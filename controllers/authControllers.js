const bcrypt = require('bcrypt');
const CustomError = require('../errors/CustomError')
const jwt = require('jsonwebtoken')
// delete require.cache[require.resolve('../data/users.json')];
const users = require('../data/users.json')
const userSchema = require('../model/userModel');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({
    dictionary: 'number',
})
const fsPromises = require('fs/promises');

const loginController = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        // res.statusMessage = "Missing field in body"
        // res.status(406).json({
        //     message: "Missing field in body",
        //     status: 406
        // })

        throw new CustomError("Missing field in body", "Missing field in body", 406)
    }

    const user = users.find(user => {
        return user.username === username
    })

    if (!user) {
        // res.statusMessage = "User not found"
        // res.status(404).json({
        //     message: "User not found",
        //     status: 404
        // })

        throw new CustomError("User not found", "User not found", 404)
    }

    const compare = await bcrypt.compare(password, user.password)

    if (!compare) {
        // res.statusMessage = "Invalid credentials"
        // res.status(401).json({
        //     message: "Invalid credentials",
        //     status: 401
        // })

        throw new CustomError("Invalid credentials", "Invalid credentials", 401)
    } else {
        //!generate token
        const { password, ...restUser } = user;

        const token = jwt.sign({ username: restUser.username, _id: restUser._id }, process.env.JWT_SECRET, { expiresIn: '5hr' })
        const refreshToken = jwt.sign({ username: restUser.username, _id: restUser._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' })

        restUser.token = token
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
            restUser
        })
    }
}


const registerController = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        // res.statusMessage = "Missing field in body"
        // res.status(406).json({
        //     message: "Missing field in body",
        //     status: 406
        // })

        throw new CustomError("Missing field in body", "Missing field in body", 406)
    }

    ///check if a user exists with same username
    const userExists = users.find(user => {
        return user.username === username
    })

    if (userExists) {
        // res.statusMessage = "User already exists"
        // res.status(409).json({
        //     message: "User already exists",
        //     status: 409
        // })

        throw new CustomError("User already exists", "User already exists", 409)
    }

    //hashing the password before storing
    const hashedPass = await bcrypt.hash(password, Number(process.env.SALT))

    //user object
    const user = {
        username,
        password: hashedPass,
        email,
        role: "user",
        token: undefined,
        _id: uid.randomUUID(5)
    }

    //assigning the admin role to the first 5 users
    if (users.length + 1 <= 5) {
        user.role = "admin"
    }

    //validating the user object thus created
    if (userSchema.validate(user)) {
        users.push(user);

        //writing the user data to the file
        console.time("after")

        const { password, ...restUser } = user;

        await fsPromises.writeFile('./data/users.json', JSON.stringify(users, null, 2));

        console.timeEnd("after")
        res.statusMessage = "User created successfully"
        res.status(201).json({
            message: "User created successfully",
            status: 201,
            restUser
        })
    } else {
        // res.statusMessage = "Invalid user data"
        // res.status(406).json({
        //     message: "Invalid user data",
        //     status: 406
        // })

        throw new CustomError("Invalid user data", "Invalid user data", 406)
    }
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