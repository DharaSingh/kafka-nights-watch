const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  email: { type: String, unique: true},
  password: String,
  name: String, 
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
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

userSchema.statics.findByEmail = function(email, callback) {
  return this.model.find({ email: email }, callback);
};

const User = mongoose.model('User', userSchema);

module.exports = User;