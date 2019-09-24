
const User = require('../models/User');

// create a new user with email, name and password 

exports.create = function (req, res) {
    let user = new User()
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save().then(user => {
        req.session.user = user.email;
        res.redirect('/home');
    }).catch(error => {
        res.send('user exists, please login');
    });
};
// Handle view contact info
exports.get = function (req, res) {
    let deff = 'test'
    User.findByEmail(req.query.email, function (err, user) {
        if (err || !user) {
            res.status(500).send({'data' : 'User not found'});
            return
        }
        res.json({
            data: {
                name : user.name,
                email : user.email,
                id : user._id
            }
        });
    });
};
