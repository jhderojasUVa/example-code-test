import request from 'supertest';
import app from '../index';
import { evidence } from '../services/evidenceService';

describe('Reports API', () => {
  beforeEach(() => {
    evidence.length = 0;
  });

  it('should generate a report', async () => {
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
      .get('/reports')
      .set('Authorization', 'Bearer test-user');

    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe('test-user');
    expect(res.body.evidence.length).toBe(1);
  });

  it('should generate a share link', async () => {
    const res = await request(app)
      .post('/reports/share')
      .set('Authorization', 'Bearer test-user');

    expect(res.status).toBe(200);
    expect(res.body.share_url).toBeDefined();
  });

  it('should get a shared report', async () => {
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

    const shareRes = await request(app)
      .post('/reports/share')
      .set('Authorization', 'Bearer test-user');

    const shareUrl = shareRes.body.share_url;
    const token = shareUrl.split('/').pop();

    const res = await request(app).get(`/share/${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe('test-user');
    expect(res.body.evidence.length).toBe(1);
  });

  it('should not get a shared report with an invalid token', async () => {
    const res = await request(app).get('/share/invalid-token');
    expect(res.status).toBe(404);
  });

  it('should not get a shared report twice', async () => {
    const shareRes = await request(app)
      .post('/reports/share')
      .set('Authorization', 'Bearer test-user');

    const shareUrl = shareRes.body.share_url;
    const token = shareUrl.split('/').pop();

    await request(app).get(`/share/${token}`);
    const res = await request(app).get(`/share/${token}`);

    expect(res.status).toBe(404);
  });
});
