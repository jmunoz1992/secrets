const db = require('../server/db');
const { User, Secret } = require('../server/db/models');
const { seedUsers, seedSecrets } = require('./test-seeds');

async function seed () {
  await db.sync({force: true});
  console.log('db synced!');

  const users = await Promise.all(seedUsers.map(user => User.create(user)));
  const secrets = await Promise.all(seedSecrets.map(secret => Secret.create(secret)));

  console.log(`seeded ${users.length} users`);
  console.log(`seeded ${secrets.length} secrets`);
  console.log(`seeded successfully`);
}

seed()
  .catch(err => {
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
  })
  .then(() => {
    console.log('closing db connection');
    db.close();
    console.log('db connection closed');
  });

console.log('seeding...');
