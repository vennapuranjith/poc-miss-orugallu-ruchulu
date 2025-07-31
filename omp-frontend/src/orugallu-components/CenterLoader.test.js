import { render, screen } from '@testing-library/react';
import CenterLoader from './CenterLoader';

test('renders loader image', () => {
  render(<CenterLoader />);
  expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
});