// Stak V1 — unified AI provider interface
// Source of truth: docs/SPEC.md Section 9.6 (models) and 3.1 (Anthropic primary,
// OpenAI for variants). Concrete implementations live in ./anthropic and ./openai.

export type ProviderName = 'anthropic' | 'openai';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CompletionRequest {
  system: string;
  messages: ChatMessage[];
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIProvider {
  readonly name: ProviderName;
  complete(req: CompletionRequest): Promise<string>;
}

/**
 * Models per feature (SPEC.md Section 9.6). Centralized so Settings → AI
 * Behavior (Pro) can override these later without touching call sites.
 */
export const MODELS = {
  improve: 'claude-sonnet-4-5',
  generate: 'claude-sonnet-4-5',
  translateVariant: 'claude-sonnet-4-5',
} as const;
export type AiFeature = keyof typeof MODELS;

export const DEFAULT_MAX_TOKENS = 4096;

/** Which provider serves a given model id. */
export function providerForModel(model: string): ProviderName {
  if (model.startsWith('gpt-') || model.startsWith('o1') || model.startsWith('o3')) {
    return 'openai';
  }
  // Anthropic is the default/primary.
  return 'anthropic';
}

/**
 * Pull a JSON object out of a model response. Handles the common cases where a
 * model wraps JSON in ```json fences or adds stray prose, by extracting the
 * outermost balanced braces. Throws if no parseable object is found.
 */
export function extractJson<T = unknown>(raw: string): T {
  const text = raw.trim();

  // Fast path: the whole thing is JSON.
  try {
    return JSON.parse(text) as T;
  } catch {
    // fall through to extraction
  }

  // Strip a fenced block if present.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fence?.[1]?.trim();
  if (candidate) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // fall through
    }
  }

  // Last resort: scan for the first balanced { ... } region.
  const start = text.indexOf('{');
  if (start !== -1) {
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < text.length; i += 1) {
      const ch = text[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') inString = true;
      else if (ch === '{') depth += 1;
      else if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          const slice = text.slice(start, i + 1);
          return JSON.parse(slice) as T;
        }
      }
    }
  }

  throw new Error('No JSON object found in model response.');
}

/** Lazily resolve the provider implementation for a model. */
export async function getProviderForModel(model: string): Promise<AIProvider> {
  const name = providerForModel(model);
  if (name === 'openai') {
    const { openaiProvider } = await import('./openai');
    return openaiProvider;
  }
  const { anthropicProvider } = await import('./anthropic');
  return anthropicProvider;
}
