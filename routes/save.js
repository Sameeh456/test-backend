const express = require('express')

const router = express.Router()

const messageController = require('../controllers/message')
const checkAuth = require('../middlewares/check-auth')

router.post('/data', checkAuth, messageController.postMessage)

module.exports = router