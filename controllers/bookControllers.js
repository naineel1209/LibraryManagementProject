const CustomError = require('../errors/CustomError')
const Book = require('../model/bookModel')
const priceChart = require('../data/priceChart.json')

const getAvailableBooks = async (req, res) => {
    //! GET books - get all books available to rent
    const availableBooks = await Book.find({ available: true, lost: false }).populate("publishedBy", "username");

    res.statusMessage = "GET request successful"
    res.status(200).json({
        message: "GET request successful",
        availableBooks
    })
}

const postBook = async (req, res) => {
    //! POST books - add a new book to the library
    const { title, type, author } = req.body;

    if (!title || !type || !author) {
        throw new CustomError("Missing field in body", "Missing field in body", 406)
    }

    if (!Object.keys(priceChart).includes(type)) {
        throw new CustomError("Invalid Book Type", "Invalid Book Type", 406);
    }

    const book = new Book({
        title,
        type,
        author,
        publishedBy: req.user._id,
    });

    book.populate("publishedBy", "username");

    await book.save();

    res.statusMessage = "Book added successfully"
    res.status(201).json({
        message: "Book added successfully",
        book
    })
}

const getAsingleBook = async (req, res) => {
    const { bookId } = req.params;

    const book = await Book.findById(bookId).populate("publishedBy", "username").populate("currentlyHeldBy", "username");

    if (!book) {
        throw new CustomError("Book not found", "Book not found", 404)
    }

    res.statusMessage = "GET request successful"
    res.status(200).json({
        message: "GET request successful",
        book
    })
}

const deleteAsingleBook = async (req, res) => {
    const { bookId } = req.params;

    // const bookIndex = books.findIndex(book => {
    //     return book.bookId === bookId
    // })

    // if (bookIndex === -1) {
    //     throw new CustomError("Book not found", "Book not found", 404)
    // }

    // const book = books[bookIndex];
    // if (book.publishedBy !== req.user._id || req.user.role !== "admin") {
    //     throw new CustomError("Unauthorized", "Unauthorized", 401)
    // }

    // books.splice(bookIndex, 1);

    // await fsPromises.writeFile('./data/books.json', JSON.stringify(books, null, 2));
    const book = await Book.findById(bookId);

    if (!book) {
        throw new CustomError("Book not found", "Book not found", 404)
    }

    if (book.lost) {
        throw new CustomError("Book is lost", "Book is lost", 409)
    }

    if (book.publishedBy !== req.user._id || req.user.role !== "admin") {
        throw new CustomError("Unauthorized", "Unauthorized", 401)
    }

    res.statusMessage = "Book deleted successfully"
    res.status(200).json({
        message: "Book deleted successfully",
        status: 200,
        book
    })
}

const updateAsingleBook = async (req, res) => {
    const { bookId } = req.params;
    const { title, type, author } = req.body;

    if (!title && !type && !author) {
        throw new CustomError("Missing field in body", "Missing field in body", 406)
    }

    if (!Object.keys(priceChart).includes(type)) {
        throw new CustomError("Invalid Book Type");
    }

    const book = await Book.findById(bookId).populate("publishedBy", "username").populate("currentlyHeldBy", "username");

    if (!book) {
        throw new CustomError("Book not found", "Book not found", 404)
    }

    if (book.lost) {
        throw new CustomError("Book is lost", "Book is lost", 409)
    }

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

    await book.save();

    res.statusMessage = "Book updated successfully"
    return res.status(200).json({
        message: "Book updated successfully",
        status: 200,
        book
    })
}

module.exports = { getAvailableBooks, postBook, getAsingleBook, deleteAsingleBook, updateAsingleBook }