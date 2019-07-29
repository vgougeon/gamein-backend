const express = require('express')
const app = express()

const routes = require("./src/routes/routes")
app.use(routes)

// DEPLOY
app.get('/deploy', function (req, res) {
  res.send('Deploiement...')
})
//

app.listen(3000, function () {
  console.log('Server ON')
})