import { Router } from 'express';
import { createEvidence, getEvidence } from '../controllers/evidenceController';

// This file defines the routes for the evidence API.

// Create a new router.
const router = Router();

// Route to create a new evidence record.
router.post('/', createEvidence);
// Route to get all evidence for the authenticated user.
router.get('/', getEvidence);

// Export the router.
export default router;
