const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const util = require('util');
const url = require('url');
const querystring = require('querystring');

var cors = require('cors')

dotenv.config();

var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || '/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

passport.serializeUser(function (user, done) {
  console.log('serialize', user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log('deserialize', user);
  done(null, user);
});

const app = express();

app.use(bodyParser.json());
app.use(cors())

var sess = {
  secret: 'ChAnGe ThIs SeCrEt',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('build'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Perform the login, after login Auth0 will redirect to callback
app.get('/auth', passport.authenticate('auth0'));

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
app.get('/callback', function (req, res, next) {
  console.log('in /callback');
  passport.authenticate('auth0', function (err, user, info) {
    console.log('in authenticate');
    if (err) { return next(err); }
    if (!user) { return res.redirect('/auth'); }
    req.logIn(user, function (err) {
      console.log('in req.login');
      if (err) { return next(err); }
      res.redirect('/#/checklist');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
app.get('/auth/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  var logoutURL = new url.URL(
    util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

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

const port = 3333;
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
]