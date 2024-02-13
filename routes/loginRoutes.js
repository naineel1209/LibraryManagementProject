require('dotenv').config();
const { Router } = require('express');
const router = Router();
const { loginController } = require('../controllers/authControllers');

//data
const users = require('../data/users.json')

//PATH: /login

/**
 * @swagger
 * 
 * /login:
 *  get:
 *    description: Get instructions for login
 *    tags:
 *      - Login
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *          description: GET request successful
 *          schema:
 *              $ref: 'contracts/loginContract.json#/getLoginResponse'
 *  post:
 *    description: Post a request to login and get a token
 *    tags:
 *      - Login
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: login
 *        schema:
 *          $ref: 'contracts/loginContract.json#/postLoginRequest'
 *    responses:
 *      '200':
 *          description: Login successful
 *          schema:
 *              $ref: 'contracts/loginContract.json#/postLoginResponse'
 *      '401':
 *          description: Unauthorized
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *      '404':
 *          description: Not Found
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *      '406':
 *          description: Missing field in body
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 */
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
// .post((req, res) => loginController(req, res));

module.exports = router;