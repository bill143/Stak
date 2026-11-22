// Stak V1 — tier limits and free-tier enforcement
// Source of truth: docs/SPEC.md Section 2.2 (feature matrix), 2.3 (rationale),
// and 13.5 (free tier enforcement + structured 402 error).

export type Tier = 'free' | 'pro';

/** Countable limits enforced server-side on create / AI calls. */
export type LimitKey =
  | 'prompts'
  | 'groups'
  | 'aiImprove'
  | 'aiGenerate'
  | 'vaultKeys';

/** Free tier ceilings. Pro is unlimited (represented as Infinity). */
export const FREE_LIMITS: Record<LimitKey, number> = {
  prompts: 25,
  groups: 3, // custom groups; the 7 seeded default groups don't count
  aiImprove: 5, // per calendar month
  aiGenerate: 5, // per calendar month
  vaultKeys: 5,
};

export const UPGRADE_URL = '/settings/subscription';

/** The maximum allowed for a given tier + limit. */
export function limitFor(tier: Tier, key: LimitKey): number {
  return tier === 'pro' ? Infinity : FREE_LIMITS[key];
}

/**
 * Structured error returned with HTTP 402 when a free user hits a ceiling.
 * Shape matches SPEC.md Section 13.5 so the client can render an upgrade modal.
 */
export interface LimitExceededError {
  error: 'limit_exceeded';
  limit: LimitKey;
  current: number;
  max: number;
  upgradeUrl: string;
}

/**
 * Check whether adding one more of `key` is allowed given the current count.
 * Returns `null` when allowed, or a structured error when the ceiling is hit.
 * `current` is the count BEFORE the new item is created.
 */
export function checkLimit(
  tier: Tier,
  key: LimitKey,
  current: number,
): LimitExceededError | null {
  const max = limitFor(tier, key);
  if (current < max) return null;

  return {
    error: 'limit_exceeded',
    limit: key,
    current,
    max: max === Infinity ? current : max,
    upgradeUrl: UPGRADE_URL,
  };
}

/** Boolean feature gates from the tier matrix (Section 2.2). */
export type FeatureKey =
  | 'allLayoutModes'
  | 'multiAgentVariants'
  | 'vaultCloudSync'
  | 'shareableLinks'
  | 'copyAsEnv'
  | 'allThemes'
  | 'customAccent'
  | 'prioritySupport';

const PRO_ONLY_FEATURES: ReadonlySet<FeatureKey> = new Set<FeatureKey>([
  'allLayoutModes',
  'multiAgentVariants',
  'vaultCloudSync',
  'shareableLinks',
  'copyAsEnv',
  'allThemes',
  'customAccent',
  'prioritySupport',
]);

/** Whether a tier may use a gated feature. */
export function canUse(tier: Tier, feature: FeatureKey): boolean {
  if (tier === 'pro') return true;
  return !PRO_ONLY_FEATURES.has(feature);
}

/**
 * Free users get exactly one agent variant (the primary). Pro unlocks all 8+.
 * Used to gate the "+ Add variant" affordance on the detail page.
 */
export function maxAgentVariants(tier: Tier): number {
  return tier === 'pro' ? Infinity : 1;
}

/**
 * Usage counters reset on a rolling 30-day window (SPEC.md Section 9.4). Given
 * the last reset timestamp, report whether counters are due to be zeroed.
 */
export function isUsageWindowExpired(usageResetAt: Date, now: Date = new Date()): boolean {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  return now.getTime() - usageResetAt.getTime() >= THIRTY_DAYS_MS;
}
