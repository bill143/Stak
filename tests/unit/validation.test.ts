import { describe, it, expect } from 'vitest';
import {
  promptDraftSchema,
  createPromptSchema,
  aiGenerateRequestSchema,
  translateVariantRequestSchema,
  createVaultKeySchema,
  placeholderSchema,
} from '../../lib/validation/schemas';

describe('promptDraftSchema', () => {
  it('applies defaults for optional collection fields', () => {
    const parsed = promptDraftSchema.parse({
      title: 'Test prompt',
      template: 'Do {thing}',
    });
    expect(parsed.category).toBe('other');
    expect(parsed.primaryAgent).toBe('claude-desktop');
    expect(parsed.icon).toBe('📄');
    expect(parsed.howItWorks).toEqual([]);
    expect(parsed.tags).toEqual([]);
    expect(parsed.placeholders).toEqual([]);
  });

  it('rejects an empty template', () => {
    expect(promptDraftSchema.safeParse({ title: 'x', template: '' }).success).toBe(
      false,
    );
  });

  it('rejects an unknown agent', () => {
    const result = promptDraftSchema.safeParse({
      title: 'x',
      template: 'y',
      primaryAgent: 'not-a-real-agent',
    });
    expect(result.success).toBe(false);
  });
});

describe('placeholderSchema', () => {
  it('rejects keys with illegal characters', () => {
    expect(
      placeholderSchema.safeParse({ key: 'bad key!', label: 'l', sample: 's' })
        .success,
    ).toBe(false);
  });

  it('accepts keys with underscores and hyphens', () => {
    expect(
      placeholderSchema.safeParse({ key: 'file_name-2', label: 'l', sample: 's' })
        .success,
    ).toBe(true);
  });
});

describe('createPromptSchema', () => {
  it('requires a valid groupId uuid', () => {
    const bad = createPromptSchema.safeParse({
      title: 'x',
      template: 'y',
      groupId: 'not-a-uuid',
    });
    expect(bad.success).toBe(false);
  });
});

describe('aiGenerateRequestSchema', () => {
  it('defaults targetGroup and targetAgent to auto', () => {
    const parsed = aiGenerateRequestSchema.parse({ userIdea: 'organize my files' });
    expect(parsed.targetGroup).toBe('auto');
    expect(parsed.targetAgent).toBe('auto');
  });

  it('rejects an idea that is too short', () => {
    expect(aiGenerateRequestSchema.safeParse({ userIdea: 'a' }).success).toBe(false);
  });
});

describe('translateVariantRequestSchema', () => {
  it('accepts two valid agents', () => {
    const parsed = translateVariantRequestSchema.parse({
      promptId: '11111111-1111-4111-8111-111111111111',
      fromAgent: 'claude-desktop',
      toAgent: 'chatgpt',
    });
    expect(parsed.toAgent).toBe('chatgpt');
  });
});

describe('createVaultKeySchema', () => {
  it('accepts ciphertext + iv metadata and defaults isLocked false', () => {
    const parsed = createVaultKeySchema.parse({
      providerId: 'anthropic',
      displayName: 'Production',
      encryptedBlob: 'YmxvYg==',
      ivBase64: 'aXY=',
    });
    expect(parsed.isLocked).toBe(false);
  });
});
