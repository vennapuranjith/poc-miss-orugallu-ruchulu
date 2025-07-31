const request = require('supertest');
const app = require('../index');

describe('GET /api/items', () => {
  it('should return an array of items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});