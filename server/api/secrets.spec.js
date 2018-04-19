const { expect } = require('chai');
const db = require('../db/index');
const Secret = db.model('secret');
const User = db.model('user');
const { seedSecrets, seedUsers } = require('../../script/test-seeds');
const assert = require('assert');
const app = require('../index');
const request = require('supertest');

describe('Secret model', () => {
  before(async () => {
    await db.sync({ force: true });
    const users = await User.bulkCreate(seedUsers);
    const secrets = await Secret.bulkCreate(seedSecrets);
    assert(users.length === 3, 'User.bulkCreate failed');
    assert(secrets.length === 4, 'Secret.bulkCreate failed');
  });

  describe('GET /api/secrets', () => {
    it('should grab all the secrets', () => {
      return request(app)
        .get('/api/secrets')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(seedSecrets.length);
          expect(res.body[0].message).to.equal(seedSecrets[0].message);
        });

    });
  });
});

