const { Router } = require('express');
const router = Router({ mergeParams: true });
const { returnBook } = require('../controllers/rentReturnControllers');

//PATH: /books/return - authenticated users

router
    .route('/')
    .get(returnBook)


module.exports = router;