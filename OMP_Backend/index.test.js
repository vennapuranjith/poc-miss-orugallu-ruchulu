const request = require('supertest');
const app = require('../index'); // Make sure your Express app is exported

describe('Basic API health check', () => {
  it('should respond to GET / with 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});