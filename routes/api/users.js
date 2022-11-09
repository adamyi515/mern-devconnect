const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { registerUser } = require('../../controller/users');

// @desc    Test route
// @route   GET /api/users
// @access  PUBLIC
router.post('/', [
    check('name', 'Name is required.').not().isEmpty(),
    check('email', 'Email is required.').isEmail(),
    check('password', 'Please enter password with 6 character or more.').isLength({ min: 6})
], registerUser);





module.exports = router;