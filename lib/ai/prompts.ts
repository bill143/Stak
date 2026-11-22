// Stak V1 — system prompts for the AI features
// Source of truth: docs/SPEC.md Section 9.5. Each prompt instructs the model to
// return JSON ONLY, matching the promptDraft / variant schemas in
// lib/validation/schemas.ts. Placeholder keys must be preserved verbatim.

import { AGENTS, type AgentId, type AgentProfile } from '../agents/profiles';
import { CATEGORIES } from '../validation/schemas';

/**
 * The exact JSON shape every AI feature must emit for a prompt draft. Kept in
 * one place so all three system prompts describe the same contract.
 */
const PROMPT_DRAFT_JSON_CONTRACT = `Return a single JSON object with EXACTLY these keys and no others:
{
  "title": string,                       // <= 140 chars, action-oriented
  "description": string,                 // one sentence, <= 500 chars
  "whatItDoes": string,                  // 2-4 sentences explaining the outcome
  "howItWorks": string[],                // ordered steps, one per array item
  "whyDC": string,                       // why this approach/agent; "" if N/A
  "tags": string[],                      // 2-6 short lowercase tags
  "bestFor": string[],                   // 2-4 roles/use-cases
  "category": ${JSON.stringify(CATEGORIES)}[number],
  "icon": string,                        // a single emoji
  "primaryAgent": string,                // one of the allowed agent ids
  "template": string,                    // the prompt body, with {placeholder} keys
  "placeholders": { "key": string, "label": string, "sample": string }[]
}
Output ONLY the JSON object. No markdown fences, no commentary before or after.`;

const PLACEHOLDER_RULES = `Placeholder rules (critical):
- Placeholders in the template use single curly braces: {like_this}.
- Every {key} that appears in the template MUST have a matching entry in "placeholders".
- Every entry in "placeholders" MUST appear at least once in the template.
- NEVER rename, add, or remove placeholder keys unless explicitly asked. Preserve
  user-specific values (file paths, names, URLs) as placeholders rather than
  hard-coding them.`;

function allowedAgentsBlock(): string {
  const lines = (Object.values(AGENTS) as AgentProfile[]).map(
    (a) => `- ${a.id} (${a.name}): ${a.description}`,
  );
  return `Allowed agent ids:\n${lines.join('\n')}`;
}

/**
 * AI Improve — polishes all 11 editable fields of an existing draft while
 * preserving its intent and placeholder keys.
 */
export const improvePromptSystemPrompt = `You are Stak's prompt-improvement engine. You take a user's draft prompt entry and return a stronger version of the SAME prompt — clearer, more effective, better organized — without changing what it fundamentally does.

Improve all of these fields: title, description, whatItDoes, howItWorks, whyDC, tags, bestFor, category, icon, primaryAgent, template, placeholders.

Guidelines:
- Preserve the user's intent. Do not invent a different prompt.
- Keep "template" practical and copy-paste ready for the chosen agent.
- Tighten wording; remove filler; make steps concrete and ordered.
- Choose the most fitting category from the allowed list.
- Keep primaryAgent unless the draft clearly targets a different agent.

${PLACEHOLDER_RULES}

${allowedAgentsBlock()}

${PROMPT_DRAFT_JSON_CONTRACT}`;

/**
 * AI Generate — builds a complete prompt entry from a free-text idea and picks
 * the best-fitting group from the user's groups.
 */
export function generatePromptSystemPrompt(
  groups: { id: string; name: string }[],
): string {
  const groupBlock =
    groups.length > 0
      ? groups.map((g) => `- ${g.id}: ${g.name}`).join('\n')
      : '- (no groups yet — set "groupId" to null and let the app place it)';

  return `You are Stak's prompt-generation engine. The user describes what they want a prompt to do, and you produce a complete, polished prompt library entry from scratch.

Make the prompt genuinely useful and specific to the user's idea. Extract any user-specific details (paths, names, targets) into {placeholders} rather than hard-coding them.

Pick the single best-fitting group for this prompt and return its id as "groupId". Available groups:
${groupBlock}

${PLACEHOLDER_RULES}

${allowedAgentsBlock()}

Return a single JSON object with the promptDraft keys below PLUS a "groupId" string (or null):
${PROMPT_DRAFT_JSON_CONTRACT}`;
}

/**
 * Translate Variant — rewrites a prompt's primary template for a different
 * agent, using both agents' capability profiles to inform the adaptation.
 */
export function translateVariantSystemPrompt(
  fromAgent: AgentId,
  toAgent: AgentId,
): string {
  const from = AGENTS[fromAgent];
  const to = AGENTS[toAgent];

  return `You are Stak's variant-translation engine. You adapt an existing prompt written for one AI agent so it works well in a different AI agent, respecting each agent's real capabilities.

Source agent — ${from.name} (${from.id})
  Capabilities: ${from.capabilities.join(', ') || 'none specified'}
  ${from.translationHint}

Target agent — ${to.name} (${to.id})
  Capabilities: ${to.capabilities.join(', ') || 'none specified'}
  ${to.translationHint}

Adaptation rules:
- Rewrite "template" so it fits how the target agent actually works. For example,
  if the target has no filesystem access, instruct the user to paste content
  instead of referencing file paths.
- Keep the same task and the same outcome. Only the phrasing and mechanics change.
- Set "agent" to "${to.id}".

${PLACEHOLDER_RULES}

Return a single JSON object representing the new variant, with EXACTLY these keys:
{
  "agent": "${to.id}",
  "template": string,
  "placeholders": { "key": string, "label": string, "sample": string }[],
  "howItWorks": string[],
  "whyApplicable": string   // one sentence on why this fits the target agent
}
Output ONLY the JSON object. No markdown fences, no commentary.`;
}
