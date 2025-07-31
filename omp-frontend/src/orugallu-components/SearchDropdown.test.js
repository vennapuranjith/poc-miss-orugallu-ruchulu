import { render, screen, fireEvent } from '@testing-library/react';
import SearchDropdown from './SearchDropdown';

test('renders no items found', () => {
  render(<SearchDropdown items={[]} onAddToCart={jest.fn()} onClear={jest.fn()} />);
  expect(screen.getByText(/No items found/i)).toBeInTheDocument();
});

test('renders items and handles add', () => {
  const onAddToCart = jest.fn();
  render(
    <SearchDropdown
      items={[{ id: 1, name: "Test", price: 10, imageUrl: "img.jpg" }]}
      onAddToCart={onAddToCart}
      onClear={jest.fn()}
    />
  );
  expect(screen.getByText(/Test/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Add to Cart/i));
  expect(onAddToCart).toHaveBeenCalled();
});