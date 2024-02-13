const { Router } = require('express');
const router = Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { logoutController } = require('../controllers/authControllers');

//PATH: /logout

/**
 * @swagger
 * 
 * /logout:
 *  get:
 *    description: Logout functionality only for authenticated users..
 *    tags:
 *      - Logout
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    responses:
 *      '200':
 *          description: GET request successful
 *          schema:
 *              $ref: 'contracts/loginContract.json#/getLogoutResponse'
 *      '401':
 *          description: Unauthorized
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 */
router
    .route('/')
    .get(verifyToken, logoutController);

module.exports = router