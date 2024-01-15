const { Router } = require('express');
const router = Router();
const { lostBook } = require('../controllers/lostControllers');

//PATH: /books/lost - authenticated users

router
  .get('/', lostBook)

module.exports = router;