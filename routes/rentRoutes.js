const { Router } = require('express');
const router = Router({ mergeParams: true });
const CustomError = require('../errors/CustomError')
const books = require('../data/books.json');
const bookSchema = require('../model/bookModel')
const fsPromises = require('fs/promises')

//PATH: /books/:bookId/rent - authenticated users

router
    .route('/')
    .get(async (req, res) => {
        //! Rent the bookId to the currentUser
        const { bookId } = req.params;

        const book = books.find(book => {
            return book.bookId === bookId
        })

        if (!book) {
            throw new CustomError("Book not found", "Book not found", 404)
        }

        if (!book.available) {
            throw new CustomError("Book not available", "Book not available", 409)
        }

        if (req.user._id === book.publishedBy) {
            throw new CustomError("You cannot rent your own book", "You cannot rent your own book", 409)
        }

        book.available = false;
        book.currentlyHeldBy = req.user._id;

        await fsPromises.writeFile('./data/books.json', JSON.stringify(books, null, 2));

        res.statusMessage = "Book rented successfully"
        res.status(200).json({
            message: "Book rented successfully",
            status: 200,
            book
        })
    })


module.exports = router;