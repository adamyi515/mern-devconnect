const User = require('../models/User');
const test = async (req, res) => {
    try {

        // After the middleware is executed, check to see if the user exist in db.
        // If user does not exist, then send a 404.
        const getUser = await User.findById(req.user.id).select('-password');
        if(!getUser){
            return res.status(404).json({
                msg: 'User could not be found.'
            })
        }

        // If user is found, then return user data.
        res.json(getUser);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    test
}