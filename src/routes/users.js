const router = require('express').Router({ mergeParams: true });
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(401).send(e);
  }

});

router.post('/logout', auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    next({status: 500, error: 'Internal Server error'});
  }
});

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    next({status: 500, error: 'Internal Server error'});
  }
})



router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send('Error: could not create user');
  }
});

router.get('/me', auth, async (req, res) => {
  res.send(req.user)
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
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email', 'age', 'name', 'password'];
  const invalidBodyParameters = updates.filter(prop => !allowedUpdates.includes(prop));
  // console.log(User.schema)

  if (invalidBodyParameters.length) {
    const error = { message: 'invalid reqest', invalidBodyParameters }
    return res.status(400).send({ error });
  }

  try {
    // use this approach to ensure validators are run and pre save middleware runs.
    const user = await User.findById(req.params.id);
    if (user) {
      updates.forEach(prop => user[prop] = req.body[prop]);
      await user.save();
      return res.status(202).send(user);
    };

    res.status(404).send('User not found');
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