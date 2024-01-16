// // require('dotenv').config();
// // const bcrypt = require('bcrypt');
// // const ShortUniqueId = require('short-unique-id');

// // (async () => {
// //     const hashedPass = await bcrypt.hash('123456', Number(process.env.SALT), (err, hash) => {
// //         if (err) {
// //             console.log(err);
// //         }
// //         console.log("Hash ", hash);
// //     });
// // });


// // const uid = new ShortUniqueId({
// //     dictionary: 'number',
// // });

// // console.log(uid.randomUUID(5));
// // console.log(uid.randomUUID(5));

// // const rentOrders = require('./data/rentOrders.json');
// // const books = require('./data/books.json');

// // books.forEach(book => {
// //     console.log(book.bookId, rentOrders[book.bookId]);
// // })


// const { differenceInDays, format } = require('date-fns');

// const startDate = new Date('2024-01-15');
// const endDate = new Date('2024-01-25');

// // Example: Calculate the difference in days between startDate and endDate
// const daysDifference = differenceInDays(endDate, startDate);


// console.log('Start Date:', format(startDate, 'yyyy-MM-dd'));
// console.log('End Date:', format(endDate, 'yyyy-MM-dd'));
// console.log('Days Difference:', daysDifference);
