const express = require('express')
const app = express()

const mysql = require('mysql')
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'azerty31',
  database : 'gamein'
});

db.connect();
db.query('SELECT username FROM accounts WHERE id = 7', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].username);
});
const routes = require('./src/routes/routes')
app.use(routes)

app.listen(3000, function () {
  console.log('Server ON')
})