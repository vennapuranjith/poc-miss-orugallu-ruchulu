import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

function TestComponent() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span>{user ? user.username : "No user"}</span>
      <button onClick={() => login({ username: "test" }, "token")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

test('AuthProvider provides user context', () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
  expect(screen.getByText(/No user/i)).toBeInTheDocument();
});