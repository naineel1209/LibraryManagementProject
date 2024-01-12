require('dotenv').config();

const { Router } = require('express');
const router = Router();
const users = require('../data/users.json')
const userSchema = require('../model/userModel');
const bcrypt = require('bcrypt');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({
    dictionary: 'number',
})
const fsPromises = require('fs/promises');
const CustomError = require('../errors/CustomError')

//PATH: /register

router
    .route('/')
    .get((req, res) => {
        res.statusMessage = "GET request successful"
        res.status(200).json({
            message: "GET request successful",
            instructions: "Send a POST request with username, password and email in the body to register"
        })
    })
    .post(async (req, res) => {
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
    })

module.exports = router;