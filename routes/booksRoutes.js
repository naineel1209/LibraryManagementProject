const { Router } = require('express');
const router = Router({ mergeParams: true });
const priceChart = require('../data/priceChart.json');
const { getAvailableBooks, postBook, getAsingleBook, deleteAsingleBook, updateAsingleBook } = require('../controllers/bookControllers');


//PATH: /books - authenticated users

/**
 * @swagger
 * 
 * /books/info:
 *  get:
 *    description: Get the information of the prices of the book by type
 *    tags:
 *      - Book
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *          description: GET request successful
 *          schema:
 *              $ref: 'contracts/priceContract.json#/price'
 */
router
    .get('/info', (req, res) => {
        res.statusMessage = "GET request successful"
        res.status(200).json({
            message: "GET request successful",
            status: 200,
            priceChart
        })
    })


/**
 * @swagger
 * 
 * /books:
 *  get:
 *    description: Get the available book
 *    tags:
 *      - Book
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *          description: GET available books successful
 *          schema:
 *              $ref: 'contracts/bookContract.json#/getAvailableBooks'
 *      '401':
 *          description: Unauthorized
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *  post:
 *    description: Post a book with book details
 *    tags:
 *      - Book
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: book
 *        schema:
 *          $ref: 'contracts/bookContract.json#/postBookRequest'
 *    responses:
 *      '201':
 *          description: Book successfully added
 *          schema:
 *              $ref: 'contracts/bookContract.json#/postBookResponse'
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
    .route('/')
    .get(getAvailableBooks)
    .post(postBook)

router.use('/rent', require('./rentRoutes'))
router.use('/return', require('./returnRoutes'))
router.use('/lost', require('./lostRoutes'))

/**
 * @swagger
 * 
 * /books/{bookId}:
 *  get:
 *    description: Get a single book by bookId
 *    tags:
 *      - Book
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: bookId
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *          description: GET request successful
 *          schema:
 *              $ref: 'contracts/bookContract.json#/getSingleBook'
 *      '401':
 *          description: Unauthorized
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *      '404':
 *          description: Not Found
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *  delete:
 *    description: Delete a single book by bookId
 *    tags:
 *      - Book
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: bookId
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *          description: Book deleted successfully
 *          schema:
 *              $ref: 'contracts/bookContract.json#/deleteSingleBook'
 *      '401':
 *          description: Unauthorized
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *      '404':
 *          description: Not Found
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *      '409':
 *          description: Book is lost
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *  patch:
 *    description: Patch a single book by bookId
 *    tags:
 *      - Book
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: bookId
 *        required: true
 *        type: string
 *      - in: body
 *        name: bookDetails
 *        schema:
 *          $ref: 'contracts/bookContract.json#/patchBookRequest'
 *    responses:
 *      '200':
 *          description: Book deleted successfully
 *          schema:
 *              $ref: 'contracts/bookContract.json#/patchBookResponse'
 *      '401':
 *          description: Unauthorized
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *      '404':
 *          description: Not Found
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 *      '409':
 *          description: Book is lost
 *          schema:
 *              $ref: 'contracts/errorResponse.json#/errorResponse'
 */
router
    .route('/:bookId')
    .get(getAsingleBook)
    .delete(deleteAsingleBook)
    .patch(updateAsingleBook)


module.exports = router;