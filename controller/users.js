const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const User = require('../models/User');
const SECRET = process.env.JWT_SECRET;

// @route   POST /api/users
// @desc    Allow users to register and create a user.
// @access  PUBLIC
const registerUser = async (req, res) => {
    // Validate user is inputting data with correct type.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { email, name, password } = req.body;

    try {
        // Check if user exist.
        const foundUser = await User.findOne({ email });
            if(foundUser){
            return res.status(400).json({
                msg: 'User already exist'
            })
        }

        // Get user gravatar.
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        
        
        // Encrypt Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in DB.
        const newUser = await User.create({
            name,
            email,
            avatar,
            password: hashedPassword
        });

        // Return jwt
        const payload = {
            user: {
                id: newUser._id
            }
        }
        const token = jwt.sign(payload, SECRET, {
            expiresIn: 360000
        });

        const newUserData = {
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            token: token
        }


        res.status(200).json(newUserData)
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }


}


module.exports = {
    registerUser
}