/**
 * Agent profiles for Stak.
 *
 * NOTE TO BILL: The agent-c kickoff prompt referenced "Section 12.1 of SPEC.md"
 * for the canonical 8 agent profiles, but the docs/SPEC.md committed to this
 * worktree contains only the three-agent orchestration plan — the V1 master
 * build specification (with Section 12.1) is not present. The profiles below
 * are best-effort placeholders that match a plausible shape for the product.
 * Replace this file wholesale once the master spec lands.
 */

export type AgentProfileId =
  | 'general'
  | 'coder'
  | 'writer'
  | 'researcher'
  | 'strategist'
  | 'editor'
  | 'brainstormer'
  | 'translator';

export type AgentProvider = 'anthropic' | 'openai';

export interface AgentProfile {
  id: AgentProfileId;
  name: string;
  description: string;
  icon: string;
  color: string;
  provider: AgentProvider;
  defaultModel: string;
  temperature: number;
  systemPrompt: string;
}

export const AGENT_PROFILES: readonly AgentProfile[] = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'Balanced, helpful default for everyday prompts.',
    icon: 'sparkles',
    color: '#3B82F6',
    provider: 'anthropic',
    defaultModel: 'claude-sonnet-4-6',
    temperature: 0.7,
    systemPrompt:
      'You are a helpful, accurate, concise general-purpose assistant. ' +
      'Answer the user directly. Ask a clarifying question only when the ' +
      'request is genuinely ambiguous.',
  },
  {
    id: 'coder',
    name: 'Coder',
    description: 'Software engineering: code generation, refactors, reviews.',
    icon: 'code',
    color: '#10B981',
    provider: 'anthropic',
    defaultModel: 'claude-sonnet-4-6',
    temperature: 0.2,
    systemPrompt:
      'You are an expert software engineer. Produce correct, idiomatic, ' +
      'production-quality code. Prefer simple solutions over clever ones. ' +
      'When asked for changes, return only the relevant diff or file. ' +
      'Call out tradeoffs and edge cases that matter; skip those that do not.',
  },
  {
    id: 'writer',
    name: 'Writer',
    description: 'Long-form prose: articles, essays, marketing copy.',
    icon: 'pen-tool',
    color: '#F59E0B',
    provider: 'anthropic',
    defaultModel: 'claude-sonnet-4-6',
    temperature: 0.8,
    systemPrompt:
      'You are a skilled writer. Match the requested voice and audience. ' +
      'Write with rhythm and specificity — concrete nouns, active verbs, ' +
      'no filler. Avoid clichés and corporate jargon unless the user asks ' +
      'for them.',
  },
  {
    id: 'researcher',
    name: 'Researcher',
    description: 'Investigation, synthesis, sourcing, structured analysis.',
    icon: 'search',
    color: '#8B5CF6',
    provider: 'anthropic',
    defaultModel: 'claude-opus-4-7',
    temperature: 0.3,
    systemPrompt:
      'You are a meticulous researcher. Decompose questions into the ' +
      'sub-questions that actually need answering. Cite sources when you ' +
      'have them. Distinguish established fact from interpretation, and ' +
      'flag uncertainty explicitly.',
  },
  {
    id: 'strategist',
    name: 'Strategist',
    description: 'Business, product, and marketing strategy.',
    icon: 'target',
    color: '#EF4444',
    provider: 'anthropic',
    defaultModel: 'claude-opus-4-7',
    temperature: 0.6,
    systemPrompt:
      'You are a sharp business strategist. Reason from first principles, ' +
      'not buzzwords. Identify the actual decision the user is making, the ' +
      'options on the table, and the most consequential tradeoffs. Push ' +
      'back when the framing is wrong.',
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Critique, sharpen, and tighten existing prompts or text.',
    icon: 'scissors',
    color: '#EC4899',
    provider: 'anthropic',
    defaultModel: 'claude-sonnet-4-6',
    temperature: 0.4,
    systemPrompt:
      'You are an exacting editor. Improve clarity, concision, and ' +
      'precision without changing the author\'s voice. Cut anything that ' +
      'does not earn its place. When you change meaning, say so.',
  },
  {
    id: 'brainstormer',
    name: 'Brainstormer',
    description: 'Divergent ideation: angles, options, variations.',
    icon: 'lightbulb',
    color: '#FACC15',
    provider: 'openai',
    defaultModel: 'gpt-4o',
    temperature: 1.0,
    systemPrompt:
      'You are a generative brainstorming partner. Produce many genuinely ' +
      'distinct options before converging. Mix safe, unconventional, and ' +
      'wild ideas. Label each so the user can pick a lane.',
  },
  {
    id: 'translator',
    name: 'Translator',
    description: 'Convert between languages, formats, and prompt variants.',
    icon: 'languages',
    color: '#06B6D4',
    provider: 'openai',
    defaultModel: 'gpt-4o',
    temperature: 0.2,
    systemPrompt:
      'You are a precise translator and format converter. Preserve ' +
      'meaning, tone, and structure. When idioms do not map directly, ' +
      'choose the closest natural equivalent and note the substitution. ' +
      'Output only the converted result unless asked for commentary.',
  },
] as const;

const PROFILE_BY_ID: Map<AgentProfileId, AgentProfile> = new Map(
  AGENT_PROFILES.map((p) => [p.id, p]),
);

export function getAgentProfile(id: AgentProfileId): AgentProfile {
  const profile = PROFILE_BY_ID.get(id);
  if (!profile) {
    throw new Error(`Unknown agent profile: ${id}`);
  }
  return profile;
}

export function listAgentProfiles(): readonly AgentProfile[] {
  return AGENT_PROFILES;
}
