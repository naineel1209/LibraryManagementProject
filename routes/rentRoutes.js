const { Router } = require('express');
const router = Router({ mergeParams: true });
const { rentBook, rentHistory } = require('../controllers/rentReturnControllers');


//PATH: /books/rent - authenticated users

router
    .route('/')
    .get(rentBook)


router
    .route('/:bookId/history')
    .get(rentHistory)


module.exports = router;