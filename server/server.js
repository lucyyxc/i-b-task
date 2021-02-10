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
const _ = require('lodash');

var cors = require('cors')

const taskTimes = require('./taskTimes')

dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_KEY);

var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || '/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    if ( profile && profile.emails ) {
      const db = app.get('db');
      const email = profile.emails[0].value
      db.get_user_by_email([email])
      .then(user => {
        return done(null, user[0]);
      })
    } else {
      return done(null, profile);
    }
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
      if (user && user.sub) {
        res.redirect('/#/checklist');
      } else {
        res.redirect('/#/payment');
      }
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
            images: ['https://flowerlogo.s3.us-east-2.amazonaws.com/TIB-magnolia-circle-RGB-72dpi-nude.png'],
          },
          unit_amount: 9900,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    allow_promotion_codes: true,
    success_url: `${process.env.SERVERHOST}/#/checklist?success=true`,
    cancel_url: `${process.env.SERVERHOST}/#/`,
  });
  res.json({ id: session.id, user: req.user.auth_id });
});

app.post('/create-confirmation-session', async (req, res) => {
  const { body } = req;
  const session = await stripe.checkout.sessions.retrieve(body.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  res.status(200).send(customer);
});

app.post('/api/post/duplicateUser', (req, res) => {
  const db = req.app.get('db');
  const { body } = req;
  db.duplicate_user([body.email])
  .then( response => {
    res.status(200).send(response)
  })
  .catch(err => console.log('db duplicate user error', err))
})

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
      .concat(_.flattenDeep(taskTimes.map(task => [dateFromWedding(Math.round(task.startDate * taskTimeMultiplier)), dateFromWedding(Math.round(task.endDate * taskTimeMultiplier))])));
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

app.post('/api/post/subUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_sub([userid, body.sub])
  .then(response => res.status(200).send('updated sub status'))
  .catch(err => console.log('db update sub error', err));
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

app.post('/api/post/subUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_sub([userid, body.sub])
  .then(response => res.status(200).send('user sub updated'))
  .catch(err => console.log('db user sub update error', err))
})

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
  db.update_assignee([userid, body.id, body.assignee.toUpperCase()])
  .then(response => res.status(200).send('task assignee updated'))
  .catch(err => console.log('db notes assignee error', err));
});

app.post('/api/post/usersNameUpdate', (req, res) => {
  const db = req.app.get('db');
  const { auth_id: userid, assignee } = req.user;
  const { body } = req;
  const initials = body.name.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  db.update_users_name([userid, body.name, initials])
  .then(response => db.update_users_name_task_assignee([userid, assignee, initials])
    .then(response => {
      req.session.passport.user.name = body.name;
      req.session.passport.user.assignee = initials;
      req.session.save(function(err) {console.log(err)})
      res.status(200).send('users name updated')
    })
    .catch(err => console.log('db user new name task assignee error, err'))
  )
  .catch(err => console.log('db notes assignee error', err));
});

app.post('/api/post/weddingDateUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_wedding_date([userid, body.weddingdate])
  .then(response => {
    req.session.passport.user.weddingdate = body.weddingdate;
    req.session.save(function(err) {console.log(err)})
    res.status(200).send('updated user wedding date')
  })
  .catch(err => console.log('db update wedding date error', err));
});

// TODO UNTESTED
app.post('/api/post/birthdayUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_birthday([userid, body.birthday])
  .then(response => {
    req.session.passport.user.birthday = body.birthday;
    req.session.save(function(err) {console.log(err)})
    res.status(200).send('updated user birthday')
})
  .catch(err => console.log('db update birthday error', err));
});

app.post('/api/post/tagUpdate', (req, res) => {
  const db = req.app.get('db');
  const userid = req.user.auth_id;
  const { body } = req;
  db.update_tag([userid, body.id, body.tags])
  .then(response => res.status(200).send('task tag updated'))
  .catch(err => console.log('db notes tag error', err));
});

app.get('/api/get/userTasks', (req, res) => {
  const db = req.app.get('db');
  console.log(req.user);
  if (req.user) {
    const userid = req.user.auth_id;
    db.users_tasks([userid])
    .then(tasks => {
      res.status(200).json(tasks);
    })
  } else {
    res.status(404).send('No user available');
  }
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
      body.tags,
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