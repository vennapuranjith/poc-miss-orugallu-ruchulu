import { render, screen } from '@testing-library/react';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';
import { MemoryRouter } from 'react-router-dom';

test('redirects if not authenticated', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <PrivateRoute>
          <div>Protected</div>
        </PrivateRoute>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.queryByText(/Protected/i)).not.toBeInTheDocument();
});