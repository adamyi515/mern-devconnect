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
        const token = generateToken(newUser);

        res.status(200).json(token)
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

const loginUser = async (req, res) => {
    // Validate user's data being sent to endpoint.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const { email, password } = req.body;

    try {
        // Check if user is even in the system.
        const foundUser = await User.findOne({ email });
        if(!foundUser){
            return res.status(404).json({
                msg: 'User not registered.'
            });
        }

        // If user is found then compare the passwords. If password is correct, return a new token.
        if(await bcrypt.compare(password, foundUser.password)){
            const token = generateToken(foundUser);
            return res.status(200).json(token);
        } else {
            return res.status(404).json({
                msg: 'Invalid credentials'
            })
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }

}


//////////////////////////////////////////////////////////////////////////////////////////
// Private Method
const generateToken = (user) => {
    const payload = {
        user: {
            id: user._id
        }
    };
    const token = jwt.sign(payload, SECRET, {
        expiresIn: 360000
    });

    return token;
}

module.exports = {
    registerUser,
    loginUser
}