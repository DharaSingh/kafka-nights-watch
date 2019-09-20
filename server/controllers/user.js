
const User = require('../models/User');
const Session = require('../models/Session')

// create a new user with email, name and password 

exports.create = function (req, res) {
    let user = new User()
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function (err) {
        if (err){
            res.status(500)
            res.json({
                message : "User already exists "
            }).send()
        }
        res.status(201).json({
            message: 'User created',
            data: {
                "name" : user.name,
                "email" : user.email
            }
        });
    });
};
// Handle view contact info
exports.get = function (req, res) {
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
