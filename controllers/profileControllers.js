const CustomError = require('../errors/CustomError')
// delete require.cache[require.resolve('../data/books.json')];
const books = require('../data/books.json');
const fsPromises = require('fs/promises');

const findProfile = async (req, res) => {
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
}

module.exports = { findProfile }