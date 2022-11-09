const express = require('express');
const router = express.Router();
const { authRoute } = require('../../middleware/auth');
const { check } = require('express-validator/check');
const { registerUser, loginUser } = require('../../controller/users');

// @desc    Test route
// @route   GET /api/users
// @access  PUBLIC
router.post('/', [
    check('name', 'Name is required.').not().isEmpty(),
    check('email', 'Email is required.').isEmail(),
    check('password', 'Please enter password with 6 character or more.').isLength({ min: 6})
], registerUser);


router.post('/login', [
    check('email', 'Email is required.').isEmail(),
    check('password', 'Password is required.').exists()
], loginUser);



module.exports = router;