const express = require('express')
const sess = require('express-session')
const routes = require('./src/routes/routes');

const app = express()

app.use(express.urlencoded());
app.use(express.json()); 

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(sess({
  secret: 'gamein',
  resave: false,
  saveUninitialized: true,
}))

app.use(routes)

app.listen(3000, function () {
  console.log('Server ON')
})