import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

import 'vitest-axe/extend-expect';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);
expect.extend(axeMatchers);

global.CSS = {
  supports: () => false,
  escape: (value) => value,
};

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
