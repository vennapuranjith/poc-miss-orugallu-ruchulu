import { render, screen, fireEvent } from '@testing-library/react';
import ItemCard from './ItemCard';
import { CartContext } from './CartContext';

test('renders item and adds to cart', () => {
  const addToCart = jest.fn();
  render(
    <CartContext.Provider value={{ addToCart }}>
      <ItemCard id={1} name="Test Item" price={100} description="desc" imageUrl="img.jpg" />
    </CartContext.Provider>
  );
  expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Add to Cart/i));
  expect(addToCart).toHaveBeenCalled();
});