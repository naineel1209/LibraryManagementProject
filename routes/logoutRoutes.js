const { Router } = require('express');
const router = Router();
const { verifyToken } = require('../middlewares/authMiddleware');

//PATH: /logout

router
    .route('/')
    .get(verifyToken, (req, res) => {
        res.clearCookie('libmgmt')
        res.clearCookie('libmgmtRefresher');

        res.statusMessage = "GET request successful"
        res.status(200).json({
            message: "GET request successful",
            contents: "You have been logged out"
        })
    })

module.exports = router