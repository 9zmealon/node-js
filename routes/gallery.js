var express = require('express');
var router = express.Router();

var connection = require("./dbConnction/databaseConnection");

router.get('/',(req,res)=>{
    var baseUrl = req.protocol + "://" + req.get('host');
    connection.query('SELECT * from uploads', (err,result)=>{
        if(err) throw err;
        var results = result.map((data)=>{
            return {
                filename: data.filename,
                url: baseUrl + '/uploads/' + data.filename
            }
        });
        res.render('gallery',{results});
    })
})
module.exports = router;