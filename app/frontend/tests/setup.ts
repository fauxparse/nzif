import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

global.CSS = {
  supports: () => false,
  escape: (value: string) => value,
} as unknown as typeof CSS;

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(cleanup);

Object.defineProperties(MouseEvent.prototype, {
  offsetX: {
    get() {
      return this.clientX;
    },
  },
  offsetY: {
    get() {
      return this.clientY;
    },
  },
});

global.ResizeObserver = require('resize-observer-polyfill');

require('intersection-observer');
