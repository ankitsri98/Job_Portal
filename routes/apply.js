const express =require('express');
const router =express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
// Load User model
const Apply = require('../model/applyjob');

router.get('/apply', forwardAuthenticated, (req,res)=>res.render('applys'));

router.post('/apply', (req, res) => {
  const { name, email, contact_no,  college , skills } = req.body;
  let errors = [];

  if (!name || !email || !contact_no || !college || !skills) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (contact_no.toString().length!=10) {
    errors.push({ msg: 'Invalid Number' });
  }
  //console.log(contact_no);
  if (errors.length > 0) {
    //rendering smae form with error msgs
    res.render('applys', {
      errors,
      name,
      email,
      contact_no,
      college,
      skills
    });
  } else {
    //validating 
    Apply.findOne({ email: email }).then(user => {
      if (user) {
        //console.log('already found');
        errors.push({ msg: 'Already Applied For this Job' });
        res.render('applys', {
          errors,
          name,
          email,
          contact_no,
          college,
          skills
        });
      } else {
        //console.log('okay');
        const newUser = new Apply({
          name,
          email,
          contact_no,
          college,
          skills
        });
        //console.log(newUser);
        newUser
          .save()
          .then(user => {
            req.flash(
              'success_msg',
              'You are now registered and can log in'
            );
            res.redirect('/users/dashboard');
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
  }
});


module.exports=router;

