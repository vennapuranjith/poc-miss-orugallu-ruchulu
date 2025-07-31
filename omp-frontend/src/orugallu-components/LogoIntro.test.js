import { render, screen } from '@testing-library/react';
import LogoIntro from './LogoIntro';

test('renders logo image', () => {
  render(<LogoIntro onComplete={() => {}} />);
  expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
});