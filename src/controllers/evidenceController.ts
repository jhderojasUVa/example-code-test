import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { evidence, createEvidence as createEvidenceInDb } from '../services/evidenceService';

/**
 * Creates a new evidence record for the authenticated user.
 * @param req The request object, containing the evidence data in the body.
 * @param res The response object.
 */
export const createEvidence = (req: Request, res: Response) => {
  // Get the evidence data from the request body.
  const { title, media_type, file } = req.body;
  // Get the user ID from the request object.
  const userId = (req as any).user.id;

  // Validate that all required fields are present.
  if (!title || !media_type || !file) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate that the media type is one of the allowed types.
  const allowedMediaTypes = ['video', 'image', 'voice_note', 'text'];
  if (!allowedMediaTypes.includes(media_type)) {
    return res.status(400).json({ message: 'Invalid media type' });
  }

  // Create the new evidence record in the database.
  const newEvidence = createEvidenceInDb(userId, title, media_type, file);

  // Return the new evidence record.
  res.status(201).json(newEvidence);
};

/**
 * Retrieves all evidence for the authenticated user, sorted by creation date.
 * @param req The request object, containing the user ID.
 * @param res The response object.
 */
export const getEvidence = (req: Request, res: Response) => {
  // Get the user ID from the request object.
  const userId = (req as any).user.id;
  // Filter the evidence to only include evidence for the current user, and sort it by creation date.
  const userEvidence = evidence.filter(e => e.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  // Return the user's evidence.
  res.status(200).json(userEvidence);
};
