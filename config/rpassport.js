const rpassport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const recruit= require('../model/recruiter');
// Load User model

module.exports = function(rpassport) {
  rpassport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      recruit.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  rpassport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  rpassport.deserializeUser(function(id, done) {
    recruit.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
