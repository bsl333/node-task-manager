const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');

const PORT = process.env.PORT || 3000;
const app = express();

!process.env.TEST_ENV && app.use(require('morgan')('dev'));
app.use(require('body-parser').json());

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the Task manager App' })
})

app.use('/users', userRouter);
app.use('/tasks', taskRouter);

// catch other routes
app.use((req, _, next) => {
  const status = 404;
  const message = `Not found. Request: ${req.method} ${req.url}`;
  next({ status, message });

});

// default error messaging
app.use((err, _, res, next) => {
  const { status = 500, message = 'Internal Server Error' } = err;
  res.status(status).send({ error: message });
})

!process.env.TEST_ENV && app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

module.exports = app;