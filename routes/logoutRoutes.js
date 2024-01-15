const { Router } = require('express');
const router = Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { logoutController } = require('../controllers/authControllers');

//PATH: /logout

router
    .route('/')
    .get(verifyToken, logoutController);

module.exports = router