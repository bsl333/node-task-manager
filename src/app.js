const express = require('express');
require('./db/mongoose')
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(require('morgan')('dev'));
app.use(require('body-parser').json());

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));