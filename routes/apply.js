const express =require('express');
const router =express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated , forwardAuthenticated } = require('../config/auth');
// Load User model
const Apply = require('../model/applyjob');
const Job = require('../model/jobpost');
//router.get('/apply', forwardAuthenticated, (req,res)=>res.render('applys'));


router.get('/apply/:id', ensureAuthenticated , (req,res)=>{
  //console.log('enterrrrrrr');
  const id=req.params.id;
  Job.findById(id)
    .then(result=>{
      //console.log('asdadasd');
      res.render('applys',{applied: id});
    })
    .catch(err=>{
      console.log(err);
    });
});

router.post('/apply', (req, res) => {
  const { name, email, contact_no,  college , skills, applied } = req.body;
  let errors = [];
  console.log(applied);
  if (!name || !email || !contact_no || !college || !skills || !applied) {
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
      skills,
      applied
    });
  } else {
    //validating 
    Apply.findOne({ email: email , applied: applied }).then(user => {
      if (user) {
        //console.log('already found');
        errors.push({ msg: 'Already Applied For this Job' });
        res.render('applys', {
          errors,
          name,
          email,
          contact_no,
          college,
          skills,
          applied
        });
      } else {
        //console.log('okay');
        const newUser = new Apply({
          name,
          email,
          contact_no,
          college,
          skills,
          applied
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

