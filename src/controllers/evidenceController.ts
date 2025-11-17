import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { evidence, createEvidence as createEvidenceInDb } from '../services/evidenceService';

export const createEvidence = (req: Request, res: Response) => {
  const { title, media_type, file } = req.body;
  const userId = (req as any).user.id;

  if (!title || !media_type || !file) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const allowedMediaTypes = ['video', 'image', 'voice_note', 'text'];
  if (!allowedMediaTypes.includes(media_type)) {
    return res.status(400).json({ message: 'Invalid media type' });
  }

  const newEvidence = createEvidenceInDb(userId, title, media_type, file);

  res.status(201).json(newEvidence);
};

export const getEvidence = (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const userEvidence = evidence.filter(e => e.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.status(200).json(userEvidence);
};
