import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Input from '.';

describe('Input', () => {
  it('renders a text input by default', () => {
    render(<Input type="text" />);
    expect(screen.getByRole('textbox').tagName).toBe('INPUT');
  });
});
