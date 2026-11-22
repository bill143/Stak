import { describe, it, expect } from 'vitest';
import {
  extractJson,
  providerForModel,
  MODELS,
} from '../../lib/ai/providers';
import {
  improvePromptSystemPrompt,
  generatePromptSystemPrompt,
  translateVariantSystemPrompt,
} from '../../lib/ai/prompts';

describe('extractJson', () => {
  it('parses a bare JSON object', () => {
    expect(extractJson('{"a":1}')).toEqual({ a: 1 });
  });

  it('parses JSON wrapped in a ```json fence', () => {
    const raw = 'Here you go:\n```json\n{"title":"X"}\n```\nHope that helps!';
    expect(extractJson(raw)).toEqual({ title: 'X' });
  });

  it('extracts the first balanced object amid prose', () => {
    const raw = 'Sure! {"nested":{"k":"v"},"n":2} done';
    expect(extractJson(raw)).toEqual({ nested: { k: 'v' }, n: 2 });
  });

  it('does not get confused by braces inside strings', () => {
    const raw = '{"text":"a } b { c"}';
    expect(extractJson(raw)).toEqual({ text: 'a } b { c' });
  });

  it('throws when no JSON object is present', () => {
    expect(() => extractJson('no json here')).toThrow();
  });
});

describe('providerForModel', () => {
  it('routes claude models to anthropic', () => {
    expect(providerForModel(MODELS.improve)).toBe('anthropic');
    expect(providerForModel('claude-sonnet-4-5')).toBe('anthropic');
  });

  it('routes gpt models to openai', () => {
    expect(providerForModel('gpt-4o-mini')).toBe('openai');
  });
});

describe('system prompts', () => {
  it('improve prompt instructs JSON-only output and placeholder preservation', () => {
    expect(improvePromptSystemPrompt).toMatch(/JSON/i);
    expect(improvePromptSystemPrompt).toMatch(/placeholder/i);
    expect(improvePromptSystemPrompt).toContain('claude-desktop');
  });

  it('generate prompt lists the provided groups', () => {
    const sp = generatePromptSystemPrompt([
      { id: 'g1', name: 'File Organization' },
      { id: 'g2', name: 'Coding & Development' },
    ]);
    expect(sp).toContain('g1: File Organization');
    expect(sp).toContain('g2: Coding & Development');
    expect(sp).toContain('groupId');
  });

  it('translate prompt embeds both agents capabilities and pins target id', () => {
    const sp = translateVariantSystemPrompt('claude-desktop', 'chatgpt');
    expect(sp).toContain('Claude Desktop');
    expect(sp).toContain('ChatGPT');
    expect(sp).toContain('"agent": "chatgpt"');
  });
});
