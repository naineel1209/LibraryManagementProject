const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({
    dictionary: 'number',
})
const CustomError = require('../errors/CustomError')

// delete require.cache[require.resolve('../data/books.json')];
const books = require('../data/books.json');

const bookSchema = require('../model/bookModel')
const priceChart = require('../data/priceChart.json')
const fsPromises = require('fs/promises')


const getAvailableBooks = (req, res) => {
    //! GET books - get all books available to rent
    const availableBooks = books.filter(book => {
        return book.available;
    })

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
        // res.statusMessage = "Missing field in body"
        // res.status(406).json({
        //     message: "Missing field in body",
        //     status: 406
        // })
        throw new CustomError("Missing field in body", "Missing field in body", 406)
    }

    if (!Object.keys(priceChart).includes(type)) {
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
}

const getAsingleBook = (req, res) => {
    delete require.cache[require.resolve('../data/books.json')];
    // const reloadedBooks = require('../data/books.json');

    const { bookId } = req.params;

    const book = books.find(book => {
        return book.bookId === bookId
    })

    console.log(book);

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

}

module.exports = { getAvailableBooks, postBook, getAsingleBook, deleteAsingleBook, updateAsingleBook }