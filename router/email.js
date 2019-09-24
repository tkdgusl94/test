var express = require('express')
var app = express()
var router = express.Router();
var bodyParser = require('body-parser') // npm install body-parser --save 바디파서는 post할때 받기 위해서 입력한 값을 받기 위해 사용

router.use(bodyParser.json()) // body-parser를 json 형태로 받기 위함.
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/post', function(req, res) {
    console.log(req.body.email)
    res.render('email.ejs', { 'email': req.body.email })
});

module.exports = router;