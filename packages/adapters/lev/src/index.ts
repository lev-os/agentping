import type { LevAdapter } from './contract.js';

import { createFsProjectionReader } from './projection-reader.js';

export * from './contract.js';
export { createFsProjectionReader } from './projection-reader.js';

export function createLevAdapter(opts: { readonly levRoot: string }): LevAdapter {
  return { projectionReader: createFsProjectionReader(opts) };
}
