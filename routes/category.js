var express = require('express');
var router = express.Router();
var connection = require("./dbConnction/databaseConnection");

const { check, validationResult } = require('express-validator/check');

router.post('/', [
    check('title')
        .isLength({ min: 2 })
        .withMessage("invalid input too short min 2 ")
        .isLength({ max: 10 })
        .withMessage("too long max 10"),
    check('email').isEmail()
        .withMessage("invalid email adress."),
    check('description').isLength({ min: 2, max: 10 })
        .withMessage("too long max 10")
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json(errors.array());
    } else {
        var insertObj = {
            title: req.body.title || "unknown",
            description: req.body.description || null,
            status: req.body.status
        }
        connection.query('insert into category set ?', insertObj, function (err, result) {
            if (err) throw err;
            res.redirect(301, '/category/id/' + result.insertId);
            // res.json({
            //     id : result.insertId,
            //     message: 'insert succesful.'
            // });
        });
    }

});

router.put('/update/:id', [
    check("title")
        .isLength({ min: 2, max: 10 })
        .withMessage("invalid input too shor or too long max 10 min 2"),
    check("description")
        .isLength({ min: 2, max: 10 })
        .withMessage("invalid input too shor or too long max 10 min 2"),
], function (req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json(error.array());
    }
    var id = req.params.id;
    var updateObj = {
        title: req.body.title || "unknown",
        description: req.body.description || null,
        status: req.body.status || 1
    }
    var query = connection.query('update category set ? where id = ?', [updateObj, id], function (err, result) {
        if (err) throw err;
        res.redirect(303, '/category/id/' + id); //303 for put method.
        // res.json({
        //     ...result,
        //     message: 'update successfull.'
        // });
    });
    console.log(query.sql);
});

router.delete('/delete/:id', function (req, res) {
    connection.query('delete from category where id = ?', req.params.id, function (err, result) {
        if (err) throw err;
        res.json({
            ...result,
            message: " delete successful."
        })
    })
})

router.get('/', function (req, res, next) {
    connection.query('select * from category', function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});

router.get('/id/:id', function (req, res, next) {
    var id = req.params.id;
    connection.query('select * from category where id = ?', id, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});

router.get('/status/:status', function (req, res, next) {
    var status = req.params.status;
    connection.query('select * from category where status = ?', status, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});
module.exports = router;