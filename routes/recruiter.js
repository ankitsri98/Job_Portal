const express =require('express');
const router =express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { EnsureAuthenticated , ForwardAuthenticated } = require('../config/rauth');
// Load User model
const recruit = require('../model/recruiter');
//const { forwardAuthenticated } = require('../config/auth');
const Apply = require('../model/applyjob');
const Job = require('../model/jobpost');

//LOGIN
router.get('/login', ForwardAuthenticated, (req,res)=>res.render('rlogin'));

router.get('/dashboard', EnsureAuthenticated,  (req,res)=>{
  Apply.find().then( async (results)=>{
    var arr=[];
    results.forEach(result=>{
      
      Job.findById(result.applied).then(x=>{
        //console.log("fffrf",x);
        arr.push(x.company_name);
        
      })
      console.log(arr);
    });
    
    // result.applied
    // jobs.findone(for result.applied)
    // job.companyname
    res.render('rdashboard',{apply: results,companynames:arr});
  })
  .catch((err)=>{
    console.log(err);
  })
});

//REGISTER
router.get('/register',ForwardAuthenticated,(req,res)=>res.render('rregister'));

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
                console.log('new recruiter came ');
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
router.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }
    console.log('okkkkkkkkkayr');
    if (!user) {
      req.flash(
        'error_msg',
        'You Are Not Registered Yet'
      );
      return res.redirect('/recruiter/login');
    }
    console.log('okayr');
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log('reached to be directed');
      return res.redirect('/recruiter/dashboard');
    });

  })(req, res, next);
});
/*
router.post('/login',(req, res) => {
  const {email,password}  = req.body;
  //console.log({email,password});
  recruit.findOne({ email: email }).then(async (user) => {

  if(user && await bcrypt.compare(password, user.password)){
    res.redirect('/recruiter/dashboard');
  }
  else{
    req.flash(
      'error_msg',
      'Not Registered Or Put Correct Credentials'
    );
    res.redirect('/recruiter/login');
  }}).catch(err => console.log(err));
});*/
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports=router;
