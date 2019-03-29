var express = require("express");
var route = express.Router(); // var route = express();
var connection = require("./dbConnction/databaseConnection");

route.get('/', function (req, res, next) {
    res.render('test', {
        title: "this is a test page",
        description: "sajhdgajshdasd"
    });
});

route.get("/test/:id", function (req, res, next) {
    res.send(req.params.id);

});

module.exports = route;
