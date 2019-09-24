var express = require('express')
var app = express()
var router = express.Router();
var bodyParser = require('body-parser') // npm install body-parser --save 바디파서는 post할때 받기 위해서 입력한 값을 받기 위해 사용
var mysql = require('mysql')

router.use(bodyParser.json()) // body-parser를 json 형태로 받기 위함.
router.use(bodyParser.urlencoded({ extended: true }))

var connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'qlrvka94!',
    database: 'test'
})

connection.connect() //<ALTER USER ‘root’@’localhost’ IDENTIFIED WITH mysql_native_password BY ‘사용할패스워드’> mysql에 들어가서 입력하기.

router.post('/post', function(req, res) {
    console.log(req.body.email)
    res.render('email.ejs', { 'email': req.body.email })
});

router.post('/ajax', function(req, res) {
    var email = req.body.email;
    var responseData = {};

    var query = connection.query('select name from user where email = "' + email + '"', function(err, rows) {
        if (err) throw err;
        if (rows[0]) {
            responseData.result = "ok";
            responseData.name = rows[0].name;
        } else {
            responseData.result = "none";
            responseData.name = "";
        }
        res.json(responseData)
    })
});

module.exports = router;