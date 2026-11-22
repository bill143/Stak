// Stak V1 — OpenAI provider (used for ChatGPT-targeted variant work)
// SPEC.md Section 3.1, 9.6. Client is constructed lazily so importing this
// module never requires OPENAI_API_KEY (e.g. in unit tests).

import OpenAI from 'openai';
import {
  type AIProvider,
  type CompletionRequest,
  DEFAULT_MAX_TOKENS,
} from './providers';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set.');
  }
  client = new OpenAI({ apiKey });
  return client;
}

export const openaiProvider: AIProvider = {
  name: 'openai',
  async complete(req: CompletionRequest): Promise<string> {
    const response = await getClient().chat.completions.create({
      model: req.model,
      max_tokens: req.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: req.temperature,
      messages: [
        { role: 'system', content: req.system },
        ...req.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    return response.choices[0]?.message?.content ?? '';
  },
};
