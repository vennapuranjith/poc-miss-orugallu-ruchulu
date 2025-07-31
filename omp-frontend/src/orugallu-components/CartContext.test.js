import { render, screen } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

function TestCart() {
  const { cart, addToCart, clearCart } = useCart();
  return (
    <div>
      <span>Cart count: {cart.length}</span>
      <button onClick={() => addToCart({ id: 1, name: "item", quantity: 1 })}>Add</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}

test('CartProvider provides cart context', () => {
  render(
    <CartProvider>
      <TestCart />
    </CartProvider>
  );
  expect(screen.getByText(/Cart count:/i)).toBeInTheDocument();
});