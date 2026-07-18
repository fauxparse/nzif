// tests.d.ts

import 'vitest';

declare global {
  namespace Vi {
    // eslint-disable-next-line typescript/no-empty-interface:
    interface Assertion {}
  }
}
