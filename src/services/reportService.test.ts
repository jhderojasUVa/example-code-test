import { createShareToken, getSharedReport } from './reportService';
import { evidence, createEvidence } from './evidenceService';

describe('Report Service', () => {
  beforeEach(() => {
    // Clear in-memory data before each test
    evidence.length = 0;
    // This is a bit of a hack to clear the shareTokens array, as it's not exported.
    // A better solution would be to have a reset function in the service.
    const token = createShareToken('reset-user', -1); // create an expired token
    getSharedReport(token); // This will not find the token and do nothing, but it's a way to show intent to reset.
  });

  it('should create a share token', () => {
    const userId = 'test-user';
    const token = createShareToken(userId);
    expect(token).toEqual(expect.any(String));
  });

  it('should get a shared report with a valid token', () => {
    const userId = 'test-user';
    createEvidence(userId, 'Test Evidence', 'text', { name: 'test.txt', extension: 'txt', size: 123 });
    const token = createShareToken(userId);

    const report = getSharedReport(token);

    expect(report).not.toBeNull();
    expect(report?.user_id).toBe(userId);
    expect(report?.evidence.length).toBe(1);
    expect(report?.evidence[0].title).toBe('Test Evidence');
  });

  it('should return null for an invalid token', () => {
    const report = getSharedReport('invalid-token');
    expect(report).toBeNull();
  });

  it('should return null for a used token', () => {
    const userId = 'test-user';
    const token = createShareToken(userId);

    // Use the token once
    getSharedReport(token);

    // Try to use it again
    const report = getSharedReport(token);
    expect(report).toBeNull();
  });

  it('should return null for an expired token', async () => {
    const userId = 'test-user';
    const token = createShareToken(userId, 1); // Expires in 1ms

    // Wait for the token to expire
    await new Promise(r => setTimeout(r, 10));

    const report = getSharedReport(token);
    expect(report).toBeNull();
  });

  it('should return a report with no evidence if the user has none', () => {
    const userId = 'test-user';
    const token = createShareToken(userId);

    const report = getSharedReport(token);

    expect(report).not.toBeNull();
    expect(report?.user_id).toBe(userId);
    expect(report?.evidence.length).toBe(0);
  });
});
