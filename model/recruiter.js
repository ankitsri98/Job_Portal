const mongoose = require('mongoose');

const recruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  company:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

const recruit = mongoose.model('recruit', recruitSchema);

module.exports = recruit;