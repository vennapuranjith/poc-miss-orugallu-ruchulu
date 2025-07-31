const request = require('supertest');
const app = require('../index');

describe('GET /api/orders', () => {
  it('should require authentication', async () => {
    const res = await request(app).get('/api/orders');
    expect([401, 403]).toContain(res.statusCode); // Adjust based on your auth logic
  });
});