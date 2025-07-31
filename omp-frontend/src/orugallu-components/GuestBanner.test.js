import { render, screen } from '@testing-library/react';
import GuestBanner from './GuestBanner';
import { AuthContext } from './AuthContext';

test('shows banner for guest', () => {
  render(
    <AuthContext.Provider value={{ user: null }}>
      <GuestBanner />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/Sign up today/i)).toBeInTheDocument();
});

test('hides banner for logged in user', () => {
  render(
    <AuthContext.Provider value={{ user: { username: "test" } }}>
      <GuestBanner />
    </AuthContext.Provider>
  );
  expect(screen.queryByText(/Sign up today/i)).not.toBeInTheDocument();
});