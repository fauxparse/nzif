// tests.d.ts

import 'vitest';

declare global {
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Assertion {}
  }
}
