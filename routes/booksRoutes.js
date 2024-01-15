const { Router } = require('express');
const router = Router({ mergeParams: true });
const priceChart = require('../data/priceChart.json');
const { getAvailableBooks, postBook, getAsingleBook, deleteAsingleBook, updateAsingleBook } = require('../controllers/bookControllers');


//PATH: /books - authenticated users 

router
    .get('/info', (req, res) => {
        res.statusMessage = "GET request successful"
        res.status(200).json({
            message: "GET request successful",
            status: 200,
            priceChart
        })
    })

router
    .route('/')
    .get(getAvailableBooks)
    .post(postBook)

router.use('/rent', require('./rentRoutes'))
router.use('/return', require('./returnRoutes'))
router.use('/lost', require('./lostRoutes'))

router
    .route('/:bookId')
    .get(getAsingleBook)
    .delete(deleteAsingleBook)
    .patch(updateAsingleBook)


module.exports = router;