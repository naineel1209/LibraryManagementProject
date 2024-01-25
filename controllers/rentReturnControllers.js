const CustomError = require('../errors/CustomError')
const Book = require('../model/bookModel')
const RentOrder = require('../model/rentOrder')
const priceChart = require('../data/priceChart.json')

const { isAfter, differenceInDays, format } = require('date-fns');

const rentBook = async (req, res) => {
    //! Rent the bookId to the currentUser
    const { bookId, returnDate } = req.body;

    if (!bookId || !returnDate) {
        throw new CustomError("Missing field in body", "Missing field in body", 406)
    }

    const parsedDate = new Date(returnDate);
    const isDate = !isNaN(parsedDate) && parsedDate.toString() != "Invalid String";

    if (isDate && isAfter(new Date(), returnDate)) {
        throw new CustomError("Invalid return date", "Invalid return date", 406)
    }

    const book = await Book.findById(bookId);

    //book not found
    if (!book) {
        throw new CustomError("Book not found", "Book not found", 404)
    }

    //book not available
    if (!book.available) {
        throw new CustomError("Book not available", "Book not available", 409)
    }

    //book published by currentUser
    if (req.user._id.equals(book.publishedBy) === true) {
        throw new CustomError("You cannot rent your own book", "You cannot rent your own book", 409)
    }

    //book already rented by currentUser
    if (req.user._id.equals(book.currentlyHeldBy) === true) {
        throw new CustomError("You have already rented this book", "You have already rented this book", 409);
    }

    //: rent order to be made
    const currentDateFormatted = format(new Date(), 'yyyy-MM-dd');
    const returnDateFormatted = format(new Date(returnDate), 'yyyy-MM-dd');

    const price = priceChart[book.type];
    let payment = price["rentalFee"];

    if (isAfter(returnDate, currentDateFormatted)) {
        const daysDifference = differenceInDays(new Date(returnDate), new Date());
        payment += price["rentalFee"] * (daysDifference - 1);
    }

    const rentOrder = new RentOrder({
        bookId,
        rentedBy: req.user._id,
        rentDate: currentDateFormatted,
        returnDate: returnDateFormatted,
        payment,
    })

    //make the book unavailable for rent and update the currentlyHeldBy
    book.available = false;
    book.currentlyHeldBy = req.user._id;

    await rentOrder.populate("rentedBy", "username");
    await book.save();
    await rentOrder.save();

    res.statusMessage = "Book rented successfully"
    res.status(200).json({
        message: "Book rented successfully",
        status: 200,
        book,
        rentOrder
    })
}

const returnBook = async (req, res) => {
    //! Rent the bookId to the currentUser
    const { bookId, rentOrderId } = req.body;

    //TODO: return to be made
    const book = await Book.findById(bookId);

    if (!book) {
        throw new CustomError("Book not found", "Book not found", 404)
    }

    if (book.available) {
        throw new CustomError("Book not rented", "Book not rented", 409)
    }

    console.log(req.user._id, book.currentlyHeldBy)

    if (req.user._id.equals(book.currentlyHeldBy) === false) {
        throw new CustomError("You cannot return a book you did not rent", "You cannot return a book you did not rent", 409)
    }

    //find the rent order
    const rentOrder = await RentOrder.findById(rentOrderId);

    if (rentOrder.returned) {
        throw new CustomError("You have already returned this order", "You have already returned this order", 406)
    }

    //calculate the payment to be made
    const currentDate = new Date();

    const returnDate = new Date(rentOrder.returnDate); //rentOrder return date
    const daysDifference = differenceInDays(currentDate, rentOrder.rentDate); //days difference between current date and rent order current date

    //get the price chart for the book type
    const price = priceChart[book.type];

    //base payment that is compulsary to be made even if the book is returned on same day
    let payment = price["rentalFee"];

    //calculate the remaining days payment not required if book returned on same day
    if (daysDifference > 0) {
        payment += price["rentalFee"] * (daysDifference - 1);
    }

    //calculate the penalty if book is returned after the return date
    let penalty = 0;
    if (isAfter(currentDate, returnDate)) {
        let extraDays = differenceInDays(currentDate, returnDate);
        penalty += extraDays * price["lateFee"];
    }

    //total payment to be made
    const totalPayment = payment + penalty;

    rentOrder.payment = payment;
    rentOrder.penalty = penalty;
    rentOrder.totalPayment = totalPayment;
    rentOrder.returned = true;
    rentOrder.returnDate = format(currentDate, 'yyyy-MM-dd');


    //update the book
    book.available = true;
    book.currentlyHeldBy = null;

    //write the rentOrders to the file
    await rentOrder.populate("rentedBy", "username");
    await rentOrder.save();
    await book.save();

    res.statusMessage = "Book returned successfully"
    res.status(200).json({
        message: "Book returned successfully",
        status: 200,
        rentOrder,
        book
    })

}

const rentHistory = async (req, res) => {
    const { bookId } = req.params;

    if (!bookId) {
        throw new CustomError("Missing field in params", "Missing field in params", 406)
    }

    const rentOrders = await RentOrder.find({ bookId }).populate("rentedBy", "username").populate("bookId");

    res.statusMessage = "GET request successful"
    res.status(200).json({
        message: "GET request successful",
        status: 200,
        rentOrders
    })
}
module.exports = { rentBook, returnBook, rentHistory }