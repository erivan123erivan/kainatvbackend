const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
router.post('/login', usersController.login);
router.post('/update/:id', usersController.updateUser);

module.exports = router;
