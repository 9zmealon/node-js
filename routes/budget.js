var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "budget"
});
connection.connect();

//-------INCOME--------------------------------------------------------------------
router.get('/income', (req, res) => {
    connection.query('SELECT * FROM income', (err, result) => {//---------GET
        if (err) throw err;
        res.json({
            result
        });
    });
});

router.get('/income/:id', (req, res) => {
    connection.query('SELECT * FROM income WHERE id = ?', req.params.id, (err, result) => {//------------GET + id
        if (err) throw err;
        res.json({
            result
        });
    });
});

router.post('/income', (req, res) => {//------------------POST
    var postObject = {
        title: req.body.title,
        price: req.body.price || 0
    };
    connection.query('INSERT into income SET ?', postObject, (err, result) => {
        if (err) throw err;
        res.redirect(301, '/budget/income/' + result.insertId);
    });
});

router.put('/income/:id', (req, res) => {//--------------------PUT
    var putObject = {
        title: req.body.title,
        price: req.body.price || 0
    };
    connection.query('UPDATE income SET ? WHERE id = ?', [putObject, req.params.id], function (err, result) {
        if (err) throw err;
        res.redirect(303, '/budget/income/' + req.params.id);
    });
});

router.delete('/income/:id', (req,res)=>{//-----------------------------DELETE
    connection.query('DELETE FROM income where id = ?', req.params.id, (err,result)=>{
        if(err) throw err;
        res.redirect(303, '/budget/income');
    });
});
//--------------------------------------------------------------------------------------------
//=======EXPENSES======================================================================
router.get('/expenses', (req, res) => {
    connection.query('SELECT * FROM expenses', (err, result) => {//---------GET
        if (err) throw err;
        res.json({
            result
        });
    });
});

router.get('/expenses/:id', (req, res) => {
    connection.query('SELECT * FROM expenses WHERE id = ?', req.params.id, (err, result) => {//------------GET + id
        if (err) throw err;
        res.json({
            result
        });
    });
});

router.post('/expenses', (req, res) => {//------------------POST
    var postObject = {
        title: req.body.title,
        price: req.body.price || 0
    };
    connection.query('INSERT into expenses SET ?', postObject, (err, result) => {
        if (err) throw err;
        res.redirect(301, '/budget/expenses/' + result.insertId);
    });
});

router.put('/expenses/:id', (req, res) => {//--------------------PUT
    var putObject = {
        title: req.body.title,
        price: req.body.price || 0
    };
    connection.query('UPDATE expenses SET ? WHERE id = ?', [putObject, req.params.id], function (err, result) {
        if (err) throw err;
        res.redirect(303, '/budget/expenses/' + req.params.id);
    });
});

router.delete('/expenses/:id', (req,res)=>{//-----------------------------DELETE
    connection.query('DELETE FROM expenses where id = ?', req.params.id, (err,result)=>{
        if(err) throw err;
        res.redirect(303, '/budget/expenses');
    });
});
//============================================================================================
module.exports = router;