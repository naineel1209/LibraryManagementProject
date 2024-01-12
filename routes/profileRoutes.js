const { Router } = require('express');
const router = Router({ mergeParams: true });
const CustomError = require('../errors/CustomError')
const books = require('../data/books.json');
const fsPromises = require('fs/promises');
const { verifyToken } = require('../middlewares/authMiddleware');

//PATH: /profile - authenticated users`

router
    .route('/')
    .get(verifyToken, async (req, res) => {
        //! GET profile - get all books rented by the currentUser, publishedByUser
        const currentUser = req.user;

        const rentedBooks = books.filter(book => {
            return book.currentlyHeldBy === currentUser._id
        })

        const publishedBooks = books.filter(book => {
            return book.publishedBy === currentUser._id
        });

        res.statusMessage = "GET request successful"
        res.status(200).json({
            message: "GET request successful",
            currentUser,
            rentedBooks,
            publishedBooks
        })
    })


module.exports = router;
