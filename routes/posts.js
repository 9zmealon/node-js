var express = require("express");
var router = express.Router();
var connection = require("./dbConnction/databaseConnection");

const { check, validationResult } = require('express-validator/check');

router.post('/', [
    check('title')
        .isLength({ min: 2, max: 10 })
        .withMessage('max 10 min 2 character INVALID INPUT.'),
    check('description')
        .isLength({ min: 2, max: 20 })
        .withMessage("INVALID INPUT character length 2-20."),
], function (req, res, next) {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(422).json(error.array());
    var myObj = {
        title: req.body.title || "not inserted",
        description: req.body.description,
        image: req.body.image,
        status: req.body.status || 0
    }
    connection.query('insert into posts set ?', myObj, function (err, result, fields) {
        if (err) throw err;

        res.redirect(301, '/posts/id/' + result.insertId)
        // res.json({
        //     ...result,
        //     "message": "Inserted new data",

        // })
    })
});

router.delete('/delete/:id', function (req, res, next) {
    var id = req.params.id;
    connection.query('delete from posts where id = ?', id, function (err, result, filds) {
        if (err) throw err;
        res.json({
            message: "delete successfull."
        })
    })
})

router.put('/update/:id', [
    check('title')
        .isLength({ min: 2, max: 10 })
        .withMessage('2-10 character needed.'),
    check('description')
        .isLength({ min: 2, max: 20 })
], function (req, res, next) {

    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(422).json(error.array());
    var id = req.params.id;
    var myObj = {
        title: req.body.title || "not inserted",
        description: req.body.description,
        image: req.body.image,
        status: req.body.status || 0
    }
    connection.query('update posts set ? where id = ?', [myObj, id], function (err, result, fields) {
        if (err) throw err;

        res.redirect(303, '/posts/id/' + id);
        // res.json({
        //     message: "update successfull."
        // })
    })
})

router.get('/', function (req, res, next) {
    connection.query("select * from posts", function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    })
});

router.get('/id/:id', function (req, res, next) {
    var id = req.params.id;
    connection.query('select * from posts where id = ?', id, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});

router.get('/status/:status', function (req, res, next) {
    var status = req.params.status;
    connection.query('select * from posts where status = ?', status, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});

router.get('/image/:id', function (req, res, next) {
    var id = req.params.id;
    connection.query('select * from posts where id = ?', id, function (err, result, fields) {
        if (err) {
            throw err;
        }
        console.log(result);
        res.render("img", { image: result[0].image });
    });
});
module.exports = router;