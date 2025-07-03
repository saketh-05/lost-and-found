const express = require('express');
const router = express.Router();
const upload = require('./middleware/upload'); // Multer middleware

const { reportFoundItem } = require('./controllers/foundItemController');

// Route to report found item with image upload
router.post('/report', upload.single('image'), reportFoundItem);

module.exports = router;
