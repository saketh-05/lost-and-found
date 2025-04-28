const express = require('express');
const router = express.Router();
const { reportLostItem } = require('../controllers/LostItemController');
//typical
router.post('/report', reportLostItem);

module.exports = router;
