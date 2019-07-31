const express = require('express')
const sess = require('express-session')
const app = express()

app.use(sess({
  secret: 'gamein',
  resave: false,
  saveUninitialized: true,
}))

const mysql = require('mysql2/promise')
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'azerty31',
  database: 'gamein'
});

const test = "Salut"

const routes = require('./src/routes/routes')(pool)
app.use(routes)

app.listen(3000, function () {
  console.log('Server ON')
})