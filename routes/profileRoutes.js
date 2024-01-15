const { Router } = require('express');
const router = Router({ mergeParams: true });
const { findProfile } = require('../controllers/profileControllers');
const { verifyToken } = require('../middlewares/authMiddleware');

//PATH: /profile - authenticated users`

router
    .route('/')
    .get(verifyToken, findProfile)


module.exports = router;
