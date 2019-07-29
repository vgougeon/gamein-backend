const express = require('express')
const app = express()

const routes = require("./src/routes/routes")
app.use(routes)

// DEPLOY
app.get('/deploy', function (req, res) {
  const exec = require('child_process').exec;

  exec('cd /var/www/gamein-front-reactjs && ./deploy.sh', function(err, stdout, stderr){
    if (err) {
     console.error(err);
     return res.send(500);
    }
    res.send(200);
  });
})

app.listen(3000, function () {
  console.log('Server ON')
})