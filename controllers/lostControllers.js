const CustomError = require('../errors/CustomError')
// delete require.cache[require.resolve('../data/books.json')];
// delete require.cache[require.resolve('../data/rentOrders.json')];
const books = require('../data/books.json');
const priceChart = require('../data/priceChart.json')
const rentOrders = require('../data/rentOrders.json')
const fsPromises = require('fs/promises')
const { differenceInDays, format, isAfter } = require('date-fns');

const lostBook = async (req, res) => {
    const { bookId, rentOrderId } = req.body;

    const book = books.find(item => {
        return item.bookId === bookId
    })

    if (!book) {
        throw new CustomError("Book not found", "Book not found", 404)
    }
    console.log(book)
    if (book.available) {
        throw new CustomError("Book is available and not lost", "Book is available and not lost", 409)
    }

    if (book.currentlyHeldBy !== req.user._id) {
        throw new CustomError("You cannot mark a book lost that you did not rent", "You cannot mark a book lost that you did not rent", 409)
    }

    //find the rent order
    const rentOrderIndex = rentOrders[bookId].findIndex(order => {
        return order.rentOrderId === rentOrderId;
    })

    if (rentOrderIndex === -1) {
        throw new CustomError("Rent order not found", "Rent order not found", 404)
    }

    const rentOrder = rentOrders[bookId][rentOrderIndex];

    if (rentOrder.returned) {
        throw new CustomError("You have already returned this order", "You have already returned this order", 406)
    }

    //calculate the payment to be made
    const currentDate = new Date();
    const returnDate = new Date(rentOrder.returnDate);
    const daysDifference = differenceInDays(currentDate, returnDate);

    const price = priceChart[book.type];
    let payment = price["rentalFee"];
    if (isAfter(currentDate, returnDate)) {
        payment += (daysDifference - 1) * price["rentalFee"];
    }

    //add the 10 * rentalFee as penalty
    let penalty = 10 * price["rentalFee"];

    let totalPayment = payment + penalty;

    //update the rent order
    rentOrders[bookId][rentOrderIndex].lost = true;
    rentOrders[bookId][rentOrderIndex].payment = payment;
    rentOrders[bookId][rentOrderIndex].penalty = penalty;
    rentOrders[bookId][rentOrderIndex].totalPayment = totalPayment;
    rentOrders[bookId][rentOrderIndex].returned = true;

    //make a copy of the books array and remove the book from it
    const booksCopy = books.filter(item => {
        return item.bookId !== bookId;
    });

    await fsPromises.writeFile('./data/books.json', JSON.stringify(booksCopy, null, 2));
    await fsPromises.writeFile('./data/rentOrders.json', JSON.stringify(rentOrders, null, 2));

    res.statusMessage = "Book marked as lost"
    res.status(200).json({
        message: "Book marked as lost",
        status: 200,
        payment,
        penalty,
        totalPayment
    })
}

module.exports = { lostBook }