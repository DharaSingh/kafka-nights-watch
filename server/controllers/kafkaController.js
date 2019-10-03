const kafkaservice = require('../services/KafkaService');

exports.getTopics = (request, response) => {

    let val = kafkaservice.GetTopics();
    if (val) {
        response.send({data : val, err : null, success: true}).end();
        return ;
    }
    response.send({data : null, err : "failed to get topics list", success: false}).end();
};

exports.getGroups = (request, response) => {
   
    let val = kafkaservice.GetConsumerGroups();
    if (val) {
        response.send({data : val, err : null, success: true}).end();
        return ;
    }
    response.send({data : null, err : "failed to get consumer groups", success: false}).end();
};


exports.describeGroup = (request, response) => {
    let cg = request.query.consumer_group;
    let val = kafkaservice.GetConsumerGroup(cg);
    if (val) {
        response.send({data : val, err : null, success: true}).end()
        return 
    }
    response.send({data : null, err : "failed to get consumer group details", success: false}).end()

};


const validateTopic = topic => {
    if (!topic) {
        return false;
    }
    if (topic.topic && topic.topic != "" && 
        topic.partitions && topic.partitions > 0 && topic.replicationFactor >= 0) {
            return true;
    }
    return false;
};


exports.createTopic = (request, response) => {
    let topic = request.body;
    if (!validateTopic(topic)) {
        response.status(400).send({data : "invalid input topic details"}).end()
        return
    }

    kafkaservice.createTopic(topic, (err, res) => {
        if (err) {
            response.send({data : "topic creation failed"}).status(500).end()
            return
        }
        response.send(res).end()
    });
};


exports.getMsgs = (request, response) => {
    let topic = request.query.topic;
    let val = kafkaservice.GetMsgs(topic);
    if (val) {
        response.send({data : val, err : null, success: true}).end()
        return 
    }
    response.send({data : null, err : "failed to get msgs for topic", success: false}).end()
};


exports.getBrokers = (request, response) => {
    let brokers = kafkaservice.GetBrokers();
    response.send({data : {'borkers': brokers}, err : null, success: true}).end()
};