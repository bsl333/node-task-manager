const express = require('express');
require('./db/mongoose')
const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(require('morgan')('dev'));
app.use(require('body-parser').json());

app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));