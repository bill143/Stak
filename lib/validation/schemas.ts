// Stak V1 — Zod validation schemas (shared source of truth for domain types)
// Backs the API routes in SPEC.md Sections 7, 8, 9. Inferred types are the
// canonical TypeScript shapes used across the app.

import { z } from 'zod';
import { AGENTS, type AgentId } from '../agents/profiles';
import { PROVIDERS, type ProviderId } from '../vault/providers';

// ---------------------------------------------------------------------------
// Enums derived from the canonical registries
// ---------------------------------------------------------------------------

const agentIds = Object.keys(AGENTS) as [AgentId, ...AgentId[]];
export const agentIdSchema = z.enum(agentIds);

const providerIds = Object.keys(PROVIDERS) as [ProviderId, ...ProviderId[]];
export const providerIdSchema = z.enum(providerIds);

/** Prompt categories. `other` is the fallback default. */
export const CATEGORIES = [
  'file-management',
  'coding',
  'writing',
  'research',
  'productivity',
  'data',
  'learning',
  'other',
] as const;
export type Category = (typeof CATEGORIES)[number];
export const categorySchema = z.enum(CATEGORIES);

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

export const placeholderSchema = z.object({
  key: z
    .string()
    .min(1)
    .regex(/^[A-Za-z0-9_-]+$/, 'Placeholder keys may use letters, digits, _ and -'),
  label: z.string().min(1).max(80),
  sample: z.string().max(2000),
});

export const promptVariantSchema = z.object({
  agent: agentIdSchema,
  template: z.string().min(1).max(20000),
  placeholders: z.array(placeholderSchema).default([]),
  howItWorks: z.array(z.string()).optional(),
  whyApplicable: z.string().max(2000).optional(),
});

// ---------------------------------------------------------------------------
// Prompt draft — the shape the AI Improve route receives and returns,
// and the editable surface of the Edit modal (SPEC.md 7.4, 9.1).
// ---------------------------------------------------------------------------

export const promptDraftSchema = z.object({
  title: z.string().min(1).max(140),
  description: z.string().max(500).optional(),
  whatItDoes: z.string().max(4000).optional(),
  howItWorks: z.array(z.string()).default([]),
  whyDC: z.string().max(2000).optional(),
  tags: z.array(z.string().max(40)).default([]),
  bestFor: z.array(z.string().max(80)).default([]),
  category: categorySchema.default('other'),
  icon: z.string().max(16).default('📄'),
  primaryAgent: agentIdSchema.default('claude-desktop'),
  template: z.string().min(1).max(20000),
  placeholders: z.array(placeholderSchema).default([]),
});
export type PromptDraft = z.infer<typeof promptDraftSchema>;

/** Creating a prompt requires a target group on top of the draft. */
export const createPromptSchema = promptDraftSchema.extend({
  groupId: z.string().uuid(),
  variants: z.array(promptVariantSchema).optional(),
});
export type CreatePromptInput = z.infer<typeof createPromptSchema>;

/** Updates are partial; id identifies the prompt. */
export const updatePromptSchema = createPromptSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;

// ---------------------------------------------------------------------------
// Groups (SPEC.md Section 7, 4)
// ---------------------------------------------------------------------------

export const createGroupSchema = z.object({
  name: z.string().min(1).max(60),
  icon: z.string().max(16).default('📁'),
  color: z.string().max(20).default('blue'),
});
export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = createGroupSchema.partial().extend({
  id: z.string().uuid(),
  position: z.number().int().min(0).optional(),
});
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;

// ---------------------------------------------------------------------------
// Vault key metadata (SPEC.md Section 8.4, 8.9)
// The encrypted blob + IV are produced client-side; the server only ever
// receives ciphertext and safe metadata — never the plaintext key.
// ---------------------------------------------------------------------------

export const createVaultKeySchema = z.object({
  providerId: providerIdSchema,
  displayName: z.string().min(1).max(80),
  encryptedBlob: z.string().min(1), // base64 ciphertext
  ivBase64: z.string().min(1),
  isLocked: z.boolean().default(false),
  projectTag: z.string().max(60).optional(),
  notes: z.string().max(2000).optional(),
});
export type CreateVaultKeyInput = z.infer<typeof createVaultKeySchema>;

// ---------------------------------------------------------------------------
// AI route request bodies (SPEC.md Sections 9.1–9.3)
// ---------------------------------------------------------------------------

export const aiImproveRequestSchema = z.object({
  promptDraft: promptDraftSchema,
});
export type AiImproveRequest = z.infer<typeof aiImproveRequestSchema>;

export const aiGenerateRequestSchema = z.object({
  userIdea: z.string().min(3).max(2000),
  targetGroup: z.union([z.literal('auto'), z.string().uuid()]).default('auto'),
  targetAgent: z.union([z.literal('auto'), agentIdSchema]).default('auto'),
});
export type AiGenerateRequest = z.infer<typeof aiGenerateRequestSchema>;

export const translateVariantRequestSchema = z.object({
  promptId: z.string().uuid(),
  fromAgent: agentIdSchema,
  toAgent: agentIdSchema,
});
export type TranslateVariantRequest = z.infer<typeof translateVariantRequestSchema>;

// ---------------------------------------------------------------------------
// Share links (SPEC.md Section 10)
// ---------------------------------------------------------------------------

export const createShareLinkSchema = z.object({
  promptId: z.string().uuid(),
  expiresAt: z.string().datetime().optional(),
});
export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>;
