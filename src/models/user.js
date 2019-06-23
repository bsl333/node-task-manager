const mongoose = require('mongoose');
const { isEmail } = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useCreateIndex: true,
  useNewUrlParser: true
});

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('User age must be greater than zero (0)');
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!isEmail(value)) {
        throw new Error('Provide a valid email')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(password) {
      if (/passw[0o]rd/i.test(password)) {
        throw new Error('password must not contain the word password within it')
      }
    }
  }
});

module.exports = User;