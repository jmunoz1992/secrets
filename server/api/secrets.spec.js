/* global describe beforeEach it */

const { expect } = require('chai');
const db = require('../index');
const Secret = db.model('secret');
const User = db.model('user');
const { seedSecrets, seedUsers } = require('./test-seeds');
console.log('seedSecrets, seedUsers: ', seedSecrets, seedUsers);
const assert = require('assert');

describe('Secret model', () => {
  before(async () => {
    await db.sync({ force: true });
    const users = await User.bulkCreate(seedUsers);
    const secrets = await Secret.bulkCreate(seedSecrets);
    assert(users.length === 3, 'User.bulkCreate failed');
    assert(secrets.length === 4, 'Secret.bulkCreate failed');
  });

  describe('properties', () => {
    beforeEach('create new message', );
    it('should include secret message', () => {

    });
  });

  it('should be true', () => {
    expect(true).to.equal(true);
  });

  // beforeEach(() => {
  //   return Passage.create({
  //     title: 'Hello World',
  //     content: 'Hello yee world of mine!'
  //   })
  //   .then(passage => {
  //     hello = passage;
  //   })
  //   .catch(err => {
  //     console.log(err.message);
  //   });
  // });

  // describe('Model assignments', () => {
  //   it('Defaults to not public', () => {
  //     expect(hello.isPublic).to.be.equal(false);
  //   });
  // });


  // describe('Methods', () => {

  //   it('Preview returns a slice the length you provide it', () => {
  //     expect(hello.preview(3).length).to.be.equal(3);
  //     expect(hello.preview(3)).to.be.equal('Hel');
  //   });
  // });//end instance methods
}); // end describe('Passage model')

