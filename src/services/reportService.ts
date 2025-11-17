import { v4 as uuidv4 } from 'uuid';
import { evidence, Evidence } from './evidenceService';

interface SharedReport {
  user_id: string;
  generated_at: string;
  evidence: Evidence[];
}

interface ShareToken {
  token: string;
  userId: string;
  expiresAt: number;
  used: boolean;
}

let shareTokens: ShareToken[] = [];

export const createShareToken = (userId: string): string => {
  const token = uuidv4();
  shareTokens.push({
    token,
    userId,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    used: false,
  });
  return token;
};

export const getSharedReport = (token: string): SharedReport | null => {
  const tokenData = shareTokens.find(t => t.token === token);

  if (!tokenData || tokenData.used || tokenData.expiresAt < Date.now()) {
    return null;
  }

  tokenData.used = true;

  const userEvidence = evidence.filter(e => e.user_id === tokenData.userId);

  return {
    user_id: tokenData.userId,
    generated_at: new Date().toISOString(),
    evidence: userEvidence,
  };
};
