import { render, screen } from '@testing-library/react';
import Home from '../app/page';

test('renders the title', () => {
  render(<Home />);
  const titleElement = screen.getByText(/カタン/i);
  expect(titleElement).toBeInTheDocument();
});
