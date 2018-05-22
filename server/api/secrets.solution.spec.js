const { expect } = require('chai');
const db = require('../db/index');
const Secret = db.model('secret');
const User = db.model('user');
const { seedSecrets, seedUsers } = require('../../script/test-seeds');
const assert = require('assert');
const app = require('../index');
const request = require('supertest');

const COUNT_PUBLIC = seedSecrets.filter(secret => secret.isPublic).length;
const COUNT_USER1_PRIVATE = seedSecrets.filter(secret => secret.isPublic === false && secret.userId === 1).length;

describe('Secret model - Worshop Solution', () => {
  let user1PrivateSecret = {};
  let user2PrivateSecret = {};
  let authUser = {};

  beforeEach(async () => {

    /*
      SEED Test Database
    */

    await db.sync({ force: true });
    const users = await Promise.all(seedUsers.map(user => User.create(user)));
    const secrets = await Promise.all(seedSecrets.map(secret => Secret.create(secret)));
    assert(users.length === 3, 'User.create failed');
    assert(secrets.length === 4, 'Secret.create failed');

    /*
      Grab proper user and secret info for tests

      Since the users and secrets are created using Promise.all above,
      there is no guarantee which seeds will get what id.
    */

    const dbUsers = users.filter(user => user.id === 1);
    authUser = {
      id: dbUsers[0].dataValues.id,
      email: dbUsers[0].dataValues.email,
      password: 'a123'
    };

    user1PrivateSecret = secrets.filter(secret => (
      secret.userId === 1 && secret.isPublic === false
    ))[0].dataValues;

    user2PrivateSecret = secrets.filter(secret => (
      secret.userId === 2 && secret.isPublic === false
    ))[0].dataValues;
  });

  /*
    Testing behavior for guest users
  */

  describe('guests', () => {
    describe('GET /api/secrets', () => {
      it('should return only the secrets which are public');

      it('should not return the userId or any data besides the message');
    });

    describe('POST /api/secrets', () => {
      it('should return a 401 unauthorized error');
    });

    describe('PUT /api/secrets/:id', () => {
      it('should return a 401 unauthorized error');
    });

    describe('DELETE /api/secrets', () => {
      it('should return a 401 unauthorized error');
    });
  });

  /*
    Testing behavior for an authenticated user
  */

  describe('with authenticated user', () => {
    const authenticatedUser = request.agent(app);

    beforeEach((done) => {
      authenticatedUser
        .post('/auth/login')
        .send(authUser)
        .end((err, res) => {
          if (err) throw err;
          assert(res.statusCode === 200, 'Login failed for tests with authentication');
          done();
        });
    });

    describe('GET /api/secrets', () => {
      it('should return public secrets and their private secrets');
    });

    describe('POST /api/secrets', () => {
      it('should create a new secret');
    });

    /*
      Edit/Delete a secret the user owns
    */

    describe('when user owns secret', () => {
      describe('PUT /api/secrets/:id', () => {
        it('should update a secret');

        it('should only update whether the secret isPublic');
      });

      describe('DELETE /api/secrets', () => {
        it('should delete a secret');
      });
    });

    /*
      Edit/Delete a secret the user DOES NOT own
    */

    describe('when user does NOT own secret', () => {
      describe('PUT /api/secrets/:id', () => {
        it('should return a 401 unauthorized error');
      });

      describe('DELETE /api/secrets', () => {
        it('should return a 401 unauthorized error');
      });
    });
  });
});

