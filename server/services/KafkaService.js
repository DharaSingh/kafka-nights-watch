const Kafka = require('kafka-node');
const Consumer = Kafka.Consumer;
const CircularBuffer = require("circular-buffer");

const groupId = "kafka-nights-watch-service"
const TopicToMsgMap = {}
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

// init admin
const admin = new Kafka.Admin(getClient());

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
}

const initConsumer = (topic) => {
    client = getClient();
    consumer = new Consumer(
        client,
        [
            { topic: topic }
        ],
        {
            autoCommit: true,
            groupId: groupId,
            autoCommitIntervalMs: 2000,
            fetchMaxWaitMs: 1000,
            fetchMaxBytes: 1024 * 1024 * 10, // 10 MB
            fromOffset: true,
            encoding: 'utf8',
            keyEncoding: 'utf8'
        }
    );
    return consumer
};

const Consume = (topic, msgBuffer) => {
    
    consumer = initConsumer(topic);
    console.log('consumer started for topic ', topic);

    consumer.on('message', function (message) {
        msgBuffer.enq({value : message.value, offset: message.offset, partition: message.partition})
    });

    consumer.on('error', function(err) {
        console.log(err);
    });
    consumer.on('offsetOutOfRange', function (err) {
        console.log(err);
    });
};


const initConsumers = () => {
    listTopics((err, res) => {
        if (!err) {
            res.forEach(element => {
                if (element.metadata) {
                    Object.keys(element.metadata).forEach(key => {
                        let msgBuffer = new CircularBuffer(10);
                        TopicToMsgMap[key] = msgBuffer;
                        Consume(key, msgBuffer);
                    });
                }
            });
        }
    });
};
initConsumers();


module.exports = { listTopics, listGroups, describeGroup, createTopic, describeConfig };
