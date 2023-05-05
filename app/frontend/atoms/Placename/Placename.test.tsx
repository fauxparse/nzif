import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Placename from '.';

describe('Placename', () => {
  it('shows the traditional name by default', () => {
    render(<Placename name="Wellington" traditionalName="Te-Whanganui-a-Tara" />);
    expect(screen.getByText('Te-Whanganui-a-Tara')).toBeInTheDocument();
    expect(screen.queryByText('Wellington')).not.toBeInTheDocument();
  });
});
