const Book = require('../model/bookModel')
const RentOrder = require('../model/rentOrder')
const books = require('../data/books.json');

const findProfile = async (req, res) => {
    //! GET profile - get all books rented by the currentUser, publishedByUser
    const currentUser = req.user;

    const rentedBooks = await Book.find({ currentlyHeldBy: currentUser._id }).populate("publishedBy", "username").populate("currentlyHeldBy", "username");

    const publishedBooks = await Book.find({ publishedBy: currentUser._id }).populate("publishedBy", "username").populate("currentlyHeldBy", "username");

    const previousRentedBooks = await RentOrder.find({ rentedBy: currentUser._id, returned: true }).populate("bookId", "title type author publishedBy currentlyHeldBy");

    res.statusMessage = "GET request successful"
    res.status(200).json({
        message: "GET request successful",
        currentUser,
        rentedBooks,
        publishedBooks,
        previousRentedBooks
    })
}

module.exports = { findProfile }