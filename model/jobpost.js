const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  requirement: {
    type: String,
    required: true
  },
  eligible: {
    type: String,
    required: true
  },
  check:{
    type:Boolean,
    default: false
  }
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;