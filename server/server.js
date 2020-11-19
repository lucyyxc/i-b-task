const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const dummy = require('./dummy.json');

const port = 3333;

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(bodyParser.json());
app.use(cors())

app.get('/api/get/:email', (req, res) => {
  const { email } = req.params;
  // head to the db and find the user profile that has this email
  const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  // head back to the database and find all the tasks that are attached to this email's user id
  const tasks = allTasks.filter(task => task.userId === user.id);
  res.status(200).json({user, tasks});
})

app.post('/api/post/newUser', (req, res) => {
  const { body } = req;
  // create the initials
  const initials = body.name.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  // create the user object that is going to be sent to the db
  const newUser = {
    name: body.name,
    email: body.email,
    assignee: initials,
    id: '77',
    weddingDate: body.user_metadata.weddingDate,
    birthday: body.user_metadata.birthday,
    collabAdded: false,
    collabID: null,
    sub: false
  }
  // send it
  users.push(newUser);
  // respond with something because we have to
  res.status(200).send('Added new user');
})

app.listen(port, () => console.log(`listening on port ${port}`));


const users =  [
  {
    name: 'Trevor Brown',
    email: 'TrevorBrown25@gmail.com',
    assignee: 'TB',
    id: '1357',
    weddingDate: '2021-12-25',
    birthday: '1992-06-18',
    collabAdded: false,
    collabID: null,
    sub: true
  }
];

const allTasks = [
  {
    id: '01',
    userId: '1357',
    taskName: 'guest-list',
    taskLabel: 'Guest List',
    assignee: 'TB',
    tags: '',
    startDate: '2020-11-20',
    endDate: '2020-11-24',
    status: 'in-progress',
    custom: false,
    details: {
      advice: 'You should get this done',
      notes: 'I should get this done.',
      pintrest: 'https://www.pinterest.com/',
      blog: 'https://twitter.com/',
      moneyTip: 'Spend less moneys.'
    }
  },
  {
    id: '02',
    userId: '1357',
    taskName: 'create-budget',
    taskLabel: 'Create Budget',
    assignee: 'TB2',
    tags: '',
    startDate: '2020-11-16',
    endDate: '2020-11-20',
    status: 'complete',
    custom: false,
    details: {
      advice: 'You should really get this done',
      notes: 'I should really get this done.',
      pintrest: 'https://www.pinterest.com/',
      blog: 'https://twitter.com/',
      moneyTip: 'Spend even more moneys.'
    }
  },
  {
    id: '03',
    userId: '1357',
    taskName: 'research-venue',
    taskLabel: 'Research Venue Space',
    assignee: 'TB',
    tags: '',
    startDate: '2020-11-19',
    endDate: '2020-11-22',
    status: 'not-started',
    custom: 'false',
    details: {
      advice: 'This should probably get this done',
      notes: 'I think I should probably get this done.',
      pintrest: 'https://www.pinterest.com/',
      blog: 'https://twitter.com/',
      moneyTip: '',
    }
  },
  {
    id: '03',
    userId: '77',
    taskName: 'research-venue',
    taskLabel: 'Research Venue Space',
    assignee: 'GT',
    tags: '',
    startDate: '2020-10-09',
    endDate: '2020-12-09',
    status: 'not-started',
    custom: 'false',
    details: {
      advice: 'This should probably get this done',
      notes: 'I think I should probably get this done.',
      pintrest: 'https://www.pinterest.com/',
      blog: 'https://twitter.com/',
      moneyTip: '',
    }
  },
]