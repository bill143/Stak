\# Stak — V1 Master Build Specification



\*\*Version:\*\* 1.2

\*\*Status:\*\* Locked for build

\*\*Owner:\*\* Bill Asmar

\*\*Last updated:\*\* April 25, 2026

\*\*Codename:\*\* Stak (final brand name TBD — naming research in parallel during build week)

\*\*GitHub:\*\* https://github.com/bill143/Stak



\---



\## 0. Document Purpose



This is the single source of truth for building Stak V1. It is designed to be handed directly to Claude Code (or split across multiple parallel Claude Code agents) as the executable specification. Every architectural decision, data model, page, feature, and edge case has been pre-resolved so the implementation team can focus on building, not deciding.



When in doubt during implementation, \*\*this document wins\*\*. If something is ambiguous here, stop and resolve it before guessing.



\*\*A note on the name:\*\* "Stak" is the working codename for the build. The "AI prompt tool" naming space is heavily saturated in 2026 — Promptly, PromptForge, PromptVault, PromptDesk, Quill, Recall, and Keystone are all already in use by AI companies. Real branding research will run in parallel during the build week so we ship under a name that has a clean domain, no trademark conflicts, and isn't already an established AI product. Throughout this document, the product is referred to as "Stak" — replace globally before public launch.



\---



\## 1. Product Overview



\### 1.1 What Stak Is



Stak is a universal prompt library for AI power users. It lets developers, builders, and technical knowledge workers save, organize, and reuse their best prompts across every AI tool they use — Claude, ChatGPT, Cursor, Ollama, and more. It also includes an encrypted API key vault so users can manage their AI provider credentials in one trusted place.



\### 1.2 Tagline



\*Your AI prompts, organized.\*



\### 1.3 One-Liner Pitch



Stak is the universal prompt library for AI power users — save, organize, and reuse your best prompts across Claude, ChatGPT, Cursor, Ollama, and any AI tool you work with.



\### 1.4 Three-Sentence Positioning



> For developers, builders, and AI power users who work across multiple AI tools daily, Stak is the universal prompt library that turns your scattered, copy-pasted prompts into a searchable, editable, AI-improvable knowledge base. Unlike a Notion doc or a folder of text files, Stak is purpose-built for prompts — with intelligent variants for each AI agent, an encrypted API key vault, and one-click handoff to wherever you're working. Stak is where your prompts live, so you stop reinventing them every time.



\### 1.5 Target User (Primary)



\*\*The Multi-Tool AI Builder\*\*



\- Software developer or technical knowledge worker

\- Uses 3+ AI tools daily (Claude Desktop, ChatGPT, Cursor, sometimes Ollama)

\- Has a `prompts.txt` file, a Notion page of prompts, or a folder full of `.md` files

\- Has lost a prompt at least once and wished they hadn't

\- Pays for at least one AI subscription

\- Earns $80k+ (will pay for tools that save them time)

\- Active on Twitter/X, follows AI builders, uses Cursor or Claude Code



\### 1.6 Brand \& Visual Identity



| Attribute | Decision |

|---|---|

| Personality | Confident, builder-first, fast, honest |

| Aesthetic reference | Linear, Raycast, Vercel |

| Primary mode | Dark-first (light mode V1.1) |

| Accent color | Electric blue `#3B82F6` with purple gradient highlights |

| UI typography | Inter |

| Code/prompt typography | JetBrains Mono |

| Logo direction | Stylized prompt/cursor mark — clean, geometric, monogrammable |



\---



\## 2. Business Model



\### 2.1 Pricing



| Tier | Price | Annual | Notes |

|---|---|---|---|

| Free | $0 | — | Honest tier, not a crippled trial |

| Pro | $9/month | $84/year (22% off) | Annual creates upsell |



| Product (in Stripe) | Price | Recurring |

|---|---|---|

| Stak Pro | $9.00 | Monthly |

| Stak Pro | $84.00 | Yearly |



\### 2.2 Tier Feature Matrix



| Feature | Free | Pro |

|---|---|---|

| Prompts | 25 max | Unlimited |

| Custom groups | 3 max | Unlimited |

| Layout modes | Detailed only | All 3 |

| Search \& filters | ✓ | ✓ |

| Edit prompts | ✓ | ✓ |

| Copy / Share via email | ✓ | ✓ |

| Multi-agent variants | 1 agent | All 8+ agents |

| AI Improve Prompt | 5/month | Unlimited |

| AI Generate Prompt | 5/month | Unlimited |

| API Vault — keys stored | 5 max | Unlimited |

| API Vault — cloud sync | — | ✓ (opt-in) |

| Shareable links | — | ✓ |

| Copy as .env builder | — | ✓ |

| Themes | Default only | All 6 + custom accent |

| Priority support | — | ✓ |



\### 2.3 Why These Limits



\- 25 prompts is enough to feel "I have a system" but not enough to live in long-term

\- 5 AI calls/month is enough to fall in love with AI Improve, not enough to satisfy daily use

\- API Vault gating to 5 keys is the strongest converter — once you have 6 keys saved, you'll pay $9 to keep them



\### 2.4 Payment Processor



\*\*Stripe\*\* — Checkout for upgrade flow, Customer Portal for self-service, webhooks for subscription events.



\### 2.5 Explicitly Out of V1 Business Model



\- No team tier

\- No usage-based pricing

\- No lifetime deal

\- No free trial of Pro (free tier IS the trial)

\- No annual-only tier — both monthly and annual offered



\---



\## 3. Tech Stack



\### 3.1 Confirmed Stack



```

Framework:       Next.js 14 (App Router)

Language:        TypeScript (strict mode)

UI:              shadcn/ui + Tailwind CSS

Database:        Supabase Postgres

ORM:             Prisma

Auth:            Supabase Auth (email + Google OAuth)

State (client):  Zustand

State (server):  TanStack Query

Payments:        Stripe (Checkout + Customer Portal + webhooks)

Encryption:      Web Crypto API + argon2-browser (WASM)

AI:              Anthropic SDK (primary), OpenAI SDK (variants)

Email:           Resend

Analytics:       PostHog

Error tracking:  Sentry

Deployment:      Vercel

File storage:    Supabase Storage (deferred to V1.1)

Monitoring:      Vercel Analytics + Sentry

Testing:         Vitest (unit), Playwright (E2E)

```



\### 3.2 Key Dependencies



```json

{

&#x20; "next": "14.x",

&#x20; "react": "18.x",

&#x20; "typescript": "5.x",

&#x20; "@supabase/supabase-js": "latest",

&#x20; "@supabase/ssr": "latest",

&#x20; "prisma": "latest",

&#x20; "@prisma/client": "latest",

&#x20; "zustand": "latest",

&#x20; "@tanstack/react-query": "latest",

&#x20; "stripe": "latest",

&#x20; "@anthropic-ai/sdk": "latest",

&#x20; "openai": "latest",

&#x20; "argon2-browser": "latest",

&#x20; "resend": "latest",

&#x20; "posthog-js": "latest",

&#x20; "@sentry/nextjs": "latest",

&#x20; "tailwindcss": "latest",

&#x20; "lucide-react": "latest",

&#x20; "zod": "latest",

&#x20; "react-hook-form": "latest",

&#x20; "@hookform/resolvers": "latest",

&#x20; "vitest": "latest",

&#x20; "@playwright/test": "latest"

}

```



\### 3.3 Folder Structure



```

/stak

├── app/

│   ├── (marketing)/

│   │   ├── page.tsx                  ← landing

│   │   ├── pricing/page.tsx

│   │   ├── resources/page.tsx

│   │   ├── security/page.tsx

│   │   ├── terms/page.tsx

│   │   ├── privacy/page.tsx

│   │   └── layout.tsx

│   ├── (auth)/

│   │   ├── signin/page.tsx

│   │   ├── signup/page.tsx

│   │   ├── forgot-password/page.tsx

│   │   ├── verify-email/page.tsx

│   │   └── layout.tsx

│   ├── (app)/

│   │   ├── library/

│   │   │   ├── page.tsx

│   │   │   ├── \[promptId]/page.tsx

│   │   │   └── components/

│   │   ├── vault/

│   │   │   ├── page.tsx

│   │   │   └── components/

│   │   ├── settings/

│   │   │   ├── page.tsx

│   │   │   ├── account/page.tsx

│   │   │   ├── appearance/page.tsx

│   │   │   ├── subscription/page.tsx

│   │   │   ├── data/page.tsx

│   │   │   ├── ai/page.tsx

│   │   │   ├── vault/page.tsx

│   │   │   ├── notifications/page.tsx

│   │   │   └── privacy/page.tsx

│   │   └── layout.tsx

│   ├── share/\[token]/page.tsx        ← public shared prompts

│   ├── api/

│   │   ├── ai/

│   │   │   ├── generate/route.ts

│   │   │   ├── improve/route.ts

│   │   │   └── translate-variant/route.ts

│   │   ├── prompts/

│   │   │   └── \[...].ts

│   │   ├── share/

│   │   │   └── \[...].ts

│   │   └── stripe/

│   │       └── webhook/route.ts

│   └── layout.tsx

├── components/

│   ├── ui/                           ← shadcn primitives

│   ├── library/

│   ├── vault/

│   ├── marketing/

│   ├── settings/

│   └── shared/

├── lib/

│   ├── crypto/

│   │   ├── vault.ts                  ← AES-GCM + Argon2 wrapper

│   │   └── tokens.ts

│   ├── supabase/

│   │   ├── client.ts                 ← browser client

│   │   ├── server.ts                 ← server client

│   │   └── middleware.ts

│   ├── stripe/

│   │   ├── client.ts

│   │   └── webhooks.ts

│   ├── ai/

│   │   ├── anthropic.ts

│   │   ├── openai.ts

│   │   ├── providers.ts              ← unified interface

│   │   └── prompts.ts                ← system prompts for AI features

│   ├── agents/

│   │   └── profiles.ts               ← agent metadata

│   ├── seed/

│   │   └── prompts.ts                ← 73 pre-seeded prompts

│   ├── validation/

│   │   └── schemas.ts                ← Zod schemas

│   └── utils/

├── prisma/

│   ├── schema.prisma

│   └── migrations/

├── public/

├── styles/

│   └── globals.css

├── tests/

│   ├── unit/

│   └── e2e/

├── .env.example

├── next.config.js

├── tailwind.config.ts

├── tsconfig.json

├── package.json

└── README.md

```



\---



\## 4. Data Model (Prisma Schema)



```prisma

// schema.prisma



generator client {

&#x20; provider = "prisma-client-js"

}



datasource db {

&#x20; provider = "postgresql"

&#x20; url      = env("DATABASE\_URL")

&#x20; directUrl = env("DIRECT\_URL")

}



model User {

&#x20; id              String    @id @default(uuid())

&#x20; email           String    @unique

&#x20; name            String?

&#x20; avatarUrl       String?

&#x20; emailVerified   DateTime?

&#x20; createdAt       DateTime  @default(now())

&#x20; updatedAt       DateTime  @updatedAt



&#x20; // Subscription

&#x20; stripeCustomerId      String?  @unique

&#x20; stripeSubscriptionId  String?  @unique

&#x20; subscriptionStatus    String?  // 'free' | 'active' | 'canceled' | 'past\_due'

&#x20; subscriptionTier      String   @default("free") // 'free' | 'pro'

&#x20; subscriptionPeriodEnd DateTime?



&#x20; // Usage tracking (for free tier limits)

&#x20; aiImproveCount       Int      @default(0)

&#x20; aiGenerateCount      Int      @default(0)

&#x20; usageResetAt         DateTime @default(now())



&#x20; // Settings

&#x20; preferences          Json?    // { theme, layout, defaultAgent, etc. }



&#x20; // Relations

&#x20; groups               Group\[]

&#x20; prompts              Prompt\[]

&#x20; vaultProviders       VaultProvider\[]

&#x20; shareLinks           ShareLink\[]

&#x20; vaultMaster          VaultMaster?

}



model Group {

&#x20; id          String   @id @default(uuid())

&#x20; userId      String

&#x20; name        String

&#x20; icon        String   @default("📁")

&#x20; color       String   @default("blue")

&#x20; isCustom    Boolean  @default(true)

&#x20; position    Int      @default(0)

&#x20; createdAt   DateTime @default(now())

&#x20; updatedAt   DateTime @updatedAt



&#x20; user        User     @relation(fields: \[userId], references: \[id], onDelete: Cascade)

&#x20; prompts     Prompt\[]



&#x20; @@index(\[userId])

}



model Prompt {

&#x20; id              String   @id @default(uuid())

&#x20; userId          String

&#x20; groupId         String

&#x20; title           String

&#x20; description     String?

&#x20; whatItDoes      String?  @db.Text

&#x20; howItWorks      Json?    // string\[]

&#x20; whyDC           String?  @db.Text

&#x20; tags            String\[] @default(\[])

&#x20; bestFor         String\[] @default(\[])

&#x20; category        String   @default("other")

&#x20; icon            String   @default("📄")

&#x20; template        String   @db.Text

&#x20; placeholders    Json?    // { key, label, sample }\[]

&#x20; primaryAgent    String   @default("claude-desktop")

&#x20; variants        Json?    // PromptVariant\[]

&#x20; isSeed          Boolean  @default(false)

&#x20; isCustom        Boolean  @default(true)

&#x20; isAiGenerated   Boolean  @default(false)

&#x20; isVerified      Boolean  @default(false)

&#x20; position        Int      @default(0)

&#x20; createdAt       DateTime @default(now())

&#x20; updatedAt       DateTime @updatedAt



&#x20; user            User       @relation(fields: \[userId], references: \[id], onDelete: Cascade)

&#x20; group           Group      @relation(fields: \[groupId], references: \[id], onDelete: Cascade)

&#x20; shareLinks      ShareLink\[]



&#x20; @@index(\[userId])

&#x20; @@index(\[groupId])

&#x20; @@index(\[userId, primaryAgent])

}



// PromptVariant is stored as JSON inside Prompt.variants

// Schema:

// {

//   agent: string;

//   template: string;

//   placeholders: { key, label, sample }\[];

//   howItWorks?: string\[];

//   whyApplicable?: string;

// }



model VaultMaster {

&#x20; id              String   @id @default(uuid())

&#x20; userId          String   @unique

&#x20; // Argon2id hash params used for KDF (so we can verify and re-derive)

&#x20; saltBase64      String

&#x20; iterations      Int      @default(3)

&#x20; memorySize      Int      @default(65536)

&#x20; parallelism     Int      @default(4)

&#x20; // We store NOTHING that lets us recover the master password

&#x20; hint            String?  // optional user-set hint

&#x20; cloudSyncEnabled Boolean @default(false)

&#x20; autoLockMinutes Int      @default(15)

&#x20; createdAt       DateTime @default(now())

&#x20; updatedAt       DateTime @updatedAt



&#x20; user            User     @relation(fields: \[userId], references: \[id], onDelete: Cascade)

}



model VaultProvider {

&#x20; id          String   @id @default(uuid())

&#x20; userId      String

&#x20; providerId  String   // 'anthropic' | 'openai' | 'openrouter' | etc.

&#x20; position    Int      @default(0)

&#x20; createdAt   DateTime @default(now())



&#x20; user        User     @relation(fields: \[userId], references: \[id], onDelete: Cascade)

&#x20; keys        VaultKey\[]



&#x20; @@unique(\[userId, providerId])

&#x20; @@index(\[userId])

}



model VaultKey {

&#x20; id              String   @id @default(uuid())

&#x20; providerId      String   // foreign key to VaultProvider

&#x20; // Ciphertext only — we cannot decrypt this

&#x20; encryptedBlob   String   @db.Text  // base64-encoded ciphertext

&#x20; ivBase64        String              // base64-encoded IV for AES-GCM

&#x20; // Metadata that's safe to store unencrypted

&#x20; displayName     String

&#x20; isLocked        Boolean  @default(false)

&#x20; notes           String?  @db.Text

&#x20; projectTag      String?

&#x20; lastTestedAt    DateTime?

&#x20; lastUsedAt      DateTime?

&#x20; testStatus      String?  // 'success' | 'failed' | 'untested'

&#x20; rotateRemindAt  DateTime?

&#x20; createdAt       DateTime @default(now())

&#x20; updatedAt       DateTime @updatedAt



&#x20; provider        VaultProvider @relation(fields: \[providerId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[providerId])

}



model ShareLink {

&#x20; id          String   @id @default(uuid())

&#x20; userId      String

&#x20; promptId    String

&#x20; token       String   @unique  // cryptographically random

&#x20; views       Int      @default(0)

&#x20; saves       Int      @default(0)

&#x20; expiresAt   DateTime?

&#x20; isRevoked   Boolean  @default(false)

&#x20; createdAt   DateTime @default(now())



&#x20; user        User     @relation(fields: \[userId], references: \[id], onDelete: Cascade)

&#x20; prompt      Prompt   @relation(fields: \[promptId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[token])

&#x20; @@index(\[userId])

}



model UsageEvent {

&#x20; id          String   @id @default(uuid())

&#x20; userId      String

&#x20; eventType   String   // 'ai\_improve' | 'ai\_generate' | 'vault\_copy' | 'share\_view' | etc.

&#x20; metadata    Json?

&#x20; createdAt   DateTime @default(now())



&#x20; @@index(\[userId, eventType, createdAt])

}

```



\### 4.1 Important Schema Notes



\- \*\*No plaintext API keys are ever stored.\*\* `VaultKey.encryptedBlob` is ciphertext that the server cannot decrypt.

\- \*\*`UsageEvent`\*\* is for product analytics + free tier rate limiting. It's append-only.

\- \*\*`isSeed`\*\* marks prompts that came from the seed library. They cannot be deleted by the user, only edited (which creates an override).

\- \*\*`primaryAgent`\*\* + \*\*`variants` (JSON)\*\* implements the hybrid multi-agent design. Variants are kept as JSON because they're always read together with the primary prompt.

\- \*\*Cascade deletes\*\* are intentional everywhere — when a user deletes their account, everything goes.



\---



\## 5. Authentication



\### 5.1 Auth Flow



Supabase Auth handles the heavy lifting. We support:



\- \*\*Email + password signup\*\* with email verification required before app access

\- \*\*Google OAuth\*\* for one-click signup

\- \*\*Forgot password\*\* flow with email reset link

\- \*\*Session via httpOnly cookies\*\* managed by `@supabase/ssr`



\### 5.2 Page Routes



| Route | Purpose |

|---|---|

| `/signin` | Email or Google sign-in |

| `/signup` | Create new account |

| `/forgot-password` | Request reset email |

| `/reset-password?token=...` | Set new password |

| `/verify-email?token=...` | Confirm email |



\### 5.3 Middleware



A single Next.js middleware (`middleware.ts`) protects `/(app)/\*` routes. Unauthenticated users are redirected to `/signin?redirect=...`. The redirect param sends them back to where they were headed after signin.



\### 5.4 Onboarding (post-signup)



After first signup, the user is taken to `/library` with a one-time onboarding overlay that:



1\. Welcomes them by name

2\. Shows the seeded prompts pre-loaded

3\. Highlights the search bar, filters, and AI Generate button

4\. Optionally offers to set up the Vault (skippable)



The overlay can be dismissed and never reappears.



\---



\## 6. Marketing Site



\### 6.1 Pages



| Route | Purpose |

|---|---|

| `/` | Landing page |

| `/pricing` | Pricing tiers + FAQ |

| `/resources` | Links to guides, blog (placeholder), changelog |

| `/security` | Vault threat model, encryption explanation |

| `/terms` | ToS |

| `/privacy` | Privacy Policy |



\### 6.2 Landing Page Structure



```

1\. Nav: Logo | Use Cases | Pricing | Resources | \[Sign in] \[Get started]

2\. Hero

&#x20;  - Headline: "Your AI prompts, organized."

&#x20;  - Subhead: "The universal prompt library for Claude, ChatGPT, Cursor, Ollama,

&#x20;    and every AI tool you use."

&#x20;  - Primary CTA: "Start free →"

&#x20;  - Secondary CTA: "See how it works"

&#x20;  - Visual: Animated app screenshot (the prompt detail page)



3\. Social proof bar

&#x20;  - "Built for users of: \[Claude logo] \[ChatGPT logo] \[Cursor logo] \[Ollama logo] \[+4 more]"



4\. Three-pillar feature section

&#x20;  - "Save once, use everywhere"

&#x20;  - "Improve prompts with AI"

&#x20;  - "Encrypted API key vault"



5\. Feature deep-dives (alternating left/right)

&#x20;  - Multi-agent variants ("One prompt. Every AI.")

&#x20;  - AI Improve ("Make every prompt better with one click.")

&#x20;  - API Vault ("All your AI keys, encrypted, in one place.")



6\. Pricing teaser → "Start free, upgrade when you outgrow it" → CTA



7\. Testimonial slot (placeholder until we have real ones)



8\. Final CTA

&#x20;  - "Stop reinventing your prompts."

&#x20;  - "\[Get started free →]"



9\. Footer

&#x20;  - Product / Resources / Legal columns

&#x20;  - Social icons

```



\### 6.3 Pricing Page



Tier comparison cards (Free vs Pro, side-by-side), Monthly/Yearly toggle, "Choose how you power your AI" section, FAQ accordion (12-15 questions), Footer CTA.



\### 6.4 Security Page



This is a strategic marketing asset. Layout:



```

H1: "Your API keys, your control."



Section 1: "Why we built the vault this way"

Section 2: "How encryption works" (with a simple diagram)

Section 3: "What we can't do" (we cannot decrypt your keys, etc.)

Section 4: "What we promise"

Section 5: FAQ

```



This builds trust with the security-conscious developer audience and is shareable on Twitter.



\---



\## 7. App: Prompt Library



\### 7.1 Library Page (`/library`)



Top of page (sticky):

\- Header bar: page title + \[+ Add Group] \[+ Create Prompt] \[✨ AI Generate]

\- Help banner (collapsible): "How to set this up in Claude" with 4-step instructions

\- Search input

\- Layout toggle: Detailed / Compact / List

\- Group filter pills (All + each group with count)

\- Agent filter dropdown (All / Claude Desktop / Claude Code / etc.)

\- Stats line: "X prompts shown"



Body: Grid of prompt cards based on layout mode. Empty state if no prompts match.



\### 7.2 Three Layout Modes



\*\*Detailed\*\* — Full card with title, category tag, description, prompt preview (truncated), Edit/Open buttons.



\*\*Compact\*\* — Smaller card with icon, title, 1-line description, agent badge. Click opens detail.



\*\*List\*\* — Single-line rows: icon, title, group, agent, edited/custom badge. Click opens detail.



\### 7.3 Prompt Detail Page (`/library/\[promptId]`)



Layout:



```

← Back to library



\[Icon] Title

\[Verified] \[Tag] \[Tag] \[edited] \[custom] \[AI]



Agent tabs: \[Claude Desktop\*] \[Claude Code] \[ChatGPT] \[+ Add variant]



== What this prompt does ==

{whatItDoes}



== How it works ==

1\. {step}

2\. {step}

...



(optional) Why Desktop Commander? \[callout]



Best for: \[Role] \[Role] \[Role]



== The Prompt ==                              \[📋 Copy text]

\[scrollable prompt box with placeholder highlighting]



\[Placeholder fields, inline]

folder: \[\_\_\_\_\_\_\_\_\_\_\_\_]

filename: \[\_\_\_\_\_\_\_\_\_\_\_\_]



== Ready to run this prompt? ==

\[⚡ Run in {agent} ←button]



Footer:

\[← Library] | \[✉ Share email] \[🔗 Share link] \[✏ Edit] \[↻ Reset] \[🗑 Delete]

```



\### 7.4 Edit Prompt Modal



Full-screen overlay (or right-drawer on desktop). Editable fields:

\- Title

\- Group (dropdown)

\- Category

\- Short description

\- What this prompt does

\- How it works (textarea, one step per line)

\- Why DC (optional)

\- Tags (comma-separated)

\- Best for (comma-separated)

\- Primary agent (dropdown)

\- Template (with `{key}` placeholders)

\- Placeholders (key/label/sample, add/remove rows)

\- \*\*✨ Improve with AI\*\* button (top-right, sends entire draft to Claude for full polish)



Buttons: \[Cancel] \[Save]



\### 7.5 Variants UX



On the detail page, the agent tab strip shows:

\- Primary agent (always present, marked with `\*`)

\- Each existing variant as its own tab

\- A `\[+ Add variant]` button that opens an agent picker



Clicking `+ Add variant` lets the user:

\- Pick an agent

\- Choose: "Generate with AI" (uses Claude to translate the primary to the new agent's style) OR "Start blank"



Variants are fully editable independently of the primary.



\### 7.6 Search Behavior



\- Searches across: title, description, whatItDoes, template, tags, bestFor

\- Case-insensitive

\- Debounced 200ms

\- Client-side for the user's own prompts (fast, no roundtrip)



\### 7.7 Filters



\- \*\*Group:\*\* click pill or use dropdown on mobile

\- \*\*Agent:\*\* dropdown next to layout toggle

\- Filters combine (AND): "Group A AND Agent B"

\- "Clear filters" link appears when any filter is active



\### 7.8 Seed Prompts



73 prompts pre-seeded into a new user's library across the 7 default groups. The seed data lives in `/lib/seed/prompts.ts` and is inserted via a Supabase trigger or onSignup hook.



Marked with `isSeed: true`. Seed prompts can be edited (which creates an override) but not deleted from the canonical seed list — though the user can hide them via a "Hide" action that filters them out of view.



\---



\## 8. App: API Vault



\### 8.1 First-Time Vault Setup



When the user first opens `/vault`, they see a setup screen:



```

🔐 Set up your vault



Your API keys are encrypted on your device. We can never read them.



\[ ] I understand that if I forget my master password,

&#x20;   my keys are unrecoverable.



Master password: \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_]

Confirm:         \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_]

Hint (optional): \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_]



\[Set up vault →]

```



Implementation:

\- Generate a random 16-byte salt, store in `VaultMaster` row

\- Master password is run through Argon2id with that salt → derives 32-byte AES key

\- AES key is held only in memory during session (and IndexedDB if user opts into "remember for session")

\- A canary value (a known plaintext encrypted with the derived key) is stored to verify the password on subsequent unlocks



\### 8.2 Vault Lock/Unlock



\- Vault locks automatically after `autoLockMinutes` of inactivity (default 15 min)

\- Vault locks on browser close

\- When locked, `/vault` shows an unlock screen — enter master password

\- All other app pages remain functional when vault is locked



\### 8.3 Vault Page Layout



```

🔐 API Vault                              \[Lock] \[Settings]



Stats: 23 keys across 6 providers · 4 locked · 19 active



Quick actions:

\[🎯 Build .env for project] \[📋 Copy all unlocked] \[🔍 Search keys]



Provider cards (one per provider):

┌─────────────────────────────────────────────┐

│ 🅰️  Anthropic              \[+ Add Key]      │

│ ───────────────────────────────────────────  │

│ 🔓 Production         sk-ant-...8k2j  ✓      │

│ 🔒 Personal Dev       sk-ant-...4mxq  ✓      │

│ 🔓 Testing            sk-ant-...9q2p  ✓      │

│ ───────────────────────────────────────────  │

│ \[Get a new key →] \[Test all] \[Copy .env]     │

└─────────────────────────────────────────────┘

```



\### 8.4 Add Key Flow



Click `+ Add Key`:



```

Add API Key



Display name \*: \[\_\_\_\_\_\_\_\_\_\_\_\_\_]

Key \*:          \[\_\_\_\_\_\_\_\_\_\_\_\_\_]  (paste — auto-detects provider)

Provider:       \[auto-detected, override available]

Lock this key:  \[ ]

Project tag:    \[optional]

Notes:          \[optional]



\[Cancel] \[Test \& Save]

```



Auto-detection logic:



```ts

const PROVIDER\_PATTERNS = {

&#x20; 'sk-ant-': 'anthropic',

&#x20; 'sk-or-v1-': 'openrouter',

&#x20; 'sk-': 'openai', // fallback after others

&#x20; 'xi-': 'elevenlabs',

&#x20; 'hf\_': 'huggingface',

&#x20; 'gsk\_': 'groq',

};

```



`Test \& Save` makes a live test call to the provider's lightest endpoint before saving.



\### 8.5 Pre-Configured Providers



| Provider | Key dashboard URL | Detection prefix | Test endpoint |

|---|---|---|---|

| Anthropic | console.anthropic.com/settings/keys | `sk-ant-` | POST /v1/messages (max 1 token) |

| OpenAI | platform.openai.com/api-keys | `sk-` (general) | GET /v1/models |

| OpenRouter | openrouter.ai/keys | `sk-or-v1-` | GET /api/v1/models |

| ElevenLabs | elevenlabs.io/app/settings/api-keys | `xi-` | GET /v1/user |

| ngrok | dashboard.ngrok.com/api | (varies) | GET /api/credentials |

| Hugging Face | huggingface.co/settings/tokens | `hf\_` | GET /api/whoami-v2 |

| Groq | console.groq.com/keys | `gsk\_` | GET /openai/v1/models |

| Mistral | console.mistral.ai/api-keys | (varies) | GET /v1/models |

| Cohere | dashboard.cohere.com/api-keys | (varies) | GET /v1/check-api-key |

| Ollama | localhost auto-detect | n/a | GET http://localhost:11434/api/tags |

| Custom | (user-defined) | (user-defined) | (user-defined) |



\### 8.6 Lock Toggle



\- Per-key lock toggle (icon + visual tint change)

\- Locked keys require an extra confirmation dialog before any copy or .env export operation

\- Bulk operations (Copy all unlocked) skip locked keys silently



\### 8.7 Build .env for Project



Multi-step modal:



```

Step 1: Pick providers

\[ ] Anthropic

\[ ] OpenAI

\[ ] OpenRouter

...

\[Next →]



Step 2: Pick keys per provider

For Anthropic, use:

&#x20; ( ) Production \[LOCKED]

&#x20; ( ) Personal Dev

&#x20; (•) Testing

For OpenRouter, use:

&#x20; ...

\[Back] \[Next →]



Step 3: Generated .env

ANTHROPIC\_API\_KEY=sk-ant-...

OPENROUTER\_API\_KEY=sk-or-v1-...

ELEVENLABS\_API\_KEY=xi-...



\[💾 Save as preset] \[📋 Copy] \[Done]

```



Presets are saved per-user as JSON in `User.preferences` and listed at the top of the Build .env modal next time.



\### 8.8 Cloud Sync (Pro Only, Opt-In)



When toggled on:

\- The encrypted blob (and metadata) syncs to Supabase

\- The server stores ciphertext only — we cannot decrypt

\- If user logs in on a new device, they enter their master password to derive the same AES key, which decrypts the synced blobs



Toggle in Settings → Vault → "Sync vault across devices".



\### 8.9 What the Server Sees vs. Cannot See



| Field | Server can see | Notes |

|---|---|---|

| User's email | ✓ | Standard |

| Master password | ✗ | Never sent |

| AES key | ✗ | Derived client-side only |

| Plaintext API keys | ✗ | Encrypted before transit |

| Key display name | ✓ | Metadata, unencrypted |

| Provider | ✓ | Metadata |

| Lock status | ✓ | Metadata |

| Notes | ✓ | Metadata (encourage user not to put secrets here) |

| Encrypted ciphertext | ✓ | But cannot decrypt |

| Test status | ✓ | Just success/fail flag |

| Last used timestamp | ✓ | Metadata |



\---



\## 9. App: AI Features



\### 9.1 AI Improve Prompt



Triggered from the Edit modal (`✨ Improve with AI` button).



\*\*API route:\*\* `POST /api/ai/improve`



\*\*Request body:\*\*

```json

{

&#x20; "promptDraft": {

&#x20;   "title": "...",

&#x20;   "description": "...",

&#x20;   "whatItDoes": "...",

&#x20;   "howItWorks": \[...],

&#x20;   "whyDC": "...",

&#x20;   "tags": \[...],

&#x20;   "bestFor": \[...],

&#x20;   "category": "...",

&#x20;   "groupId": "...",

&#x20;   "primaryAgent": "...",

&#x20;   "template": "...",

&#x20;   "placeholders": \[...]

&#x20; }

}

```



\*\*Server logic:\*\*

1\. Verify user is authenticated

2\. Check usage limits (free: 5/month) — if exceeded, return 402 with upgrade CTA

3\. Build the system prompt

4\. Call Anthropic API (model: `claude-sonnet-4-5`)

5\. Parse JSON response

6\. Validate against Zod schema

7\. Increment `User.aiImproveCount`

8\. Return improved draft to client



\*\*Response:\*\*

```json

{

&#x20; "improved": { ...same shape as request },

&#x20; "usage": { "remaining": 4, "limit": 5 }

}

```



\### 9.2 AI Generate Prompt



Triggered from the main library (`✨ AI Generate` button).



\*\*API route:\*\* `POST /api/ai/generate`



\*\*Request body:\*\*

```json

{

&#x20; "userIdea": "free-text description from user",

&#x20; "targetGroup": "auto" | "<groupId>",

&#x20; "targetAgent": "auto" | "<agentId>"

}

```



Same auth + usage check as Improve. System prompt instructs Claude to produce a complete prompt entry. Returns full draft for user to review before saving.



\### 9.3 Translate Variant



Triggered from the prompt detail page when user clicks `+ Add variant` and selects "Generate with AI".



\*\*API route:\*\* `POST /api/ai/translate-variant`



\*\*Request body:\*\*

```json

{

&#x20; "promptId": "...",

&#x20; "fromAgent": "claude-desktop",

&#x20; "toAgent": "chatgpt"

}

```



Loads the source prompt's primary or selected variant. Loads agent profiles for both source and target. Asks Claude to rewrite the template adapting to target agent capabilities. Preserves placeholder keys exactly. Returns new variant draft for user review.



\### 9.4 Usage Limits \& Reset



\- Free tier: 5 AI Improve + 5 AI Generate per \*\*calendar month\*\*

\- Reset job: a daily Vercel cron at 00:00 UTC checks if `User.usageResetAt` is more than 30 days old; if so, resets counters to 0

\- When user upgrades to Pro, counters become irrelevant (no limit applied)



\### 9.5 System Prompts (lib/ai/prompts.ts)



Three system prompts, each carefully crafted:



\*\*`improvePromptSystemPrompt`\*\* — instructs Claude to improve all 11 fields, preserve intent, preserve placeholder keys, return JSON only.



\*\*`generatePromptSystemPrompt`\*\* — instructs Claude to generate a complete prompt entry from a free-text description, pick the right group from a list, return JSON only.



\*\*`translateVariantSystemPrompt`\*\* — instructs Claude to rewrite a prompt for a different agent, using agent profile capabilities to inform the adaptation.



\### 9.6 Models Used



| Feature | Model | Rationale |

|---|---|---|

| AI Improve | claude-sonnet-4-5 | Fast, high quality, lower cost |

| AI Generate | claude-sonnet-4-5 | Same |

| Translate variant | claude-sonnet-4-5 | Same |



These can be made configurable in Settings → AI Behavior for Pro users.



\---



\## 10. Sharing



\### 10.1 Share via Email



Click `✉ Share email` on detail page → opens `mailto:` with prefilled:

\- Subject: `Prompt: {title}`

\- Body: title + description + full prompt text + signature with link to product



\### 10.2 Shareable Links



Click `🔗 Share link` → modal:



```

Share this prompt



Anyone with this link can view the prompt.

Filled-in placeholder values are NOT shared.



\[ Generate link ]



Once generated:

https://<app-domain>/share/abc123def456...



\[Copy link] \[Revoke] \[Expires: never ▼]

```



\*\*Backend:\*\*

\- `POST /api/share` creates a `ShareLink` row with crypto-random 16-byte token

\- `GET /share/\[token]` is a public Next.js page that fetches the prompt by token (no auth required)

\- Visit count incremented on view

\- "Save to my library" button on the public page → if logged in, copies the prompt; if not, redirects to signup with a query param to copy after signup



\*\*Public share page:\*\*

\- Read-only view of the prompt

\- Shows: "Shared by @username · X views"

\- "Save this prompt to your library →" CTA (signup if needed)

\- "Get Stak free" footer



\---



\## 11. Settings (9 Categories)



\### 11.1 Account

\- Display name

\- Email (read-only, change via verification)

\- Change password

\- Delete account (confirms, exports data first)



\### 11.2 Appearance

\- Theme picker: 6 presets (Midnight, Slate, Obsidian, Royal, Forest, Sunset)

\- Custom accent color picker

\- Card density: Compact / Normal / Spacious

\- Font size: Small / Medium / Large

\- Background gradient toggle



\### 11.3 Subscription

\- Current tier

\- Stripe Customer Portal embed: upgrade, downgrade, update card, cancel

\- Usage stats (AI calls used this month, prompts saved, etc.)



\### 11.4 Data

\- Export library (JSON download — all prompts, groups, vault metadata WITHOUT decrypted keys)

\- Import library (paste/upload JSON)

\- Clear placeholder values only (resets all filled-in fields)

\- Reset to defaults (deletes custom prompts/groups, restores seed library) — confirmation required



\### 11.5 AI Behavior

\- Default model for AI features (Pro only)

\- Temperature slider 0.0–1.0

\- "Always preserve user-specific paths" toggle

\- Custom system prompt addendum (Pro, advanced)



\### 11.6 Vault

\- Master password change (requires current)

\- Auto-lock minutes: 1 / 15 / 60 / Never

\- Lock on browser close: toggle

\- Cloud sync: toggle (Pro only)

\- Master password hint: edit

\- Export vault (encrypted JSON backup)

\- Reset vault (destroys all keys — confirmation required)



\### 11.7 Notifications

\- Email: product updates (toggle)

\- Email: weekly summary (toggle)

\- Email: usage alerts (toggle)

\- Email: security alerts (always on, no toggle)



\### 11.8 Privacy

\- Storage usage indicator

\- Analytics opt-out toggle (PostHog)

\- Crash reporting opt-out toggle (Sentry)

\- Clear all stored data (local browser data)

\- Privacy policy link



\### 11.9 About

\- Version number

\- Total prompts count

\- Total groups count

\- Total vault keys count

\- Storage used (KB)

\- Last backup timestamp

\- Links: Documentation, Changelog, Support, GitHub (if public), Status page



\---



\## 12. Multi-Agent Configuration



\### 12.1 Agent Profiles (lib/agents/profiles.ts)



```ts

export const AGENTS = {

&#x20; 'claude-desktop': {

&#x20;   id: 'claude-desktop',

&#x20;   name: 'Claude Desktop',

&#x20;   icon: '🖥️',

&#x20;   capabilities: \['filesystem', 'terminal', 'mcp'],

&#x20;   description: 'Anthropic\\'s desktop client with Desktop Commander MCP for file operations.',

&#x20;   translationHint: 'Has direct filesystem access via Desktop Commander. Can read, write, delete files and run shell commands. Use specific file paths.',

&#x20;   keyDashboardUrl: 'https://console.anthropic.com/settings/keys',

&#x20;   requiresKey: true,

&#x20;   keyProvider: 'anthropic',

&#x20; },

&#x20; 'claude-code': {

&#x20;   id: 'claude-code',

&#x20;   name: 'Claude Code',

&#x20;   icon: '💻',

&#x20;   capabilities: \['filesystem', 'terminal', 'git', 'autonomous-execution'],

&#x20;   description: 'Anthropic\\'s agentic coding CLI for autonomous development.',

&#x20;   translationHint: 'Operates autonomously in a code repository. Can edit files, run commands, commit changes. Best for multi-step development tasks.',

&#x20;   keyDashboardUrl: 'https://console.anthropic.com/settings/keys',

&#x20;   requiresKey: true,

&#x20;   keyProvider: 'anthropic',

&#x20; },

&#x20; 'claude-web': {

&#x20;   id: 'claude-web',

&#x20;   name: 'Claude.ai',

&#x20;   icon: '🌐',

&#x20;   capabilities: \['web-search', 'artifacts', 'projects'],

&#x20;   description: 'Anthropic\\'s web client. No filesystem access by default.',

&#x20;   translationHint: 'No filesystem access. User pastes content into the chat. Best for analysis, writing, conversation.',

&#x20;   keyDashboardUrl: null,

&#x20;   requiresKey: false,

&#x20; },

&#x20; 'chatgpt': {

&#x20;   id: 'chatgpt',

&#x20;   name: 'ChatGPT',

&#x20;   icon: '🤖',

&#x20;   capabilities: \['web-browsing', 'code-interpreter', 'image-generation'],

&#x20;   description: 'OpenAI\\'s ChatGPT. No filesystem access by default; Code Interpreter handles uploads.',

&#x20;   translationHint: 'No persistent filesystem. Code Interpreter can run Python on uploaded files. Use natural language and provide context.',

&#x20;   keyDashboardUrl: 'https://platform.openai.com/api-keys',

&#x20;   requiresKey: true,

&#x20;   keyProvider: 'openai',

&#x20; },

&#x20; 'cursor': {

&#x20;   id: 'cursor',

&#x20;   name: 'Cursor',

&#x20;   icon: '✏️',

&#x20;   capabilities: \['filesystem', 'codebase-context', 'inline-edit'],

&#x20;   description: 'AI-first code editor.',

&#x20;   translationHint: 'Built into the editor. Has full codebase context. Best for code-focused prompts and rules-style instructions.',

&#x20;   keyDashboardUrl: null,

&#x20;   requiresKey: false,

&#x20; },

&#x20; 'windsurf': {

&#x20;   id: 'windsurf',

&#x20;   name: 'Windsurf',

&#x20;   icon: '🌊',

&#x20;   capabilities: \['filesystem', 'codebase-context', 'agentic'],

&#x20;   description: 'Codeium\\'s agentic AI IDE.',

&#x20;   translationHint: 'Similar to Cursor. Agentic flows. Codebase-aware.',

&#x20;   keyDashboardUrl: null,

&#x20;   requiresKey: false,

&#x20; },

&#x20; 'ollama': {

&#x20;   id: 'ollama',

&#x20;   name: 'Ollama',

&#x20;   icon: '🦙',

&#x20;   capabilities: \['local', 'private', 'offline'],

&#x20;   description: 'Run open-source models locally on your machine.',

&#x20;   translationHint: 'Local model. Limited reasoning compared to frontier models. Use simpler, more direct prompts. No internet/filesystem unless tools added.',

&#x20;   keyDashboardUrl: 'http://localhost:11434',

&#x20;   requiresKey: false,

&#x20; },

&#x20; 'custom': {

&#x20;   id: 'custom',

&#x20;   name: 'Custom',

&#x20;   icon: '⚙️',

&#x20;   capabilities: \[],

&#x20;   description: 'User-defined agent.',

&#x20;   translationHint: 'User-defined.',

&#x20;   keyDashboardUrl: null,

&#x20;   requiresKey: false,

&#x20; },

} as const;

```



\---



\## 13. Stripe Billing



\### 13.1 Products \& Prices



(See Section 2.1 for the canonical Stripe product/price table.)



Both prices belong to the same Product so users can switch between cycles via Customer Portal.



\### 13.2 Upgrade Flow



1\. User clicks "Upgrade to Pro" anywhere in the app (settings, paywall modal, marketing page)

2\. Server creates a Stripe Checkout Session with the user's Stripe customer ID (creates one if needed)

3\. Redirect to Stripe Checkout

4\. User completes payment

5\. Stripe redirects to `/settings/subscription?success=true`

6\. Webhook receives `checkout.session.completed` and `customer.subscription.created` → updates `User.subscriptionTier = 'pro'`



\### 13.3 Webhook Handler (`/api/stripe/webhook`)



Handle these events:



| Event | Action |

|---|---|

| `checkout.session.completed` | Mark user as Pro |

| `customer.subscription.updated` | Update tier and period end |

| `customer.subscription.deleted` | Downgrade to Free |

| `invoice.payment\_failed` | Mark `subscriptionStatus = 'past\_due'` + send email |

| `invoice.payment\_succeeded` | No-op (already handled) |



\### 13.4 Downgrade Flow



\- User cancels via Customer Portal

\- Stripe sets `cancel\_at\_period\_end = true`

\- We keep them on Pro until `subscriptionPeriodEnd`

\- Cron job or webhook on `customer.subscription.deleted` sets tier to Free

\- Their data is preserved; over-limit features (extra prompts, etc.) become read-only with upgrade prompt



\### 13.5 Free Tier Enforcement



| Limit | Where Enforced |

|---|---|

| 25 prompts | Server-side on prompt CREATE; client-side warning before |

| 3 groups | Server-side on group CREATE |

| 5 AI Improve / month | Server-side on AI route |

| 5 AI Generate / month | Server-side on AI route |

| 5 vault keys | Server-side on key CREATE |



When a Free user hits a limit, the API returns 402 with a structured error:



```json

{

&#x20; "error": "limit\_exceeded",

&#x20; "limit": "prompts",

&#x20; "current": 25,

&#x20; "max": 25,

&#x20; "upgradeUrl": "/settings/subscription"

}

```



The UI catches this and shows an upgrade modal.



\---



\## 14. Email (Resend)



\### 14.1 Transactional Emails



| Trigger | Subject | Template |

|---|---|---|

| Signup | Welcome to Stak | `welcome.tsx` |

| Email verification | Verify your email | `verify.tsx` |

| Forgot password | Reset your password | `reset-password.tsx` |

| Subscription started | You're on Pro 🎉 | `subscription-started.tsx` |

| Subscription canceled | Your Pro subscription will end on X | `subscription-canceled.tsx` |

| Payment failed | Action required: payment failed | `payment-failed.tsx` |



\### 14.2 Marketing Emails (V1.1)



Deferred to V1.1. Have the toggle in settings, but no marketing campaigns at launch.



\---



\## 15. Analytics (PostHog)



\### 15.1 Events to Track



| Event | Properties |

|---|---|

| `signup` | provider, source |

| `signin` | provider |

| `prompt\_created` | groupId, agent, isAiGenerated |

| `prompt\_edited` | promptId |

| `prompt\_copied` | promptId, agent |

| `prompt\_shared\_email` | promptId |

| `prompt\_shared\_link` | promptId |

| `share\_link\_viewed` | token |

| `share\_link\_saved` | token |

| `ai\_improve\_used` | model, success |

| `ai\_generate\_used` | model, success |

| `variant\_translated` | fromAgent, toAgent, success |

| `vault\_setup\_completed` | (none) |

| `vault\_key\_added` | provider |

| `vault\_key\_tested` | provider, success |

| `vault\_env\_built` | providerCount |

| `upgrade\_started` | source |

| `upgrade\_completed` | plan |

| `downgrade\_completed` | (none) |

| `limit\_hit` | limit\_type |



\### 15.2 Privacy



\- Disable session recording for `/vault/\*` routes

\- Mask all input fields by default (PostHog's default behavior)

\- Never capture: passwords, API keys, prompt template contents, master password

\- User can opt out in Settings → Privacy



\---



\## 16. Error Handling (Sentry)



\- Capture all unhandled exceptions

\- Capture API route errors with user ID context (but never request bodies)

\- Specifically scrub: `password`, `apiKey`, `key`, `token`, `secret`, `template` from breadcrumbs and contexts

\- Per-route error boundaries in Next.js

\- User-facing error pages that don't leak stack traces



\---



\## 17. Performance Budgets



| Metric | Target |

|---|---|

| Largest Contentful Paint (LCP) | < 2.0s on 4G |

| First Input Delay (FID) | < 100ms |

| Cumulative Layout Shift (CLS) | < 0.1 |

| Time to Interactive | < 3.0s |

| Library page render with 100 prompts | < 200ms |

| Search debounce | 200ms |

| API route p95 | < 500ms (excluding AI calls) |

| AI Improve roundtrip | < 8s |



\---



\## 18. Accessibility



V1 minimum bar:



\- All interactive elements keyboard navigable

\- Focus indicators visible

\- ARIA labels on icon-only buttons

\- Color contrast WCAG AA minimum

\- Form errors announced to screen readers

\- Modals trap focus and restore on close

\- Skip-to-content link on every page



V1.1: full WCAG AA audit and remediation.



\---



\## 19. Testing Strategy



\### 19.1 Unit Tests (Vitest)



Cover:

\- Crypto utilities (encrypt, decrypt, key derivation)

\- Provider auto-detection

\- Free-tier limit checks

\- Placeholder substitution

\- Agent profile lookups

\- Stripe webhook handlers (mocked Stripe)



\### 19.2 E2E Tests (Playwright)



Critical user journeys:

1\. Signup → verify email → land on library

2\. Create prompt → edit → save

3\. Generate AI prompt → review → save

4\. Set up vault → add key → test → copy

5\. Build .env from vault → copy

6\. Share prompt → recipient saves

7\. Upgrade to Pro via Stripe (test mode)

8\. Sign in on second device → see synced data



\### 19.3 Manual Testing Checklist



Pre-launch checklist documented in `/tests/manual-checklist.md`:

\- All 9 settings pages

\- All 6 themes

\- All 3 layout modes

\- All 73 seed prompts render

\- All 11 vault providers

\- Mobile responsive on iPhone SE, iPhone 15 Pro Max, iPad



\---



\## 20. Deployment



\### 20.1 Environments



| Env | URL | Purpose |

|---|---|---|

| Local | localhost:3000 | Dev |

| Preview | stak-pr-N.vercel.app | Per-PR previews |

| Staging | (Vercel preview URL until final brand) | Pre-prod |

| Production | (final domain TBD post-naming research) | Live |



\### 20.2 Environment Variables



```

\# Auth \& DB

DATABASE\_URL=

DIRECT\_URL=

NEXT\_PUBLIC\_SUPABASE\_URL=

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=

SUPABASE\_SERVICE\_ROLE\_KEY=



\# Stripe

STRIPE\_SECRET\_KEY=

STRIPE\_WEBHOOK\_SECRET=

NEXT\_PUBLIC\_STRIPE\_PRICE\_MONTHLY=

NEXT\_PUBLIC\_STRIPE\_PRICE\_YEARLY=



\# AI

ANTHROPIC\_API\_KEY=

OPENAI\_API\_KEY=



\# Email

RESEND\_API\_KEY=

EMAIL\_FROM=



\# Analytics

NEXT\_PUBLIC\_POSTHOG\_KEY=

NEXT\_PUBLIC\_POSTHOG\_HOST=



\# Errors

SENTRY\_DSN=

SENTRY\_AUTH\_TOKEN=



\# App

NEXT\_PUBLIC\_APP\_URL=

NODE\_ENV=

```



\### 20.3 CI/CD (GitHub Actions)



Workflow on push to `main`:

1\. Lint

2\. Typecheck

3\. Unit tests

4\. Build

5\. E2E tests against preview

6\. Deploy to Vercel



\### 20.4 Domain \& DNS



\- Final domain pending naming research (see Section 23.1)

\- During build: use a Vercel-provided preview domain (`stak-build.vercel.app` or similar) for staging

\- HTTPS via Vercel (automatic)

\- Once final name is locked: register domain, update env vars, update all email/marketing copy

\- `www` → apex redirect



\---



\## 21. Launch Plan



\### 21.1 Pre-Launch (Days 1-12)



\- Build per Section 22 plan

\- Internal testing

\- Closed beta with 10-20 invited users

\- Polish based on feedback



\### 21.2 Launch (Day 14)



\- Twitter/X thread from your account

\- Post on r/ChatGPT, r/Anthropic, r/LocalLLaMA, r/SaaS

\- Submit to Product Hunt (schedule for a Tuesday)

\- Submit to Hacker News (Show HN)

\- Email 50 hand-picked early users from your network



\### 21.3 Week 1 Post-Launch



\- Daily monitoring of Sentry, PostHog, Stripe

\- Respond to all support emails within 24h

\- Push 1-2 small fixes per day based on real user feedback

\- Don't add features yet — fix issues



\### 21.4 Month 1 Post-Launch



\- Plan V1.1 based on top user requests

\- Share metrics openly on Twitter (transparency builds trust)

\- Build the public changelog page

\- Start the security blog post series



\---



\## 22. Build Plan (Parallel Agent Orchestration)



\### 22.1 Agent Allocation



Three Claude Code agents working in parallel on isolated areas:



\*\*Agent A — Backend \& Auth\*\*

\- Database schema (Prisma)

\- Migrations

\- Supabase setup

\- Auth flow + middleware

\- Seed prompts loader

\- API routes for prompts/groups CRUD

\- Stripe webhook handler



\*\*Agent B — Frontend Core\*\*

\- Marketing site (landing, pricing, security, resources)

\- Auth pages (signin, signup, forgot)

\- Library page + 3 layout modes

\- Detail page + Edit modal

\- Settings shell + 9 categories



\*\*Agent C — Vault \& AI\*\*

\- Vault encryption library (`lib/crypto/vault.ts`)

\- Vault page + setup flow + key management UI

\- Build .env modal

\- AI Improve / Generate / Translate API routes

\- AI feature UX integration



\### 22.2 Build Sequence



| Day | Agent A | Agent B | Agent C |

|---|---|---|---|

| 1 | Repo setup, Prisma schema, Supabase project | Repo setup, Tailwind, shadcn install, design tokens | (waits) |

| 2 | Auth middleware, signup/signin API | Marketing site (landing + pricing + security) | Crypto library, unit tests |

| 3 | Prompts CRUD API, seed loader | Auth pages, app shell, settings shell | Vault setup flow |

| 4 | Groups CRUD, share links API | Library page (detailed + compact + list) | Vault page (provider cards, add key) |

| 5 | Stripe Checkout + webhook | Detail page + Edit modal | Test connection + lock toggle |

| 6 | Subscription enforcement middleware | All 9 settings pages | Build .env modal |

| 7 | (joins B and C for integration) | Variant tabs + UX | AI Improve route + UI |

| 8 | Integration testing | Mobile responsive pass | AI Generate + Translate routes |

| 9 | Performance pass | Polish, animations | Vault cloud sync (Pro) |

| 10 | E2E tests | E2E tests | E2E tests |

| 11 | Bug fixes | Bug fixes | Bug fixes |

| 12 | Security review | Accessibility audit | Security review |

| 13 | Closed beta | Closed beta | Closed beta |

| 14 | Public launch | Public launch | Public launch |



\### 22.3 Orchestrator Responsibilities (Bill)



\- Lock spec (this document) — done

\- Provision: Supabase project, Stripe account, Resend account, PostHog account, Sentry project, Vercel project, domain

\- Daily standup with each agent (15 min) — review progress, unblock, integrate

\- Code review on PRs before merge

\- Final QA pass before launch

\- Drive marketing prep (landing copy polish, social assets, launch posts)



\---



\## 23. Open Decisions / Risks



\### 23.1 Open Decisions (Bill to confirm before launch)



\- \[ ] \*\*Final brand name + domain\*\* — naming research running in parallel during build week. Codename "Stak" used throughout this spec; before public launch, do a global find-and-replace once final brand is locked.

&#x20; - Note: "PromptDesk" was rejected as a codename mid-spec because an existing open-source product at github.com/promptdesk/promptdesk already uses the name in the same category. "Stak" was chosen as a neutral working codename.

&#x20; - Recommended path: Squadhelp brief ($199-499) for 50+ professionally-screened name candidates with available `.com` domains and trademark checks, OR Atom.com / Brandbucket for pre-vetted available premium domains

&#x20; - Naming brief should specify: short (≤10 chars), brandable, available `.com` or strong `.app`, no AI prompt-tool collisions, available Twitter/X handle

\- \[ ] Logo design: commission once name is locked

\- \[ ] Twitter handle: confirm once name is locked

\- \[ ] Support email: `support@<finaldomain>`

\- \[ ] Privacy policy and Terms of Service: use a generated baseline (Termly/iubenda) or have a lawyer review



\### 23.2 Risks



| Risk | Likelihood | Mitigation |

|---|---|---|

| Master password recovery requests | High | Clear UX language, repeat warnings, hint feature |

| Vault breach perception | Medium | Security page, public audit, bug bounty when scaled |

| Anthropic API outage | Medium | Graceful degradation, error messages, OpenAI fallback (V1.1) |

| Stripe edge cases (failed payments, disputes) | Medium | Robust webhook handling, customer service playbook |

| Free tier abuse (account farming) | Low | Email verification required, monitor signups for patterns |

| Slow launch traction | Medium | Multi-channel launch (HN, PH, Twitter, Reddit), build in public |



\---



\## 24. Glossary



\- \*\*Prompt\*\* — A reusable AI instruction with a template, placeholders, and metadata

\- \*\*Group\*\* — A collection of related prompts (e.g., "File Organization")

\- \*\*Variant\*\* — An agent-specific version of a prompt

\- \*\*Vault\*\* — Encrypted storage for API keys

\- \*\*Master Password\*\* — User's password for the vault (separate from account password)

\- \*\*Provider\*\* — An AI service that issues API keys (Anthropic, OpenAI, etc.)

\- \*\*Agent\*\* — An AI tool/app where prompts are used (Claude Desktop, ChatGPT, etc.)

\- \*\*Seed Prompt\*\* — Pre-loaded prompt available to every new user



\---



\## 25. Sign-Off



This specification is the locked V1 plan for Stak. All decisions above are committed unless explicitly versioned and updated in this document.



| Role | Name | Sign-off |

|---|---|---|

| Product Owner | Bill Asmar | ✓ (yes-to-all) |

| Build Orchestrator | Claude (Anthropic) | ✓ |



\---



\*\*End of specification. Begin build.\*\*

