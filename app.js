var express = require('express')
var app = express()
var bodyParser = require('body-parser') // npm install body-parser --save 바디파서는 post할때 받기 위해서 입력한 값을 받기 위해 사용
var cors = require('cors') // npm install cors --save, localhost랑 127.0.0.1를 같게 해주는 모듈
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'qlrvka94!',
    database: 'test'
})

connection.connect()

app.use(cors())
app.listen(3000, function() {
    console.log("start, express server on port 3000");
});

app.use(express.static('public')) // public 폴더를 static으로 사용하기 위함. public 안에 있는 main.html 파일을 url에서 불러서 호출 가능함.
app.use(bodyParser.json()) // body-parser를 json 형태로 받기 위함.
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs') // npm install ejs --save

app.get('/', function(req, res) {
    console.log('test');
    res.sendFile(__dirname + '/public/main.html')
});

app.get('/main', function(req, res) {
    res.sendFile(__dirname + '/public/main.html')
});

app.post('/email_post', function(req, res) {
    console.log(req.body.email)
        //res.send("welcodddme" + req.body.email)
    res.render('email.ejs', { 'email': req.body.email })
});

app.post('/ajax_send_email', function(req, res) {
    console.log(req.body.email);
    var responseData = { 'result': 'ok', 'email': req.body.email };
    res.json(responseData);
});