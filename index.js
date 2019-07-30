const express = require('express')
const app = express()

// const mysql = require('mysql')
// const db = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'gamein'
// });

const routes = require('./src/routes/routes')
app.use(routes)

app.listen(3000, function () {
  console.log('Server ON')
})