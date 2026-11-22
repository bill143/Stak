import { describe, it, expect } from 'vitest';
import {
  detectProvider,
  maskKey,
  PROVIDERS,
  listProviders,
} from '../../lib/vault/providers';

describe('vault provider detection', () => {
  it('detects the most specific prefix first (OpenRouter before OpenAI)', () => {
    expect(detectProvider('sk-or-v1-abc123def456')).toBe('openrouter');
  });

  it('detects Anthropic keys before the broad sk- fallback', () => {
    expect(detectProvider('sk-ant-api03-XXXXXXXX')).toBe('anthropic');
  });

  it('falls back to OpenAI for a plain sk- key', () => {
    expect(detectProvider('sk-proj-abcdefghijklmnop')).toBe('openai');
  });

  it.each([
    ['xi-1234567890', 'elevenlabs'],
    ['hf_ABCDEFGHIJ', 'huggingface'],
    ['gsk_abcDEF123', 'groq'],
  ] as const)('detects %s as %s', (key, expected) => {
    expect(detectProvider(key)).toBe(expected);
  });

  it('trims surrounding whitespace before detecting', () => {
    expect(detectProvider('   sk-ant-xyz  ')).toBe('anthropic');
  });

  it('returns null for an unknown key shape', () => {
    expect(detectProvider('totally-random-token')).toBeNull();
  });

  it('returns null for an empty key', () => {
    expect(detectProvider('   ')).toBeNull();
  });
});

describe('maskKey', () => {
  it('keeps the provider prefix and last 4 chars', () => {
    expect(maskKey('sk-ant-api03-secret8k2j')).toBe('sk-ant-...8k2j');
  });

  it('never reveals the middle of the key', () => {
    const masked = maskKey('sk-or-v1-abcdef1234567890');
    expect(masked).toContain('...');
    expect(masked).not.toContain('abcdef');
  });

  it('fully redacts very short values', () => {
    expect(maskKey('sk-12')).toBe('••••');
  });
});

describe('provider registry', () => {
  it('exposes a dashboard URL and (where applicable) a test endpoint', () => {
    expect(PROVIDERS.anthropic.keyDashboardUrl).toContain('console.anthropic.com');
    expect(PROVIDERS.anthropic.testEndpoint?.method).toBe('POST');
    expect(PROVIDERS.openai.testEndpoint?.method).toBe('GET');
  });

  it('lists every provider including custom', () => {
    const ids = listProviders().map((p) => p.id);
    expect(ids).toContain('custom');
    expect(ids).toContain('ollama');
    expect(ids.length).toBe(Object.keys(PROVIDERS).length);
  });
});
