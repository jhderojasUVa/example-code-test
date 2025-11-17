import { Router } from 'express';
import { createEvidence, getEvidence } from '../controllers/evidenceController';

const router = Router();

router.post('/', createEvidence);
router.get('/', getEvidence);

export default router;
