const express =require('express');
const router =express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
// Load User model
const recruit = require('../model/recruiter');
//const { forwardAuthenticated } = require('../config/auth');
const Apply = require('../model/applyjob');

//LOGIN
router.get('/login', forwardAuthenticated, (req,res)=>res.render('rlogin'));

router.get('/dashboard', forwardAuthenticated, (req,res)=>{
  Apply.find().then((result)=>{
    res.render('rdashboard',{apply: result})
  })
  .catch((err)=>{
    console.log(err);
  })
});

//REGISTER
router.get('/register',forwardAuthenticated,(req,res)=>res.render('rregister'));

// Register
router.post('/register', (req, res) => {
  const { name, email, company,  password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !company || !password || !password2) {
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
      company,
      password,
      password2
    });
  } else {
    //validating 
    recruit.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          company,
          password,
          password2
        });
      } else {
        const newUser = new recruit({
          name,
          email,
          company,
          password
        });
        //console.log(newUser);
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
                res.redirect('/recruiter/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
  }
});


// Login
router.post('/login',(req, res) => {
  const {email,password}  = req.body;
  //console.log({email,password});
  recruit.findOne({ email: email }).then(async (user) => {

  if(await bcrypt.compare(password, user.password)){
    res.redirect('/recruiter/dashboard');
  }}).catch(err => console.log(err));
});
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports=router;