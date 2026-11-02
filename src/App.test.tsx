import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('DevKit home', () => {
  it('introduces DevKit and links to the available Stacker tool', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Useful little tools/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Stacker/ })).toHaveAttribute('href', '/tools/stacker');
    expect(screen.getByRole('link', { name: 'DevKit home' })).toHaveAttribute('href', '/');
  });
});
