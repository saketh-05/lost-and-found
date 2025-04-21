const express = require('express');
const router = express.Router();
const { reportFoundItem } = require('../controllers/FoundItemController');

router.post('/report', reportFoundItem);

module.exports = router;
