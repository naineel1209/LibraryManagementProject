const { Router } = require('express');
const router = Router({ mergeParams: true });
const CustomError = require('../errors/CustomError')
const books = require('../data/books.json');
const fsPromises = require('fs/promises')

//PATH: /books/:bookId/return - authenticated users

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

        if (book.available) {
            throw new CustomError("Book not rented", "Book not rented", 409)
        }

        if (req.user._id !== book.currentlyHeldBy) {
            throw new CustomError("You cannot return a book you did not rent", "You cannot return a book you did not rent", 409)
        }

        book.available = true;
        book.currentlyHeldBy = -1;

        await fsPromises.writeFile('./data/books.json', JSON.stringify(books, null, 2));

        res.statusMessage = "Book returned successfully"
        res.status(200).json({
            message: "Book returned successfully",
            status: 200,
            book
        })
    })


module.exports = router;