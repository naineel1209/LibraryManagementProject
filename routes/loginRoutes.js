require('dotenv').config();
const { Router } = require('express');
const router = Router();
const { loginController } = require('../controllers/authControllers');

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
    .post(loginController)

module.exports = router;