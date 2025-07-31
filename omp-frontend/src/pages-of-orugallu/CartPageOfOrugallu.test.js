import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../orugallu-components/AuthContext';
import { CartProvider } from '../orugallu-components/CartContext';
import { MemoryRouter } from 'react-router-dom';
import CartPageOfOrugallu from './CartPageOfOrugallu';

test('shows empty cart message', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <CartPageOfOrugallu />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getByText(/Ika Modhaledadhama/i)).toBeInTheDocument();
});