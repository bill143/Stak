import argon2 from 'argon2-browser';

const CANARY_PLAINTEXT = 'STAK_VAULT_CANARY_v1';

const ARGON2_PARAMS = {
  time: 3,
  mem: 65536,
  parallelism: 4,
  hashLen: 32,
  type: argon2.ArgonType.Argon2id,
} as const;

function getCrypto(): Crypto {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c || !c.subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }
  return c;
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  if (typeof Buffer !== 'undefined') {
    const buf = Buffer.from(value, 'base64');
    const out = new Uint8Array(new ArrayBuffer(buf.length));
    out.set(buf);
    return out;
  }
  const binary = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function generateSalt(): string {
  const salt = new Uint8Array(16);
  getCrypto().getRandomValues(salt);
  return bytesToBase64(salt);
}

export async function deriveKey(
  masterPassword: string,
  saltBase64: string,
): Promise<CryptoKey> {
  const salt = base64ToBytes(saltBase64);
  const result = await argon2.hash({
    pass: masterPassword,
    salt,
    time: ARGON2_PARAMS.time,
    mem: ARGON2_PARAMS.mem,
    parallelism: ARGON2_PARAMS.parallelism,
    hashLen: ARGON2_PARAMS.hashLen,
    type: ARGON2_PARAMS.type,
  });

  const rawKey = new Uint8Array(new ArrayBuffer(result.hash.length));
  rawKey.set(result.hash);

  return getCrypto().subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptKey(
  plaintext: string,
  key: CryptoKey,
): Promise<{ ciphertext: string; ivBase64: string }> {
  const subtleCrypto = getCrypto();
  const iv = new Uint8Array(12);
  subtleCrypto.getRandomValues(iv);
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertextBuf = await subtleCrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded,
  );
  return {
    ciphertext: bytesToBase64(new Uint8Array(ciphertextBuf)),
    ivBase64: bytesToBase64(iv),
  };
}

export async function decryptKey(
  ciphertext: string,
  ivBase64: string,
  key: CryptoKey,
): Promise<string> {
  const ctBytes = base64ToBytes(ciphertext);
  const iv = base64ToBytes(ivBase64);
  const plaintextBuf = await getCrypto().subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ctBytes,
  );
  return new TextDecoder().decode(plaintextBuf);
}

export async function generateCanary(
  key: CryptoKey,
): Promise<{ ciphertext: string; ivBase64: string }> {
  return encryptKey(CANARY_PLAINTEXT, key);
}

export async function verifyCanary(
  canary: { ciphertext: string; ivBase64: string },
  key: CryptoKey,
): Promise<boolean> {
  try {
    const result = await decryptKey(canary.ciphertext, canary.ivBase64, key);
    return result === CANARY_PLAINTEXT;
  } catch {
    return false;
  }
}

export const CANARY_PLAINTEXT_VALUE = CANARY_PLAINTEXT;
