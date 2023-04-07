import { ComponentPropsWithoutRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import Button from '.';

describe('Button', () => {
  it('renders a button by default', () => {
    render(<Button>button</Button>);
    expect(screen.getByRole('button').tagName).toBe('BUTTON');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button text="button" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('can render a link', () => {
    render(
      <Button as="a" href="https://example.com">
        button
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('A');
    expect(button).toHaveAttribute('href', 'https://example.com');
  });

  it('can render a custom component', () => {
    const CustomComponent = (props: ComponentPropsWithoutRef<'div'>) => (
      <div data-custom="button" {...props} />
    );
    render(<Button as={CustomComponent}>button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-custom', 'button');
  });

  it('handles refs', () => {
    render(<Button ref={(el) => el?.setAttribute('data-cool', 'beans')}>button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-cool', 'beans');
  });

  it('wraps plain-text children in a span', () => {
    render(<Button>button</Button>);
    expect(screen.getByText('button').tagName).toBe('SPAN');
  });

  it('does not wrap element children', () => {
    render(
      <Button>
        <b>button</b>
      </Button>
    );
    expect(screen.getByText('button').parentElement).toHaveClass('button');
  });

  it('has a loading state', () => {
    render(<Button loading text="button" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  describe('primary', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button primary large text="button" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
