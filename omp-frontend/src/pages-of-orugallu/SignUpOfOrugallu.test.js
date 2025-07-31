import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../orugallu-components/AuthContext';
import { CartProvider } from '../orugallu-components/CartContext';
import { MemoryRouter } from 'react-router-dom';
import SignUpOfOrugallu from './SignUpOfOrugallu';

test('renders signup heading', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <SignUpOfOrugallu />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getByText(/Signup for Miss Orugallu Ruchulu/i)).toBeInTheDocument();
});