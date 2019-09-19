
const User = require('../models/User');
const Session = require('../models/Session')

// create a new user with email, name and password 

exports.create = function (req, res) {
    let user = new User()
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function (err) {

        res.json({
            message: 'New user created!',
            data: user
        });
    });
};
// Handle view contact info
exports.get = function (req, res) {
    User.findByEmail(req.query.email, function (err, user) {
        if (err)
            res.send(err);
        res.json({
            message: 'User found',
            data: user
        });
    });
};
