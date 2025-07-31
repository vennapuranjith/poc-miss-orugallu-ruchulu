import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from './CategoryFilter';

test('renders all categories and handles selection', () => {
  const handleSelect = jest.fn();
  render(<CategoryFilter selected="all" onSelect={handleSelect} />);
  expect(screen.getByText(/All/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Curries/i));
  expect(handleSelect).toHaveBeenCalled();
});