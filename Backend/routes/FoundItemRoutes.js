const express = require('express');
const router = express.Router();
const { reportFoundItem } = require('../controllers/FoundItemController');
//basic routes
router.post('/report', reportFoundItem);

module.exports = router;
