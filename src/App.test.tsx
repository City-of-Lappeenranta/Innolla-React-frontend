import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders login dialog', () => {
  const { container } = render(<App />);
  expect(container).toHaveTextContent('Kirjaudu sisään');
});
