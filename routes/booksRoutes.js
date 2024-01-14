const { Router } = require('express');
const router = Router({ mergeParams: true });
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({
    dictionary: 'number',
})
const CustomError = require('../errors/CustomError')
const books = require('../data/books.json');
const bookSchema = require('../model/bookModel')
const priceChart = require('../data/priceChart.json')
const fsPromises = require('fs/promises')

//PATH: /books - authenticated users 

router
    .get('/info', (req, res) => {
        res.statusMessage = "GET request successful"
        res.status(200).json({
            message: "GET request successful",
            status: 200,
            priceChart
        })
    })

router
    .route('/')
    .get((req, res) => {
        //! GET books - get all books available to rent
        const availableBooks = books.filter(book => {
            return book.available;
        })

        res.statusMessage = "GET request successful"
        res.status(200).json({
            message: "GET request successful",
            availableBooks
        })
    })
    .post(async (req, res) => {
        //! POST books - add a new book to the library
        const { title, type, author } = req.body;

        if (!title || !type || !author) {
            // res.statusMessage = "Missing field in body"
            // res.status(406).json({
            //     message: "Missing field in body",
            //     status: 406
            // })
            throw new CustomError("Missing field in body", "Missing field in body", 406)
        }

        if(!Object.keys(priceChart).includes(type)){
            throw new CustomError("Invalid Book Type");
        }

        const book = {
            bookId: uid.randomUUID(3),
            title,
            type,
            author,
            available: true,
            publishedBy: req.user._id,
            currentlyHeldBy: -1,
        }

        if (bookSchema.validate(book)) {
            books.push(book);

            await fsPromises.writeFile('./data/books.json', JSON.stringify(books, null, 2));

            res.statusMessage = "Book added successfully"
            res.status(201).json({
                message: "Book added successfully",
                status: 201,
                book
            })
        } else {
            throw new CustomError("Invalid book details", "Invalid book details", 406)
        }
    })

router.use('/rent', require('./rentRoutes'))
router.use('/return', require('./returnRoutes'))

router
    .route('/:bookId')
    .get((req, res) => {
        const { bookId } = req.params;

        const book = books.find(book => {
            return book.bookId === bookId
        })

        if (!book) {
            throw new CustomError("Book not found", "Book not found", 404)
        }

        res.statusMessage = "GET request successful"
        res.status(200).json({
            message: "GET request successful",
            book
        })
    })
    .delete(async (req, res) => {
        const { bookId } = req.params;

        const bookIndex = books.findIndex(book => {
            return book.bookId === bookId
        })

        if (bookIndex === -1) {
            throw new CustomError("Book not found", "Book not found", 404)
        }

        const book = books[bookIndex];
        if (book.publishedBy !== req.user._id || req.user.role !== "admin") {
            throw new CustomError("Unauthorized", "Unauthorized", 401)
        }

        books.splice(bookIndex, 1);

        await fsPromises.writeFile('./data/books.json', JSON.stringify(books, null, 2));

        res.statusMessage = "Book deleted successfully"
        res.status(200).json({
            message: "Book deleted successfully",
            status: 200,
            book
        })
    })
    .patch(async (req, res) => {
        const { bookId } = req.params;
        const { title, type, author } = req.body;

        if (!title && !type && !author) {
            throw new CustomError("Missing field in body", "Missing field in body", 406)
        }

        const bookIndex = books.findIndex(book => {
            return book.bookId === bookId
        })

        if (bookIndex === -1) {
            throw new CustomError("Book not found", "Book not found", 404)
        }

        const book = books[bookIndex];

        if (book.publishedBy !== req.user._id || req.user.role !== "admin") {
            throw new CustomError("Unauthorized", "Unauthorized", 401)
        }

        if (title) {
            book.title = title;
        }

        if (type) {
            book.type = type;
        }

        if (author) {
            book.author = author;
        }

        if (bookSchema.validate(book)) {
            await fsPromises.writeFile('./data/books.json', JSON.stringify(books, null, 2));

            res.statusMessage = "Book updated successfully"
            res.status(200).json({
                message: "Book updated successfully",
                status: 200,
                book
            })
        } else {
            throw new CustomError("Invalid book details", "Invalid book details", 406)
        }

    })


module.exports = router;