const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const routes = require('./src/routes/routes')

const app = express()

app.use(cors())
app.use(fileUpload())
app.use(express.urlencoded())
app.use(express.json())


app.use(routes)

app.listen(3000, function () {

  console.log('Server ON')
})