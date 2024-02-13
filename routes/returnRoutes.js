const { Router } = require('express');
const router = Router({ mergeParams: true });
const { returnBook } = require('../controllers/rentReturnControllers');

//PATH: /books/return - authenticated users

/**
 * @swagger
 * 
 * /books/return:
 *  get:
 *    description: Return the rented book
 *    tags:
 *      - Rent
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: returnBody
 *        schema:
 *          type: object
 *          properties:
 *            bookId:
 *              type: string
 *            rentOrderId:
 *              type: string
 *    responses:
 *      '200':
 *          description: Return book successful
 *          schema:
 *              $ref: 'contracts/rentReturnContract.json#/rentBook'
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
 *          description: Book already rented
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 */
router
    .route('/')
    .get(returnBook)


module.exports = router;