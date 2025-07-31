import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../orugallu-components/AuthContext';
import { CartProvider } from '../orugallu-components/CartContext';
import { MemoryRouter } from 'react-router-dom';
import ItemsOfOrugallu from './ItemsOfOrugallu';

test('renders category filter', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <ItemsOfOrugallu />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  const allButtons = screen.getAllByText(/All/i);
  expect(allButtons.length).toBeGreaterThan(0);
});