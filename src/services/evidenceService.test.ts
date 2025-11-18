import { createEvidence, evidence, Evidence } from './evidenceService';

describe('Evidence Service', () => {
  beforeEach(() => {
    // Clear the in-memory database before each test
    evidence.length = 0;
  });

  it('should create a new evidence record', () => {
    const userId = 'test-user';
    const title = 'Test Evidence';
    const media_type = 'video';
    const file = {
      name: 'test.mp4',
      extension: 'mp4',
      size: 12345,
    };

    const newEvidence = createEvidence(userId, title, media_type, file);

    expect(newEvidence).toBeDefined();
    expect(newEvidence.id).toEqual(expect.any(String));
    expect(newEvidence.user_id).toBe(userId);
    expect(newEvidence.title).toBe(title);
    expect(newEvidence.media_type).toBe(media_type);
    expect(newEvidence.file).toEqual(file);
    expect(newEvidence.secure_reference).toMatch(new RegExp(`^evidence/${userId}/`));
    expect(newEvidence.created_at).toEqual(expect.any(String));

    // Check if the evidence was added to the in-memory array
    expect(evidence.length).toBe(1);
    expect(evidence[0]).toEqual(newEvidence);
  });

  it('should add multiple evidence records', () => {
    createEvidence('user1', 'Evidence 1', 'image', { name: '1.jpg', extension: 'jpg', size: 1 });
    createEvidence('user2', 'Evidence 2', 'text', { name: '2.txt', extension: 'txt', size: 2 });

    expect(evidence.length).toBe(2);
  });
});
