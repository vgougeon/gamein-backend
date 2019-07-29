const express = require('express')
const app = express()

const routes = require("./src/routes/routes")
app.use(routes)

// DEPLOY
app.get('/deploy', function (req, res) {
  res.send('Deploiement...')

  const exec = require('child_process').exec;
  const repo = '/var/www/gamein-front-reactjs/';

  exec('cd ' + repo + ' && git pull');
})

app.listen(3000, function () {
  console.log('Server ON')
})