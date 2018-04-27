const {expect} = require('chai');
const {sortById} = require('./sorting');

describe('sortById', () => {
  it('should sort by id, ascending', () => {
    const objects = [
      {id: 5},
      {id: 2},
      {id: 4},
      {id: 3},
      {id: 1},
    ];

    expect(objects.sort(sortById)).to.deep.equal([
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
    ]);
  });
})
;
