const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const passport = require("passport");
//require('dotenv').config();

const initializePassport = require("./passportConfig")

initializePassport(passport);

const port = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Get routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/users/register', (req, res) => {
  res.render('register');
});

app.get('/users/login', (req, res) => {
  res.render('login');
});

app.get('/users/logout', (req, res) => {
  res.logOut();
  res.flash("success_msg", "You have loged out");
  res.redirect("/users/login");
});

app.get('/users/events', (req, res) => {
  res.render('events');
});

app.get('/users/home', (req, res) => {
  res.render('home', { user: req.user.username });
});

app.get('/users/profile', (req, res) => {
  res.render('profile');
});

app.get('/users/settings', (req, res) => {
  res.render('settings');
});

app.get('/users/messages', (req, res) => {
  res.render('messages');
});

app.get('/users/dashboard', (req, res) => {
  res.render('dashboard', { user: "userBC" });
});

// Diagnostic endpoint to check user data
app.get('/api/check-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query(
      'SELECT id, email, username, first_name, last_name, location_lat, location_lng, location_address FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      res.json({ error: 'User not found' });
    } else {
      res.json({ user: result.rows[0] });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post routes
app.post('/users/register', async (req, res) => {
  let { username, email, password, password2, first_name, last_name, user_type} = req.body;
  user_type = user_type || 'user';
  console.log('Registration data:', {
    username,
    first_name,
    last_name,
    email,
    password,
    password2,
    user_type,
    location_lat: req.body.location_lat,
    location_lng: req.body.location_lng,
    location_address: req.body.location_address
  });
  let errors = [];
  if(!username || !email || !password || !password2 || !first_name || !last_name) {
    errors.push({ message: "Please enter all fields"});
  }

  if(password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters"});
  }

  if(password != password2) {
    errors.push({ message: "Passwords do not match"});
  }

  if(errors.length > 0) {
    res.render('register', { errors });
  } else {
    // Form validation has passed
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    pool.query(
      `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
        if(err) {
          throw err;
        }
        console.log(results.rows);

        if(results.rows.length > 0) {
          errors.push({ message: "Email already registered"});
          res.render('register', { errors });
        } else {
          pool.query(
            `INSERT INTO users (
              username, email, password, first_name, last_name, user_type,
              bio, profile_image_url, location_lat, location_lng, location_address,
              is_verified, is_active
            ) VALUES (
              $1, $2, $3, $4, $5, $6,
              $7, $8, $9, $10, $11,
              FALSE, TRUE
            )
            RETURNING id, password`, 
            [
              username, email, hashedPassword, first_name, last_name, user_type,
              req.body.bio || null, req.body.profile_image_url || null,
              req.body.location_lat || null, req.body.location_lng || null, req.body.location_address || null
            ], 
            (err, results) => {
              if(err) {
                throw err;
              }
              const userId = results.rows[0].id;
              // Verify the user was created with all data
              pool.query(
                'SELECT * FROM users WHERE id = $1',
                [userId],
                (verifyErr, verifyResults) => {
                  if (verifyErr) {
                    console.error('Error verifying user creation:', verifyErr);
                  } else {
                    console.log('Created user data:', verifyResults.rows[0]);
                  }
                  req.flash('success_msg', "You are now registered. Please log in");
                  res.redirect('/users/login');
                }
              );
            }
          )
        }
      }
    )
  }
});

app.post(
  "/users/login", 
  passport.authenticate('local',{
    successRedirect: "/users/home",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
