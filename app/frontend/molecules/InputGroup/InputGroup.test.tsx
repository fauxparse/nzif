import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Input from '@/atoms/Input';

import InputGroup from '.';

describe('InputGroup', () => {
  it('renders a text input by default', () => {
    render(
      <InputGroup>
        <Input type="text" />
      </InputGroup>
    );
    expect(screen.getByRole('textbox').tagName).toBe('INPUT');
  });
});
