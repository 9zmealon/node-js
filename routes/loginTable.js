var express = require('express');
var router = express.Router();
var connection = require("./dbConnction/databaseConnection");

router.post('/register', function (req, res) {
    var clientRequest = {
        email: req.body.email,
        password: req.body.password
    };

    connection.query('insert into login_table set ?', clientRequest, function (error, result) {
        if (error) throw error;
        // res.redirect(301, '/loginTable/' + result.insertId);
        req.session.usrID = result.insertId;
        res.redirect(301, '/auth/current-user');
    });
});

router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/:userId', function (req, res) {
    connection.query('select * from login_table where id = ?', req.params.userId, function (err, result) {
        if (err) throw err;
        var { id, email, isVerified } = result[0];
        res.json({
            id,
            email,
            isVerified
        });
    });
});


module.exports = router;