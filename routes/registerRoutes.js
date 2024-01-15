require('dotenv').config();

const { Router } = require('express');
const router = Router();
const { registerController } = require('../controllers/authControllers');


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
    .post(registerController)

module.exports = router;