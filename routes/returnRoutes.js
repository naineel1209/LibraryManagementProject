const { Router } = require('express');
const router = Router({ mergeParams: true });
const CustomError = require('../errors/CustomError')
const books = require('../data/books.json');
const rentOrders = require('../data/rentOrders.json');
const priceChart = require('../data/priceChart.json')
const fsPromises = require('fs/promises')
const {isAfter, addDays, isDate, differenceInDays, format} = require('date-fns');

//PATH: /books/return - authenticated users

router
    .route('/')
    .get(async (req, res) => {
        //! Rent the bookId to the currentUser
        const { bookId, rentOrderId } = req.body;

        //TODO: return to be made
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

        //find the rent order
        const rentOrderIndex = rentOrders[bookId].findIndex(order => {
            return order.rentOrderId === rentOrderId;
        })

        if (rentOrderIndex === -1) {
            throw new CustomError("Rent order not found", "Rent order not found", 404)
        }   

        const rentOrder = rentOrders[bookId][rentOrderIndex];

        if(rentOrder.returned){
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
        if(daysDifference > 0){
            payment += price["rentalFee"] * (daysDifference - 1);
        }
        
        //calculate the penalty if book is returned after the return date
        let penalty = 0;
        console.log("here - " , currentDate, returnDate);
        if(isAfter(currentDate, returnDate)){
            let extraDays = differenceInDays(currentDate, returnDate);
            penalty += extraDays * price["lateFee"];
        }

        //total payment to be made
        const totalPayment = payment + penalty;

        rentOrder.payment = payment;
        rentOrder.penalty = penalty;
        rentOrder.totalPayment = totalPayment;
        rentOrder.returned = true;
        console.log("date -> ",format(currentDate, 'yyyy-MM-dd'))
        rentOrder.returnDate = format(currentDate, 'yyyy-MM-dd');

        console.log(rentOrder);

        delete rentOrder.minPayment;

        //splice in the rentOrders
        rentOrders[bookId].splice(rentOrderIndex, 1, rentOrder);

        //update the book
        book.available = true;
        book.currentlyHeldBy = -1;

        //write the rentOrders to the file
        await fsPromises.writeFile('./data/rentOrders.json', JSON.stringify(rentOrders, null, 2))
        await fsPromises.writeFile('./data/books.json', JSON.stringify(books, null, 2))

        res.statusMessage = "Book returned successfully"
        res.status(200).json({
            message: "Book returned successfully",
            status: 200,
            rentOrder,
            book
        })

    })


module.exports = router;