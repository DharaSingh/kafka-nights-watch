const memory_cache = require("memory-cache");
const kafkaservice = require("./KafkaService");
const cron = require("node-cron");

var Cache = new memory_cache.Cache();
const TOPICS_KEY = "topics";
const CONSUMER_GROUPS_KEY = "consumer_groups";
const CONSUMER_GROUPS_PREFIX = "consumer_group";
const MSGS_PREFIX = "msgs"

// fetch list of topics every minute and fill local cache
const fillTopics = cron.schedule(
    "* * * * *",
    () => {
        kafkaservice.listTopics((err, resp) => {
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


const fillConsumerGroups = cron.schedule(
    "* * * * *",
    () => {
        kafkaservice.listGroups((err, resp) => {
            if (!err) {
                console.log("consumer groups refilled from kafka")
                Cache.put(CONSUMER_GROUPS_KEY, resp);
                Object.keys(resp).forEach(cg => {
                    kafkaservice.describeGroup(cg, (err, cgresp) => {
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


const fillMsgs = (topic, msgBuffer) => {
    Cache.put(KeyBuilder[MSGS_PREFIX, topic], )

}


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

module.exports = { GetTopics, GetConsumerGroups, GetConsumerGroup };
