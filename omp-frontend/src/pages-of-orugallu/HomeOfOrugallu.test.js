import { render, screen } from '@testing-library/react';
import HomeOfOrugallu from './HomeOfOrugallu';
import { AuthContext } from '../orugallu-components/AuthContext';

test('renders hero heading for non-admin', () => {
  render(
    <AuthContext.Provider value={{ user: { role: 'user' } }}>
      <HomeOfOrugallu />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/Welcome to Miss Orugallu Ruchulu/i)).toBeInTheDocument();
});