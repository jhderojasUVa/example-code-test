import { v4 as uuidv4 } from 'uuid';

/**
 * Represents an evidence record.
 */
export interface Evidence {
  /** The unique ID of the evidence. */
  id: string;
  /** The ID of the user who submitted the evidence. */
  user_id: string;
  /** The title of the evidence. */
  title: string;
  /** The type of media of the evidence. */
  media_type: 'video' | 'image' | 'voice_note' | 'text';
  /** A secure reference to the evidence file. In a real application, this would be a signed URL to an object storage service. */
  secure_reference: string;
  /** The date and time the evidence was created. */
  created_at: string;
  /** The file metadata. */
  file: {
    name: string;
    extension: string;
    size: number;
  };
}

/**
 * In-memory database of evidence records. In a real application, this would be a database.
 */
export let evidence: Evidence[] = [];

/**
 * Creates a new evidence record and adds it to the in-memory database.
 * @param userId The ID of the user who submitted the evidence.
 * @param title The title of the evidence.
 * @param media_type The type of media of the evidence.
 * @param file The file metadata.
 * @returns The new evidence record.
 */
export const createEvidence = (userId: string, title: string, media_type: Evidence['media_type'], file: Evidence['file']): Evidence => {
  // Create the new evidence record.
  const newEvidence: Evidence = {
    id: uuidv4(),
    user_id: userId,
    title,
    media_type,
    // In a real application, this would be a signed URL to an object storage service.
    secure_reference: `evidence/${userId}/${uuidv4()}`,
    created_at: new Date().toISOString(),
    file,
  };
  // Add the new evidence record to the in-memory database.
  evidence.push(newEvidence);
  // Return the new evidence record.
  return newEvidence;
};
