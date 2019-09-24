var express = require('express')
var router = express.Router();
var path = require('path')
var mysql = require('mysql')
var passport = require('passport') // npm install passport passport-local express-session connect-flash --save-dev
var LocalStrategy = require('passport-local').Strategy

var connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'qlrvka94!',
    database: 'test'
})
connection.connect() //<ALTER USER ‘root’@’localhost’ IDENTIFIED WITH mysql_native_password BY ‘사용할패스워드’> mysql에 들어가서 입력하기.

router.get('/', function(req, res) {
    var msg;
    var errMsg = req.flash('error')
    if (errMsg) msg = errMsg;
    res.render('join.ejs', { 'message': msg });
});

passport.use('local-join', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 인증을 수행하는 인증 함수로 HTTP request를 그대로 전달할지 여부를 결정한다.
}, function(req, email, password, done) {
    var query = connection.query('select * from user where email = ?', [email], function(err, rows) {
        if (err) return done(err);
        if (rows.length) {
            console.log('existed user')
            return done(null, false, { message: 'your email is already used' })
        } else {
            var sql = { email: email, pw: password };
            var query = connection.query('insert into user set ?', sql, function(err, rows) {
                if (err) throw err
                return done(null, { 'email': email, 'id': rows.insertId })
            })
        }
    })
}));

router.post('/', passport.authenticate('local-join', {
    successRedirect: '/main',
    failureRedirect: '/join',
    failureFlash: true
}))

// router.post('/', function(req, res) {
//     var body = req.body;
//     var email = body.email;
//     var name = body.name;
//     var passwd = body.password;
//     var sql = { email: email, name: name, pw: passwd };

//     var query = connection.query('insert into user set ?', sql, function(err, rows) {
//         if (err) { throw err; } else res.render('welcome.ejs', { 'name': name, 'id': rows.insertId })
//     })
// })
module.exports = router;