// Initialize express router
let router = require('express').Router();
var session = require('express-session');
const User = require('./models/User');

var usercontroller = require('./controllers/user');
// Contact routes
router.route('/user').post(usercontroller.create);
router.route('/user').get(usercontroller.get)

const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
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
    if (req.session.user && req.cookies.user_sid) {
        res.send('home page done');
    } else {
        res.send('please login');
    }
});

// route for user logout
router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.send('log out');
    } else {
        res.send('please login');
    }
});



router.route('/signup').post(usercontroller.create)


module.exports = router;
