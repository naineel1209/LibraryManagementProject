const { Router } = require('express');
const router = Router({ mergeParams: true });
const CustomError = require('../errors/CustomError')
const books = require('../data/books.json');
const priceChart = require('../data/priceChart.json')
const rentOrders = require('../data/rentOrders.json')
const bookSchema = require('../model/bookModel')
const fsPromises = require('fs/promises')
const {isDate, isAfter, format} = require('date-fns');

const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({
    dictionary: 'number',
})

//PATH: /books/rent - authenticated users

router
    .route('/')
    .get(async (req, res) => {
        //! Rent the bookId to the currentUser
        const { bookId, returnDate } = req.body;

        if (!bookId || !returnDate ) {    
            throw new CustomError("Missing field in body", "Missing field in body", 406)
        }

        const parsedDate = new Date(returnDate);
        const isDate = !isNaN(parsedDate) && parsedDate.toString() != "Invalid String";
 
        if(isDate && isAfter(new Date(), returnDate)){
            throw new CustomError("Invalid return date", "Invalid return date", 406)
        }

        const book = books.find(book => {
            return book.bookId === bookId
        })
        
        //book not found
        if (!book) {
            throw new CustomError("Book not found", "Book not found", 404)
        }

        //book not available
        if (!book.available) {
            throw new CustomError("Book not available", "Book not available", 409)
        }

        //book published by currentUser
        if (req.user._id === book.publishedBy) {
            throw new CustomError("You cannot rent your own book", "You cannot rent your own book", 409)
        }

        //book already rented by currentUser
        if(req.user._id === book.currentlyHeldBy){
            throw new CustomError("You have already rented this book", "You have already rented this book", 409);
        }

        //TODO: rent order to be made
        const currentDateFormatted = format(new Date(), 'yyyy-MM-dd');
        const returnDateFormatted = format(new Date(returnDate), 'yyyy-MM-dd');

        const rentOrder = {
            rentOrderId: uid.randomUUID(5),
            bookId,
            rentedBy: req.user._id,
            rentDate: currentDateFormatted,
            returnDate: returnDateFormatted
        }

        if(!rentOrders[rentOrder.bookId]){
            rentOrders[rentOrder.bookId] = [];
        }

        rentOrders[rentOrder.bookId].push(rentOrder);

        //make the book unavailable for rent and update the currentlyHeldBy
        book.available = false;
        book.currentlyHeldBy = req.user._id;

        await fsPromises.writeFile('./data/books.json', JSON.stringify(books, null, 2));
        await fsPromises.writeFile('./data/rentOrders.json', JSON.stringify(rentOrders, null, 2));

        res.statusMessage = "Book rented successfully"
        res.status(200).json({
            message: "Book rented successfully",
            status: 200,
            book,
            rentOrder
        })
    })


module.exports = router;