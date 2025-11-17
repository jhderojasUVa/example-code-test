import { v4 as uuidv4 } from 'uuid';
import { evidence, Evidence } from './evidenceService';

/**
 * Represents a shared report.
 */
interface SharedReport {
  /** The ID of the user who owns the report. */
  user_id: string;
  /** The date and time the report was generated. */
  generated_at: string;
  /** The evidence included in the report. */
  evidence: Evidence[];
}

/**
 * Represents a share token.
 */
interface ShareToken {
  /** The unique token string. */
  token: string;
  /** The ID of the user who owns the report. */
  userId: string;
  /** The date and time the token expires. */
  expiresAt: number;
  /** Whether the token has been used. */
  used: boolean;
}

/**
 * In-memory database of share tokens. In a real application, this would be a database.
 */
let shareTokens: ShareToken[] = [];

/**
 * Creates a new share token and adds it to the in-memory database.
 * @param userId The ID of the user who owns the report.
 * @param expiresIn The number of milliseconds until the token expires.
 * @returns The new share token.
 */
export const createShareToken = (userId: string, expiresIn: number = 5 * 60 * 1000): string => {
  // Create the new share token.
  const token = uuidv4();
  // Add the new share token to the in-memory database.
  shareTokens.push({
    token,
    userId,
    expiresAt: Date.now() + expiresIn,
    used: false,
  });
  // Return the new share token.
  return token;
};

/**
 * Retrieves a shared report using a token.
 * @param token The share token.
 * @returns The shared report, or null if the token is invalid, has been used, or has expired.
 */
export const getSharedReport = (token: string): SharedReport | null => {
  // Find the token in the in-memory database.
  const tokenData = shareTokens.find(t => t.token === token);

  // If the token is not found, has been used, or has expired, return null.
  if (!tokenData || tokenData.used || tokenData.expiresAt < Date.now()) {
    return null;
  }

  // Mark the token as used.
  tokenData.used = true;

  // Filter the evidence to only include evidence for the user who owns the report.
  const userEvidence = evidence.filter(e => e.user_id === tokenData.userId);

  // Return the shared report.
  return {
    user_id: tokenData.userId,
    generated_at: new Date().toISOString(),
    evidence: userEvidence,
  };
};
