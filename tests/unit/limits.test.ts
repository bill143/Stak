import { describe, it, expect } from 'vitest';
import {
  checkLimit,
  limitFor,
  canUse,
  maxAgentVariants,
  isUsageWindowExpired,
  FREE_LIMITS,
  UPGRADE_URL,
} from '../../lib/billing/limits';

describe('limitFor', () => {
  it('returns the free ceiling for free users', () => {
    expect(limitFor('free', 'prompts')).toBe(25);
    expect(limitFor('free', 'vaultKeys')).toBe(5);
  });

  it('is unlimited for pro users', () => {
    expect(limitFor('pro', 'prompts')).toBe(Infinity);
  });
});

describe('checkLimit', () => {
  it('allows a free user below the ceiling', () => {
    expect(checkLimit('free', 'prompts', 24)).toBeNull();
  });

  it('blocks a free user at the ceiling with the structured 402 shape', () => {
    const err = checkLimit('free', 'prompts', 25);
    expect(err).toEqual({
      error: 'limit_exceeded',
      limit: 'prompts',
      current: 25,
      max: 25,
      upgradeUrl: UPGRADE_URL,
    });
  });

  it('blocks the 6th vault key — the strongest converter', () => {
    expect(checkLimit('free', 'vaultKeys', FREE_LIMITS.vaultKeys)).not.toBeNull();
  });

  it('never blocks a pro user', () => {
    expect(checkLimit('pro', 'prompts', 10_000)).toBeNull();
  });
});

describe('canUse feature gates', () => {
  it('locks pro-only features for free users', () => {
    expect(canUse('free', 'shareableLinks')).toBe(false);
    expect(canUse('free', 'allLayoutModes')).toBe(false);
    expect(canUse('free', 'vaultCloudSync')).toBe(false);
  });

  it('unlocks everything for pro users', () => {
    expect(canUse('pro', 'shareableLinks')).toBe(true);
    expect(canUse('pro', 'copyAsEnv')).toBe(true);
  });
});

describe('maxAgentVariants', () => {
  it('gives free users a single agent and pro users unlimited', () => {
    expect(maxAgentVariants('free')).toBe(1);
    expect(maxAgentVariants('pro')).toBe(Infinity);
  });
});

describe('isUsageWindowExpired', () => {
  it('is false within 30 days', () => {
    const reset = new Date('2026-06-01T00:00:00Z');
    const now = new Date('2026-06-15T00:00:00Z');
    expect(isUsageWindowExpired(reset, now)).toBe(false);
  });

  it('is true after 30 days', () => {
    const reset = new Date('2026-05-01T00:00:00Z');
    const now = new Date('2026-06-15T00:00:00Z');
    expect(isUsageWindowExpired(reset, now)).toBe(true);
  });
});
