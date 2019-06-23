const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();

// use newUrlParser
MongoClient.connect(connectionURL, { useNewUrlParser: true }, async (err, client) => {
  if (err) {
    return console.error('unable to connect to client', err);
  }
  const db = client.db(databaseName)// will create db if it doesn't exist

  const q1 = db.collection('tasks').findOne({ _id: new ObjectID('5d0dc372d210f33382896112') });
  const q2 = db.collection('tasks').find({ completed: false }).toArray();

  // Promise.all([q1, q2]).then(resp => resp.forEach(p => console.log(p)));

  // db.collection('users').updateOne(
  //   {
  //     name: 'Mike'
  //   }, {
  //     $set: {
  //       name: 'Molly'
  //     }
  //   });

  // db.collection('tasks').updateMany({ completed: 1  }, {
  //   $set: {
  //     completed: true
  //   }
  // }).then(res => console.log(res.modifiedCount));

  db.collection('tasks').deleteOne({ title: 'Wash dishes' }).then(res => console.log(res))

  // db.collection('tasks').findOne({ _id: new ObjectID('5d0dc372d210f33382896112')})
  //   .then(resp => console.log(resp));
  // db.collection('tasks').find({ completed: false }).toArray()
  //   .then(resp => console.log(resp))

  // db.collection('users').insertOne({
  //   name: 'Branden',
  //   age: 27
  // }, (err, result) =>{
  //   if (err) {
  //     return console.log('unable to insert user');
  //   }
  //   console.log(result.ops);

  // });

  // db.collection('users').insertMany([
  //   {
  //     name: 'Jen',
  //     age: 28
  //   }, {
  //     name: 'Dan',
  //     age: 30
  //   }
  // ], (err, result) => {
  //   if (err) return console.log(err);
  //   console.log(result.ops);
  // })

  // db.collection('tasks').insertMany([
  //   {
  //     title: 'Wash dishes',
  //     completed: false
  //   }, {
  //     title: 'Wash dog',
  //     completed: true
  //   }, {
  //     title: 'Clean room',
  //     completed: false
  //   }
  // ], (err, result) => {
  //   if (err) return console.log(err);
  //   console.log(result.ops)
  // });

  client.close();
})
