const CustomError = require('../errors/CustomError')
const Book = require('../model/bookModel')
const RentOrder = require('../model/rentOrder')
const priceChart = require('../data/priceChart.json')
const { differenceInDays, isAfter } = require('date-fns');

const lostBook = async (req, res) => {
    const { bookId, rentOrderId } = req.body;

    const book = await Book.findById(bookId).populate("publishedBy", "username").populate("currentlyHeldBy", "username");

    if (!book) {
        throw new CustomError("Book not found", "Book not found", 404)
    }

    if (book.available) {
        throw new CustomError("Book is available and not lost", "Book is available and not lost", 409)
    }

    if (req.user._id.equals(book.publishedBy) === true) {
        throw new CustomError("You cannot mark a book lost that you did not rent", "You cannot mark a book lost that you did not rent", 409)
    }

    //find the rent order
    const rentOrder = await RentOrder.findById(rentOrderId);

    if (rentOrder.returned) {
        throw new CustomError("You have already returned this order", "You have already returned this order", 406)
    }

    //calculate the payment to be made
    const currentDate = new Date();
    const returnDate = new Date(rentOrder.returnDate);
    const daysDifference = differenceInDays(currentDate, returnDate);

    console.log(book)
    const price = priceChart[book.type];
    let payment = price["rentalFee"];
    if (isAfter(currentDate, returnDate)) {
        payment += (daysDifference - 1) * price["rentalFee"];
    }

    //add the 10 * rentalFee as penalty
    let penalty = 10 * price["rentalFee"];

    let totalPayment = payment + penalty;

    //update the rent order
    rentOrder.lost = true;
    rentOrder.payment = payment;
    rentOrder.penalty = penalty;
    rentOrder.totalPayment = totalPayment;
    rentOrder.returned = true;

    //make a copy of the books array and remove the book from it
    // book.lost = true;
    // book.currentlyHeldBy = null;

    await book.deleteOne()
    await rentOrder.save();

    res.statusMessage = "Book marked as lost"
    res.status(200).json({
        message: "Book marked as lost",
        status: 200,
        book,
        rentOrder
    })
}

module.exports = { lostBook }