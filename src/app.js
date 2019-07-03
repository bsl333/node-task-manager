const express = require('express');
require('./db/mongoose')
const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');
const auth = require('./middleware/auth');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(require('morgan')('dev'));
app.use(require('body-parser').json());

app.use('/users', userRouter);
app.use('/tasks', taskRouter);

// catch other routes
app.use((req, res, next) => {
  const status = 404;
  const message = `Not found. Request: ${req.method} ${req.url}`;
  next({ status, message });

});
// default error messaging
app.use((err, req, res, next) => {
  console.log(err)
  const { status = 500, message = 'Internal Server Error' } = err;
  console.log(status, message)
  res.status(status).send({ error: message });
})


app.listen(PORT, () => console.log(`listening on port: ${PORT}`));