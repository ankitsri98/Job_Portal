const mongoose = require('mongoose');

const ApplySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact_no: {
    type: Number,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  college:{
    type: String,
    required: true
  },
  applied:{
    type: String,
    required: false
  }
});

const Apply = mongoose.model('Apply', ApplySchema);

module.exports = Apply;