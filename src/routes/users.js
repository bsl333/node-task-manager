const router = require('express').Router({ mergeParams: true });
const User = require('../models/user');


router.post('/', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send('Error: could not create user');
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user ? res.send(user) : res.status(404).send('User not found');
  } catch (e) {
    res.status(500).send('Server error');
  }
});

router.patch('/:id', async (req, res) => {
  const allowedUpdates = ['email', 'age', 'name', 'password'];
  const isValidRequest = Object.keys(req.body).every(prop => allowedUpdates.includes(prop));
  // console.log(User.schema)

  if (!isValidRequest) {
    const error = { message: 'invalid reqest', propsReceived: req.body, propsAllowed: allowedUpdates }
    return res.status(400).send(error);
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    user ? res.status(202).send(user) : res.status(404).send('User not found');
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    user ? res.status(204).send() : res.status(404).send('user not found');
  } catch (e) {
    res.status(500).send('Server Error');
  }
})

module.exports = router;