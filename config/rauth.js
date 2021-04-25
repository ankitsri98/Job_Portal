module.exports = {
  EnsureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    console.log('hehehe');
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/');
  },
  ForwardAuthenticated: function(req, res, next) {
    console.log('cont. reach');
    if (!req.isAuthenticated()) {
      console.log('cont  Reach as ');
      //means where this func. is used if control reaches to next route to execute
      return next();
    }
    res.redirect('/recruiter/dashboard');      
  }
};
//Is done so that typing any route directly should not land us at that page
//untill user signed in