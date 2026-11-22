import { describe, it, expect } from 'vitest';
import {
  DEFAULT_GROUPS,
  SEED_PROMPTS,
  seedCountByGroup,
} from '../../lib/seed/prompts';
import { AGENTS } from '../../lib/agents/profiles';
import { CATEGORIES } from '../../lib/validation/schemas';
import {
  checkPlaceholderConsistency,
  extractPlaceholderKeys,
} from '../../lib/utils/placeholders';

describe('default groups', () => {
  it('defines exactly the 7 default groups', () => {
    expect(DEFAULT_GROUPS).toHaveLength(7);
  });

  it('has unique keys and ascending positions', () => {
    const keys = DEFAULT_GROUPS.map((g) => g.key);
    expect(new Set(keys).size).toBe(7);
    const positions = DEFAULT_GROUPS.map((g) => g.position);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});

describe('seed prompts integrity', () => {
  it('references only known groups, agents, and categories', () => {
    const groupKeys = new Set(DEFAULT_GROUPS.map((g) => g.key));
    for (const p of SEED_PROMPTS) {
      expect(groupKeys.has(p.groupKey)).toBe(true);
      expect(AGENTS[p.primaryAgent]).toBeDefined();
      expect(CATEGORIES).toContain(p.category);
    }
  });

  it('keeps every template and its declared placeholders consistent', () => {
    for (const p of SEED_PROMPTS) {
      const result = checkPlaceholderConsistency(p.template, p.placeholders);
      expect(
        result.ok,
        `${p.title}: undeclared=${result.undeclared} unused=${result.unused}`,
      ).toBe(true);
    }
  });

  it('declares placeholders for every templated key', () => {
    for (const p of SEED_PROMPTS) {
      const used = extractPlaceholderKeys(p.template);
      const declared = p.placeholders.map((ph) => ph.key);
      expect(new Set(declared)).toEqual(new Set(used));
    }
  });

  it('covers every default group with at least one prompt', () => {
    const counts = seedCountByGroup();
    for (const g of DEFAULT_GROUPS) {
      expect(counts[g.key]).toBeGreaterThan(0);
    }
  });

  it('has non-empty core fields on every prompt', () => {
    for (const p of SEED_PROMPTS) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(0);
      expect(p.template.length).toBeGreaterThan(0);
      expect(p.howItWorks.length).toBeGreaterThan(0);
    }
  });
});
