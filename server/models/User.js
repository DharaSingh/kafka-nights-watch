const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true},
  password: {type: String, required: true},
  name: {type: String, required: true}, 
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);
User.findByEmail = function(email, callback) {
  User.findOne({email : email}).exec(callback);
};


module.exports = User;