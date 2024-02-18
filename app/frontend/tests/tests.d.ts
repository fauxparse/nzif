// tests.d.ts

import 'vitest';

declare global {
  namespace Vi {
    // biome-ignore lint/suspicious/noEmptyInterface:
    interface Assertion {}
  }
}
