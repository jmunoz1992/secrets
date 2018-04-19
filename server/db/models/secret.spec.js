const { expect } = require('chai');
const db = require('../index');
const Secret = db.model('secret');

describe('Secret model', () => {
  describe('properties', () => {
    it('should include secret message', () => {
      expect(Secret.attributes.message).to.be.an('object');
      expect(Secret.attributes.message.allowNull).to.equal(false);
      expect(Secret.attributes.message.notEmpty).to.equal(true);
    });

    it('should include a boolean for isPublic', () => {
      expect(Secret.attributes.isPublic).to.be.an('object');
      expect(Secret.attributes.isPublic.defaultValue).to.equal(false);
    });
  });
});
