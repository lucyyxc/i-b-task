"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var session = require('express-session');

var dotenv = require('dotenv');

var passport = require('passport');

var Auth0Strategy = require('passport-auth0');

var util = require('util');

var url = require('url');

var querystring = require('querystring');

var massive = require('massive');

var moment = require('moment');

var cors = require('cors');

var taskTimes = require('./taskTimes');

dotenv.config();

var stripe = require('stripe')(process.env.STRIPE_KEY);

var strategy = new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || '/callback'
}, function (accessToken, refreshToken, extraParams, profile, done) {
  // console.log('inside auth strat', profile);
  // console.log('inside auth strat', profile.emails[0].value);
  var db = app.get('db');
  var email = profile.emails[0].value;
  db.get_user_by_email([email]).then(function (user) {
    return done(null, user[0]);
  });
});
passport.use(strategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
var app = express();
app.use(bodyParser.json());
app.use(cors());
var sess = {
  secret: 'ChAnGe ThIs SeCrEt',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true; // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(express["static"]('build'));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}); // Perform the login, after login Auth0 will redirect to callback

app.get('/auth', passport.authenticate('auth0')); // Perform the final stage of authentication and redirect to previously requested URL or '/user'

app.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/auth');
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      if (user && user.sub) {
        res.redirect('/#/checklist');
      } else {
        res.redirect('/#/payment');
      }
    });
  })(req, res, next);
}); // Perform session logout and redirect to homepage

app.get('/auth/logout', function (req, res) {
  req.logout();
  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }

  var logoutURL = new url.URL(util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN));
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;
  res.redirect(logoutURL);
});
app.get('/api/get/user', function (req, res) {
  res.status(200).json(req.user);
});
app.post('/create-checkout-session', function _callee(req, res) {
  var session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'The Independent Bride Checklist',
                  images: ['https://flowerlogo.s3.us-east-2.amazonaws.com/TIB-magnolia-circle-RGB-72dpi-nude.png']
                },
                unit_amount: 9900
              },
              quantity: 1
            }],
            mode: 'payment',
            allow_promotion_codes: true,
            success_url: "".concat(process.env.SERVERHOST, "/#/checklist?success=true"),
            cancel_url: "".concat(process.env.SERVERHOST, "/#/")
          }));

        case 2:
          session = _context.sent;
          res.json({
            id: session.id,
            user: req.user.auth_id
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.post('/create-confirmation-session', function _callee2(req, res) {
  var body, session, customer;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          body = req.body;
          _context2.next = 3;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.retrieve(body.session_id));

        case 3:
          session = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(stripe.customers.retrieve(session.customer));

        case 6:
          customer = _context2.sent;
          res.status(200).send(customer);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.post('/api/post/newUser', function (req, res) {
  var db = req.app.get('db');
  var body = req.body; // create the initials

  var initials = body.name.split(' ').map(function (name) {
    return name.charAt(0).toUpperCase();
  }).join('');
  db.create_user([body.name, body.email, body.user_metadata.emailAgree, initials, body.user_metadata.weddingdate, body.user_metadata.birthday, false, null, false, body.user_metadata.timeUntil, body._id]).then(function (user) {
    var taskTimeMultiplier = user[0].timeselected === "2Y" ? 2 : user[0].timeselected === "6M" ? .5 : 1;

    var dateFromWedding = function dateFromWedding(daysAway) {
      return moment(user[0].weddingdate).subtract(daysAway, 'days').format('YYYY-MM-DD');
    };

    var newTasks = [user[0].auth_id, user[0].assignee].concat(taskTimes.map(function (task) {
      return [dateFromWedding(Math.round(task.startDate * taskTimeMultiplier)), dateFromWedding(Math.round(task.endDate * taskTimeMultiplier))];
    }).flat());
    db.create_new_users_tasks(newTasks).then(function (response) {
      res.status(200).send('Added new user');
    })["catch"](function (err) {
      return console.log('db create user new tasks error', err);
    });
  })["catch"](function (err) {
    return console.log('db create user error', err);
  });
});
app.post('/api/post/statusUpdate', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  db.update_task_status([userid, body.id, body.status]).then(function (response) {
    return res.status(200).send('updated task status');
  })["catch"](function (err) {
    return console.log('db update task status error', err);
  });
});
app.post('/api/post/subUpdate', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  db.update_sub([userid, body.sub]).then(function (response) {
    return res.status(200).send('updated sub status');
  })["catch"](function (err) {
    return console.log('db update sub error', err);
  });
});
app.post('/api/post/startDateUpdate', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  db.update_start_date([userid, body.id, body.startdate]).then(function (response) {
    return res.status(200).send('updated task start date');
  })["catch"](function (err) {
    return console.log('db update start date error', err);
  });
});
app.post('/api/post/endDateUpdate', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  db.update_end_date([userid, body.id, body.enddate]).then(function (response) {
    return res.status(200).send('updated task end date');
  })["catch"](function (err) {
    return console.log('db update end date error', err);
  });
});
app.post('/api/post/nameUpdate', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  db.update_name([userid, body.id, body.tasklabel]).then(function (response) {
    return res.status(200).send('updated task name');
  })["catch"](function (err) {
    return console.log('db update task name error', err);
  });
});
app.post('/api/post/addTaskImage', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  db.add_task_image([userid, body.id, body.imageNmae, body.imageUrl]).then(function (response) {
    return res.status(200).send('added task image');
  })["catch"](function (err) {
    return console.log('db add task image error', err);
  });
});
app.post('/api/post/archiveTask', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  db.archive_task([userid, body.id]).then(function (response) {
    return res.status(200).send('archived task');
  })["catch"](function (err) {
    return console.log('db archive task error', err);
  });
});
app.post('/api/post/unarchiveTask', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  db.unarchive_task([userid, body.id]).then(function (response) {
    return res.status(200).send('unarchived task');
  })["catch"](function (err) {
    return console.log('db unarchive task error', err);
  });
});
app.post('/api/post/subUpdate', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  console.log('BODY DOT SUB', body.sub);
  db.update_sub([userid, body.sub]).then(function (response) {
    return res.status(200).send('user sub updated');
  })["catch"](function (err) {
    return console.log('db user sub update error', err);
  });
});
app.post('/api/post/notesUpdate', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  db.update_notes([userid, body.id, body.notes]).then(function (response) {
    return res.status(200).send('task notes updated');
  })["catch"](function (err) {
    return console.log('db notes update error', err);
  });
});
app.post('/api/post/assigneeUpdate', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  console.log(body);
  db.update_assignee([userid, body.id, body.assignee.toUpperCase()]).then(function (response) {
    return res.status(200).send('task assignee updated');
  })["catch"](function (err) {
    return console.log('db notes assignee error', err);
  });
});
app.post('/api/post/tagUpdate', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  var body = req.body;
  console.log(body);
  db.update_tag([userid, body.id, body.tags]).then(function (response) {
    return res.status(200).send('task tag updated');
  })["catch"](function (err) {
    return console.log('db notes tag error', err);
  });
});
app.get('/api/get/userTasks', function (req, res) {
  var db = req.app.get('db');
  var userid = req.user.auth_id;
  db.users_tasks([userid]).then(function (tasks) {
    res.status(200).json(tasks);
  });
});
app.post('/api/post/createTask', function (req, res) {
  var db = req.app.get('db');
  var _req$user = req.user,
      userid = _req$user.auth_id,
      assignee = _req$user.assignee;
  var body = req.body;
  db.create_task([body.id, userid, body.tasklabel.toLowerCase().split(' ').join('-'), body.tasklabel, body.assignee || assignee, body.tags, body.startdate, body.enddate, body.status, body.notes]).then(function (response) {
    return res.status(200).send('task created');
  })["catch"](function (err) {
    return console.log('db create task error', err);
  });
});
var port = 3333;
massive(process.env.CONNECTION_STRING).then(function (massiveInstance) {
  app.set('db', massiveInstance);
  app.listen(port, function () {
    return console.log("listening on port ".concat(port));
  });
})["catch"](function (err) {
  return console.log(err);
});