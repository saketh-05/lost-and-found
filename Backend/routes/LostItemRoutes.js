const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Multer middleware

const { reportLostItem } = require('./controllers/lostItemController');

// Route to report lost item with image upload
router.post('/report-lost-item', upload.single('image'), reportLostItem);

module.exports = router;
