import request from 'supertest';
import app from '../index';
import { evidence } from '../services/evidenceService';
import { createShareToken } from '../services/reportService';

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

  it('should generate an empty report if user has no evidence', async () => {
    const res = await request(app)
      .get('/reports')
      .set('Authorization', 'Bearer test-user');

    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe('test-user');
    expect(res.body.evidence.length).toBe(0);
  });

  it('should generate a share link and allow fetching the report', async () => {
    await request(app)
      .post('/evidence')
      .set('Authorization', 'Bearer test-user')
      .send({
        title: 'Shareable Evidence',
        media_type: 'text',
        file: { name: 'report.txt', extension: 'txt', size: 100 },
      });

    const shareRes = await request(app)
      .post('/reports/share')
      .set('Authorization', 'Bearer test-user');

    expect(shareRes.status).toBe(200);
    expect(shareRes.body.share_url).toBeDefined();

    // Extract the token from the URL
    const shareUrl = new URL(shareRes.body.share_url);
    const token = shareUrl.pathname.split('/').pop();

    const reportRes = await request(app).get(`/share/${token}`);
    expect(reportRes.status).toBe(200);
    expect(reportRes.body.user_id).toBe('test-user');
    expect(reportRes.body.evidence.length).toBe(1);
    expect(reportRes.body.evidence[0].title).toBe('Shareable Evidence');
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

    const token = createShareToken('test-user');

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
    const token = createShareToken('test-user');

    await request(app).get(`/share/${token}`);
    const res = await request(app).get(`/share/${token}`);

    expect(res.status).toBe(404);
  });

  it('should not get a shared report with an expired token', async () => {
    const token = createShareToken('test-user', 1); // expires in 1ms

    await new Promise(r => setTimeout(r, 10));

    const res = await request(app).get(`/share/${token}`);

    expect(res.status).toBe(404);
  });
});
