const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { 
    createOrUpdateProfile, getProfile, getAllProfiles,
    deleteProfile, updateProfileExperience
} = require('../../controller/profile');
const { authRoute } = require('../../middleware/auth');


// ROUTES ===========================================================
router.post('/', [authRoute, [
    check('status', 'Status is required.').not().isEmpty(),
    check('skills', 'Skills is required.').not().isEmpty()
]], createOrUpdateProfile);

router.get('/', authRoute, getAllProfiles);

router.get('/user/:userId', authRoute, getProfile);

router.put('/experience', [authRoute, [
    check('title', 'Title is required.').not().isEmpty(),
    check('company', 'Company is required.').not().isEmpty(),
    check('from', 'From is required.').not().isEmpty()
]], updateProfileExperience);

router.delete('/', authRoute, deleteProfile);


module.exports = router;