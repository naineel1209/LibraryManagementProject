const bcrypt = require('bcrypt');
const CustomError = require('../errors/CustomError')
const jwt = require('jsonwebtoken')
const User = require('../model/userModel.js');

const loginController = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new CustomError("Missing field in body", "Missing field in body", 406)
    }

    //find the user with the username
    const user = await User.findOne({ username });

    if (!user) {
        throw new CustomError("User not found", "User not found", 404)
    }

    const compare = await bcrypt.compare(password, user.password)

    if (!compare) {
        throw new CustomError("Invalid credentials", "Invalid credentials", 401)
    } else {
        //!generate token
        delete user.password

        const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '5hr' })
        const refreshToken = jwt.sign({ username: user.username, _id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' })

        user.token = token

        await user.save()

        res.cookie('libmgmt', token, {
            expires: new Date(Date.now() + (5 * 3600000)),
            httpOnly: true,
        })
        res.cookie('libmgmtRefresher', refreshToken, {
            expires: new Date(Date.now() + 604800000),
            httpOnly: true,
        })

        res.statusMessage = "Login successful"
        res.status(200).json({
            message: "Login successful",
            status: 200,
            user
        })
    }
}


const registerController = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        throw new CustomError("Missing field in body", "Missing field in body", 406)
    }

    ///check if a user exists with same username
    const userExists = await User.findOne({ username })

    if (userExists) {
        throw new CustomError("User already exists", "User already exists", 409)
    }

    //user object
    const user = new User({
        username,
        password,
        email,
        role: "user",
        token: undefined,
    })

    //assigning the admin role to the first 5 users
    if (await User.countDocuments() + 1 <= 5) {
        user.role = "admin"
    }

    await user.save()

    res.statusMessage = "User created successfully"
    res.status(201).json({
        message: "User created successfully",
        status: 201,
        user
    })
}

const logoutController = (req, res) => {
    res.clearCookie('libmgmt')
    res.clearCookie('libmgmtRefresher');

    res.statusMessage = "GET request successful"
    res.status(200).json({
        message: "GET request successful",
        contents: "You have been logged out"
    })
};


module.exports = { loginController, registerController, logoutController }