const express = require('express');
const router = express.Router();
const { getProfile } = require('../../controller/profile');
const { authRoute } = require('../../middleware/auth');

// @desc    Get one profile from the current logged in user.
// @route   GET /api/profile/loginId
// @access  PRIVATE
router.get('/me', authRoute, getProfile);


// @desc    CREATE a profile for the current logged in person.
// @route   POST /api/profile/
// @access  PRIVATE
router.post('/me', authRoute, getProfile);





module.exports = router;