import { Router } from 'express';
import { generateReport, shareReport, getSharedReport } from '../controllers/reportsController';

// This file defines the routes for the reports API.

// Create a new router.
const router = Router();

// Route to generate a report of all evidence for the authenticated user.
router.get('/', generateReport);
// Route to create a shareable link for the user's report.
router.post('/share', shareReport);
// Route to get a shared report using a secure token.
router.get('/share/:token', getSharedReport);

// Export the router.
export default router;
