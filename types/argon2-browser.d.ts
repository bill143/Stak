declare module 'argon2-browser' {
  export const ArgonType: {
    Argon2d: 0;
    Argon2i: 1;
    Argon2id: 2;
  };

  export interface Argon2HashParams {
    pass: string | Uint8Array;
    salt: string | Uint8Array;
    time?: number;
    mem?: number;
    parallelism?: number;
    hashLen?: number;
    type?: 0 | 1 | 2;
    secret?: Uint8Array;
    ad?: Uint8Array;
  }

  export interface Argon2HashResult {
    hash: Uint8Array;
    hashHex: string;
    encoded: string;
  }

  export interface Argon2VerifyParams {
    pass: string | Uint8Array;
    encoded: string;
    type?: 0 | 1 | 2;
  }

  export function hash(params: Argon2HashParams): Promise<Argon2HashResult>;
  export function verify(params: Argon2VerifyParams): Promise<void>;
  export function unloadRuntime(): void;

  const argon2: {
    hash: typeof hash;
    verify: typeof verify;
    unloadRuntime: typeof unloadRuntime;
    ArgonType: typeof ArgonType;
  };

  export default argon2;
}
