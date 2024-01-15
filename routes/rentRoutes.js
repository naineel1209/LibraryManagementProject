const { Router } = require('express');
const router = Router({ mergeParams: true });
const { rentBook } = require('../controllers/rentReturnControllers');


//PATH: /books/rent - authenticated users

router
    .route('/')
    .get(rentBook)


module.exports = router;