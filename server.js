const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '123456',
    database : 'fda'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

const data = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'password',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'David',
      email: 'david@gmail.com',
      password: '123456',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.json(data.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === data.users[0].email && req.body.password === data.users[0].password) {
    res.json(data.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body

  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))

});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  db.select('*').from('users').where({
    id: id
  })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json('not found')
      }
    })
    .catch(err => res.status(404).json('error while getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
});


app.listen(3000, () => {
  console.log('app is running on port 3000');
});



