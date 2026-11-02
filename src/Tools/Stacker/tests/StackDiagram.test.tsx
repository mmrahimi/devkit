import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StackDiagram } from '../components/StackDiagram';

describe('StackDiagram', () => {
  it('shows the chosen technologies, logos, categories, and connecting arrows in catalogue order', () => {
    render(<StackDiagram selections={{ testing: 'vitest', database: 'postgresql', frontend: 'react' }} />);

    const flow = screen.getByLabelText('Selected technologies in catalogue order');
    const cards = within(flow).getAllByRole('article');

    expect(cards).toHaveLength(3);
    expect(cards.map((card) => within(card).getByText(/React|PostgreSQL|Vitest/).textContent)).toEqual([
      'React', 'PostgreSQL', 'Vitest',
    ]);
    expect(within(flow).getAllByRole('img', { name: /Next technology in the stack/ })).toHaveLength(2);
    expect(within(flow).getAllByRole('img').map((image) => image.getAttribute('aria-label'))).toEqual([
      'React', 'Next technology in the stack',
      'PostgreSQL', 'Next technology in the stack',
      'Vitest',
    ]);
    expect(within(flow).getByText('Frontend framework')).toBeInTheDocument();
    expect(within(flow).getByText('Database')).toBeInTheDocument();
    expect(within(flow).getByText('Testing')).toBeInTheDocument();
  });

  it('identifies a technology with its generated logo and name when no brand logo exists', () => {
    render(<StackDiagram selections={{ api: 'rest' }} />);

    expect(screen.getByRole('img', { name: 'REST' })).toBeInTheDocument();
    expect(screen.getByText('REST')).toBeInTheDocument();
    expect(screen.getByText('API style')).toBeInTheDocument();
  });

  it('shows all ten selected technologies and connects each to the next without adding a layers label', () => {
    render(<StackDiagram selections={{
      frontend: 'react',
      backend: 'django',
      database: 'postgresql',
      'data-toolkit': 'prisma',
      styling: 'tailwind',
      hosting: 'vercel',
      caching: 'redis',
      api: 'rest',
      authentication: 'auth0',
      testing: 'vitest',
    }} />);

    const flow = screen.getByLabelText('Selected technologies in catalogue order');
    expect(within(flow).getAllByRole('article')).toHaveLength(10);
    expect(within(flow).getAllByRole('img', { name: 'Next technology in the stack' })).toHaveLength(9);
    expect(screen.queryByText(/layers?/i)).not.toBeInTheDocument();
  });
});
