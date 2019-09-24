const listTopics = require('../services/KafkaService');

exports.getTopics = (req, res) => {
     listTopics()
    if (err) {
        res.send("not able to get list of topics").end()
        return
    }
    res.send('topics').end()
};
