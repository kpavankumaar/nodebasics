const express = require('express');
const router = express.Router();
const reviewCtrl = require('../controllers/review.ctrl');

router.post('/', reviewCtrl.save);

module.exports = router;