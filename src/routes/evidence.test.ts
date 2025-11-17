import request from 'supertest';
import app from '../index';
import { evidence } from '../services/evidenceService';

describe('Evidence API', () => {
  beforeEach(() => {
    evidence.length = 0;
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post('/evidence').send({});
    expect(res.status).toBe(401);
  });

  it('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .post('/evidence')
      .set('Authorization', 'Bearer invalid-token')
      .send({});
    expect(res.status).toBe(401);
  });

  it('should create evidence', async () => {
    const res = await request(app)
      .post('/evidence')
      .set('Authorization', 'Bearer test-user')
      .send({
        title: 'Test Evidence',
        media_type: 'video',
        file: {
          name: 'test.mp4',
          extension: 'mp4',
          size: 12345,
        },
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Evidence');
    expect(res.body.user_id).toBe('test-user');
  });

  it('should not create evidence with invalid media type', async () => {
    const res = await request(app)
      .post('/evidence')
      .set('Authorization', 'Bearer test-user')
      .send({
        title: 'Test Evidence',
        media_type: 'invalid',
        file: {
          name: 'test.mp4',
          extension: 'mp4',
          size: 12345,
        },
      });
    expect(res.status).toBe(400);
  });

  it('should not create evidence with missing fields', async () => {
    const res = await request(app)
      .post('/evidence')
      .set('Authorization', 'Bearer test-user')
      .send({
        title: 'Test Evidence',
      });
    expect(res.status).toBe(400);
  });

  it('should get evidence for a user', async () => {
    await request(app)
      .post('/evidence')
      .set('Authorization', 'Bearer test-user')
      .send({
        title: 'Test Evidence',
        media_type: 'video',
        file: {
          name: 'test.mp4',
          extension: 'mp4',
          size: 12345,
        },
      });

    const res = await request(app)
      .get('/evidence')
      .set('Authorization', 'Bearer test-user');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Test Evidence');
  });

  it('should not get evidence for another user', async () => {
    await request(app)
      .post('/evidence')
      .set('Authorization', 'Bearer another-user')
      .send({
        title: 'Test Evidence',
        media_type: 'video',
        file: {
          name: 'test.mp4',
          extension: 'mp4',
          size: 12345,
        },
      });

    const res = await request(app)
      .get('/evidence')
      .set('Authorization', 'Bearer test-user');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});
