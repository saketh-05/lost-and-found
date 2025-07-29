import { Router } from 'express';
const router = Router();

import { reportLostItem } from './controllers/lostItemController';

// Route to report lost item with image upload
router.post('/report-lost-item', reportLostItem);

export default router;
