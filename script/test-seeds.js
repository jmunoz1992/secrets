const seedUsers = [
  {
    email: 'user1@email.com',
    password: 'a123'
  }, {
    email: 'user2@email.com',
    password: 'a123'
  }, {
    email: 'admin@email.com',
    password: 'a123'
  }
];

const seedSecrets = [
  {
    message: 'I love the admin of this web site.',
    userId: 1,
    isPublic: true
  }, {
    message: 'Once I shoplifted from Macys.',
    userId: 1,
    isPublic: false
  }, {
    message: 'I took the SAT for my sister. I got a terrible score.',
    userId: 2,
    isPublic: true
  }, {
    message: 'I don\'t trust anyone like I trust my dog.',
    userId: 2,
    isPublic: false
  }
];

module.exports = { seedUsers, seedSecrets };
