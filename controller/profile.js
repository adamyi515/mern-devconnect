const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');


const getProfile = async (req, res) => {
    try {
        const id = req.user.id;

        // Check to see if there's a profile for this user (user's id passed here.)
        const foundProfile = await Profile.findOne({ user: id });
        if(!foundProfile){
            return res.status(404).json({
                msg: 'Profile not found.'
            })
        }

        // If it finds it, well... then return that profile back.
        res.status(200).json(foundProfile);


    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
}


module.exports = {
    getProfile
}