var express = require('express')
var router = express.Router();
var path = require('path')
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'qlrvka94!',
    database: 'test'
})
connection.connect() //<ALTER USER ‘root’@’localhost’ IDENTIFIED WITH mysql_native_password BY ‘사용할패스워드’> mysql에 들어가서 입력하기.

router.get('/', function(req, res) {
    console.log('get join url')
    res.render('join.ejs');
});

router.post('/', function(req, res) {
    var body = req.body;
    var email = body.email;
    var name = body.name;
    var passwd = body.password;
    var sql = { email: email, name: name, pw: passwd };

    var query = connection.query('insert into user set ?', sql, function(err, rows) {
        if (err) { throw err; } else res.render('welcome.ejs', { 'name': name, 'id': rows.insertId })
    })
})

module.exports = router;