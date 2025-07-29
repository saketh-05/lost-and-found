import { Router } from 'express';
const router = Router();

import { reportFoundItem } from './controllers/foundItemController';

// Route to report found item with image upload
router.post('/report', reportFoundItem);

export default router;
