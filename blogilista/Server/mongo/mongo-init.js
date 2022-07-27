db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('blogs');
db.createCollection('users');

db.users.insert({ name: "Riko", username: 'Riksa', passwordHash: '$2a$12$88weLlW/7QqZFqubsb4YTuas8EMqLda/YtbTUhObX2fy7cgjeSlFa' });