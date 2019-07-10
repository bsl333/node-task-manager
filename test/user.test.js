const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const user1 = {
  name: 'User1',
  email: 'user1@someEmail.com',
  password: '1234567',
};

beforeEach(async () => {
  await User.deleteMany()
  await new User(user1).save();
});

afterEach(() => {
})


test('Registration: it should sign up a new user', async () => {
  await request(app).post('/users')
    .send({
      name: 'Test User Created',
      email: 'user.test@local.com',
      password: '1234567',
    }).expect(201)
});

test('Should login an existing user', async () => {
  await request(app).post('/users/login')
    .send({
      email: user1.email,
      password: user1.password
    }).expect(200);
});

describe('Should fail to login with bad credentials', () => {
  test('with bad email', async () => {
    await request(app).post('/users/login')
      .send({
        email: 'test',
        password: user1.password
      }).expect(401)
  });

  test('with bad password', async () => {
    await request(app).post('/users/login')
      .send({
        email: user1.email,
        password: '123'
      }).expect(401)
  });
});