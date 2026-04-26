export const AGENTS = {
  'claude-desktop': {
    id: 'claude-desktop',
    name: 'Claude Desktop',
    icon: '🖥️',
    capabilities: ['filesystem', 'terminal', 'mcp'],
    description: "Anthropic's desktop client with Desktop Commander MCP for file operations.",
    translationHint: 'Has direct filesystem access via Desktop Commander. Can read, write, delete files and run shell commands. Use specific file paths.',
    keyDashboardUrl: 'https://console.anthropic.com/settings/keys',
    requiresKey: true,
    keyProvider: 'anthropic',
  },
  'claude-code': {
    id: 'claude-code',
    name: 'Claude Code',
    icon: '💻',
    capabilities: ['filesystem', 'terminal', 'git', 'autonomous-execution'],
    description: "Anthropic's agentic coding CLI for autonomous development.",
    translationHint: 'Operates autonomously in a code repository. Can edit files, run commands, commit changes. Best for multi-step development tasks.',
    keyDashboardUrl: 'https://console.anthropic.com/settings/keys',
    requiresKey: true,
    keyProvider: 'anthropic',
  },
  'claude-web': {
    id: 'claude-web',
    name: 'Claude.ai',
    icon: '🌐',
    capabilities: ['web-search', 'artifacts', 'projects'],
    description: "Anthropic's web client. No filesystem access by default.",
    translationHint: 'No filesystem access. User pastes content into the chat. Best for analysis, writing, conversation.',
    keyDashboardUrl: null,
    requiresKey: false,
  },
  'chatgpt': {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖',
    capabilities: ['web-browsing', 'code-interpreter', 'image-generation'],
    description: "OpenAI's ChatGPT. No filesystem access by default; Code Interpreter handles uploads.",
    translationHint: 'No persistent filesystem. Code Interpreter can run Python on uploaded files. Use natural language and provide context.',
    keyDashboardUrl: 'https://platform.openai.com/api-keys',
    requiresKey: true,
    keyProvider: 'openai',
  },
  'cursor': {
    id: 'cursor',
    name: 'Cursor',
    icon: '✏️',
    capabilities: ['filesystem', 'codebase-context', 'inline-edit'],
    description: 'AI-first code editor.',
    translationHint: 'Built into the editor. Has full codebase context. Best for code-focused prompts and rules-style instructions.',
    keyDashboardUrl: null,
    requiresKey: false,
  },
  'windsurf': {
    id: 'windsurf',
    name: 'Windsurf',
    icon: '🌊',
    capabilities: ['filesystem', 'codebase-context', 'agentic'],
    description: "Codeium's agentic AI IDE.",
    translationHint: 'Similar to Cursor. Agentic flows. Codebase-aware.',
    keyDashboardUrl: null,
    requiresKey: false,
  },
  'ollama': {
    id: 'ollama',
    name: 'Ollama',
    icon: '🦙',
    capabilities: ['local', 'private', 'offline'],
    description: 'Run open-source models locally on your machine.',
    translationHint: 'Local model. Limited reasoning compared to frontier models. Use simpler, more direct prompts. No internet/filesystem unless tools added.',
    keyDashboardUrl: 'http://localhost:11434',
    requiresKey: false,
  },
  'custom': {
    id: 'custom',
    name: 'Custom',
    icon: '⚙️',
    capabilities: [],
    description: 'User-defined agent.',
    translationHint: 'User-defined.',
    keyDashboardUrl: null,
    requiresKey: false,
  },
} as const;

export type AgentId = keyof typeof AGENTS;
export type AgentProfile = (typeof AGENTS)[AgentId];

export function getAgent(id: AgentId): AgentProfile {
  return AGENTS[id];
}

export function listAgents(): readonly AgentProfile[] {
  return Object.values(AGENTS);
}
