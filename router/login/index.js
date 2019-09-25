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
    res.render('login.ejs', { 'message': msg });
});

passport.serializeUser(function(user, done) {
    console.log('passport session save : ', user.id)
    done(null, user.id);
})

passport.deserializeUser(function(id, done) {
    console.log('passport session get_id : ', id)
    done(null, id);
})
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 인증을 수행하는 인증 함수로 HTTP request를 그대로 전달할지 여부를 결정한다.
}, function(req, email, password, done) {
    var query = connection.query('select * from user where email = ?', [email], function(err, rows) { // email이 DB에 저장되어 있는지 체크
        if (err) return done(err);
        if (rows.length) { // login 정보가 DB에 있는 경우
            return done(null, { 'email': email, 'id': rows[0].UID })
        } else { // DB에 정보가 없는 경우 에러처리. 여기서 반환된 값이 밑의 ***** 쪽으로 넘어감
            return done(null, false, { 'message': 'your login info is not found >.<' });
        }
    })
}));

router.post('/', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) res.status(500).json(err);
        if (!user) return res.status(401).json(info.message);

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json(user); // *****
        });
    })(req, res, next);
})

module.exports = router;