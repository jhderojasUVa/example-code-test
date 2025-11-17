export interface Evidence {
  id: string;
  user_id: string;
  title: string;
  media_type: 'video' | 'image' | 'voice_note' | 'text';
  file: {
    name: string;
    extension: string;
    size: number;
  };
  secure_reference: string;
  created_at: string;
}

export interface SharedToken {
  token: string;
  user_id: string;
  expires_at: number;
  used: boolean;
}

export const evidence: Evidence[] = [];
export const sharedTokens: SharedToken[] = [];