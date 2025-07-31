import { render, screen } from '@testing-library/react';
import NavbarOfOrugallu from './NavbarOfOrugallu';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';
import { MemoryRouter } from 'react-router-dom';

test('renders logo and links', () => {
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null }}>
        <CartContext.Provider value={{ cart: [] }}>
          <NavbarOfOrugallu />
        </CartContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  expect(screen.getByText(/Items/i)).toBeInTheDocument();
});