const request = require('supertest');
const app = require('../bin/app');
require('dotenv').config();
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      if (error.message === 'ns not found') return
      if (error.message.includes('a background operation is currently running')) return

      console.log(error.message)
    }
  }
}

// Disconnect Mongoose
afterAll(async () => {
  await dropAllCollections()
  await mongoose.connection.close()
})
describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('POST /user/api/signup', () => {
  it('should return 201 OK', async () => {
    const res = await request(app)
      .post('/user/api/signup')
      .send({
        "name": "Salman",
        "email": "test5@gmail.com",
        "password": "Pass@123",
        "phoneNo": "8022618891",
        "houseNo": "B-202",
        "sector": "35",
        "city": "Kharghar",
        "state": "Maharashtra",
        "pincode": "402106",
        "isSeller": 'true'
      })
    expect(res.statusCode).toEqual(201)
  });
  it('should return 409 OK', async () => {
    const res = await request(app)
      .post('/user/api/signup')
      .send({
        "name": "Salman",
        "email": "",
      })
    expect(res.statusCode).toEqual(409)
  });
  it('should return 400 OK', async () => {
    const res = await request(app)
      .post('/user/api/signup')
      .send({
        "name": "Salman",
        "email": "t100@gmail.com",
        "password": "Pass@123",
        "phoneNo": "8022618891",
        "houseNo": "B-202",
        "sector": "35",
        "city": "Kharghar",
        "state": "Maharashtra",
        "pincode": "402106",
        "isSeller": 'true'
      })
    expect(res.statusCode).toEqual(400)
  });
});

describe('POST /user/api/login', () => {
  it('should return 200 OK', async () => {
    const res = await request(app)
      .post('/user/api/login')
      .send(
        {
          "email": "test5@gmail.com",
          "password": "Pass@123",
          "isSeller": 'true'
        }
      )
    expect(res.statusCode).toEqual(200)
    expect(res.body.role).toEqual('seller')
  });
  it('should return 400 OK', async () => {
    const res = await request(app)
      .post('/user/api/login')
      .send(
        {
          "email": "test@gmail.com",
          "password": "Pass123",
          "isSeller": 'true'
        })
    expect(res.statusCode).toEqual(400)
  })
  it('should return 409 OK', async () => {
    const res = await request(app)
      .post('/user/api/login')
      .send(
        {
          "email": "",
        })
    expect(res.statusCode).toEqual(409)
  })
});

describe('GET /user/api/logout', () => {
  it('should return 302 OK', async () => {
    const res = await request(app)
      .get('/user/api/logout')
    expect(res.statusCode).toEqual(302)
  });
});