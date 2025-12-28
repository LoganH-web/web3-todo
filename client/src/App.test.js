import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header and connect button', () => {
  render(<App />);
  expect(screen.getByText(/Web3 To.?Do/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
});
