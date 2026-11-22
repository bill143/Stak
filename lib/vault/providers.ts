// Stak V1 — Vault provider registry + API key auto-detection
// Source of truth: docs/SPEC.md Section 8.4 (Add Key flow) and 8.5 (Pre-configured providers)

export type ProviderId =
  | 'anthropic'
  | 'openai'
  | 'openrouter'
  | 'elevenlabs'
  | 'ngrok'
  | 'huggingface'
  | 'groq'
  | 'mistral'
  | 'cohere'
  | 'ollama'
  | 'custom';

export type TestMethod = 'GET' | 'POST';

export interface ProviderTestEndpoint {
  method: TestMethod;
  url: string;
  /** Notes about the lightest call to make against this endpoint. */
  note?: string;
}

export interface ProviderProfile {
  id: ProviderId;
  name: string;
  /** Where the user goes to mint a new key. */
  keyDashboardUrl: string | null;
  /**
   * Detection prefixes for this provider's keys. May be empty when a key
   * shape can't be reliably distinguished (those providers are detected only
   * when the user picks them manually).
   */
  detectionPrefixes: string[];
  /** Lightest endpoint we hit to validate a key on "Test & Save". */
  testEndpoint: ProviderTestEndpoint | null;
}

/**
 * Canonical provider list. Mirrors the table in SPEC.md Section 8.5.
 * Order is significant for display, but detection ranks by prefix specificity
 * (longest match wins) — see `detectProvider`.
 */
export const PROVIDERS: Record<ProviderId, ProviderProfile> = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    keyDashboardUrl: 'https://console.anthropic.com/settings/keys',
    detectionPrefixes: ['sk-ant-'],
    testEndpoint: {
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      note: 'max_tokens: 1',
    },
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    keyDashboardUrl: 'https://platform.openai.com/api-keys',
    // 'sk-' is the broad fallback — only used after more specific prefixes miss.
    detectionPrefixes: ['sk-'],
    testEndpoint: {
      method: 'GET',
      url: 'https://api.openai.com/v1/models',
    },
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    keyDashboardUrl: 'https://openrouter.ai/keys',
    detectionPrefixes: ['sk-or-v1-'],
    testEndpoint: {
      method: 'GET',
      url: 'https://openrouter.ai/api/v1/models',
    },
  },
  elevenlabs: {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    keyDashboardUrl: 'https://elevenlabs.io/app/settings/api-keys',
    detectionPrefixes: ['xi-'],
    testEndpoint: {
      method: 'GET',
      url: 'https://api.elevenlabs.io/v1/user',
    },
  },
  ngrok: {
    id: 'ngrok',
    name: 'ngrok',
    keyDashboardUrl: 'https://dashboard.ngrok.com/api',
    detectionPrefixes: [],
    testEndpoint: {
      method: 'GET',
      url: 'https://api.ngrok.com/api/credentials',
    },
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face',
    keyDashboardUrl: 'https://huggingface.co/settings/tokens',
    detectionPrefixes: ['hf_'],
    testEndpoint: {
      method: 'GET',
      url: 'https://huggingface.co/api/whoami-v2',
    },
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    keyDashboardUrl: 'https://console.groq.com/keys',
    detectionPrefixes: ['gsk_'],
    testEndpoint: {
      method: 'GET',
      url: 'https://api.groq.com/openai/v1/models',
    },
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral',
    keyDashboardUrl: 'https://console.mistral.ai/api-keys',
    detectionPrefixes: [],
    testEndpoint: {
      method: 'GET',
      url: 'https://api.mistral.ai/v1/models',
    },
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere',
    keyDashboardUrl: 'https://dashboard.cohere.com/api-keys',
    detectionPrefixes: [],
    testEndpoint: {
      method: 'GET',
      url: 'https://api.cohere.com/v1/check-api-key',
    },
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama',
    keyDashboardUrl: 'http://localhost:11434',
    detectionPrefixes: [],
    testEndpoint: {
      method: 'GET',
      url: 'http://localhost:11434/api/tags',
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    keyDashboardUrl: null,
    detectionPrefixes: [],
    testEndpoint: null,
  },
};

/**
 * Map of every detection prefix to its provider, ranked so that the most
 * specific (longest) prefix is matched first. This is what makes
 * `sk-or-v1-...` resolve to OpenRouter and `sk-ant-...` to Anthropic before
 * the broad `sk-` OpenAI fallback can claim them.
 */
const RANKED_PREFIXES: ReadonlyArray<{ prefix: string; providerId: ProviderId }> =
  Object.values(PROVIDERS)
    .flatMap((p) => p.detectionPrefixes.map((prefix) => ({ prefix, providerId: p.id })))
    .sort((a, b) => b.prefix.length - a.prefix.length);

/**
 * Detect the most likely provider for a pasted API key. Returns `null` when no
 * prefix matches, in which case the UI should ask the user to pick a provider
 * (defaulting to `custom`).
 */
export function detectProvider(rawKey: string): ProviderId | null {
  const key = rawKey.trim();
  if (key.length === 0) return null;

  for (const { prefix, providerId } of RANKED_PREFIXES) {
    if (key.startsWith(prefix)) return providerId;
  }
  return null;
}

/**
 * A redacted preview of a key for safe display in lists, e.g.
 * `sk-ant-...8k2j`. Never returns enough characters to reconstruct the key.
 */
export function maskKey(rawKey: string): string {
  const key = rawKey.trim();
  if (key.length <= 8) return '••••';

  const match = RANKED_PREFIXES.find(({ prefix }) => key.startsWith(prefix));
  const prefix = match ? match.prefix : key.slice(0, 3);
  const tail = key.slice(-4);
  return `${prefix}...${tail}`;
}

export function getProvider(id: ProviderId): ProviderProfile {
  return PROVIDERS[id];
}

export function listProviders(): ProviderProfile[] {
  return Object.values(PROVIDERS);
}
