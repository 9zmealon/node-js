var express = require('express');
var router = express.Router();
var connection = require("./dbConnction/databaseConnection");

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        connection.query('SELECT * from users where usersname =? and password = ?', [username, password],
            (err, result) => {
                if (err) return done(err);
                if (!result) return done(null, false, { message: "users not found" });
                return done(null, result);
            })
        // User.findOne({ username: username }, function(err, user) {
        //   if (err) { return done(err); }
        //   if (!user) {
        //     return done(null, false, { message: 'Incorrect username.' });
        //   }
        //   if (!user.validPassword(password)) {
        //     return done(null, false, { message: 'Incorrect password.' });
        //   }
        //   return done(null, user);
        // });
    }
));

router.post('/login',
    (req, res) => {
        passport.authenticate('local', (err, users, info) => {
            if (err) throw err;
            if (users) {
                console.log("users", users);
            }
            console.log("info:", info);
        })(req, res, next);
        res.send({
            meg: "login success"
        })
    })

module.exports = router;