const router = require('express').Router({ mergeParams: true});
const Task = require('../models/task');

router.post('/', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save()
    res.send(task);
  } catch (e) {
    res.send(400).send('Error: could not create task');
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task ? res.send(task) : res.status(404).send('task not found')
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const propsAllowed = Task.schema.obj;
  const invalidBodyParameters = updates.filter(prop => !propsAllowed[prop]);
  if (invalidBodyParameters.length) {
    const error = {
      errorMessage: 'Invalid Updates',
      invalidBodyParameters
    }
    return res.status(400).send({error});
  }

  try {
    const task = await Task.findById(req.params.id);
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

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    task ? res.status(204).send() : res.status(404).send('task not found');
  } catch(e) {
    res.status(500).send('Server Error');
  }
})

module.exports = router;