// const { expect } = require('chai');
// const db = require('../db/index');
// const Secret = db.model('secret');
// const User = db.model('user');
// const { seedSecrets, seedUsers } = require('../../script/test-seeds');
// const assert = require('assert');
// const app = require('../index');
// const request = require('supertest');

// describe('Secret model', () => {
//   let users = [];
//   let secrets = [];

//   beforeEach(async () => {
//     await db.sync({ force: true });
//     users = await Promise.all(seedUsers.map(user => User.create(user)));
//     secrets = await Promise.all(seedSecrets.map(secret => Secret.create(secret)));
//     assert(users.length === 3, 'User.create failed');
//     assert(secrets.length === 4, 'Secret.create failed');
//   });

//   describe('GET /api/secrets', () => {
//     it('should grab all the secrets', () => {
//       return request(app)
//         .get('/api/secrets')
//         .expect(200)
//         .then(res => {
//           expect(res.body).to.be.an('array');
//           expect(res.body.length).to.equal(seedSecrets.length);
//         });

//     });
//   });

//   describe('POST /api/secrets', () => {
//     it('should add a new secret', () => {
//       return request(app)
//         .post('/api/secrets')
//         .send({ message: 'a brand new secret', isPublic: true, userId: 1 })
//         .expect(201)
//         .then(res => {
//           expect(res.body.message).to.be.equal('a brand new secret');
//           expect(res.body.isPublic).to.be.equal(true);
//           expect(res.body.userId).to.be.equal(1);
//         });
//     });
//   });

//   describe('PUT /api/secrets/:id', () => {
//     it('should update a secret', () => {
//       return request(app)
//         .put('/api/secrets/1')
//         .send({ isPublic: false })
//         .expect(200)
//         .then(res => {
//           expect(res.body.isPublic).to.be.equal(false);
//         });
//     });
//   });

//   describe('DELETE /api/secrets/:id', () => {
//     it('should delete a secret', () => {
//       return request(app)
//         .delete('/api/secrets/1')
//         .expect(204);
//     });
//   });
// });

