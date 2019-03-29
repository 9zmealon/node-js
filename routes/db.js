var express = require("express");
var router = express();
var mysql = require("mysql");


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

connection.connect();

router.get('/', function (req, res, next) {
    connection.query("select * from items", function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    })
})

router.get('/id/:myId', function (req, res, next) {
    var id = req.params.myId;
    connection.query("select * from items where id = ?", id, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    })
});

router.get('/status/:myStatus', function (req, res, next) {
    var status = req.params.myStatus;
    connection.query("select * from items where status = ?", status, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    })
});


module.exports = router;