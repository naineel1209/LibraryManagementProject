const { Router } = require('express');
const router = Router({ mergeParams: true });
const { findProfile } = require('../controllers/profileControllers');
const { verifyToken } = require('../middlewares/authMiddleware');

//PATH: /profile - authenticated users`

/**
 * @swagger
 * 
 * /profile:
 *  get:
 *    description: Profile of the user
 *    tags:
 *      - Profile
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *          description: Return book successful
 *          schema:
 *              $ref: 'contracts/profileContract.json#/profile'
 *      '401':
 *          description: Unauthorized
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 */
router
    .route('/')
    .get(verifyToken, findProfile)


module.exports = router;
