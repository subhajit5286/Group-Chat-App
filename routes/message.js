const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message');
const authenticator = require('../middleware/auth');

router.post('/send', authenticator.authenticate, messageController.saveMessage);

module.exports = router;