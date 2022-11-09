const express = require('express');
const router = express.Router();
const { test } = require('../../controller/auth');
const { authRoute } = require('../../middleware/auth');

// @desc    Test route
// @route   POST /api/users
// @access  PRIVATE
router.get('/', authRoute, test);





module.exports = router;