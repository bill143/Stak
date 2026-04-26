import { describe, it, expect } from 'vitest';
import {
  deriveKey,
  generateSalt,
  encryptKey,
  decryptKey,
  generateCanary,
  verifyCanary,
} from '../../lib/crypto/vault';

const PASSWORD = 'correct horse battery staple';
const WRONG_PASSWORD = 'Tr0ub4dor&3';

/**
 * Vault keys are non-extractable, so we compare two keys by encrypting the
 * same plaintext with the same IV and checking the resulting ciphertexts.
 * AES-GCM is deterministic for fixed (key, iv, plaintext).
 */
async function fingerprint(key: CryptoKey): Promise<string> {
  const fixedIv = new Uint8Array(12);
  const data = new TextEncoder().encode('vault-key-fingerprint');
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: fixedIv },
    key,
    data,
  );
  return Buffer.from(new Uint8Array(ct)).toString('base64');
}

describe('vault crypto', () => {
  it('round-trips a plaintext through encryptKey -> decryptKey', async () => {
    const salt = generateSalt();
    const key = await deriveKey(PASSWORD, salt);

    const plaintext = 'sk-test-1234567890-secret-api-key';
    const { ciphertext, ivBase64 } = await encryptKey(plaintext, key);

    expect(ciphertext).toBeTypeOf('string');
    expect(ivBase64).toBeTypeOf('string');
    expect(ciphertext).not.toContain(plaintext);

    const decrypted = await decryptKey(ciphertext, ivBase64, key);
    expect(decrypted).toBe(plaintext);
  });

  it('verifies a canary encrypted with the matching key', async () => {
    const salt = generateSalt();
    const key = await deriveKey(PASSWORD, salt);

    const canary = await generateCanary(key);
    const ok = await verifyCanary(canary, key);

    expect(ok).toBe(true);
  });

  it('fails canary verification when the wrong password is used', async () => {
    const salt = generateSalt();
    const correctKey = await deriveKey(PASSWORD, salt);
    const wrongKey = await deriveKey(WRONG_PASSWORD, salt);

    const canary = await generateCanary(correctKey);
    const ok = await verifyCanary(canary, wrongKey);

    expect(ok).toBe(false);
  });

  it('produces different keys for different salts (same password)', async () => {
    const saltA = generateSalt();
    const saltB = generateSalt();
    expect(saltA).not.toBe(saltB);

    const keyA = await deriveKey(PASSWORD, saltA);
    const keyB = await deriveKey(PASSWORD, saltB);

    const rawA = await fingerprint(keyA);
    const rawB = await fingerprint(keyB);

    expect(rawA).not.toBe(rawB);
  });

  it('produces the same key for the same salt + password (deterministic)', async () => {
    const salt = generateSalt();

    const keyA = await deriveKey(PASSWORD, salt);
    const keyB = await deriveKey(PASSWORD, salt);

    const rawA = await fingerprint(keyA);
    const rawB = await fingerprint(keyB);

    expect(rawA).toBe(rawB);
  });
});
