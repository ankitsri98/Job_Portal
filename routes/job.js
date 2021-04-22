const express =require('express');
const router =express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
// Load User model
const Job = require('../model/jobpost');

router.get('/add',forwardAuthenticated,(req,res)=>res.render('jobs'));


// Register
router.post('/add', (req, res) => {
  console.log('xxx');
  const { company_name, post, requirement, eligible } = req.body;
  let errors = [];

  if (!company_name|| !post || !requirement || !eligible) {
    errors.push({ msg: 'Please enter all fields' });
  }
  //console.log(company_name);
  if (errors.length > 0) {
    console.log('error occured');
    //rendering smae form with error msgs
    res.render('rdashboard', {
      errors,
      company_name,
      post,
      requirement,
      eligible
    });
  } else {
    //posting a job
    //console.log('posta job');
        const newUser = new Job({
          company_name,
          post,
          requirement,
          eligible
        });
        newUser
          .save()
          .then(user => {
            req.flash(
              'success_msg',
              'You have now posted a job Successfully'
            );
            console.log('ewaqe');
            res.redirect('/recruiter/dashboard');
          })
          .catch(err => console.log(err));
      }
});


module.exports=router;
