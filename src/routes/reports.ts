import { Router } from 'express';
import { generateReport, shareReport, getSharedReport } from '../controllers/reportsController';

const router = Router();

router.get('/', generateReport);
router.post('/share', shareReport);
router.get('/share/:token', getSharedReport);

export default router;
