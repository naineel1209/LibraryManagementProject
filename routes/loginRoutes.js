require('dotenv').config();
const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const CustomError = require('../errors/CustomError')
const jwt = require('jsonwebtoken')

//data
const users = require('../data/users.json')

//PATH: /login 
router
    .route('/')
    .get((req, res) => {
        res.statusMessage = "GET request successful"
        res.status(200).json({
            message: "GET request successful",
            instructions: "Send a POST request with username and password in the body to receive a token"
        })
    })
    .post(async (req, res) => {
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
    })

module.exports = router;