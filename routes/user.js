const express =require('express');
const router =express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated , forwardAuthenticated } = require('../config/auth');
// Load User model
const User = require('../model/User');
const Job = require('../model/jobpost');

//LOGIN
router.get('/login', forwardAuthenticated, (req,res)=>res.render('login'));


router.get('/dashboard', ensureAuthenticated, (req,res)=>{
  Job.find().then((result)=>{
    //console.log(result);
    res.render('dashboard',{jobs: result})
  })
  .catch((err)=>{
    console.log(err);
  }) 
});

//REGISTER
router.get('/register',forwardAuthenticated,(req,res)=>res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    //rendering smae form with error msgs
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validating 
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                console.log('new user came');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }
    console.log('okkkkkkkkkayr');
    if (!user) {
      return res.redirect('/users/login');
    }
    console.log('okayr');
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log('redirect to user dash');
      return res.redirect('/users/dashboard');
    });

  })(req, res, next);
});
/*
router.post('/login', (req, res) => {
  console.log('okayr');
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })
});*/
/*router.post('/login',(req, res) => {
  const {email,password}  = req.body;
  //console.log({email,password});
  User.findOne({ email: email }).then(async (user) => {
    //console.log(user);
  if(user && await bcrypt.compare(password, user.password)){
    res.redirect('/users/dashboard');
  }
else{
  req.flash(
    'error_msg',
    'Not Registered Or Put Correct Credentials'
  );
  res.redirect('/users/login');
}}).catch(err => console.log(err));
});*/

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports=router;
