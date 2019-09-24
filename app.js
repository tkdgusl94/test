var express = require('express')
var app = express()
var cors = require('cors') // npm install cors --save, localhost랑 127.0.0.1를 같게 해주는 모듈
var bodyParser = require('body-parser') // npm install body-parser --save 바디파서는 post할때 받기 위해서 입력한 값을 받기 위해 사용

var router = require('./router/index')

app.listen(3000, function() {
    console.log("start, express server on port 3000");
});
app.use(express.static('public')) // public 폴더를 static으로 사용하기 위함. public 안에 있는 main.html 파일을 url에서 불러서 호출 가능함.

// bodyparser 같은 경우는 app.js에만 설치해도 다른 라우터에서 사용 가능.
app.use(bodyParser.json()) // body-parser를 json 형태로 받기 위함.
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(router)

app.set('view engine', 'ejs') // npm install ejs --save