import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../orugallu-components/AuthContext';
import { CartProvider } from '../orugallu-components/CartContext';
import { MemoryRouter } from 'react-router-dom';
import LandingPageOfOrugallu from './LandingPageOfOrugallu';

test('renders landing title', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <LandingPageOfOrugallu />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getByText(/Welcome to Miss Orugallu Ruchulu/i)).toBeInTheDocument();
});