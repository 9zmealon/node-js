var express = require('express');
var router = express.Router();
var connection = require("./dbConnction/databaseConnection");

function requiresLogin(req,res,next){
    if (!req.session.userId) return res.status(401).send('please login');
    next();
}
router.get('/current-user', requiresLogin, function (req, res) {

    // if (!req.session.userId) return res.status(401).send('please login');

    connection.query(
        'select * from login_table where id = ?',
        req.session.userId,
        (err, result) => {
            if (err) throw err;
            var { id, email, isVerified } = result[0];
            res.json({ id, email, isVerified , msg: "current user"});
        }
    )
});

router.post('/login', function (req, res) {
    var credentials = {
        email: req.body.email,
        password: req.body.password
    };

    connection.query('select * from login_table where email = ? AND password = ?',
        [credentials.email, credentials.password],
        function (error, result) {
            if (error) throw error;
        if(result.length < 1){
            return res.status(401).send("Invalid login details")
        }
            req.session.userId = result[0].id;

            res.redirect(301, '/auth/current-user')
            // res.json(result[0]);
        });
});

module.exports = router;