const { Router } = require('express');
const router = Router();
const { lostBook } = require('../controllers/lostControllers');

//PATH: /books/lost - authenticated users

/**
 * @swagger
 * 
 * /books/lost:
 *  get:
 *    description: Mark the rented book as lost
 *    tags:
 *      - Lost
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
 *          description: Book marked as Lost successful
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
  .get('/', lostBook)

module.exports = router;