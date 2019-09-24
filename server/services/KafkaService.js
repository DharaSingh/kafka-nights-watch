const Kafka = require('kafka-node');

const groupId = "kafka-nights-watch-service"

// init client
const client = new Kafka.KafkaClient({
    kafkaHost: global.gConfig.kafka.brokers,
    connectTimeout : 10000,
    requestTimeout: 30000,
    autoConnect: true,
    maxAsyncRequests: 100,
    clientId: global.gConfig.kafka.client_id,
});

// init admin
const admin = new Kafka.Admin(client); 


const listTopics = () => {
   await admin.listTopics((err, res) => {
        if (err) {
            console.log("error in getting list of topics", err)
            return [err, undefined]
        }
        return [undefined, res]
      });
};

module.exports = listTopics;
