const request = require('supertest');
const app = require('../index');

describe('POST /api/users/login', () => {
  it('should fail with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'wrong@example.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });
});