// Initialize express router
let router = require('express').Router();
const User = require('../models/User');

const usercontroller = require('../controllers/userController');
const kafkaController = require('../controllers/kafkaController')

// Contact routes
router.route('/user').post(usercontroller.create);
router.route('/user').get(usercontroller.get)
router.route('/kafka/topics').get(kafkaController.getTopics)
router.route('/kafka/groups').get(kafkaController.getGroups);
router.route('/kafka/group:consumer_group?').get(kafkaController.describeGroup)
router.route('/kafka/topic').post(kafkaController.createTopic)
router.route('/kafka/msgs:topic?').get(kafkaController.getMsgs)
const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_session_id) {
        res.redirect('/home');
    } else {
        next();
    }
};


// route for user Login
router.route('/login')
    .get(sessionChecker, (req, res) => {
        res.send('login page');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/home');
            }
        });
    });


// route for user's dashboard
router.get('/home', (req, res) => {
    if (req.session.user && req.cookies.user_session_id) {
        res.send('home page done');
    } else {
        res.send('please login');
    }
});

// route for user logout
router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_session_id) {
        res.clearCookie('user_session_id');
        res.send('log out');
    } else {
        res.send('please login');
    }
});



router.route('/signup').post(usercontroller.create)


module.exports = router;
