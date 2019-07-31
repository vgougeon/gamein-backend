const express = require('express')
const router = express.Router()

const handlers = require('../handlers')

router.get('/', handlers.me)

module.exports = router
