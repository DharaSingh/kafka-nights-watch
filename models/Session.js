const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    email: { type: String, unique: true},
    sessionId: {type: String, unique: true}
  }, { timestamps: true });



  module.exports = sessionSchema