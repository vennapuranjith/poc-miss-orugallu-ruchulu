import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../orugallu-components/AuthContext';
import { CartProvider } from '../orugallu-components/CartContext';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from './SearchResults';

test('renders search results heading', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <SearchResults />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getByText(/Results for/i)).toBeInTheDocument();
});