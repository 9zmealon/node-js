var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_js-class'
});
connection.connect();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
const { check, validationResult } = require('express-validator/check');

router.post('/', [
    check('usersname')
        .isLength({ min: 7 }).withMessage('Invalid Input. Too short. Atleast 8 character needed.')
        .isLength({ max: 20 }).withMessage('Invalid Input. Too long. Atmost 20 character Valid.'),
    check('password')
        .isLength({ min: 8 }).withMessage('Invaliid. Atleast 8 character.')
        .isLength({ max: 20 }).withMessage('Invalid. Atmost 20 character')
], function (req, res) {

    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(422).json(error.array());
    var insertObj = {
        usersname: req.body.usersname || "unknown",
        password: req.body.password || null,
        status: req.body.status || 0
    }
    connection.query('insert into users set ?', insertObj, function (err, result) {
        if (err) throw err;

        res.redirect(301, '/users/' + result.insertId);
        // res.json({
        //     ...result,
        //     message: 'insert succesful.'
        // });
    });
});

router.put('/update/:id', [
    check('usersname')
        .isLength({ min: 7 }).withMessage('Invalid Input. Too short. Atleast 8 character needed.')
        .isLength({ max: 20 }).withMessage('Invalid Input. Too long. Atmost 20 character Valid.'),
    check('password')
        .isLength({ min: 8 }).withMessage('Invaliid. Atleast 8 character.')
        .isLength({ max: 20 }).withMessage('Invalid. Atmost 20 character')
], function (req, res) {

    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(422).json(error.array());
    id = req.params.id;
    var updateObj = {
        usersname: req.body.usersname || "unknown",
        password: req.body.password || null,
        status: req.body.status || 0
    }
    connection.query('update users set ? where id = ?', [updateObj, id], function (err, result) {
        if (err) throw err;
        res.redirect(301, '/users/' + result.insertId);

        // res.json({
        //     ...result,
        //     message: 'update successfull.'
        // });
    });
});

router.delete('/delete/:id', function (req, res) {
    connection.query('delete from users where id = ?', req.params.id, function (err, result) {
        if (err) throw err;
        res.json({
            ...result,
            message: " delete successful."
        })
    })
})
//---------------------------------------------------------------------------------------
router.get('/', function (req, res, next) {
    connection.query('select * from users', function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    connection.query('select * from users where id = ?', id, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});

router.get('/status/:status', function (req, res, next) {
    var status = req.params.status;
    connection.query('select * from users where status = ?', status, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});
module.exports = router;
