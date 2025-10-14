const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
//require('dotenv').config();

const port = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

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

app.get('/users/events', (req, res) => {
  res.render('events');
});

app.get('/users/home', (req, res) => {
  res.render('home');
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

// Post routes
app.post('/users/register', async (req, res) => {
  let { username, email, password, password2, first_name, last_name, user_type} = req.body;
  user_type = user_type || 'user';
  console.log({
    username,
    first_name,
    last_name,
    email,
    password,
    password2,
    user_type
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
            `INSERT INTO users (username, email, password, first_name, last_name, user_type)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, password`, [username, email, hashedPassword, first_name, last_name, user_type], (err, results) => {
              if(err) {
                throw err;
              }
              console.log(results.rows);
              req.flash('success_msg', "You are now registered. Please log in");
              res.redirect('/users/login');
            }
          )
        }
      }
    )
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

/*
app.get('/users/register', (req, res) => {
  res.render({ 'register' });
});

app.get('/users/login', (req, res) => {
  res.render({ 'login' });
});

app
*/
