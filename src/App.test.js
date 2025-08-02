import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders XDisplayName component', () => {
  render(<App />);
  expect(screen.getByText('Display Full Name')).toBeInTheDocument();
});
