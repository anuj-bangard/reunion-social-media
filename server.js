const express = require("express");
const bodyParser = require("body-parser");
const { pool } = require("./config/Db")
const { handleError } = require("./services/handleError")
const login = require('./api/controllers/login')
const follow = require('./api/controllers/follow')
const user = require('./api/controllers/user')
const posts = require('./api/controllers/posts')
const like = require('./api/controllers/like')
const comment = require('./api/controllers/comment')

const app = express();

app.use(express.json({ extended: false }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, authorization, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/api', login)
app.use('/api', follow)
app.use('/api', user)
app.use('/api', posts)
app.use('/api', like)
app.use('/api', comment)

app.get('/', function (_, res) {
  res.sendFile(__dirname + "/home.html");
})

app.use((error, req, res, next) => {
  handleError(error, req, res)
})
app.listen(process.env.PORT || 5000, () => {
  console.log("Server Running");
});