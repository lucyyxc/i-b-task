const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const util = require('util');
const url = require('url');
const querystring = require('querystring');
const massive = require('massive');

var cors = require('cors')

dotenv.config();

var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || '/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    console.log('inside auth strat', profile);
    console.log('inside auth strat', profile.emails[0].value);
    const db = app.get('db');
    const email = profile.emails[0].value
    db.get_user_by_email([email])
    .then(user => {
      console.log(user);
      return done(null, user[0]);
    })
  }
);
  
passport.use(strategy);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
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
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/auth'); }
    req.logIn(user, function (err) {
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

app.get('/api/get/user', (req, res) => {
  console.log('this is req.user', req.user);
  res.status(200).json(req.user);
})




app.post('/api/post/newUser', (req, res) => {
  const db = req.app.get('db');
  const { body } = req;
  // create the initials
  const initials = body.name.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  db.create_user([
    body.name,
    body.email,
    initials,
    body.user_metadata.weddingdate,
    body.user_metadata.birthday,
    false,
    null,
    false,
    body._id
  ])
  .then(user => {
    console.log('newUser, user');
    res.status(200).send('Added new user');
  })
  .catch(err => console.log('db create user error', err))
})

app.get('/api/get/userTasks', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  db.users_tasks([userid])
  .then(tasks => {
    console.log('tasks', tasks);
    res.status(200).json(tasks);
  })
})

const port = 3333;

massive(process.env.CONNECTION_STRING)
.then(massiveInstance => {
  app.set('db', massiveInstance)
  app.listen(port, () => console.log(`listening on port ${port}`));
})
.catch(err => console.log(err))

const users =  [
  {
    name: 'Trevor Brown',
    email: 'TrevorBrown25@gmail.com',
    assignee: 'TB',
    id: '1357',
    weddingdate: '2021-12-25',
    birthday: '1992-06-18',
    collabadded: false,
    collabid: null,
    sub: true
  }
];

const allTasks = [
  {
    id: '01',
    userid: '1357',
    taskname: 'guest-list',
    tasklabel: 'Guest List',
    assignee: 'TB',
    tags: '',
    startdate: '2020-11-20',
    enddate: '2020-11-24',
    status: 'in-progress',
    custom: false,
    advice: 'You should get this done',
    notes: 'I should get this done.',
    pintrest: 'https://www.pinterest.com/',
    blog: 'https://twitter.com/',
    moneytip: 'Spend less moneys.',
    archived: false
  },
  {
    id: '02',
    userid: '1357',
    taskname: 'create-budget',
    tasklabel: 'Create Budget',
    assignee: 'TB2',
    tags: '',
    startdate: '2020-11-16',
    enddate: '2020-11-20',
    status: 'complete',
    custom: false,
    advice: 'You should really get this done',
    notes: 'I should really get this done.',
    pintrest: 'https://www.pinterest.com/',
    blog: 'https://twitter.com/',
    moneytip: 'Spend even more moneys.',
    archived: false
  },
  {
    id: '03',
    userid: '1357',
    taskname: 'research-venue',
    tasklabel: 'Research Venue Space',
    assignee: 'TB',
    tags: '',
    startdate: '2020-11-19',
    enddate: '2020-11-22',
    status: 'not-started',
    custom: 'false',
    advice: 'This should probably get this done',
    notes: 'I think I should probably get this done.',
    pintrest: 'https://www.pinterest.com/',
    blog: 'https://twitter.com/',
    moneytip: '',
    archived: false
  }
]