const { authenticate } = require('../middleware/auth');

test('authenticate middleware should call next if user is authenticated', () => {
  const req = { user: { id: 1 } };
  const res = {};
  const next = jest.fn();
  authenticate(req, res, next);
  expect(next).toHaveBeenCalled();
});