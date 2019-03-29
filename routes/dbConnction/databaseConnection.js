var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_js-class"
});

connection.connect();

module.exports = connection;