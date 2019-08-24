const express = require('express')
const router = express.Router()

const handlers = require('../handlers/root')

router.get('/me', handlers.me)
router.post('/signIn', handlers.signIn)

router.post('/newPost', handlers.newPost)
router.post('/likePost', handlers.likePost)
router.get('/getPosts', handlers.getPosts)
router.get('/getComments', handlers.getComments)
router.post('/newComment', handlers.newComment)

router.get('/getFriends', handlers.getFriends)


router.post('/getGames', handlers.getGames)
router.get('/getGame', handlers.getGame)
router.get('/getGameOst', handlers.getGameOst)
router.post('/newSkin', handlers.newSkin)

router.get('/getConsoles', handlers.getConsoles)

module.exports = router;
