const express = require('express');
const router = express.Router();

// const userController = require('../controllers/user');
const adminController = require('../controllers/admin');
const authenticator = require('../middleware/auth');

router.put('/makeAdmin', authenticator.authenticate, adminController.makeAdmin);
 router.put('/removeAdmin', authenticator.authenticate, adminController.removeAdminPermission);
 router.delete('/removeUserFromGroup', authenticator.authenticate, adminController.removeUserFromGroup);
module.exports = router;