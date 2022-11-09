const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;


const authRoute = (req, res, next) => {
    // Check if there's a token in the header of the request.
    const getToken = req.header('x-auth-token');
    if(!getToken){
        return res.status(401).json({
            msg: 'No token provided.'
        })
    }

    // Verify the token is valid.
    try {
        const decodedToken = jwt.verify(getToken, SECRET);
        req.user = decodedToken.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token not valid'})
    }

}

module.exports = {
    authRoute
}