// Stak V1 — seed library: default groups + pre-loaded prompts
// Source of truth: docs/SPEC.md Section 7.8. Every new user's library is
// populated from this data on signup. Entries are marked isSeed (immutable in
// the canonical list — editing creates a per-user override).
//
// The spec targets 73 seeded prompts. This file establishes the 7 default
// groups and a curated, fully-fleshed starter set spread across every group;
// the array is append-only and the loader scales to the full 73 without code
// changes. See SEED_TARGET_COUNT below.

import type { AgentId } from '../agents/profiles';
import type { Category } from '../validation/schemas';
import type { Placeholder } from '../utils/placeholders';

export const SEED_TARGET_COUNT = 73;

/** Stable keys let seed prompts reference a group before its DB id exists. */
export type GroupKey =
  | 'file-organization'
  | 'coding-development'
  | 'writing-content'
  | 'research-analysis'
  | 'productivity-planning'
  | 'data-automation'
  | 'learning-explaining';

export interface SeedGroup {
  key: GroupKey;
  name: string;
  icon: string;
  color: string;
  position: number;
}

/** The 7 default groups every user starts with (isCustom = false). */
export const DEFAULT_GROUPS: readonly SeedGroup[] = [
  { key: 'file-organization', name: 'File Organization', icon: '📁', color: 'blue', position: 0 },
  { key: 'coding-development', name: 'Coding & Development', icon: '💻', color: 'violet', position: 1 },
  { key: 'writing-content', name: 'Writing & Content', icon: '✍️', color: 'amber', position: 2 },
  { key: 'research-analysis', name: 'Research & Analysis', icon: '🔍', color: 'emerald', position: 3 },
  { key: 'productivity-planning', name: 'Productivity & Planning', icon: '🗓️', color: 'rose', position: 4 },
  { key: 'data-automation', name: 'Data & Automation', icon: '⚙️', color: 'cyan', position: 5 },
  { key: 'learning-explaining', name: 'Learning & Explaining', icon: '🎓', color: 'fuchsia', position: 6 },
] as const;

export interface SeedPrompt {
  groupKey: GroupKey;
  title: string;
  description: string;
  whatItDoes: string;
  howItWorks: string[];
  whyDC?: string;
  tags: string[];
  bestFor: string[];
  category: Category;
  icon: string;
  primaryAgent: AgentId;
  template: string;
  placeholders: Placeholder[];
  isVerified?: boolean;
}

export const SEED_PROMPTS: readonly SeedPrompt[] = [
  // --- File Organization ---------------------------------------------------
  {
    groupKey: 'file-organization',
    title: 'Organize a messy folder by file type',
    description: 'Sort the contents of a folder into clean subfolders grouped by file type.',
    whatItDoes:
      'Scans a target folder and moves files into type-based subfolders (Images, Documents, Archives, etc.) without touching files already in place. Produces a short summary of what moved where.',
    howItWorks: [
      'Point the agent at the folder you want cleaned up.',
      'It lists the files and groups them by extension into logical categories.',
      'It creates the subfolders if they do not exist, then moves files in.',
      'It reports a summary table of moves and skips anything it is unsure about.',
    ],
    whyDC:
      'Desktop Commander has direct filesystem access, so it can move files in place rather than asking you to do it by hand.',
    tags: ['files', 'cleanup', 'automation'],
    bestFor: ['Developers', 'Anyone with a messy Downloads folder'],
    category: 'file-management',
    icon: '🧹',
    primaryAgent: 'claude-desktop',
    template:
      'Organize the folder at {folder_path} by moving files into subfolders grouped by type (Images, Documents, Code, Archives, Audio, Video, Other). Do not move files that are already inside a subfolder. Before moving anything, show me the plan. After moving, give me a summary of what went where.',
    placeholders: [
      { key: 'folder_path', label: 'Folder path', sample: '/Users/me/Downloads' },
    ],
    isVerified: true,
  },
  {
    groupKey: 'file-organization',
    title: 'Find and remove duplicate files',
    description: 'Identify duplicate files in a directory tree and safely remove the copies.',
    whatItDoes:
      'Walks a directory, finds files with identical contents, keeps one canonical copy, and proposes the duplicates for deletion — always asking before it removes anything.',
    howItWorks: [
      'Give the agent the root folder to scan.',
      'It compares files by size and content hash to find true duplicates.',
      'It picks the copy in the shallowest / earliest path as the keeper.',
      'It lists the duplicates and waits for your confirmation before deleting.',
    ],
    tags: ['files', 'dedupe', 'cleanup'],
    bestFor: ['Developers', 'Photographers', 'Power users'],
    category: 'file-management',
    icon: '🗂️',
    primaryAgent: 'claude-desktop',
    template:
      'Scan {folder_path} recursively for duplicate files (same content, not just same name). Keep one copy of each and list the duplicates you propose to delete, grouped by the file they duplicate. Do NOT delete anything until I confirm.',
    placeholders: [
      { key: 'folder_path', label: 'Folder path', sample: '~/Pictures' },
    ],
  },

  // --- Coding & Development ------------------------------------------------
  {
    groupKey: 'coding-development',
    title: 'Review a pull request diff',
    description: 'Get a focused code review of a diff covering bugs, edge cases, and clarity.',
    whatItDoes:
      'Reviews a code change for correctness bugs, missed edge cases, security issues, and readability. Prioritizes high-confidence findings and explains the "why" behind each.',
    howItWorks: [
      'Paste the diff or point the agent at the changed files.',
      'It reads the change in the context of the surrounding code.',
      'It reports findings ranked by severity, each with a concrete suggestion.',
      'It flags anything it is unsure about separately so you can judge.',
    ],
    tags: ['code-review', 'quality', 'bugs'],
    bestFor: ['Software engineers', 'Tech leads'],
    category: 'coding',
    icon: '🔬',
    primaryAgent: 'claude-code',
    template:
      'Review the following change for correctness bugs, edge cases, and security issues. Focus on high-confidence problems first; list lower-confidence observations separately. For each finding, give the file:line, the problem, and a concrete fix.\n\n```diff\n{diff}\n```',
    placeholders: [
      { key: 'diff', label: 'Diff or changed code', sample: 'diff --git a/app.ts b/app.ts ...' },
    ],
    isVerified: true,
  },
  {
    groupKey: 'coding-development',
    title: 'Explain an unfamiliar codebase',
    description: 'Get a guided tour of how a project is structured and where to start.',
    whatItDoes:
      'Builds a high-level map of a repository: entry points, the main modules, how data flows, and where the important logic lives — so you can get productive fast.',
    howItWorks: [
      'Open the agent in the repository you want to understand.',
      'It surveys the directory structure and key config files.',
      'It explains the architecture, the main flows, and the entry points.',
      'It suggests the 3-5 files to read first to understand the system.',
    ],
    tags: ['onboarding', 'architecture', 'reading'],
    bestFor: ['Engineers joining a project', 'Open-source contributors'],
    category: 'coding',
    icon: '🗺️',
    primaryAgent: 'claude-code',
    template:
      'Give me a guided tour of this codebase for someone seeing it for the first time. Cover: (1) what the project does, (2) how the code is structured, (3) the main entry points and data flow, and (4) the 3-5 files I should read first. Keep it concrete and reference real paths.',
    placeholders: [],
  },

  // --- Writing & Content ---------------------------------------------------
  {
    groupKey: 'writing-content',
    title: 'Turn rough notes into a clear summary',
    description: 'Convert messy notes into a tight, well-structured summary.',
    whatItDoes:
      'Takes disorganized notes and rewrites them into a clear summary with a short overview, key points, and any action items — in your voice, without inventing facts.',
    howItWorks: [
      'Paste your raw notes.',
      'The model groups related ideas and drops redundancy.',
      'It produces an overview, bulleted key points, and action items.',
      'It marks anything ambiguous instead of guessing.',
    ],
    tags: ['writing', 'summary', 'notes'],
    bestFor: ['Knowledge workers', 'Students', 'Managers'],
    category: 'writing',
    icon: '📝',
    primaryAgent: 'claude-web',
    template:
      'Turn these rough notes into a clear summary with three sections: a 2-sentence overview, key points as bullets, and action items. Use only what is in the notes — do not invent details. Flag anything unclear.\n\nNotes:\n{notes}',
    placeholders: [
      { key: 'notes', label: 'Your raw notes', sample: 'met w/ team re: launch, blockers...' },
    ],
  },
  {
    groupKey: 'writing-content',
    title: 'Rewrite text for a specific audience',
    description: 'Adapt a piece of writing for a different audience and tone.',
    whatItDoes:
      'Rewrites your text so it lands with a specific audience at a specific tone, preserving meaning while adjusting vocabulary, length, and framing.',
    howItWorks: [
      'Provide the original text, the target audience, and the desired tone.',
      'The model rewrites for that audience without changing the facts.',
      'It keeps the core message and call to action intact.',
      'It returns just the rewritten version, ready to use.',
    ],
    tags: ['writing', 'editing', 'tone'],
    bestFor: ['Marketers', 'Founders', 'Writers'],
    category: 'writing',
    icon: '🎯',
    primaryAgent: 'chatgpt',
    template:
      'Rewrite the text below for this audience: {audience}. Target tone: {tone}. Preserve the meaning and any call to action; adjust vocabulary, length, and framing to fit. Return only the rewritten text.\n\nText:\n{text}',
    placeholders: [
      { key: 'audience', label: 'Target audience', sample: 'non-technical executives' },
      { key: 'tone', label: 'Desired tone', sample: 'confident but plain-spoken' },
      { key: 'text', label: 'Original text', sample: 'Our platform leverages...' },
    ],
  },

  // --- Research & Analysis -------------------------------------------------
  {
    groupKey: 'research-analysis',
    title: 'Compare options against criteria',
    description: 'Build a decision matrix comparing options across the factors you care about.',
    whatItDoes:
      'Takes a set of options and the criteria that matter to you, then produces a comparison table plus a clear, reasoned recommendation.',
    howItWorks: [
      'List the options and the criteria to judge them on.',
      'The model scores each option per criterion with brief justification.',
      'It assembles a comparison table.',
      'It gives a recommendation and names the key trade-off.',
    ],
    tags: ['research', 'decision', 'comparison'],
    bestFor: ['Founders', 'Analysts', 'Buyers'],
    category: 'research',
    icon: '⚖️',
    primaryAgent: 'claude-web',
    template:
      'Compare these options against the criteria and recommend one. Build a table (options as rows, criteria as columns), score each cell with a one-line reason, then give a recommendation and the main trade-off.\n\nOptions: {options}\nCriteria: {criteria}',
    placeholders: [
      { key: 'options', label: 'Options to compare', sample: 'Postgres, MySQL, SQLite' },
      { key: 'criteria', label: 'Criteria that matter', sample: 'scalability, ease of setup, cost' },
    ],
  },
  {
    groupKey: 'research-analysis',
    title: 'Stress-test an argument',
    description: 'Find the weak points in a claim or plan before someone else does.',
    whatItDoes:
      "Plays devil's advocate against your argument: surfaces the strongest counterarguments, hidden assumptions, and failure modes, then suggests how to shore it up.",
    howItWorks: [
      'State your claim or plan as clearly as you can.',
      'The model lists the strongest objections, not strawmen.',
      'It names the assumptions the argument depends on.',
      'It suggests the changes that would make it more robust.',
    ],
    tags: ['research', 'critique', 'reasoning'],
    bestFor: ['Founders', 'Writers', 'Strategists'],
    category: 'research',
    icon: '🥊',
    primaryAgent: 'claude-web',
    template:
      'Stress-test this argument. Give me: (1) the three strongest counterarguments, steelmanned; (2) the hidden assumptions it depends on; (3) the most likely way it fails in practice; (4) what would make it more robust.\n\nArgument:\n{argument}',
    placeholders: [
      { key: 'argument', label: 'Your argument or plan', sample: 'We should ship without a beta because...' },
    ],
  },

  // --- Productivity & Planning ---------------------------------------------
  {
    groupKey: 'productivity-planning',
    title: 'Break a goal into a weekly plan',
    description: 'Turn a big goal into a realistic week-by-week plan with milestones.',
    whatItDoes:
      'Decomposes a goal into milestones and a week-by-week plan sized to your available time, with a clear definition of done for each week.',
    howItWorks: [
      'Describe the goal, your deadline, and hours available per week.',
      'The model defines milestones working backward from the deadline.',
      'It lays out each week\'s focus and a "done" criterion.',
      'It flags the riskiest week so you can plan around it.',
    ],
    tags: ['planning', 'goals', 'productivity'],
    bestFor: ['Builders', 'Students', 'Anyone with a deadline'],
    category: 'productivity',
    icon: '📈',
    primaryAgent: 'claude-web',
    template:
      'Break this goal into a weekly plan. Goal: {goal}. Deadline: {deadline}. I have about {hours_per_week} hours/week. Work backward from the deadline into milestones, then give a week-by-week plan with a clear "done" for each week. Flag the riskiest week.',
    placeholders: [
      { key: 'goal', label: 'The goal', sample: 'Launch a personal portfolio site' },
      { key: 'deadline', label: 'Deadline', sample: 'in 6 weeks' },
      { key: 'hours_per_week', label: 'Hours per week', sample: '8' },
    ],
  },
  {
    groupKey: 'productivity-planning',
    title: 'Draft a focused meeting agenda',
    description: 'Produce a tight agenda that keeps a meeting on track.',
    whatItDoes:
      'Builds a time-boxed agenda from the meeting goal and topics, with an owner and intended outcome for each item, plus a crisp decision to be made.',
    howItWorks: [
      'Give the meeting goal, length, and the topics to cover.',
      'The model time-boxes each topic to fit the total length.',
      'It assigns an outcome to each item so nothing is open-ended.',
      'It ends with the explicit decision the meeting should produce.',
    ],
    tags: ['meetings', 'planning', 'productivity'],
    bestFor: ['Managers', 'Team leads', 'PMs'],
    category: 'productivity',
    icon: '🗓️',
    primaryAgent: 'chatgpt',
    template:
      'Draft a {duration}-minute meeting agenda. Goal: {goal}. Topics: {topics}. Time-box each topic to fit, give each one an owner placeholder and an intended outcome, and end with the explicit decision the meeting must reach.',
    placeholders: [
      { key: 'duration', label: 'Meeting length (min)', sample: '30' },
      { key: 'goal', label: 'Meeting goal', sample: 'Decide the launch date' },
      { key: 'topics', label: 'Topics', sample: 'status, blockers, date options' },
    ],
  },

  // --- Data & Automation ---------------------------------------------------
  {
    groupKey: 'data-automation',
    title: 'Write a script to transform a CSV',
    description: 'Generate a small, runnable script to reshape or clean a CSV file.',
    whatItDoes:
      'Writes a self-contained script that reads a CSV, applies the transformation you describe, and writes the result — with comments and a note on how to run it.',
    howItWorks: [
      'Describe the input columns and the transformation you want.',
      'The agent writes a single runnable script (Python by default).',
      'It includes how-to-run instructions and handles common edge cases.',
      'In Claude Code it can also run the script against a sample for you.',
    ],
    tags: ['data', 'csv', 'scripting'],
    bestFor: ['Analysts', 'Engineers', 'Ops'],
    category: 'data',
    icon: '🧮',
    primaryAgent: 'claude-code',
    template:
      'Write a {language} script that reads the CSV at {input_path}, performs this transformation: {transformation}, and writes the result to {output_path}. Handle missing values and bad rows gracefully. Add comments and a one-line run command.',
    placeholders: [
      { key: 'language', label: 'Language', sample: 'Python' },
      { key: 'input_path', label: 'Input CSV path', sample: './data/raw.csv' },
      { key: 'transformation', label: 'Transformation', sample: 'group by month and sum revenue' },
      { key: 'output_path', label: 'Output path', sample: './data/monthly.csv' },
    ],
  },
  {
    groupKey: 'data-automation',
    title: 'Explain a regular expression',
    description: 'Get a plain-English breakdown of what a regex matches.',
    whatItDoes:
      'Decodes a regular expression piece by piece, shows what it matches and what it rejects, and points out likely gotchas or edge cases.',
    howItWorks: [
      'Paste the regex you want to understand.',
      'The model breaks it into parts and explains each one.',
      'It gives example strings that match and that fail.',
      'It calls out common pitfalls (greedy matches, escaping, anchors).',
    ],
    tags: ['regex', 'data', 'explain'],
    bestFor: ['Developers', 'Data wranglers'],
    category: 'data',
    icon: '🔣',
    primaryAgent: 'ollama',
    template:
      'Explain this regular expression in plain English, part by part. Then give three strings it matches and three it does not, and list any common pitfalls.\n\nRegex: {regex}',
    placeholders: [
      { key: 'regex', label: 'Regular expression', sample: '^\\d{3}-\\d{2}-\\d{4}$' },
    ],
  },

  // --- Learning & Explaining -----------------------------------------------
  {
    groupKey: 'learning-explaining',
    title: 'Explain a concept at three levels',
    description: 'Understand a topic explained for a beginner, a student, and an expert.',
    whatItDoes:
      'Explains any concept three ways — a one-paragraph beginner version, a deeper student version with an example, and a precise expert version — so you can find the level that clicks.',
    howItWorks: [
      'Name the concept you want explained.',
      'The model writes a beginner explanation with an analogy.',
      'Then a student-level explanation with a worked example.',
      'Then an expert-level explanation with the precise mechanics.',
    ],
    tags: ['learning', 'explain', 'teaching'],
    bestFor: ['Students', 'Self-learners', 'Teachers'],
    category: 'learning',
    icon: '🎓',
    primaryAgent: 'claude-web',
    template:
      'Explain {concept} at three levels: (1) beginner — one paragraph with a simple analogy; (2) student — a deeper explanation with one worked example; (3) expert — the precise mechanics and where the simpler versions break down.',
    placeholders: [
      { key: 'concept', label: 'Concept to explain', sample: 'how HTTPS keeps data private' },
    ],
  },
  {
    groupKey: 'learning-explaining',
    title: 'Quiz me to test my understanding',
    description: 'Turn a topic into an adaptive quiz that finds your gaps.',
    whatItDoes:
      'Generates questions on a topic one at a time, waits for your answer, tells you if you are right with a short explanation, and adapts difficulty to where you struggle.',
    howItWorks: [
      'Tell the model the topic and your current level.',
      'It asks one question at a time and waits for your answer.',
      'It grades each answer and explains the correct reasoning.',
      'It steers toward the areas where you make mistakes.',
    ],
    tags: ['learning', 'quiz', 'practice'],
    bestFor: ['Students', 'Interview prep', 'Self-learners'],
    category: 'learning',
    icon: '❓',
    primaryAgent: 'chatgpt',
    template:
      'Quiz me on {topic} at a {level} level. Ask ONE question at a time and wait for my answer before continuing. After each answer, tell me if I am right, explain briefly, and adapt the next question to my weak spots. Start now.',
    placeholders: [
      { key: 'topic', label: 'Topic', sample: 'TCP/IP networking basics' },
      { key: 'level', label: 'Your level', sample: 'beginner' },
    ],
  },
];

/** Quick lookup of how many seed prompts exist per group. */
export function seedCountByGroup(): Record<GroupKey, number> {
  const counts = Object.fromEntries(
    DEFAULT_GROUPS.map((g) => [g.key, 0]),
  ) as Record<GroupKey, number>;
  for (const p of SEED_PROMPTS) counts[p.groupKey] += 1;
  return counts;
}
