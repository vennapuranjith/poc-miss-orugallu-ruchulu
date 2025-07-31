import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../orugallu-components/AuthContext';
import { CartProvider } from '../orugallu-components/CartContext';
import { MemoryRouter } from 'react-router-dom';
import CheckoutPageOfOrugallu from './CheckoutPageOfOrugallu';

test('renders checkout heading', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <CheckoutPageOfOrugallu />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
});