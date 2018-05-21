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

describe('Secret model', () => {
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
      it('should return only the secrets which are public', () => {
        return request(app)
          .get('/api/secrets')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(COUNT_PUBLIC);
            expect(res.body[0].isPublic).to.equal(true);
          });
      });

      it('should not return the userId or any data besides the message', () => {
        return request(app)
          .get('/api/secrets')
          .expect(200)
          .then(res => {
            expect(res.body[0].userId).to.equal(null);
          });
      });
    });

    describe('POST /api/secrets', () => {
      it('should return a 401 unauthorized error', () => {
        return request(app)
          .post('/api/secrets')
          .send({ message: 'a brand new secret' })
          .expect(401);
      });
    });

    describe('PUT /api/secrets/:id', () => {
      it('should return a 401 unauthorized error', () => {
        return request(app)
          .put(`/api/secrets/${user1PrivateSecret.id}`)
          .send({ isPublic: false })
          .expect(401);
      });
    });

    describe('DELETE /api/secrets', () => {
      it('should return a 401 unauthorized error', () => {
        return request(app)
          .delete(`/api/secrets/${user1PrivateSecret.id}`)
          .expect(401);
      });
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
      it('should return public secrets and their private secrets', () => {
        return authenticatedUser
          .get('/api/secrets')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.equal(COUNT_PUBLIC + COUNT_USER1_PRIVATE);
          });
      });
    });

    describe('POST /api/secrets', () => {
      it('should create a new secret', () => {
        return authenticatedUser
          .post('/api/secrets')
          .send({ message: 'a brand new secret', isPublic: true, userId: 1 })
          .expect(201)
          .then(res => {
            expect(res.body.message).to.be.equal('a brand new secret');
            expect(res.body.isPublic).to.be.equal(true);
            expect(res.body.userId).to.be.equal(1);
          });
      });
    });

    /*
      Edit/Delete a secret the user owns
    */

    describe('when user owns secret', () => {
      describe('PUT /api/secrets/:id', () => {
        it('should update a secret', () => {
          return authenticatedUser
            .put(`/api/secrets/${user1PrivateSecret.id}`)
            .send({ isPublic: false })
            .expect(200)
            .then(res => {
              expect(res.body.isPublic).to.be.equal(false);
            });
        });

        it('should only update whether the secret isPublic', () => {
          return authenticatedUser
            .put(`/api/secrets/${user1PrivateSecret.id}`)
            .send({ message: '99' })
            .expect(200)
            .then(res => {
              expect(res.body.message).to.be.equal(
                user1PrivateSecret.message
              );
            });
        });
      });

      describe('DELETE /api/secrets', () => {
        it('should delete a secret', () => {
          return authenticatedUser
            .delete(`/api/secrets/${user1PrivateSecret.id}`)
            .expect(204);
        });
      });
    });

    /*
      Edit/Delete a secret the user DOES NOT own
    */

    describe('when user does NOT own secret', () => {
      describe('PUT /api/secrets/:id', () => {
        it('should return a 401 unauthorized error', () => {
          return authenticatedUser
            .put(`/api/secrets/${user2PrivateSecret.id}`)
            .send({ isPublic: false })
            .expect(401);
        });
      });

      describe('DELETE /api/secrets', () => {
        it('should return a 401 unauthorized error', () => {
          return authenticatedUser
            .delete(`/api/secrets/${user2PrivateSecret.id}`)
            .expect(401);
        });
      });
    });
  });
});

