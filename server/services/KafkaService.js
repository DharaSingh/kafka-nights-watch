const Kafka = require('kafka-node');
const Consumer = Kafka.Consumer;
const Offset = Kafka.Offset;
const memory_cache = require("memory-cache");
const cron = require("node-cron");
const CircularBuffer = require("circular-buffer");
const ConsumerGroup = Kafka.ConsumerGroup;


var Cache = new memory_cache.Cache();
const TOPICS_KEY = "topics";
const CONSUMER_GROUPS_KEY = "consumer_groups";
const CONSUMER_GROUPS_PREFIX = "consumer_group";
const MSGS_PREFIX = "msgs"
var TopicsSet = new Set([]);
const groupId = "kafka-nights-watch-service"


// init client
const getClient = () => {
    return new Kafka.KafkaClient({
        kafkaHost: global.gConfig.kafka.brokers,
        connectTimeout: 10000,
        requestTimeout: 30000,
        autoConnect: true,
        maxAsyncRequests: 100,
        clientId: global.gConfig.kafka.client_id,
    });
}



// fetch list of topics every minute and fill local cache
const fillTopics = cron.schedule(
    "* * * * *",
    () => {
        listTopics((err, resp) => {
            if (!err) {
                console.log("topics refilled from kafka")
                Cache.put(TOPICS_KEY, resp);
            }
        });
    },
    {
        scheduled: true
    }
);

const setDiff = (setA, setB) => {
    var _difference = new Set(setA);
    for (var elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
};

const consumeMsgs = cron.schedule(
    "* * * * *",
    () => {
        let topics = GetTopics();
        if (!topics) {
            return
        }
        let newTopicsSet = new Set([]);
        topics.forEach(element => {
            if (element.metadata) {
                Object.keys(element.metadata).forEach(topic => {
                    newTopicsSet.add(topic);
                });
            }
        });
        console.log("new set is ", newTopicsSet)
        let diff = setDiff(newTopicsSet, TopicsSet);
        if (diff.size > 0) {
            TopicsSet = new Set(newTopicsSet);
            initConsumerGroup();
        }
    },
    {
        scheduled: true
    }
);


const fillConsumerGroups = cron.schedule(
    "* * * * *",
    () => {
        listGroups((err, resp) => {
            if (!err) {
                console.log("consumer groups refilled from kafka")
                Cache.put(CONSUMER_GROUPS_KEY, resp);
                Object.keys(resp).forEach(cg => {
                    describeGroup(cg, (err, cgresp) => {
                        if (!err) {
                            console.log("consumer group refilled from kafka", cg)
                            Cache.put(KeyBuilder([CONSUMER_GROUPS_PREFIX, cg]), cgresp);
                        }
                    });
                });
            }
        });
    },
    {
        scheduled: true
    }
);



const KeyBuilder = args => {
    return args.join("_");
};

const GetTopics = () => {
    return Cache.get(TOPICS_KEY);
};

const GetConsumerGroups = () => {
    return Cache.get(CONSUMER_GROUPS_KEY);
};

const GetConsumerGroup = cg => {
    let key = KeyBuilder([CONSUMER_GROUPS_PREFIX, cg]);
    return Cache.get(key);
};



// init admin
const admin = new Kafka.Admin(getClient());
var offset = new Offset(getClient());


const listTopics = (cb) => {
    admin.listTopics(cb);
};

const listGroups = (cb) => {
    admin.listGroups(cb);
};

const describeGroup = (group, cb) => {
    let groups = [];
    groups.push(group);
    admin.describeGroups(groups, cb);
};

const createTopic = (topic, cb) => {
    let topics = [];
    topics.push(topic);
    admin.createTopics(topics, cb);
};

const describeConfig = (payload, cb) => {
    let payloads = [];
    payloads.push(payload);
    admin.describeConfig(payloads, cb);
};
var consumerGroup = null;
const initConsumerGroup = () => {
    if (consumerGroup) {
        consumer.close(true, () => {
            consumerGroup = null;
        });
        return;
    }
    let options = {
        kafkaHost: global.gConfig.kafka.brokers,
        groupId: groupId,
        sessionTimeout: 15000,
        protocol: ['roundrobin'],
        fromOffset: 'latest',
        encoding: 'utf8',
        commitOffsetsOnFirstJoin: true,
        outOfRangeOffset: 'earliest'
    };
    consumerGroup = new ConsumerGroup(options, Array.from(TopicsSet));
    console.log("starting consumer group for topics, ", TopicsSet);
    consumerGroup.on('message', function (message) {
        let msgBuffer = GetMsgs(message.topic);
        if (!msgBuffer) {
            msgBuffer = new CircularBuffer(global.gConfig.max_msgs);
            let key = KeyBuilder([MSGS_PREFIX, message.topic]);
            Cache.put(key, msgBuffer);
        }             
        msgBuffer.enq({ value: message.value, offset: message.offset, partition: message.partition });

    });

    consumerGroup.on('error', function (err) {
        console.log(err);
    });

};


const GetMsgs = (topic) => {
    let key = KeyBuilder([MSGS_PREFIX, topic]);
    return Cache.get(key);
}


module.exports = { listTopics, listGroups, describeGroup, createTopic, describeConfig, GetTopics, GetConsumerGroups, GetConsumerGroup, GetMsgs };
