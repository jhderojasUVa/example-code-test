import { Request, Response } from 'express';
import { evidence } from '../services/evidenceService';
import { createShareToken, getSharedReport as getSharedReportFromService } from '../services/reportService';

/**
 * Generates a report of all evidence for the authenticated user.
 * @param req The request object, containing the user ID.
 * @param res The response object.
 */
export const generateReport = (req: Request, res: Response) => {
  // Get the user ID from the request object.
  const userId = (req as any).user.id;
  // Filter the evidence to only include evidence for the current user.
  const userEvidence = evidence.filter(e => e.user_id === userId);

  // Create the report object.
  const report = {
    user_id: userId,
    generated_at: new Date().toISOString(),
    evidence: userEvidence,
  };

  // Return the report.
  res.status(200).json(report);
};

/**
 * Creates a secure, shareable link for the user's report.
 * @param req The request object, containing the user ID.
 * @param res The response object.
 */
export const shareReport = (req: Request, res: Response) => {
  // Get the user ID from the request object.
  const userId = (req as any).user.id;
  // Create a new share token.
  const token = createShareToken(userId);
  // Create the shareable URL.
  const shareUrl = `${req.protocol}://${req.get('host')}/share/${token}`;

  // Return the shareable URL.
  res.status(200).json({ share_url: shareUrl });
};

/**
 * Retrieves a shared report using a secure token.
 * @param req The request object, containing the token from the URL parameters.
 * @param res The response object.
 */
export const getSharedReport = (req: Request, res: Response) => {
  // Get the token from the request parameters.
  const { token } = req.params;
  // Get the shared report from the service.
  const report = getSharedReportFromService(token);

  // If the report is not found or has expired, return a 404 error.
  if (!report) {
    return res.status(404).json({ message: 'Report not found or expired' });
  }

  // Return the report.
  res.status(200).json(report);
};
