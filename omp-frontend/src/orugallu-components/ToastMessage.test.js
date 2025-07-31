import { render, screen } from '@testing-library/react';
import ToastMessage from './ToastMessage';

test('renders toast message', () => {
  render(<ToastMessage message="Test Toast" />);
  expect(screen.getByText(/Test Toast/i)).toBeInTheDocument();
});