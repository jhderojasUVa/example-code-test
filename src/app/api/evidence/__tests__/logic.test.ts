// Import functions to be tested and necessary modules for mocking.
import { createEvidence, getEvidence } from '../logic';
import { NextRequest } from 'next/server';
import { getUserId } from '@/lib/auth';
import { evidence } from '@/lib/db';

// Mock the authentication and database modules.
jest.mock('@/lib/auth');
jest.mock('@/lib/db', () => ({
  evidence: [],
}));

// Typecast the mocked functions to allow for mock implementations.
const mockedGetUserId = getUserId as jest.Mock;

/**
 * Test suite for the createEvidence function.
 */
describe('createEvidence', () => {
  // Reset mocks before each test to ensure a clean state.
  beforeEach(() => {
    mockedGetUserId.mockClear();
    evidence.length = 0; // Clear the in-memory evidence array.
  });

  // Test case: should return 401 if the user is not authenticated.
  test('should return 401 if user is not authenticated', async () => {
    mockedGetUserId.mockReturnValue(null); // Simulate no user ID found.
    const req = new NextRequest('http://localhost/api/evidence', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await createEvidence(req);
    // Expect the status to be 401 "Unauthorized".
    expect(response.status).toBe(401);
  });

  // Test case: should return 400 if required fields are missing.
  test('should return 400 if required fields are missing', async () => {
    mockedGetUserId.mockReturnValue('user-123'); // Simulate an authenticated user.
    const req = new NextRequest('http://localhost/api/evidence', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }), // Missing media_type and file.
    });

    const response = await createEvidence(req);
    // Expect the status to be 400 "Bad Request".
    expect(response.status).toBe(400);
  });

  // Test case: should return 400 if the media type is invalid.
  test('should return 400 if media type is invalid', async () => {
    mockedGetUserId.mockReturnValue('user-123');
    const req = new NextRequest('http://localhost/api/evidence', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test',
        media_type: 'document', // Invalid media type.
        file: 'file-data',
      }),
    });

    const response = await createEvidence(req);
    // Expect the status to be 400 "Bad Request".
    expect(response.status).toBe(400);
  });

  // Test case: should create and return evidence if the request is valid.
  test('should create and return evidence if request is valid', async () => {
    mockedGetUserId.mockReturnValue('user-123');
    const req = new NextRequest('http://localhost/api/evidence', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Valid Evidence',
        media_type: 'image',
        file: 'image-data',
      }),
    });

    const response = await createEvidence(req);
    const responseBody = await response.json();

    // Expect the status to be 201 "Created".
    expect(response.status).toBe(201);
    // Expect the database to contain one evidence record.
    expect(evidence.length).toBe(1);
    // Validate the properties of the created evidence.
    expect(responseBody.title).toBe('Valid Evidence');
    expect(responseBody.user_id).toBe('user-123');
  });
});

/**
 * Test suite for the getEvidence function.
 */
describe('getEvidence', () => {
  // Reset mocks and populate the database before each test.
  beforeEach(() => {
    mockedGetUserId.mockClear();
    evidence.length = 0;
    // Add sample evidence for two different users.
    evidence.push(
      { id: '1', user_id: 'user-123', title: 'Evidence 1', media_type: 'image', file: '', secure_reference: '', created_at: '2023-01-01T00:00:00Z' },
      { id: '2', user_id: 'user-456', title: 'Evidence 2', media_type: 'image', file: '', secure_reference: '', created_at: '2023-01-02T00:00:00Z' },
      { id: '3', user_id: 'user-123', title: 'Evidence 3', media_type: 'image', file: '', secure_reference: '', created_at: '2023-01-03T00:00:00Z' }
    );
  });

  // Test case: should return 401 if the user is not authenticated.
  test('should return 401 if user is not authenticated', async () => {
    mockedGetUserId.mockReturnValue(null);
    const req = new NextRequest('http://localhost/api/evidence');

    const response = await getEvidence(req);
    // Expect the status to be 401 "Unauthorized".
    expect(response.status).toBe(401);
  });

  // Test case: should return the user's evidence, sorted by creation date.
  test("should return user's evidence sorted by creation date", async () => {
    mockedGetUserId.mockReturnValue('user-123');
    const req = new NextRequest('http://localhost/api/evidence');

    const response = await getEvidence(req);
    const responseBody = await response.json();

    // Expect the status to be 200 "OK".
    expect(response.status).toBe(200);
    // Expect to receive two evidence records for this user.
    expect(responseBody.length).toBe(2);
    // Expect the evidence to be sorted with the newest first.
    expect(responseBody[0].id).toBe('3');
    expect(responseBody[1].id).toBe('1');
  });
});
