/**
 * Vitest global setup for argon2-browser.
 *
 * argon2-browser ships an Emscripten-compiled WASM module. In Node 20+,
 * `globalThis.fetch` exists, which makes Emscripten's environment detection
 * try to load the WASM via HTTP from a relative path — that blows up.
 *
 * The Emscripten runtime honours `self.Module.wasmBinary` if it is set
 * before the module loads. We pre-read the WASM from disk and stash it
 * there, which short-circuits the fetch path and instantiates from the
 * pre-loaded ArrayBuffer instead.
 */
import fs from 'node:fs';
import path from 'node:path';

const wasmPath = path.resolve(
  process.cwd(),
  'node_modules/argon2-browser/dist/argon2.wasm',
);

const wasmBinary = fs.readFileSync(wasmPath);

const g = globalThis as unknown as {
  self?: unknown;
  Module?: { wasmBinary: Uint8Array };
};

if (typeof g.self === 'undefined') {
  g.self = globalThis;
}

g.Module = { wasmBinary: new Uint8Array(wasmBinary) };
