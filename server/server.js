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
const moment = require('moment');

var cors = require('cors')

dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_KEY);
console.log(process.env.STRIPE_KEY);

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
      res.redirect('/#/payment');
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
  res.status(200).json(req.user);
})

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'The Independent Bride Checklist',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 9900,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    allow_promotion_codes: true,
    success_url: `${process.env.SERVERHOST}/#/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SERVERHOST}/#/`,
  });
  res.json({ id: session.id });
});

app.post('/create-confirmation-session', async (req, res) => {
  const { body } = req;
  const session = await stripe.checkout.sessions.retrieve(body.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  res.status(200).send(customer);
});

app.post('/api/post/newUser', (req, res) => {
  const db = req.app.get('db');
  const { body } = req;
  // create the initials
  const initials = body.name.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  db.create_user([
    body.name,
    body.email,
    body.user_metadata.emailAgree,
    initials,
    body.user_metadata.weddingdate,
    body.user_metadata.birthday,
    false,
    null,
    false,
    body.user_metadata.timeUntil,
    body._id
  ])
  .then(user => {
    const taskTimeMultiplier = user[0].timeselected === "2Y" ? 2 :(user[0].timeselected === "6M" ? .5 : 1)
    const dateFromWedding = (daysAway) => (moment(user[0].weddingdate).subtract(daysAway, 'days').format('YYYY-MM-DD'));
    const newTasks = [user[0].auth_id, user[0].assignee]
      .concat(taskStarts.map(e => dateFromWedding(Math.round(e * taskTimeMultiplier))))
      .concat(taskEnds.map(e => dateFromWedding(Math.round(e * taskTimeMultiplier))));
    db.create_new_users_tasks(newTasks)
    .then(response => {
      res.status(200).send('Added new user');
    }).catch(err => console.log('db create user new tasks error', err))
  })
  .catch(err => console.log('db create user error', err))
})

app.post('/api/post/statusUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_task_status([userid, body.id, body.status])
  .then(response => res.status(200).send('updated task status'))
  .catch(err => console.log('db update task status error', err));
});

app.post('/api/post/startDateUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_start_date([userid, body.id, body.startdate])
  .then(response => res.status(200).send('updated task start date'))
  .catch(err => console.log('db update start date error', err));
});

app.post('/api/post/endDateUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_end_date([userid, body.id, body.enddate])
  .then(response => res.status(200).send('updated task end date'))
  .catch(err => console.log('db update end date error', err));
});

app.post('/api/post/nameUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_name([userid, body.id, body.tasklabel])
  .then(response => res.status(200).send('updated task name'))
  .catch(err => console.log('db update task name error', err));
});

app.post('/api/post/addTaskImage', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.add_task_image([userid, body.id, body.imageNmae, body.imageUrl])
  .then(response => res.status(200).send('added task image'))
  .catch(err => console.log('db add task image error', err));
});

app.post('/api/post/archiveTask', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.archive_task([userid, body.id])
  .then(response => res.status(200).send('archived task'))
  .catch(err => console.log('db archive task error', err));
});

app.post('/api/post/unarchiveTask', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.unarchive_task([userid, body.id])
  .then(response => res.status(200).send('unarchived task'))
  .catch(err => console.log('db unarchive task error', err));
});

app.post('/api/post/notesUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_notes([userid, body.id, body.notes])
  .then(response => res.status(200).send('task notes updated'))
  .catch(err => console.log('db notes update error', err));
});

app.post('/api/post/assigneeUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  console.log(body);
  db.update_assignee([userid, body.id, body.assignee.toUpperCase()])
  .then(response => res.status(200).send('task assignee updated'))
  .catch(err => console.log('db notes assignee error', err));
});

app.get('/api/get/userTasks', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  db.users_tasks([userid])
  .then(tasks => {
    res.status(200).json(tasks);
  })
})

app.post('/api/post/createTask', (req, res) => {
  const db = req.app.get('db');
  const { auth_id: userid, assignee } = req.user;
  const { body } = req;
  db.create_task(
    [
      body.id,
      userid,
      body.tasklabel.toLowerCase().split(' ').join('-'),
      body.tasklabel,
      body.assignee || assignee,
      body.startdate,
      body.enddate,
      body.status,
      body.notes
    ]
  )
  .then(response => res.status(200).send('task created'))
  .catch(err => console.log('db create task error', err));
});

const port = 3333;

massive(process.env.CONNECTION_STRING)
.then(massiveInstance => {
  app.set('db', massiveInstance)
  app.listen(port, () => console.log(`listening on port ${port}`));
})
.catch(err => console.log(err))

const taskStarts = [365,364,363,362,361,361,360,359,358,360,357,333,242,328,350];
const taskEnds = [362,357,359,338,361,358,337,352,358,327,305,331,210,321,326];