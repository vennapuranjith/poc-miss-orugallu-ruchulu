import { render, screen } from '@testing-library/react';
import FooterOfOrugallu from './FooterOfOrugallu';

test('renders copyright', () => {
  render(<FooterOfOrugallu />);
  expect(screen.getByText(/Miss Orugallu Ruchulu/i)).toBeInTheDocument();
});