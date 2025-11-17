import { v4 as uuidv4 } from 'uuid';

export interface Evidence {
  id: string;
  user_id: string;
  title: string;
  media_type: 'video' | 'image' | 'voice_note' | 'text';
  secure_reference: string;
  created_at: string;
  file: {
    name: string;
    extension: string;
    size: number;
  };
}

export let evidence: Evidence[] = [];

export const createEvidence = (userId: string, title: string, media_type: Evidence['media_type'], file: Evidence['file']): Evidence => {
  const newEvidence: Evidence = {
    id: uuidv4(),
    user_id: userId,
    title,
    media_type,
    secure_reference: `evidence/${userId}/${uuidv4()}`,
    created_at: new Date().toISOString(),
    file,
  };
  evidence.push(newEvidence);
  return newEvidence;
};
