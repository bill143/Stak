\# Stak — Three-Agent Orchestration Plan



\*\*Companion document to:\*\* `Stak V1 Master Build Specification`

\*\*Purpose:\*\* How to actually run three Claude Code agents in parallel without them stepping on each other.

\*\*Audience:\*\* Bill (orchestrator) + the three Claude Code agents.

\*\*GitHub:\*\* https://github.com/bill143/Stak



\---



\## How This Works



You'll open \*\*three separate Claude Code sessions\*\*, each in its own terminal/tab. Each session gets a focused mission and a strict ownership boundary. They share one git repo, but each owns its own file paths to avoid merge conflicts.



You (Bill) act as the orchestrator: kick off Day 1, review what each agent produces at the end of the day, integrate, then issue Day 2 prompts.



I (Claude in this conversation) am your co-orchestrator. After each agent reports back, paste their output here. I'll tell you what's working, what's broken, what to integrate, and what to push back on.



\---



\## Pre-Flight Checklist (Before Spawning Agents)



Do these in this order. Total time: 30-45 min.



\### Step 1 — Provision external accounts



Open these in tabs and create accounts/projects:



1\. \*\*GitHub\*\* — repo already created at https://github.com/bill143/Stak (private)

2\. \*\*Vercel\*\* — sign in, link to GitHub

3\. \*\*Supabase\*\* — new project named `stak`. Region: closest to you. Save these values somewhere secure:

&#x20;  - Project URL (`NEXT\_PUBLIC\_SUPABASE\_URL`)

&#x20;  - Anon key (`NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY`)

&#x20;  - Service role key (`SUPABASE\_SERVICE\_ROLE\_KEY`) ← never commit this

&#x20;  - Database URL (`DATABASE\_URL`)

&#x20;  - Direct URL (`DIRECT\_URL`)

4\. \*\*Stripe\*\* — sign in, switch to \*\*Test mode\*\*. Create:

&#x20;  - Product: "Stak Pro"

&#x20;  - Two prices on that product: $9/mo recurring, $84/yr recurring

&#x20;  - Save the price IDs (`price\_xxxxx`)

&#x20;  - Save your test secret key

&#x20;  - We'll wire up the webhook signing secret later (Day 5)

5\. \*\*Resend\*\* — sign in, save the API key. Domain verification can wait.

6\. \*\*PostHog\*\* — new project, save the project API key + host

7\. \*\*Sentry\*\* — new Next.js project, save the DSN

8\. \*\*Anthropic\*\* — make sure you have an API key (you do)

9\. \*\*OpenAI\*\* — sign in, create an API key. We need this for the ChatGPT variant translation feature.



\### Step 2 — Local environment



```bash

\# In your dev folder

cd \~/code     # or wherever you keep code projects

git clone https://github.com/bill143/Stak.git stak

cd stak

```



Confirm Node 20+ is installed: `node -v`



\### Step 3 — Master env file



Create a file at `\~/.stak-secrets.env` (NOT in the repo). This is your master env file the agents will reference. Don't put it in the repo. Format:



```

DATABASE\_URL=...

DIRECT\_URL=...

NEXT\_PUBLIC\_SUPABASE\_URL=...

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=...

SUPABASE\_SERVICE\_ROLE\_KEY=...

STRIPE\_SECRET\_KEY=...

NEXT\_PUBLIC\_STRIPE\_PRICE\_MONTHLY=...

NEXT\_PUBLIC\_STRIPE\_PRICE\_YEARLY=...

ANTHROPIC\_API\_KEY=...

OPENAI\_API\_KEY=...

RESEND\_API\_KEY=...

NEXT\_PUBLIC\_POSTHOG\_KEY=...

NEXT\_PUBLIC\_POSTHOG\_HOST=https://us.i.posthog.com

SENTRY\_DSN=...

NEXT\_PUBLIC\_APP\_URL=http://localhost:3000

NODE\_ENV=development

```



When agents need an env value, you'll paste only the specific values they need into their session, never the whole file.



\### Step 4 — Spec accessible to all agents



Save the full V1 spec (the artifact titled "PromptDesk V1 Master Build Specification") as `docs/SPEC.md` in your local repo. Each agent will read this as the source of truth.



\---



\## Agent Ownership Map (Avoid Conflicts)



To prevent agents from clobbering each other's work, each agent owns specific paths.



| Path | Owner | Notes |

|---|---|---|

| `prisma/` | \*\*Agent A\*\* | DB schema. Only A modifies. |

| `lib/supabase/` | \*\*Agent A\*\* | DB clients |

| `lib/seed/` | \*\*Agent A\*\* | Seed prompts |

| `app/api/prompts/` | \*\*Agent A\*\* | Prompts CRUD API |

| `app/api/groups/` | \*\*Agent A\*\* | Groups CRUD API |

| `app/api/share/` | \*\*Agent A\*\* | Share links API |

| `app/api/stripe/` | \*\*Agent A\*\* | Stripe webhook |

| `middleware.ts` | \*\*Agent A\*\* | Auth middleware |

| `app/(auth)/` | \*\*Agent A\*\* | Signin/signup pages — auth flow |

| `app/(marketing)/` | \*\*Agent B\*\* | Landing, pricing, security, etc. |

| `app/(app)/library/` | \*\*Agent B\*\* | Library page + detail + edit |

| `app/(app)/settings/` | \*\*Agent B\*\* | All 9 settings pages |

| `components/ui/` | \*\*Agent B\*\* | shadcn primitives + design tokens |

| `components/library/` | \*\*Agent B\*\* | Library-specific components |

| `components/marketing/` | \*\*Agent B\*\* | Marketing-page components |

| `components/settings/` | \*\*Agent B\*\* | Settings components |

| `tailwind.config.ts` | \*\*Agent B\*\* | Theme tokens (other agents only read) |

| `styles/globals.css` | \*\*Agent B\*\* | Global CSS |

| `app/(app)/vault/` | \*\*Agent C\*\* | Vault UI |

| `app/api/ai/` | \*\*Agent C\*\* | AI Improve / Generate / Translate |

| `lib/crypto/` | \*\*Agent C\*\* | Encryption library |

| `lib/ai/` | \*\*Agent C\*\* | AI provider abstractions + system prompts |

| `lib/agents/` | \*\*Agent C\*\* | Agent profiles |

| `components/vault/` | \*\*Agent C\*\* | Vault components |



\### Shared paths (read-only for agents — Bill manages directly)



\- `package.json` — Bill installs deps; agents tell Bill what they need

\- `.env.local` — Bill creates from master env file

\- `.env.example` — Bill maintains

\- `next.config.js` — Bill maintains

\- `tsconfig.json` — Bill maintains (created on Day 1 by Agent A and not touched after)

\- `README.md` — Bill maintains

\- `.gitignore` — Bill maintains



\### Branch strategy



\- `main` — protected, requires PR

\- `agent-a/day-N-{task}` — Agent A branches

\- `agent-b/day-N-{task}` — Agent B branches

\- `agent-c/day-N-{task}` — Agent C branches

\- All PRs reviewed by Bill before merge to main



\---



\## Day 1 Kickoff Prompts



These are the exact prompts to paste into each Claude Code session. Each agent gets the SPEC.md file in their workspace plus the focused day-prompt below.



\### 🔵 Agent A — Backend \& Auth — Day 1



Open Claude Code in `\~/code/stak-agent-a`. Paste this prompt:



```

You are Agent A on the Stak build. You own the backend, database, auth, and API routes.



Your working directory is \~/code/stak-agent-a (a git worktree on branch agent-a/day-1-scaffold-and-auth). You are one of three concurrent agents on this build. Your branch is isolated from the other agents' work via git worktrees.



Read docs/SPEC.md from start to finish. This is the source of truth for everything.



Your Day 1 mission:

1\. Initialize Next.js 14 with App Router, TypeScript (strict), Tailwind, shadcn/ui

&#x20;  - Use: npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

2\. Install core dependencies:

&#x20;  @supabase/supabase-js, @supabase/ssr, prisma, @prisma/client,

&#x20;  zod, react-hook-form, @hookform/resolvers, lucide-react,

&#x20;  @tanstack/react-query, zustand

3\. Set up Prisma:

&#x20;  - Create prisma/schema.prisma using the EXACT schema from Section 4 of SPEC.md

&#x20;  - Configure for Supabase Postgres (DATABASE\_URL + DIRECT\_URL)

&#x20;  - Run npx prisma generate

&#x20;  - Do NOT run migrations yet — wait for Bill to provision Supabase access

4\. Create lib/supabase/client.ts and lib/supabase/server.ts following the @supabase/ssr docs

5\. Create middleware.ts that protects /(app)/\* routes — redirects unauthenticated to /signin?redirect=...

6\. Create the /(auth) route group with placeholder pages: signin, signup, forgot-password, verify-email

&#x20;  - Use shadcn Form + Input + Button components

&#x20;  - Wire up Supabase Auth for email/password + Google OAuth

&#x20;  - Pages should work end-to-end (signup → verification email → signin)

7\. Create a basic /(app)/library/page.tsx that just says "Library — authenticated" so we can verify auth works

8\. Create .env.example with all the env vars listed in Section 20.2 of SPEC.md (with empty values)



Constraints:

\- DO NOT touch app/(marketing)/ — that's Agent B

\- DO NOT touch app/(app)/library/ beyond a single placeholder page — that's Agent B

\- DO NOT touch lib/crypto/ or lib/ai/ — that's Agent C

\- DO NOT install dependencies that are listed for Agent C's work (argon2-browser, @anthropic-ai/sdk, openai)

\- DO NOT install dependencies that are Agent B's responsibility (just the shadcn components Agent B picks)

\- USE Stak as the brand name throughout (codename — final brand pending)



When done:

\- Commit on branch agent-a/day-1-scaffold-and-auth

\- Push to origin

\- Report back to Bill with: (a) what was built, (b) what was tested, (c) any blockers, (d) exact dependencies installed



Begin.

```



\### 🟢 Agent B — Frontend Core — Day 1



Open a SECOND Claude Code session in `\~/code/stak-agent-b`. Paste this prompt:



```

You are Agent B on the Stak build. You own the marketing site, design system, library UI, and settings UI.



Your working directory is \~/code/stak-agent-b (a git worktree on branch agent-b/day-1-marketing-and-design-system). You are one of three concurrent agents on this build. Your branch is isolated from the other agents' work via git worktrees.



Read docs/SPEC.md from start to finish. This is the source of truth for everything.



IMPORTANT COORDINATION:

\- Agent A is working on auth, backend, and the repo scaffold IN PARALLEL with you

\- WAIT for Agent A's Day 1 PR to be merged into main before you start work that depends on the Next.js scaffold

\- After Agent A's PR merges, you'll need to update your worktree:

&#x20;   git checkout main

&#x20;   git pull origin main

&#x20;   git checkout agent-b/day-1-marketing-and-design-system

&#x20;   git merge main

\- While waiting, you may design the components in isolation OR work on a parallel branch agent-b/day-1-design-tokens that ONLY touches Tailwind config and globals.css

\- Confirm with Bill before pushing anything that touches files outside your ownership



Your Day 1 mission (after Agent A's scaffold is merged):

1\. Install shadcn/ui CLI and initialize: npx shadcn-ui@latest init

&#x20;  Use: TypeScript, default style, slate base color, CSS variables yes

2\. Install these shadcn components:

&#x20;  button, input, label, card, dialog, dropdown-menu, select, switch, separator,

&#x20;  tabs, sheet, toast, badge, skeleton, avatar

3\. Define design tokens in tailwind.config.ts:

&#x20;  - Primary: electric blue (#3B82F6)

&#x20;  - 6 themes (Midnight, Slate, Obsidian, Royal, Forest, Sunset) as CSS variable sets

&#x20;  - Font families: Inter (UI), JetBrains Mono (code)

&#x20;  - Custom spacing scale matching the dark-aesthetic

4\. Build the marketing landing page at app/(marketing)/page.tsx following Section 6.2 of SPEC.md exactly:

&#x20;  - Nav with Logo, Use Cases dropdown, Pricing, Resources, Sign in, Get started

&#x20;  - Hero with headline "Your AI prompts, organized." + animated screenshot mockup

&#x20;  - Three-pillar feature section

&#x20;  - Three feature deep-dives (Multi-agent / AI Improve / API Vault)

&#x20;  - Pricing teaser

&#x20;  - Testimonial slot (placeholder cards)

&#x20;  - Final CTA

&#x20;  - Footer with Product/Resources/Legal columns

5\. Build the marketing layout at app/(marketing)/layout.tsx with the nav and footer



Constraints:

\- DO NOT touch app/(auth)/ — that's Agent A

\- DO NOT touch app/api/ — that's Agent A or C

\- DO NOT touch lib/crypto/, lib/ai/, lib/agents/ — that's Agent C

\- DO NOT modify prisma/schema.prisma — that's Agent A

\- USE Stak as the brand name throughout (codename — final brand pending)



When done:

\- Commit on branch agent-b/day-1-marketing-and-design-system

\- Push to origin

\- Open a PR with screenshots of the landing page (mobile + desktop)

\- Report back to Bill with: (a) what was built, (b) what was tested, (c) any blockers, (d) exact dependencies installed



Begin.

```



\### 🟣 Agent C — Vault \& AI — Day 1



Open a THIRD Claude Code session in `\~/code/stak-agent-c`. Paste this prompt:



```

You are Agent C on the Stak build. You own the encrypted vault, AI features, and agent profiles.



Your working directory is \~/code/stak-agent-c (a git worktree on branch agent-c/day-1-crypto-and-agents). You are one of three concurrent agents on this build. Your branch is isolated from the other agents' work via git worktrees.



Read docs/SPEC.md from start to finish. This is the source of truth for everything.



IMPORTANT COORDINATION:

\- Agent A is working on the repo scaffold in parallel

\- You can start work IMMEDIATELY on the encryption library — it has no dependency on other agents' work

\- After Agent A's scaffold lands in main, sync your worktree:

&#x20;   git checkout main

&#x20;   git pull origin main

&#x20;   git checkout agent-c/day-1-crypto-and-agents

&#x20;   git merge main



Your Day 1 mission:

1\. Build lib/crypto/vault.ts — the encrypted vault primitives. Per Section 8 of SPEC.md:

&#x20;  - Function deriveKey(masterPassword: string, saltBase64: string): Promise<CryptoKey>

&#x20;    uses Argon2id via argon2-browser

&#x20;    params: iterations=3, memorySize=65536, parallelism=4, hashLength=32

&#x20;  - Function generateSalt(): string (returns base64-encoded 16 bytes from crypto.getRandomValues)

&#x20;  - Function encryptKey(plaintext: string, key: CryptoKey): Promise<{ ciphertext: string, ivBase64: string }>

&#x20;    uses AES-256-GCM via Web Crypto API

&#x20;  - Function decryptKey(ciphertext: string, ivBase64: string, key: CryptoKey): Promise<string>

&#x20;  - Function generateCanary(key: CryptoKey): Promise<{ ciphertext: string, ivBase64: string }>

&#x20;    encrypts a known plaintext "STAK\_VAULT\_CANARY\_v1" so we can verify the password later

&#x20;  - Function verifyCanary(canary: { ciphertext, ivBase64 }, key: CryptoKey): Promise<boolean>

2\. Build lib/agents/profiles.ts — exact code from Section 12.1 of SPEC.md (all 8 agent profiles)

3\. Write unit tests using Vitest at tests/unit/crypto.test.ts:

&#x20;  - encrypt → decrypt round trip

&#x20;  - canary verification (success case)

&#x20;  - canary verification (wrong password — must fail)

&#x20;  - different salts produce different keys

&#x20;  - same salt + same password = same key (deterministic)

4\. Install dependencies: argon2-browser, @anthropic-ai/sdk, openai, vitest, @vitest/ui

5\. Add a vitest.config.ts at the repo root

6\. Add npm script "test:unit" in package.json running vitest



Constraints:

\- DO NOT touch app/(auth)/, app/(app)/library/, app/(marketing)/ — those are Agents A and B

\- DO NOT modify prisma/schema.prisma — that's Agent A

\- DO NOT touch middleware.ts — that's Agent A

\- USE Stak as the brand name throughout (codename — final brand pending)



When done:

\- Commit on branch agent-c/day-1-crypto-and-agents

\- Push to origin

\- Open a PR with the test results in the description

\- Report back to Bill with: (a) what was built, (b) test results (must be 100% passing), (c) any blockers, (d) exact dependencies installed



Begin.

```



\---



\## Daily Standup Loop



After every Day-N is complete (or earlier if an agent gets blocked):



\### Step 1 — Each agent reports back



You'll get three reports. Paste each into this conversation. I'll triage:

\- ✅ Working as expected → merge

\- ⚠️ Issues → I'll tell you exactly what to push back on

\- 🚨 Major blocker → I'll redirect that agent's day



\### Step 2 — Bill merges PRs in order



Order matters. On Day 1:

1\. Agent A first (everyone else needs the scaffold)

2\. Agent B second (needs A's scaffold)

3\. Agent C in parallel (independent until later days)



For days 2+, the order depends on what changed. I'll tell you each day.



\### Step 3 — I generate Day N+1 prompts



Once you confirm Day N is integrated and working, paste the merged status here. I'll generate the three Day N+1 prompts based on the day plan in Section 22.2 of SPEC.md, accounting for anything that slipped or anything new we learned.



\---



\## Day-by-Day High-Level Plan



(Per Section 22.2 of SPEC.md, restated here for orchestration reference.)



| Day | Agent A | Agent B | Agent C |

|---|---|---|---|

| 1 | Repo scaffold, Prisma schema, Supabase clients, auth pages | Marketing site (landing) + design system | Crypto library + agent profiles + unit tests |

| 2 | Auth middleware, signup/signin API routes complete, email verification | Pricing + Security + Resources marketing pages | Vault setup flow page (master password setup) |

| 3 | Prompts CRUD API, seed loader (73 seeded prompts) | Auth pages styling, app shell, library page (detailed mode) | Vault page (provider cards, add key flow) |

| 4 | Groups CRUD, share links API | Library compact + list modes | Test connection per provider |

| 5 | Stripe Checkout endpoint + webhook handler | Detail page + Edit modal | Lock toggle + key copy with confirmation |

| 6 | Subscription enforcement middleware (free tier limits) | All 9 settings pages | Build .env modal + presets |

| 7 | Integration testing | Variant tabs UX | AI Improve API route + UI integration |

| 8 | Bug fixes, perf | Mobile responsive pass | AI Generate API + Translate Variant API |

| 9 | Performance pass | Polish, animations, loading states | Vault cloud sync (Pro) |

| 10 | E2E tests with Playwright | E2E tests | E2E tests |

| 11 | Bug fixes | Bug fixes | Bug fixes |

| 12 | Security review (auth flows) | Accessibility audit (WCAG AA) | Security review (vault encryption) |

| 13 | Closed beta with 10-20 invited users | Closed beta | Closed beta |

| 14 | Public launch | Public launch | Public launch |



\---



\## Communication Protocol



\### When an agent should STOP and ask Bill (not improvise)



\- Touching a file outside their ownership map

\- Installing a dependency not listed in their day's mission

\- Discovering a spec ambiguity

\- A test failing they can't debug in 15 minutes

\- Anything that would require a database schema change

\- Anything that would block another agent



\### When an agent should just proceed



\- Bug in their own code

\- Refactoring within their own files

\- Improving error messages

\- Writing additional tests beyond what was asked

\- Improving code quality (so long as the public API/contract is unchanged)



\### Standard daily report format (each agent should follow this)



```

\## Agent \[A/B/C] — Day \[N] Report



\### Built

\- bullet list of what was completed



\### Tested

\- what was tested and how

\- test results (pass/fail counts)



\### Blockers

\- anything stopping progress, with specifics



\### Dependencies installed

\- exact list with versions



\### Files touched

\- list of files created/modified



\### PR link

\- branch name and PR URL



\### Spec questions / ambiguities

\- anything in SPEC.md that was unclear

```



\---



\## Bill's Orchestrator Tasks (Each Day)



| Time | Task |

|---|---|

| Morning | Review yesterday's reports (paste into this conversation) |

| Morning | Receive Day-N prompts from me, paste to each agent |

| Throughout day | Monitor PRs, ping agents if stuck |

| End of day | Review final reports from each agent |

| End of day | Merge PRs in correct order |

| End of day | Verify staging deploy works |

| End of day | Brief end-of-day status here for Day N+1 prompts |



\---



\## When Things Go Wrong



\### Scenario: Agent gets stuck on a problem



→ Paste their error/output here. I'll diagnose and either give them a corrected prompt, or tell you to redirect them to a different task while another agent unblocks them.



\### Scenario: Two agents have conflicting changes



→ Almost shouldn't happen with the ownership map. If it does, paste both PRs here. I'll arbitrate based on the spec.



\### Scenario: Spec has a real gap



→ Paste the specific question. I'll update the SPEC.md (versioned in section 23) and rebroadcast to all three agents.



\### Scenario: An agent goes off-script and starts building features not in their day's mission



→ Stop them immediately. Have them revert. Paste their explanation here, I'll generate a corrected prompt.



\### Scenario: Everything's on fire



→ Pause all agents. Paste everything here. We regroup.



\---



\## Final Pre-Flight Checklist



Before pasting the three Day-1 prompts, confirm:



\- \[ ] Spec saved as `docs/SPEC.md` in repo

\- \[ ] All 9 external accounts created (GitHub, Vercel, Supabase, Stripe, Resend, PostHog, Sentry, Anthropic, OpenAI)

\- \[ ] All env values saved in `\~/.promptdesk-secrets.env` (NOT in repo)

\- \[ ] Local repo created and pushed to GitHub

\- \[ ] Branch protection on `main` (require PR before merge)

\- \[ ] Three Claude Code sessions ready, each in `\~/code/promptdesk`

\- \[ ] You have \~4-6 hours blocked off for Day 1 supervision



\---



\## Begin



When ready:



1\. Paste Agent A's Day 1 prompt into Session 1

2\. Paste Agent C's Day 1 prompt into Session 3 (can start in parallel with A — independent work)

3\. Wait for Agent A's PR to merge, then paste Agent B's Day 1 prompt into Session 2



Then come back here and paste each agent's Day 1 report when done.



Let's ship.

