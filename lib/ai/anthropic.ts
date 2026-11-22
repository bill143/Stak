// Stak V1 — Anthropic provider (primary engine for all AI features)
// SPEC.md Section 3.1, 9.6. Client is constructed lazily so importing this
// module never requires ANTHROPIC_API_KEY (e.g. in unit tests).

import Anthropic from '@anthropic-ai/sdk';
import {
  type AIProvider,
  type CompletionRequest,
  DEFAULT_MAX_TOKENS,
} from './providers';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set.');
  }
  client = new Anthropic({ apiKey });
  return client;
}

export const anthropicProvider: AIProvider = {
  name: 'anthropic',
  async complete(req: CompletionRequest): Promise<string> {
    const response = await getClient().messages.create({
      model: req.model,
      max_tokens: req.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: req.temperature,
      system: req.system,
      messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');
  },
};
