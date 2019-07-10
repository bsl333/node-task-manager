const router = require('express').Router({ mergeParams: true });
const multer = require('multer');
// const sharp = require('sharp')     *** Install this lib ***
const User = require('../models/user');
const auth = require('../middleware/auth');

const upload = multer({
  limits: {
    fileSize: 10 ** 6,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.+\.(jpe?g?|png)/)) {
      return cb(new Error('please upload a pdf, jpg, or jpeg'))
    }
    cb(undefined, true);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    next({ status: 401, message: e.message });
  }
});

router.post('/logout', auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    next({ status: 500, error: 'Internal Server error' });
  }
});

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    next({ status: 500, error: 'Internal Server error' });
  }
});



router.post('/', async (req, res, next) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    next({ status: 400, message: e.message });
  }
});

router.post('/me/upload', auth, upload.single('avatar'), async (req, res) => {
  try {
    // const buffer = sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    // set below line to just buffer
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  } catch (e) {
    next({ message: e.message });
  }
});

router.delete('/me/upload', auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(204).send();
  } catch (e) {
    next({ message: e.message });
  }
});

router.get('/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // TODO update to image/png
    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (e) {
    next({ status: 404, message: e.message });
  }
})

router.get('/me', auth, async (req, res) => {
  res.send({ user: req.user })
});

// no longer needed
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     user ? res.send(user) : res.status(404).send('User not found');
//   } catch (e) {
//     res.status(500).send('Server error');
//   }
// });

router.patch('/me', auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email', 'age', 'name', 'password'];
  const invalidBodyParameters = updates.filter(prop => !allowedUpdates.includes(prop));

  if (invalidBodyParameters.length) {
    const error = { message: 'invalid reqest', invalidBodyParameters };
    next({ status: 400, message: error });
  }

  try {
    // use this approach to ensure validators are run and pre save middleware runs.
    updates.forEach(prop => req.user[prop] = req.body[prop]);
    await req.user.save();
    return res.status(202).send(req.user);
  } catch (e) {
    next({ status: 500, message: e.message });
  }
});

router.delete('/me', auth, async (req, res, next) => {
  try {
    await req.user.remove();
    res.status(204).send();
  } catch (e) {
    next({ status: 500, message: e.message });
  }
});

module.exports = router;