const router = require('express').Router({ mergeParams: true });
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    ownerId: req.user._id
  });
  try {
    await task.save()
    res.status(201).send(task);
  } catch (e) {
    res.send(400).send('Error: could not create task');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    // option 1
    const tasks = await Task.find({ ownerId: req.user._id });
    res.send(tasks);
    //option 2:
    // await req.user.populate('userTasks').execPopulate();
    // res.send(req.user.userTasks);
  } catch (e) {
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    task ? res.send(task) : res.status(404).send('task not found')
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const propsAllowed = Task.schema.obj;
  const invalidBodyParameters = updates.filter(prop => !propsAllowed[prop]);
  if (invalidBodyParameters.length) {
    const error = {
      errorMessage: 'Invalid Updates',
      invalidBodyParameters
    }
    return res.status(400).send({ error });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (task) {
      updates.forEach(prop => task[prop] = req.body[prop]);
      await task.save();
      return res.status(202).send(task);
    }

    res.status(404).send('task not found');
  } catch (e) {
    res.status(500).send('Server Error')
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
    console.log(task);
    task ? res.status(204).send() : res.status(404).send('task not found');
  } catch (e) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;