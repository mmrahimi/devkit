import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the DevKit heading and description', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'DevKit' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('A growing collection of practical developer utilities.')).toBeInTheDocument();
  });
});
