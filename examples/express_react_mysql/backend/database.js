const mysql = require('mysql');

const host = "localhost";
const port = 3306;
const user = "root";
const password = "password";
const connection = mysql.createConnection({host:host, port:port, user:user, password:password});

// Connection testing
async function test() {
    connection.query('show databases', function(error, results, fields) {
        if(error) throw error;
    });
}

module.exports = {
    test: test
}
