require('dotenv').config();
const jwt = require('jsonwebtoken');
const CustomError = require('../errors/CustomError');
const User = require('../model/userModel.js');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.libmgmt, refreshToken = req.cookies.libmgmtRefresher;

    if (!token || !refreshToken) {
        throw new CustomError("Unauthorized", "Unauthorized", 401)
    }

    try {
        //it will throw an error if the token is invalid else it will decode the token and store it in req.user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id);
        next();
    } catch (err) {
        //!the access token has expired and we need to generate a new one using the refresh token
        if (err.message.includes("jwt expired") && refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
                if (decoded) {
                    const accessToken = jwt.sign({ username: decoded.username, _id: decoded._id }, process.env.JWT_SECRET, {
                        expiresIn: '5hr'
                    })

                    res.cookie('libmgmt', accessToken, {
                        httpOnly: true,
                        maxAge: 5 * 3600000 //1hr
                    })
                    req.user = await User.findById(decoded._id);
                    next();
                }
            } catch (err) {
                throw new CustomError("Unauthorized", "Unauthorized", 401)
            }
        } else {
            throw new CustomError("Unauthorized to access this route", "Unauthorized", 401)
        }
    }

}

module.exports = { verifyToken }