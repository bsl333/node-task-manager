const express = require('express');
require('./db/mongoose')
const { User, Task } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(require('morgan')('dev'));
app.use(require('body-parser').json());

app.get('/', (req, res) => {
  res.send('recieved');
})

/************************************************/
/**************** USER ENDPOINTS ****************/
/************************************************/

app.post('/users', (req, res) => {
  const user = new User(req.body)
  console.log('req.body: ', req.body);
  return user.save()
    .then(result => res.status(201).send(result))
    .catch(e => res.status(400).send(e.message))
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
})

app.get('/users/:id', (req, res) => {
  const { id }  = req.params;
  User.findById(id)
    .then(user => user ? res.send(user) : res.status(404).send('user not found'))
    .catch(e => res.status(500).send(e))
})

/************************************************/
/**************** TASK ENDPOINTS ****************/
/************************************************/

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);
  task.save()
    .then(result => res.status(201).send(result))
    .catch(e => res.status(400).send(e.message));
})

app.get('/tasks', (req, res) => {
  Task.find({})
    .then(tasks => res.send(tasks))
    .catch(e => res.status(500).send(e));
})

app.get('/tasks/:id', (req, res) =>{
  const { id } = req.params;
  Task.findById(id)
    .then(task => task ? res.send(task) : res.status(404).send('task not found'))
    .catch(e => res.status(500).send(e));
})


app.listen(PORT, () => console.log(`listening on port: ${PORT}`));