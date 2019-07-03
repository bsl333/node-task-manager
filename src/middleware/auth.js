const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mongodbcourse')
    const user = await User.find({
      "_id": decoded._id,
      "tokens.token": token
    });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();

  } catch (e) {
    next({status: 401, message: 'Please login to application'});
  }
}

module.exports = auth;