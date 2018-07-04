const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const data = {
  users: [
    {
      id: 123,
      name: 'John',
      email: 'john@gmail.com',
      password: 'password',
      entries: 0,
      joined: new Date()
    },
    {
      id: 124,
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
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body

  data.users.push({
    id: 125,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });

  res.json(data.users[data.users.length - 1]);
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});



