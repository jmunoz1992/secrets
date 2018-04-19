const seedUsers = [
  {
    id: 1,
    email: 'user1@email.com',
    password: '123',
    isAdmin: false
  }, {
    id: 2,
    email: 'user2@email.com',
    password: '123',
    isAdmin: false
  }, {
    id: 3,
    email: 'admin@email.com',
    password: '321321',
    isAdmin: true
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
    message: 'I took the ACT for my sister. I got a terrible score.',
    userId: 2,
    isPublic: true
  }, {
    message: 'I kissed a girl.',
    userId: 2,
    isPublic: false
  }
];

module.exports = { seedUsers, seedSecrets };
