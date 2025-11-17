import { Request, Response } from 'express';
import { evidence } from '../services/evidenceService';
import { createShareToken, getSharedReport as getSharedReportFromService } from '../services/reportService';

export const generateReport = (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const userEvidence = evidence.filter(e => e.user_id === userId);

  const report = {
    user_id: userId,
    generated_at: new Date().toISOString(),
    evidence: userEvidence,
  };

  res.status(200).json(report);
};

export const shareReport = (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const token = createShareToken(userId);
  const shareUrl = `${req.protocol}://${req.get('host')}/share/${token}`;

  res.status(200).json({ share_url: shareUrl });
};

export const getSharedReport = (req: Request, res: Response) => {
  const { token } = req.params;
  const report = getSharedReportFromService(token);

  if (!report) {
    return res.status(404).json({ message: 'Report not found or expired' });
  }

  res.status(200).json(report);
};
