const express = require('express');
const router = express.Router();
const { registerUser } = require('../../controller/auth');

// @desc    Test route
// @route   GET /api/users
// @access  PUBLIC
router.get('/', registerUser);





module.exports = router;