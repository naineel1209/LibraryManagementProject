const { Router } = require('express');
const router = Router({ mergeParams: true });
const { rentBook, rentHistory } = require('../controllers/rentReturnControllers');


//PATH: /books/rent - authenticated users

/**
 * @swagger
 * 
 * /books/rent:
 *  get:
 *    description: Rent the book 
 *    tags:
 *      - Rent
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: rentBody
 *        schema:
 *          type: object
 *          properties:
 *              bookId:
 *                  type: string
 *              returnDate:
 *                  type: string
 *    responses:
 *      '200':
 *          description: Rent book successful
 *          schema:
 *              $ref: 'contracts/rentReturnContract.json#/rentBook'
 *      '401':
 *          description: Unauthorized
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
    .get(rentBook)

/**
 * @swagger
 * 
 * /books/rent:
 *  get:
 *    description: Get the available book
 *    tags:
 *      - Rent
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: bookId
 *        required: true
 *    responses:
 *      '200':
 *          description: GET available books successful
 *          schema:
 *              $ref: 'contracts/rentReturnContract.json#/rentBookHistory'
 *      '401':
 *          description: Unauthorized
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *      '406':
 *          description: Missing field in body
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 */
router
    .route('/:bookId/history')
    .get(rentHistory)


module.exports = router;