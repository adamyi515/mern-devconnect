const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route  POST /api/profile
// @desc   Create or Update a profile.
// @access PRIVATE
const createOrUpdateProfile = async (req, res) => {

    // Validations
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        company, website, location, bio, status, githubusername, 
        skills, youtube, facebook, instagram, linkedin
    } = req.body;

    // Shape the PROFILE Object
    const profileProperties = {};
    profileProperties.user = req.user.id;
    profileProperties.status = status; // Status is a required field.
    profileProperties.skills = skills.split(',').map((skill) => skill.trim()); // Required field.
    if(company) profileProperties.company = company;
    if(website) profileProperties.website = website;
    if(location) profileProperties.location = location;
    if(githubusername) profileProperties.githubusername = githubusername;
    if(bio) profileProperties.bio = bio;

    // Profile properties for social.
    profileProperties.social = {};
    if(youtube) profileProperties.social.youtube = youtube;
    if(facebook) profileProperties.social.facebook = facebook;
    if(instagram) profileProperties.social.instagram = instagram;
    if(linkedin) profileProperties.social.linkedin = linkedin;

    try {
        const id = req.user.id;
        // Check to see if there's a profile for this user (user's id passed here.)
        let foundProfile = await Profile.findOne({ user: id });
        if(foundProfile){
            // If profile is found, then update data.
            foundProfile = await Profile.findOneAndUpdate(
                { user: id }, 
                { $set: profileProperties },
                { new: true }
            )

            return res.json(foundProfile);
        }

        // If profile not found (don't update) then CREATE NEW PROFILE.
        const newProfile = await Profile.create(profileProperties);
        return res.json(newProfile);


    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
}

// @route  GET /api/profile/user/:userId
// @desc   Get one profile based on the currently logged in user.
// @access PRIVATE
const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const getProfile = await Profile.findOne({ user: userId }).populate('user', ['name', 'avatar']);
        if(!getProfile){
            return res.status(400).json({
                error: 'Profile not found.'
            })
        }
        res.status(200).json(getProfile);
        
    } catch (error) {
        console.error(error);
        if(error.kind == 'ObjectId'){
            return res.status(400).json({
                error: 'Profile not found.'
            })
        }
        res.status(500).json({
            error: 'Server Error'
        })
    }
}


// @route  GET /api/profile
// @desc   Get all profiles in the system.
// @access PRIVATE
const getAllProfiles = async (req, res) => {
    try {
        const allProfiles = await Profile.find().populate('user', ['name', 'avatar']);;
        res.status(200).json(allProfiles);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Server Error'
        })
    }
}



// @route  DELETE /api/profile/:id
// @desc   Delete a profile, user and post
// @access PRIVATE
const deleteProfile = async (req, res) => {
    try {
        // DELETE Profile 
        await Profile.findOneAndRemove({ user: req.user.id });
        
        // DELETE User
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({
            msg: 'Profile and User removed.'
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error.'
        })
    }

}


// @route  PUT /api/profile/experience
// @desc   Update profile's experience
// @access PRIVATE
const updateProfileExperience = async (req, res) => {

    // Validations
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }   


    // const {
    //     title, company, location, from, to,
    //     current, description
    // } = req.body;

    const newExp = {...req.body};

    try {
        const foundProfile = await Profile.findOne({ user: req.user.id });
        foundProfile.experience.unshift(newExp);
        await foundProfile.save();
        res.json(foundProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error.'
        })
    }

}

module.exports = {
    createOrUpdateProfile,
    getAllProfiles,
    getProfile,
    deleteProfile,
    updateProfileExperience
}