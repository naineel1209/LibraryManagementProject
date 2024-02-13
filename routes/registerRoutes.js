require('dotenv').config();

const { Router } = require('express');
const router = Router();
const { registerController } = require('../controllers/authControllers');


//PATH: /register

/**
 * @swagger
 * 
 * /register:
 *  get:
 *    description: Get instructions for register
 *    tags:
 *      - Register
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *          description: GET request successful
 *          schema:
 *              $ref: 'contracts/loginContract.json#/getLoginResponse'
 *  post:
 *    description: Post a request to register the user
 *    tags:
 *      - Register
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: register
 *        schema:
 *          $ref: 'contracts/loginContract.json#/postRegisterRequest'
 *    responses:
 *      '201':
 *          description: Register successfully
 *          schema:
 *              $ref: 'contracts/loginContract.json#/postRegisterResponse'
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
 *      '409':
 *          description: User already exists
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 */
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