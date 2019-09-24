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

passport.serializeUser(function(user, done) {
    console.log('passport session save : ', user.id)
    done(null, user.id);
})

passport.deserializeUser(function(id, done) {
    console.log('passport session get_id : ', id)
    done(null, id);
})
passport.use('local-join', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 인증을 수행하는 인증 함수로 HTTP request를 그대로 전달할지 여부를 결정한다.
}, function(req, email, password, done) {
    var query = connection.query('select * from user where email = ?', [email], function(err, rows) { // email이 DB에 저장되어 있는지 체크
        if (err) return done(err);
        if (rows.length) { // DB에 이미 있으면 에러처리
            console.log('existed user')
            return done(null, false, { message: 'your email is already used' })
        } else { // DB에 없는 경우 DB에 넣어줌
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