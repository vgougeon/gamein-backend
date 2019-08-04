const express = require('express')
const router = express.Router()

const handlers = require('../handlers/root')

router.get('/me', handlers.me)
router.get('/getPosts', handlers.getPosts)
router.get('/getComments', handlers.getComments)



module.exports = router;
