const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const routes = require('./src/routes/routes')

const app = express()

app.use(cors())
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
}));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(routes)

app.use(express.static('public'));

const server = module.exports = require('http').Server(app);
const socket = require('./src/socket/socket');
// const socket = require('./src/socket/root')(server);
server.listen(3000)






