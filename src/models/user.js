const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
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
    unique: true,
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
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

userSchema.virtual('userTasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'ownerId'
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1 y" });
  this.tokens.push({ token });
  await this.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.tokens;
  delete userObj.password;
  delete userObj.avatar
  return userObj;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }

  const matchedCredentials = await bcrypt.compare(password, user.password);
  if (!matchedCredentials) {
    throw new Error('Unable to login');
  }
  return user;
}

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

userSchema.pre('remove', async function(next) {
  await Task.deleteMany({ ownerId: this._id});
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;