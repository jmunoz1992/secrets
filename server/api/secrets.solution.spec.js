const { expect } = require('chai');
const db = require('../db/index');
const Secret = db.model('secret');
const User = db.model('user');
const { seedSecrets, seedUsers } = require('../../script/test-seeds');
const assert = require('assert');
const app = require('../index');
const request = require('supertest');

const COUNT_PUBLIC_SECRETS = seedSecrets.filter(secret => secret.isPublic).length;
const COUNT_USER1_PRIVATE = seedSecrets.filter(secret => secret.isPublic === false && secret.userId === 1).length;

describe('Secret model', () => {
  let users = [];
  let secrets = [];

  beforeEach(async () => {
    secrets = [];
    await db.sync({ force: true });
    users = await Promise.all(seedUsers.map(user => User.create(user)));
    for (let i = 0; i < seedSecrets.length; i++) {
      const sec = await Secret.create(seedSecrets[i]);
      secrets.push(sec);
    }
    assert(users.length === 3, 'User.create failed');
    assert(secrets.length === 4, 'Secret.create failed');
  });

  describe('guests', () => { // users that are not logged in
    describe('GET /api/secrets', () => {
      it('should return only the secrets which are public', () => {
        return request(app)
          .get('/api/secrets')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.equal(COUNT_PUBLIC_SECRETS);
          });
      });
    });

    describe('POST /api/secrets', () => {
      it('should return a 401 unauthorized error', () => {
        return request(app)
          .post('/api/secrets')
          .send({ message: 'a brand new secret', isPublic: true, userId: 1 })
          .expect(401);
      });
    });

    describe('PUT /api/secrets/:id', () => {
      it('should return a 401 unauthorized error', () => {
        return request(app)
          .put('/api/secrets/1')
          .send({ isPublic: false })
          .expect(401);
      });
    });

    describe('DELETE /api/secrets', () => {
      it('should return a 401 unauthorized error', () => {
        return request(app)
          .delete('/api/secrets/1')
          .expect(401);
      });
    });
  });

  describe('with authenticated user', () => {
    const authenticatedUser = request.agent(app);

    beforeEach((done) => {
      const dbUsers = users.filter(user => user.id === 1);
      const authUser = {
        email: dbUsers[0].dataValues.email,
        password: 'a123'
      };
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
            expect(res.body.length).to.be.equal(COUNT_PUBLIC_SECRETS + COUNT_USER1_PRIVATE);
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

    describe('when user does NOT own secret', () => {
      describe('PUT /api/secrets/:id', () => {
        it('should return a 401 unauthorized error', () => {
          return authenticatedUser
            .put('/api/secrets/3')
            .send({ isPublic: false })
            .expect(401);
        });
      });

      describe('DELETE /api/secrets', () => {
        it('should return a 401 unauthorized error', () => {
          return authenticatedUser
            .delete('/api/secrets/3')
            .expect(401);
        });
      });
    });

    describe('when user owns secret', () => {
      describe('PUT /api/secrets/:id', () => {
        it('should update a secret', () => {
          return authenticatedUser
            .put('/api/secrets/1')
            .send({ isPublic: false })
            .expect(200)
            .then(res => {
              expect(res.body.isPublic).to.be.equal(false);
            });
        });
        it('should only update whether the secret isPublic', () => {
          return authenticatedUser
            .put('/api/secrets/1')
            .send({ message: '99' })
            .expect(200)
            .then(res => {
              expect(res.body.message).to.be.equal(
                'I love the admin of this web site.'
              );
            });
        });
      });

      describe('DELETE /api/secrets', () => {
        it('should delete a secret', () => {
          return authenticatedUser
            .delete('/api/secrets/1')
            .expect(204);
        });
      });
    });
  });
});

