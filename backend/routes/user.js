const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const userController = require('../controllers/user');

router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;
