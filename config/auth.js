module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    //console.log('control reached');
    if (!req.isAuthenticated()) {
      //console.log('control reached as ');
      return next();
    }
    res.redirect('/dashboard');      
  }
};
//Is done so that typing any route directly should not land us at that page
//untill user signed in