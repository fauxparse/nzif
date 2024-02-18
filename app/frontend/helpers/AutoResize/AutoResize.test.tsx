import { render, screen } from '@testing-library/react';
import React from 'react';
import { Mock, vi } from 'vitest';

import AutoResize from '.';

describe('AutoResize', () => {
  let onResize: Mock<[HTMLElement], void>;

  describe('with a single input', () => {
    beforeEach(() => {
      onResize = vi.fn();

      render(
        <AutoResize onResize={onResize}>
          <input placeholder="Type…" />
        </AutoResize>
      );
    });

    it('calls onResize with the input', () => {
      expect(onResize).toHaveBeenCalledTimes(1);
      expect(onResize).toHaveBeenCalledWith(screen.getByRole('textbox'));
    });
  });

  describe('with a single input with no placeholder', () => {
    beforeEach(() => {
      onResize = vi.fn();

      render(
        <AutoResize onResize={onResize}>
          <input />
        </AutoResize>
      );
    });

    it('calls onResize with the input', () => {
      expect(onResize).toHaveBeenCalledTimes(1);
      expect(onResize).toHaveBeenCalledWith(screen.getByRole('textbox'));
    });
  });

  describe('with a single textarea', () => {
    beforeEach(() => {
      onResize = vi.fn();

      render(
        <AutoResize onResize={onResize}>
          <textarea />
        </AutoResize>
      );
    });

    it('calls onResize with the input', () => {
      expect(onResize).toHaveBeenCalledTimes(1);
      expect(onResize).toHaveBeenCalledWith(screen.getByRole('textbox'));
    });
  });
});
