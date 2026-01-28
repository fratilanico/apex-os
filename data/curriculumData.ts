import type { Curriculum, Tool, Module } from '../types/curriculum';

/**
 * The 12 AI tools in the Vibe Coder Academy stack
 * Organized into Core Stack (6) and Asset Layer (6)
 */
export const tools: Tool[] = [
  // CORE STACK (Tier 1) - Daily drivers for autonomous development
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'EDITOR',
    description: 'The AI-native editor. Flow state is not just a feeling; it\'s a feature. Tab-complete entire functions with full codebase embedding.',
    tier: 'core',
    icon: 'Code2',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: 'REASONING',
    description: 'The reasoning engine. Hand off complex refactoring and architectural decisions to the smartest model available. 72.7% SWE-Bench verified.',
    tier: 'core',
    icon: 'Bot',
  },
  {
    id: 'gemini',
    name: 'Gemini 2.5',
    category: 'MULTIMODAL',
    description: 'The multimodal powerhouse. 1M token context, processes screenshots/PDFs/videos, 2x faster than competitors. Real-time Google Search grounding.',
    tier: 'core',
    icon: 'Sparkles',
  },
  {
    id: 'openai-codex',
    name: 'OpenAI Codex',
    category: 'CLOUD',
    description: 'Cloud agent for async parallel tasks. Spec-to-code workflows with AGENTS.md configuration. Perfect for distributed build systems.',
    tier: 'core',
    icon: 'Cloud',
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    category: 'IDE',
    description: 'Google\'s agentic development platform. VS Code fork with Claude Code extension built-in. Unified environment for AI-first development.',
    tier: 'core',
    icon: 'Rocket',
  },
  {
    id: 'codemachine',
    name: 'CodeMachine',
    category: 'ORCHESTRATION',
    description: 'The orchestrator. Multi-agent systems that turn specifications into production-ready software. 90% self-built capability.',
    tier: 'core',
    icon: 'Workflow',
  },
  
  // ASSET & RESEARCH LAYER (Tier 2) - Specialized tools
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    category: 'RESEARCH',
    description: 'Multi-document synthesis engine. Upload 50+ sources, generate podcasts, mind maps, infographics, and slide decks. 80+ languages supported.',
    tier: 'asset',
    icon: 'BookOpen',
  },
  {
    id: 'google-stitch',
    name: 'Google Stitch',
    category: 'DESIGN',
    description: 'AI UI generation for mobile and web applications. Design ideation at the speed of thought. From prompt to pixel-perfect mockups.',
    tier: 'asset',
    icon: 'Palette',
    url: 'https://labs.google/stitch',
  },
  {
    id: 'gpt-5-2',
    name: 'GPT-5.2',
    category: 'DEBUGGING',
    description: 'The debugging specialist. 80% accuracy on SWE-Bench debugging tasks. 30% fewer hallucinations. Root cause analysis from error logs.',
    tier: 'asset',
    icon: 'Bug',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    category: 'AGENT',
    description: 'Open-source autonomous agent framework. Multi-provider support, MCP integration. Build agents that read, write, and execute code.',
    tier: 'asset',
    icon: 'Terminal',
  },
  {
    id: 'imagen-3',
    name: 'Imagen 3',
    category: 'IMAGES',
    description: 'State-of-the-art image generation. Photorealism to abstract art. Style customization, mask-based editing, brand-consistent visuals.',
    tier: 'asset',
    icon: 'Image',
  },
  {
    id: 'veo-3-1',
    name: 'Veo 3.1',
    category: 'VIDEO',
    description: 'Cinematography-aware video generation. 4K output up to minutes in length. Native audio, improved physics, human movement.',
    tier: 'asset',
    icon: 'Video',
  },
];

/**
 * The 6 modules of the Vibe Coder Academy curriculum
 * From mental models to solo practicum
 */
export const modules: Module[] = [
  {
    id: 'module-00',
    number: '00',
    title: 'The Shift',
    subtitle: 'Why AI Coding Isn\'t Autocomplete',
    duration: '20 min read',
    objective: 'Transform your mental model from "AI helps me code faster" to "AI agents orchestrate my workflow"',
    icon: 'Zap',
    sections: [
      {
        id: '00.1',
        title: 'The Three Mindsets',
        duration: '5 min',
        tools: ['cursor', 'claude-code'],
        content: `### The Three Mindsets of Working with AI

Most founders approach AI the wrong way. They treat it like a fancy autocomplete or a really smart intern. But that's like using a Tesla to charge your phone—you're technically using it, but you're missing the entire point.

Let's break down the three mindsets, and why only one will actually transform how you build.

---

### ❌ Autocomplete Mindset (The Old Way)

**What it looks like:** You're writing code. AI suggests the next line. You hit tab. Repeat.

This is how most developers first encountered AI—through tools like GitHub Copilot. It's useful, sure. But it's fundamentally **incremental**. You're still doing the work; AI just makes you type less.

**Real example:** You're building a user authentication flow. You type \`function validateEmail(\` and AI suggests the rest. Nice! You saved 30 seconds.

**The problem:** You're still the bottleneck. You're still writing every function, reviewing every line, making every decision. The AI is just a faster keyboard. This doesn't scale. This doesn't let you build 10x faster.

**The analogy:** It's like having an assistant who can only finish your sentences. Helpful for writing emails, useless for running a company.

---

### ❌ Chatbot Mindset (Still Limited)

**What it looks like:** You open Claude or ChatGPT and say: "Build me a dashboard with user analytics." It generates code. You review it, find issues, ask it to fix them. Rinse, repeat.

This is where most founders are right now. It feels powerful—and it is, compared to autocomplete. You're delegating entire features, not just lines of code.

**Real example:** You paste your API spec and say "Create a React component that displays this data in a table with sorting." Claude builds it. Then you realize you need pagination. Back to Claude. Then you need filtering. Back to Claude. Six iterations later, it works.

**The problem:** You're still managing everything manually. Every task requires your oversight. Every iteration needs your prompt engineering skills. You're the project manager for a team of one AI that keeps forgetting what you told it 10 messages ago.

**The analogy:** It's like texting your employee every single instruction throughout the day, waiting for them to respond, checking their work, then texting the next instruction. You wouldn't run a company this way.

---

### ✅ Orchestrator Mindset (The Paradigm Shift)

**What it looks like:** You define what needs to be built. Then you route each task to the right specialized agent, set up workflows for them to coordinate, and implement verification checkpoints. You're not in the weeds—you're conducting the orchestra.

**Real example:** You need to build that same dashboard. But now:
- A **Product Agent** breaks requirements into technical specs
- A **Frontend Agent** builds the UI components
- A **Backend Agent** creates the API endpoints
- A **QA Agent** writes and runs tests
- A **Review Agent** checks everything against your requirements

They work in parallel. They hand off to each other. They verify each other's work. You set it up once, then watch it execute.

**The paradigm shift:** You're not asking AI to do things. You're designing a **system** where specialized agents do what they're best at, automatically. Your job is architecture, not micromanagement.

**The analogy:** This is how you actually run a company. You hire specialists, define clear roles, set up processes, and let them collaborate. You review the output, not every single step.

---

**Here's the truth most founders miss:** You're not managing AI. You're orchestrating agents.

The moment you understand this—the moment you stop thinking "I need to prompt this better" and start thinking "I need to design this system better"—everything changes.

Let's learn how to build that system.`,
      },
      {
        id: '00.2',
        title: 'Context Windows Are Your Superpower',
        duration: '7 min',
        tools: ['claude-code', 'gemini'],
        content: `When you hire a developer, you don't just evaluate their coding skills—you evaluate their ability to hold complex systems in their mind. Can they understand how the authentication layer connects to the database schema while debugging a payment flow? The best developers can juggle dozens of interconnected concepts simultaneously.

AI models have the same constraint, except we can measure it precisely: the **context window**.

## What Is a Context Window?

Think of a context window as working memory. It's the total amount of text an AI model can "see" and reason about in a single conversation.

Context windows are measured in **tokens**. A token is roughly 4 characters of text, or about three-quarters of a word. When you send a message to Claude or ChatGPT, everything—your prompt, the code files, previous messages, and the model's responses—consumes tokens from this budget.

Here's what that means in practice:

| Model | Context Window | Equivalent To |
|-------|---------------|---------------|
| **Claude Sonnet 4.5** | 200,000 tokens | ~150,000 words (~300 pages) |
| **Gemini 3 Pro** | 1,000,000 tokens | ~750,000 words (~1,500 pages) |
| **GPT-5.2** | 128,000 tokens | ~96,000 words (~192 pages) |

To put this in perspective: **1 million tokens** is roughly an entire medium-sized codebase, complete with configuration files, documentation, and dependencies.

## The Hiring Analogy

Imagine you're hiring three developers to debug a production issue. Each has identical skills, but wildly different working memory:

**Developer 1 (Claude):** Can hold **150 files** in their head simultaneously. They see your authentication system, API routes, database models, and error logs all at once. They trace the bug across layers without asking you to remind them what's in \`auth.config.ts\`.

**Developer 2 (Gemini):** Can hold your **entire codebase**—plus screenshots of the error, your architecture diagrams, and that PDF specification document you forgot existed. They connect a frontend race condition to a database migration from six months ago because they literally see everything.

**Developer 3 (GPT-5.2):** Can hold **128,000 tokens** worth of context. Still impressive—they see your error logs, stack traces, and relevant files. But if the bug spans 200 files, they need you to narrow it down first.

## The Math That Changes Everything

Let's say you're debugging an issue that spans 10 different files across your codebase.

### Without Large Context Windows:
- You share 3 files at a time (model's limit)
- You have **10 separate conversations**
- Each conversation loses context from the previous one
- **Total context switches: 30+**
- Time spent re-explaining architecture: **15-20 minutes**

### With Large Context Windows:
- You share all 10 files + related dependencies
- **1 conversation** with full system understanding
- The model sees how \`UserService\` calls \`AuthProvider\` which queries \`Database\` which triggers \`EventLogger\`
- Time spent re-explaining: **0 minutes**

## The Real Cost: Solution Quality Degradation

Here's the part most founders miss: **context switching doesn't just waste time—it degrades solution quality by approximately 15% per switch.**

When you split a complex problem across multiple conversations:

- The model "forgets" architectural decisions from conversation #1 by conversation #3
- Solutions become locally optimal but globally suboptimal
- You end up with band-aids instead of root cause fixes
- Code patterns become inconsistent across the codebase

A model with **200K+ tokens** doesn't just work faster—it produces **fundamentally better solutions** because it sees the full system architecture, understands existing patterns, and maintains consistency across every file it touches.

## Why This Matters for Orchestration

As an AI orchestrator, your job isn't writing code—it's **providing the right context to the right model at the right time**.

Large context windows transform AI from a "smart autocomplete" into a **system-level reasoning engine**. You stop explaining. You stop hand-holding. You point the model at your entire codebase and say: "Fix the authentication flow. Maintain our existing patterns. Update the tests."

And it does.

This is your superpower. The founder who understands context windows can ship features in **one conversation** that used to take **ten sessions** spread across three days.`,
      },
      {
        id: '00.3',
        title: 'The Cost-Quality-Speed Triangle',
        duration: '8 min',
        tools: ['claude-code', 'gemini', 'gpt-5-2'],
        content: `## Understanding the Impossible Tradeoff

Every engineering decision involves tradeoffs. You can't build something that's simultaneously cheap, perfect, and instant. This fundamental constraint applies to AI coding tools just as it does to traditional software development.

The **Cost-Quality-Speed Triangle** describes this reality: you can optimize for any two vertices, but never all three simultaneously. Want the highest quality output at maximum speed? Prepare to pay premium prices. Need rock-bottom costs delivered quickly? Accept reduced quality. Require perfect results on a budget? You'll wait longer.

The genius of modern AI development isn't trying to break this triangle—it's learning to **navigate it strategically**.

## The Three Vertices Explained

**Quality** represents output accuracy and sophistication. For coding tools, this means correctly implementing complex logic, understanding nuanced requirements, and producing maintainable code. Claude Sonnet 3.5 currently dominates this vertex with a 72.7% score on SWE-Bench Verified, the industry's toughest coding benchmark.

**Speed** measures how quickly you get usable results. Gemini Flash 2.0 excels here, processing requests roughly 2x faster than Claude Sonnet while maintaining respectable quality. When you're iterating rapidly on UI components or fixing simple bugs, every second counts.

**Cost** is straightforward: what you pay per million tokens processed. The spread is dramatic—Claude Sonnet costs $3 per million tokens, while Gemini Flash runs just $0.075 per million tokens. That's a 40x price difference for different capabilities.

## Where Tools Live on the Triangle

Modern AI coding assistants occupy distinct positions:

**Claude Sonnet** sits at the Quality-Speed corner. It delivers exceptional results quickly, but at premium pricing. Use it when the cost of errors exceeds the cost of tokens—backend logic, data transformations, algorithm implementation.

**Gemini Flash** optimizes for Cost-Speed. It's fast and affordable, making it perfect for high-volume, lower-stakes work where good-enough beats perfect. Think UI components, documentation, boilerplate code, and straightforward CRUD operations.

**GPT-5.2** occupies a specialized Quality position with task-based pricing. Its debugging capabilities justify higher costs for specific scenarios where finding the right fix quickly saves hours of developer time.

## The Decision Framework

Smart founders don't pick one tool and stick with it. They orchestrate multiple tools based on task requirements:

### Complex Backend Logic → Claude Sonnet
When building authentication systems, payment processing, or data pipelines, errors are expensive. A security flaw or data corruption bug could cost thousands in lost business. Pay the $3/M token premium for quality.

### Frontend UI Development → Gemini Flash
Building React components, styling interfaces, and implementing standard UI patterns rarely requires premium intelligence. Gemini Flash delivers clean, functional code at $0.075/M tokens while iterating 2x faster. Perfect for rapid prototyping.

### Debugging Session → GPT-5.2
When you're stuck on a cryptic error, GPT-5.2's specialized debugging mode often finds solutions other tools miss. Task-based pricing means you pay for results, not token volume.

## The 80/20 Rule in Practice

Here's the insight that transforms your development economics: **Use Gemini Flash for 80% of your work, Claude Sonnet for the 20% that demands perfection.**

The math is compelling. If your typical feature requires 2M tokens of AI assistance:
- All Claude Sonnet: $6.00
- 80% Gemini Flash (1.6M tokens) + 20% Claude (400k tokens): $1.20 + $1.20 = $2.40

That's **65% cost savings** while maintaining quality where it matters. Add Gemini Flash's speed advantage, and you're shipping **20% faster** too.

## Real-World Example: Building a Todo App Feature

Let's implement "Add tags to tasks" using smart orchestration:

**1. Database Schema (Claude Sonnet)**  
Creating the tags table and junction table requires correct foreign keys, indexes, and constraints. Errors here cause production bugs. Use Claude.

**2. API Endpoints (Gemini Flash)**  
Standard CRUD operations for tags follow established patterns. Gemini Flash generates clean Express/FastAPI routes in seconds.

**3. React Components (Gemini Flash)**  
Tag input, tag display pills, tag filtering UI—all straightforward React patterns. Let Gemini Flash iterate rapidly.

**4. Tag Search Logic (Claude Sonnet)**  
Implementing fuzzy search with proper SQL joins and performance optimization demands quality. Switch to Claude.

**5. Bug Fixing Type Errors (GPT-5.2)**  
When TypeScript throws cryptic errors in the tag filtering logic, GPT-5.2's debugging mode identifies the issue in minutes.

Total cost: ~$0.80 instead of $6.00 if you'd used only Claude. Built in 3 hours instead of 5.

## The Meta-Skill

Learning to navigate the Cost-Quality-Speed Triangle is itself a foundational skill. The specific tools will change—new models launch monthly. But the strategic thinking remains constant: **match tool capabilities to task requirements, optimize globally rather than locally, and remember that the best solution uses multiple tools orchestrated intelligently.**`,
      },
    ],
    keyTakeaways: [
      'AI orchestration beats AI assistance',
      'Context windows enable repository-aware reasoning',
      'Specialization beats generalization',
      'Cost-quality-speed triangle requires optimization',
      'Decision tree prevents tool paralysis',
      'Each tool has a philosophy; respect it',
    ],
  },
  
  {
    id: 'module-01',
    number: '01',
    title: 'The Environment',
    subtitle: 'Get All Tools Running & Compare Outputs',
    duration: '40 min hands-on',
    objective: 'Install, authenticate, and run "hello world" with each tool. Compare outputs side-by-side to understand capabilities.',
    icon: 'Box',
    sections: [
      {
        id: '01.1',
        title: 'Claude & Cursor Setup',
        duration: '10 min',
        tools: ['claude-code', 'cursor'],
        content: `## Why Claude + Cursor?

Before we dive into setup, understand what makes this pairing the foundation of the Vibe Coder stack:

**Claude Sonnet 4.5** currently holds the crown for **reasoning depth**. It's the model you use when you need architectural decisions, complex refactoring, or multi-step problem solving. It's slower than competitors, but it thinks before it acts—which is exactly what you want for non-trivial code generation.

**Cursor** is the AI-native editor that replaced VS Code for thousands of developers. It's not just "VS Code with AI features"—it's built from the ground up to embed your entire codebase into the AI's context window. When you ask Cursor to refactor a function, it sees your project structure, imported dependencies, and coding patterns across 100+ files simultaneously.

Together, they form what the community calls **"the reasoning stack"**—Cursor for flow state tab-completion, Claude for deep architectural work.

---

## Step 1: Create Your Anthropic Account

1. Go to **[claude.ai](https://claude.ai)**
2. Sign up with Google/email (free tier works for this course)
3. Verify your email
4. You'll land on the Claude web interface

> **Pro Tip:** Don't skip the web interface. It's where you'll prototype prompts before automating them in Cursor. Think of it as your "AI workbench."

---

## Step 2: Get Your API Key

1. Visit **[console.anthropic.com](https://console.anthropic.com)**
2. Click **"Get API Keys"** in the left sidebar
3. Click **"Create Key"**
4. Name it \`vibe-coder-dev\` (you'll create separate keys for production later)
5. **Copy the key immediately**—you can't view it again

> **Security Note:** API keys are like passwords. Never commit them to git. Never share them in screenshots. Store them in environment variables only.

---

## Step 3: Install Claude Code (Terminal Agent)

Claude Code is Anthropic's official terminal agent—it reads files, writes code, and executes commands on your behalf.

**For macOS/Linux:**
\`\`\`bash
npm install -g @anthropic-ai/claude-code
\`\`\`

**For Windows:**
\`\`\`bash
npm install -g @anthropic-ai/claude-code
\`\`\`

**Verify installation:**
\`\`\`bash
claude --version
\`\`\`

You should see something like \`claude-code v2.1.3\`.

---

## Step 4: Configure Authentication

Create a file at \`~/.config/claude/config.json\`:

\`\`\`json
{
  "apiKey": "sk-ant-YOUR_KEY_HERE",
  "defaultModel": "claude-sonnet-4.5",
  "maxTokens": 200000
}
\`\`\`

**Alternatively**, use environment variables (recommended for teams):

\`\`\`bash
export ANTHROPIC_API_KEY="sk-ant-YOUR_KEY_HERE"
\`\`\`

Add this to your \`~/.bashrc\`, \`~/.zshrc\`, or equivalent.

---

## Step 5: Install Cursor IDE

1. Go to **[cursor.sh](https://cursor.sh)**
2. Download for your OS (macOS, Windows, Linux)
3. Install like any normal application
4. Launch Cursor

**First-time setup wizard will ask:**
- **Import VS Code settings?** → Yes (if you used VS Code)
- **Sign in to Cursor Pro?** → Skip for now (free tier works)
- **Choose default AI model** → Select **Claude Sonnet 4.5**

---

## Step 6: Connect Cursor to Your Anthropic API Key

1. In Cursor, press \`Cmd+Shift+P\` (macOS) or \`Ctrl+Shift+P\` (Windows)
2. Type **"Cursor: Settings"**
3. Navigate to **AI Models** section
4. Under **Claude**, paste your API key
5. Set **Default Model** to \`Claude Sonnet 4.5\`
6. Set **Max Tokens** to \`200000\`

---

## Step 7: Your First AI-Generated Code

Let's verify everything works by building a simple REST API.

**In Cursor:**
1. Create new folder: \`vibe-hello-world\`
2. Open it in Cursor
3. Press \`Cmd+K\` (Cursor's AI command palette)
4. Type this prompt:

> "Create a TypeScript Express API with a /hello endpoint that returns JSON with a timestamp. Include proper error handling and TypeScript types."

**What should happen:**
- Cursor generates 4-5 files (\`server.ts\`, \`package.json\`, \`tsconfig.json\`, etc.)
- Full TypeScript setup with types
- Express boilerplate with error middleware
- ~100-150 lines of production-ready code

**Run it:**
\`\`\`bash
npm install
npm run dev
\`\`\`

Visit \`http://localhost:3000/hello\` — you should see:
\`\`\`json
{
  "message": "Hello from Vibe Coder Academy",
  "timestamp": "2025-01-23T10:30:00.000Z"
}
\`\`\`

---

## What You Just Learned

**You didn't write any code.** You specified intent, and Claude + Cursor handled:
- TypeScript configuration
- Dependency management
- Project structure
- Error handling
- Type safety

This is the shift from "coding" to "orchestrating." You're no longer a typist—you're an architect.

---

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| \`claude: command not found\` | Make sure \`npm\` global bin is in your PATH |
| \`Invalid API key\` | Check for extra spaces when pasting key |
| Cursor not generating code | Verify API key is set in Settings → AI Models |
| TypeScript errors in generated code | Update \`@types/node\` and \`typescript\` to latest |

---

## Next Steps

You've unlocked **reasoning-first development**. In the next section, we'll set up Gemini—the multimodal powerhouse that can read screenshots, PDFs, and videos.`,
      },
      {
        id: '01.2',
        title: 'Gemini Setup',
        duration: '8 min',
        tools: ['gemini'],
        content: `## Why Gemini 3?

Gemini 3 Pro is Google's answer to multimodal AI development. While Claude excels at reasoning, Gemini excels at **context volume and modality diversity**.

**Key superpowers:**
- **1 million token context window** — 5x larger than Claude
- **Native multimodal input** — Screenshots, PDFs, videos, audio
- **Real-time Google Search grounding** — Pulls live data during generation
- **2x faster inference** than competitors

**When to use Gemini:**
- You need to process 50+ files simultaneously
- You're working with design mockups or UI screenshots
- You need live web data (stock prices, documentation, etc.)
- Speed matters more than absolute reasoning depth

---

## Step 1: Create Google AI Studio Account

1. Go to **[aistudio.google.com](https://aistudio.google.com)**
2. Sign in with your Google account
3. Accept the terms of service

You'll land on the **Google AI Studio** interface—think of it as "Google Colab for AI prompts." This is your experimentation playground.

---

## Step 2: Get Your API Key

1. In AI Studio, click **"Get API Key"** in the left sidebar
2. Click **"Create API Key in New Project"**
3. Name your project: \`vibe-coder-academy\`
4. Copy the API key (starts with \`AIza...\`)

> **Note:** Unlike Anthropic, Google gives you **$300 free credits** for 90 days. You won't hit billing for this course.

---

## Step 3: Install Google Generative AI SDK

**For Node.js/TypeScript:**
\`\`\`bash
npm install @google/generative-ai
\`\`\`

**For Python:**
\`\`\`bash
pip install google-generativeai
\`\`\`

---

## Step 4: Configure Environment Variables

Add to your \`~/.bashrc\` or \`~/.zshrc\`:

\`\`\`bash
export GOOGLE_AI_API_KEY="AIza_YOUR_KEY_HERE"
\`\`\`

Reload your shell:
\`\`\`bash
source ~/.zshrc  # or ~/.bashrc
\`\`\`

---

## Step 5: Verify with a Simple Script

Create \`test-gemini.ts\`:

\`\`\`typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

async function testGemini() {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-pro' });
  
  const prompt = 'Explain in one sentence why context windows matter for AI coding.';
  const result = await model.generateContent(prompt);
  
  console.log(result.response.text());
}

testGemini();
\`\`\`

**Run it:**
\`\`\`bash
npx tsx test-gemini.ts
\`\`\`

**Expected output:**
> "Context windows determine how much code an AI model can see at once, directly affecting its ability to understand complex codebases and maintain consistency across large refactoring tasks."

---

## Step 6: The Multimodal Test (Screenshot to Code)

This is where Gemini shines. Let's convert a UI screenshot into working React code.

**Step-by-step:**
1. Find any website design you like (Dribbble, Behance, etc.)
2. Take a screenshot
3. Save it as \`design.png\`

**Create \`screenshot-to-code.ts\`:**

\`\`\`typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

async function imageToCode() {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-pro' });

  const imageData = fs.readFileSync('design.png');
  const base64Image = imageData.toString('base64');

  const prompt = \`
    Convert this UI design into a React component using Tailwind CSS.
    
    Requirements:
    - Use TypeScript
    - Use functional components with hooks
    - Match the design pixel-perfect
    - Include responsive breakpoints
    - Add proper accessibility attributes
  \`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: 'image/png',
        data: base64Image,
      },
    },
  ]);

  console.log(result.response.text());
}

imageToCode();
\`\`\`

**Run it:**
\`\`\`bash
npx tsx screenshot-to-code.ts
\`\`\`

**What you'll get:**
- Full React component code
- Tailwind classes matching your design
- Responsive variants
- Type definitions
- ~150-300 lines of production-ready code

---

## Step 7: Integrate Gemini with Cursor (Optional)

Cursor supports multiple AI providers. You can use Gemini as a secondary model:

1. In Cursor settings, navigate to **AI Models**
2. Add **Google Gemini** as a provider
3. Paste your API key
4. Set it as **secondary model**

**When to switch to Gemini in Cursor:**
- You need to reference 100+ files
- You're working with images/designs
- Claude is being slow (Gemini is 2x faster)

**Keyboard shortcut:**
- Press \`Cmd+K\` (open AI palette)
- Type \`@gemini\` before your prompt
- Example: \`@gemini Create a dashboard layout based on this Figma screenshot\`

---

## What You Just Learned

Gemini is your **multimodal Swiss Army knife**. You just:
- Converted a screenshot to production React code
- Processed visual input (something Claude can't do natively)
- Unlocked a 1M token context window

**Mental model shift:** Stop thinking "text-to-code." Start thinking "anything-to-code"—designs, PDFs, videos, audio recordings—all valid inputs.

---

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| \`API key invalid\` | Make sure key starts with \`AIza\` (not \`sk-\`) |
| \`Quota exceeded\` | You hit free tier limit; upgrade to paid ($0.002/1K tokens) |
| Image upload failing | Check file size < 20MB and format is PNG/JPG/WebP |
| Model not found | Gemini 3 rolled out Q1 2025; use \`gemini-3-pro\` not \`gemini-pro\` |

---

## Next Steps

You now have the **reasoning stack** (Claude) and the **multimodal stack** (Gemini). Next up: GPT-5.2, the debugging specialist.`,
      },
      {
        id: '01.3',
        title: 'GPT-5.2 & OpenAI Setup',
        duration: '8 min',
        tools: ['gpt-5-2', 'openai-codex'],
        content: `## Why GPT-5.2?

GPT-5.2 (released Q4 2024) represents OpenAI's pivot from "general intelligence" to **task-specific excellence**. While Claude reasons deeply and Gemini processes everything, GPT-5.2 specializes in **debugging and root cause analysis**.

**Key capabilities:**
- **80% accuracy on SWE-Bench debugging tasks** (vs. 64% for GPT-4)
- **30% fewer hallucinations** when analyzing stack traces
- **Chain-of-thought debugging** — shows its reasoning step-by-step
- **Multi-language error detection** — Python, TypeScript, Go, Rust, etc.

**When to use GPT-5.2:**
- Production is on fire and you need answers fast
- You have cryptic error logs spanning 1000+ lines
- You need multiple fix proposals with trade-off analysis
- You're debugging legacy code with no documentation

---

## Step 1: Subscribe to ChatGPT Plus (Optional but Recommended)

While you can use the API without Plus, the **ChatGPT interface** is valuable for iterative debugging:

1. Go to **[chat.openai.com](https://chat.openai.com)**
2. Sign up or log in
3. Click **"Upgrade to Plus"** ($20/month)
4. Confirm subscription

> **Note:** ChatGPT Plus gives you access to GPT-5.2 in the web interface, unlimited messages, and faster response times. The API is separate billing.

---

## Step 2: Get Your API Key

1. Visit **[platform.openai.com](https://platform.openai.com)**
2. Click **"API Keys"** in the left sidebar
3. Click **"Create New Secret Key"**
4. Name it \`vibe-coder-dev\`
5. **Copy the key immediately** (starts with \`sk-proj-\`)

> **Billing Note:** OpenAI charges per token used. GPT-5.2 costs approximately **$0.03/1K input tokens** and **$0.06/1K output tokens**. Budget ~$5-10 for this course.

---

## Step 3: Install OpenAI SDK

**For Node.js/TypeScript:**
\`\`\`bash
npm install openai
\`\`\`

**For Python:**
\`\`\`bash
pip install openai
\`\`\`

---

## Step 4: Configure Authentication

Add to your environment variables:

\`\`\`bash
export OPENAI_API_KEY="sk-proj-YOUR_KEY_HERE"
\`\`\`

Reload your shell:
\`\`\`bash
source ~/.zshrc  # or ~/.bashrc
\`\`\`

---

## Step 5: Verify with a Simple Script

Create \`test-gpt.ts\`:

\`\`\`typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testGPT() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-5.2',
    messages: [
      {
        role: 'user',
        content: 'Explain the difference between undefined and null in JavaScript in one sentence.',
      },
    ],
  });

  console.log(completion.choices[0].message.content);
}

testGPT();
\`\`\`

**Run it:**
\`\`\`bash
npx tsx test-gpt.ts
\`\`\`

**Expected output:**
> "In JavaScript, \`undefined\` means a variable has been declared but not assigned a value, while \`null\` is an explicit assignment representing 'no value'."

---

## Step 6: The Debugging Test (Real Error Log Analysis)

This is where GPT-5.2 earns its place in your stack. Let's analyze a realistic error scenario.

**Create a buggy script** (\`buggy-app.ts\`):

\`\`\`typescript
import express from 'express';

const app = express();

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await db.users.findOne({ id: userId }); // Oops, db not defined
  
  if (!user) {
    res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user); // Missing return - sends response twice
});

app.listen(3000);
\`\`\`

**Run it and capture the error:**
\`\`\`bash
npx tsx buggy-app.ts 2> error.log
\`\`\`

**Now feed the error to GPT-5.2** (\`debug-with-gpt.ts\`):

\`\`\`typescript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI();

async function debugWithGPT() {
  const errorLog = fs.readFileSync('error.log', 'utf-8');

  const completion = await openai.chat.completions.create({
    model: 'gpt-5.2',
    messages: [
      {
        role: 'system',
        content: \`You are a debugging specialist. Analyze errors and provide:
          1. Root cause
          2. Three fix proposals (with pros/cons)
          3. Prevention strategy\`,
      },
      {
        role: 'user',
        content: \`Debug this error:\n\n\${errorLog}\`,
      },
    ],
  });

  console.log(completion.choices[0].message.content);
}

debugWithGPT();
\`\`\`

**Expected output:**

> **Root Cause:** Two distinct issues:
> 1. \`db is not defined\` — Missing database connection import
> 2. \`Cannot set headers after they are sent\` — Missing return statement after 404 response
>
> **Fix Proposal 1: Quick Fix**
> - Import db module
> - Add \`return\` before 404 response
> - **Pros:** Immediate resolution
> - **Cons:** Doesn't address error handling architecture
>
> **Fix Proposal 2: Middleware Pattern**
> - Create async error handler middleware
> - Use try/catch blocks
> - Centralize error responses
> - **Pros:** Scalable, follows Express best practices
> - **Cons:** Requires refactoring
>
> **Fix Proposal 3: Type Safety**
> - Use Prisma/TypeORM for type-safe DB access
> - Add response helper functions
> - **Pros:** Prevents entire class of errors
> - **Cons:** Larger initial investment
>
> **Prevention:** Implement TypeScript strict mode, add ESLint rule for missing returns in Express handlers.

---

## Step 7: Integrate GPT-5.2 with Your Workflow

**Use Cases in Vibe Coder Academy Stack:**

| Scenario | Tool Choice |
|----------|-------------|
| Architectural planning | Claude Sonnet 4.5 |
| Converting designs to code | Gemini 3 Pro |
| **Debugging production errors** | **GPT-5.2** |
| Rapid prototyping | Cursor (any model) |
| Multi-agent orchestration | CodeMachine |

**Pro Tip:** Create a debug command in your terminal:

\`\`\`bash
# Add to ~/.zshrc
debug() {
  echo "$1" | npx tsx debug-with-gpt.ts
}
\`\`\`

**Usage:**
\`\`\`bash
debug "TypeError: Cannot read property 'map' of undefined"
\`\`\`

---

## What You Just Learned

GPT-5.2 is your **debugging co-pilot**. You just:
- Set up the OpenAI API
- Automated error analysis
- Got multiple fix proposals with trade-offs

**Mental model shift:** Stop staring at stack traces for 20 minutes. Feed them to GPT-5.2, get 3 solutions, pick the best one. Your job is **decision-making**, not detective work.

---

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| \`Invalid API key\` | Check key starts with \`sk-proj-\` (not \`sk-\`) |
| \`Rate limit exceeded\` | You hit free tier limits; add billing method |
| Model not found | GPT-5.2 requires API version \`2024-11-01\` or later |
| High costs | Use \`max_tokens\` parameter to limit output length |

---

## Cost Management Tips

**GPT-5.2 pricing (as of Jan 2025):**
- Input: $0.03 per 1K tokens (~750 words)
- Output: $0.06 per 1K tokens

**Estimated course costs:**
- Module 01: ~$0.50
- Module 02: ~$1.00
- Module 03: ~$2.00
- Module 04: ~$3.00
- Module 05: ~$5.00
- **Total:** ~$11.50

> **Budget tip:** Set a spending limit at **[platform.openai.com/settings/billing](https://platform.openai.com/settings/billing)** to avoid surprises.

---

## Next Steps

You now have the **holy trinity**:
- **Claude** = Deep reasoning
- **Gemini** = Multimodal + massive context
- **GPT-5.2** = Debugging specialist

Next: Setting up **Cursor Debug Mode** and **NotebookLM** for research workflows.`,
      },
      {
        id: '01.4',
        title: 'Cursor Debug Mode & NotebookLM',
        duration: '10 min',
        tools: ['cursor', 'notebooklm'],
        content: `## Part 1: Cursor Debug Mode

Cursor's **Debug Mode** is what separates it from VS Code with Copilot. When enabled, Cursor automatically instruments your code with logging, traces execution flow, and uses AI to pinpoint bugs in real-time.

Think of it as **"watch mode for AI debugging"**—every time you save a file, Cursor analyzes runtime behavior and suggests fixes before you even realize there's a problem.

---

### Enable Debug Mode

1. Open Cursor settings (\`Cmd+,\` or \`Ctrl+,\`)
2. Search for **"Debug Mode"**
3. Toggle **"Enable AI-Assisted Debugging"**
4. Set **"Auto-instrument on save"** to \`true\`

**What this does:**
- Adds invisible breakpoints at function entry/exit
- Logs variable states automatically
- Tracks async function chains
- Reports anomalies (null checks, type mismatches, etc.)

---

### Test It: Intentional Bug Exercise

Let's trigger a bug and watch Cursor catch it.

**Create \`debug-test.ts\`:**

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function getUserEmail(user: User | null): string {
  return user.email; // Bug: Doesn't handle null
}

const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

const user = users.find(u => u.id === '3'); // Returns undefined
console.log(getUserEmail(user)); // Crash!
\`\`\`

**Save the file.** Within 2-3 seconds, Cursor will:

1. **Highlight the bug** (line 7: \`user.email\`)
2. **Show inline suggestion:**
   > ⚠️ Potential null reference. user could be undefined.
3. **Offer auto-fix:**
   > Fix: Add null check with optional chaining

**Accept the fix** (\`Cmd+Enter\`), and Cursor rewrites it to:

\`\`\`typescript
function getUserEmail(user: User | null): string {
  return user?.email ?? 'No email found';
}
\`\`\`

---

### How Debug Mode Works Under the Hood

When you save a file, Cursor:
1. Parses your code into an Abstract Syntax Tree (AST)
2. Identifies control flow paths
3. Injects virtual breakpoints at decision points
4. Simulates execution with sample data
5. Reports anomalies to Claude Sonnet 4.5
6. Claude generates fix suggestions

**This happens in <2 seconds** for files under 500 lines.

---

### When to Use Debug Mode

| Scenario | Debug Mode Usefulness |
|----------|----------------------|
| Prototyping new features | ⭐⭐⭐ (Catches typos, type errors) |
| Refactoring legacy code | ⭐⭐⭐⭐⭐ (Prevents regression bugs) |
| Debugging async code | ⭐⭐⭐⭐⭐ (Traces promise chains) |
| Performance optimization | ⭐⭐ (Use profiler instead) |

> **Pro Tip:** Disable Debug Mode for large files (>1000 lines) as it can slow down saves. Use it selectively for critical modules.

---

## Part 2: NotebookLM for Research & Documentation

**NotebookLM** is Google's AI-powered research assistant. It's like having a PhD student who reads all your documentation and synthesizes it into podcasts, mind maps, and slide decks.

**Key capabilities:**
- Upload 50+ sources (PDFs, Google Docs, URLs, YouTube videos)
- Generate 10-15 minute **audio podcasts** summarizing content
- Create **interactive mind maps** showing concept relationships
- Export to slides, infographics, or Markdown

**When to use NotebookLM:**
- You're joining a new codebase and need to ramp up fast
- You have 20+ architecture docs to digest
- You want to create onboarding materials for your team
- You need to extract insights from competitor documentation

---

### Step 1: Create Your First Notebook

1. Go to **[notebooklm.google.com](https://notebooklm.google.com)**
2. Click **"New Notebook"**
3. Name it: \`Vibe Coder Academy - Research\`

---

### Step 2: Upload Sources

Click **"Add Source"** and upload:

**For this exercise, use:**
1. The official **React documentation** (react.dev)
2. **Next.js documentation** (nextjs.org/docs)
3. A PDF of your current project's README (if you have one)
4. Any YouTube tutorial you found helpful

**How to add URLs:**
- Click **"Add Source" → "Website"**
- Paste the URL
- NotebookLM scrapes and indexes the content

**How to add PDFs/Docs:**
- Click **"Add Source" → "Upload File"**
- Drag and drop

---

### Step 3: Generate a Podcast

This is the killer feature. NotebookLM synthesizes all your sources into a conversational podcast.

1. Click **"Generate Audio Overview"**
2. Select **"Podcast format"** (2 hosts discussing the material)
3. Choose length: **10-15 minutes**
4. Click **"Generate"**

**Wait 3-5 minutes.** You'll get an AI-generated podcast where two hosts discuss:
- Key concepts from your sources
- Connections between different documents
- Practical applications
- Common pitfalls

**Use case:** Listen to this while commuting. You'll absorb more in 15 minutes than reading docs for 2 hours.

---

### Step 4: Create a Mind Map

1. Click **"Generate Mind Map"**
2. Select **"Concept Map"** view
3. Explore the interactive graph

**What you'll see:**
- Central concepts in the middle
- Related ideas branching out
- Color-coded by source document
- Clickable nodes that show original text

**Use case:** Use this to understand how different parts of your architecture connect.

---

### Step 5: Ask Questions

NotebookLM has a built-in chat interface grounded in your sources.

**Try these prompts:**
1. "What are the main differences between React Server Components and Client Components?"
2. "Summarize the performance optimization techniques mentioned across all sources."
3. "Create a checklist for setting up a new Next.js project based on these docs."

**The magic:** Unlike ChatGPT, NotebookLM **cites its sources**. Every answer includes footnotes linking back to the original document.

---

### Step 6: Export to Slides (Bonus)

1. Click **"Export" → "Google Slides"**
2. Choose template: **"Technical Overview"**
3. Click **"Generate"**

You'll get a 10-15 slide deck summarizing your sources, ready to present to your team.

---

## Real-World Workflow: Onboarding to a New Codebase

**Scenario:** You just joined a startup. The codebase has 50,000 lines of code, zero documentation, and the CTO is on vacation.

**Your NotebookLM workflow:**

1. **Upload sources:**
   - README.md
   - CONTRIBUTING.md
   - API documentation (if it exists)
   - Last 10 commit messages (export as PDF)
   - Any Slack threads about architecture

2. **Generate podcast:**
   - Listen while setting up your dev environment
   - Get high-level understanding of system architecture

3. **Create mind map:**
   - Identify core modules and their dependencies
   - Find entry points for adding new features

4. **Ask questions:**
   - "What's the authentication flow?"
   - "Where are API routes defined?"
   - "What's the testing strategy?"

**Time saved:** 4-6 hours of reading docs → 45 minutes of listening + exploring.

---

## What You Just Learned

You now have:
- **Cursor Debug Mode** for real-time bug detection
- **NotebookLM** for rapid knowledge synthesis

**Mental model shift:** Stop reading documentation linearly. Upload it to NotebookLM, generate a podcast, and absorb it passively. Your brain is for thinking, not for being a search engine.

---

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| Debug Mode slowing down saves | Disable for files >1000 lines |
| NotebookLM podcast is too generic | Upload more specific sources (not just marketing pages) |
| Mind map is cluttered | Limit sources to 5-10 per notebook |
| Can't upload certain PDFs | Convert to Google Doc first, then upload |

---

## Next Steps

You've set up the **core reasoning stack** (Claude, Gemini, GPT-5.2) and the **knowledge tools** (Cursor Debug Mode, NotebookLM).

Next: Setting up the **asset generation layer**—Imagen, Veo, and Google Stitch for visual content.`,
      },
      {
        id: '01.5',
        title: 'Asset Tools: Imagen, Veo, Stitch',
        duration: '10 min',
        tools: ['imagen-3', 'veo-3-1', 'google-stitch'],
        content: `## Why Asset Generation Matters for Founders

Here's the dirty secret about building products solo: **80% of your time goes to things that aren't code**—designing landing pages, creating demo videos, building mockups for user testing.

Traditional workflow:
- Hire a designer on Fiverr ($200-500, 1-2 weeks)
- Use Figma yourself (3-4 hours per mockup, looks amateur)
- Skip visuals entirely (users think your product is unfinished)

**AI asset generation changes the equation:**
- **Imagen 3** generates production-ready images in 30 seconds
- **Veo 3.1** creates product demo videos from text prompts
- **Google Stitch** turns wireframes into pixel-perfect UI mockups

You're about to unlock **visual production at the speed of thought**.

---

## Part 1: Imagen 3 (Image Generation)

**Imagen 3** is Google's state-of-the-art image generation model. It excels at photorealism, brand consistency, and **following complex prompts** (unlike DALL-E which often ignores constraints).

### Access Imagen 3

1. Go to **[labs.google/imagen](https://labs.google/imagen)**
2. Sign in with Google account
3. Accept terms of service

> **Note:** Imagen 3 is currently in preview. You get **100 free generations per day**. After that, it's $0.02 per image.

---

### Test 1: Generate a Hero Image

**Scenario:** You need a landing page hero image for a SaaS dashboard product.

**Prompt:**
> "A modern SaaS dashboard interface on a laptop screen, floating in a clean white workspace with soft shadows. The dashboard shows colorful charts and analytics. Minimalist aesthetic, professional photography, 16:9 aspect ratio, shallow depth of field."

**Click "Generate"** → Wait 20-30 seconds.

**What you'll get:**
- 4 variations to choose from
- 1920x1080 resolution
- Download as PNG/JPG/WebP

**Pro tip:** Add these modifiers for better results:
- **"Studio lighting"** → Professional look
- **"Trending on Dribbble"** → Modern design style
- **"8K resolution"** → Higher quality
- **"Cinematic composition"** → Better framing

---

### Test 2: Create Brand-Consistent Icons

**Prompt:**
> "Set of 6 minimalist line icons: code, rocket, shield, chart, users, settings. Cyan and violet gradient style, transparent background, vector-style, consistent stroke width."

**Result:** You get 6 icons ready for your UI.

**Export:** Download as SVG (vector format, infinitely scalable).

---

### When to Use Imagen 3

| Use Case | Imagen 3 Quality |
|----------|-----------------|
| Hero images for landing pages | ⭐⭐⭐⭐⭐ |
| Product screenshots (fictional) | ⭐⭐⭐⭐ |
| Marketing materials | ⭐⭐⭐⭐⭐ |
| UI mockups | ⭐⭐⭐ (Use Stitch instead) |
| Photos of people | ⭐⭐⭐⭐ (Photorealistic) |
| Logos | ⭐⭐ (Use a designer) |

---

## Part 2: Veo 3.1 (Video Generation)

**Veo 3.1** is Google's video generation model. Think "Imagen, but for videos." You describe a scene, and it generates a 5-15 second video clip.

**Key capabilities:**
- **1080p resolution** at 30fps
- **Camera movements** (pan, zoom, dolly)
- **Temporal consistency** (objects don't morph mid-video)
- **Prompt adherence** (follows complex instructions)

### Access Veo 3.1

1. Go to **[labs.google/veo](https://labs.google/veo)**
2. Sign in with Google account
3. Accept early access terms

> **Note:** Veo 3.1 is in limited preview. You get **20 free generations per week**.

---

### Test 1: Create a Product Demo Video

**Scenario:** You need a 10-second demo showing your app in action.

**Prompt:**
> "Screen recording of a modern web dashboard. Mouse cursor clicking through tabs showing analytics charts, user profiles, and settings. Smooth transitions between screens. Professional UI with cyan and violet accents. 10 seconds, 1080p."

**Click "Generate"** → Wait 2-3 minutes.

**What you'll get:**
- 10-second MP4 video
- Realistic UI interactions
- Smooth camera movements

**Use case:** Embed this on your landing page hero section instead of a static screenshot.

---

### Test 2: Create a Background Video for Marketing

**Prompt:**
> "Abstract particle network visualization, cyan and violet glowing nodes connecting in 3D space, camera slowly rotating around the network, dark background, futuristic tech aesthetic, loop-able, 15 seconds."

**Result:** A professional-looking background video for your site's header.

---

### Pro Tips for Better Videos

1. **Specify camera movement:**
   - "Static camera" (no movement)
   - "Slow zoom in" (focus effect)
   - "Pan left to right" (cinematic)

2. **Request loop-able content:**
   - "Loop-able animation" (for backgrounds)
   - "Seamless loop" (no jarring cuts)

3. **Set duration explicitly:**
   - "5 seconds" (short clip)
   - "10 seconds" (standard)
   - "15 seconds" (max for Veo 3.1)

---

## Part 3: Google Stitch (UI Generation)

**Google Stitch** is the newest tool in the stack (released Q4 2024). It turns **text prompts or rough sketches** into **pixel-perfect UI mockups** for web and mobile.

**This is the game-changer for solo founders.** No more struggling with Figma for 4 hours. Just describe what you want, and Stitch generates it.

### Access Google Stitch

1. Go to **[labs.google/stitch](https://labs.google/stitch)**
2. Sign in with Google account
3. Click **"New Design"**

---

### Test 1: Generate a Landing Page

**Prompt:**
> "Landing page for an AI code generation SaaS product. Hero section with headline, subheadline, CTA button. Features section with 3 columns (icons + descriptions). Pricing table with 3 tiers. Footer with social links. Modern design, cyan and violet color scheme, dark mode."

**Click "Generate"** → Wait 30-60 seconds.

**What you'll get:**
- Full-page mockup (desktop view)
- Responsive breakpoints (mobile, tablet)
- Export as Figma file or HTML/CSS code

**Mind-blowing feature:** Click **"Export to Code"** → You get production-ready React components with Tailwind CSS.

---

### Test 2: Mobile App UI

**Prompt:**
> "Mobile app dashboard for fitness tracking. Top nav bar with profile icon. Card-based layout showing today's steps, calories, workout summary. Bottom tab bar with 5 icons: home, activity, nutrition, profile, settings. iOS design language, clean and minimal."

**Result:** Pixel-perfect mobile UI ready for development.

---

### Export Options

| Format | Use Case |
|--------|----------|
| **Figma** | Share with designers, iterate on details |
| **HTML/CSS** | Quick prototypes, no framework |
| **React + Tailwind** | Production-ready components (recommended) |
| **Vue/Svelte** | If you use these frameworks |
| **PNG/JPG** | For presentations, mockups |

---

## Real-World Workflow: Building a Landing Page

**Scenario:** You need a landing page for your new product. You have 2 hours.

**Traditional approach:**
1. Sketch wireframe (30 min)
2. Design in Figma (2 hours) ← Oops, already over time
3. Code it (3 hours)
4. **Total: 5.5 hours**

**AI-powered approach:**
1. Describe page to **Google Stitch** (2 min)
2. Generate mockup (1 min)
3. Export to React + Tailwind (instant)
4. Customize code in Cursor (30 min)
5. Generate hero image with **Imagen 3** (2 min)
6. Generate background video with **Veo 3.1** (3 min)
7. Deploy (5 min)
8. **Total: 45 minutes**

**Time saved: 4 hours and 45 minutes.**

---

## Asset Generation Checklist

Before moving to Module 02, generate these assets to verify your setup:

- [ ] **Imagen 3:** Hero image for a fictional product
- [ ] **Imagen 3:** Set of 6 UI icons
- [ ] **Veo 3.1:** 10-second product demo video
- [ ] **Veo 3.1:** Loopable background animation
- [ ] **Google Stitch:** Landing page mockup
- [ ] **Google Stitch:** Mobile app dashboard
- [ ] **Stitch → Code:** Export one mockup to React components

---

## What You Just Learned

You now control the **entire asset generation pipeline**:
- **Images** on demand (Imagen 3)
- **Videos** on demand (Veo 3.1)
- **UI mockups → Code** on demand (Google Stitch)

**Mental model shift:** Stop hiring designers for every asset. Generate 10 variations in 5 minutes, pick the best one, iterate with AI. Your job is **curation**, not creation.

---

## Cost Summary (Module 01 Tools)

| Tool | Free Tier | Paid Pricing |
|------|-----------|--------------|
| Claude Code | 50 messages/day | $20/month (unlimited) |
| Cursor | Unlimited (bring own API key) | $20/month (includes API credits) |
| Gemini 3 | $300 credits (90 days) | $0.002/1K tokens |
| GPT-5.2 | $5 free credits | $0.03/1K input, $0.06/1K output |
| NotebookLM | Unlimited (free) | N/A |
| Imagen 3 | 100/day | $0.02/image |
| Veo 3.1 | 20/week | $0.10/video |
| Google Stitch | 50/day | $0.05/mockup |

**Estimated monthly cost for active use:** $40-60 (Claude Pro + Cursor Pro + API usage)

---

## Next Steps

You've completed **Module 01: The Environment**. All tools are installed, authenticated, and tested.

**Up next:** **Module 02: From Chatting to Specifying** — Why chat prompts fail at scale, and how configuration files (CLAUDE.md, .cursorrules, AGENTS.md) unlock consistent AI outputs.`,
      },
    ],
    keyTakeaways: [
      'All tools are now installed & authenticated',
      'You\'ve seen real output from each tool',
      'You understand baseline quality expectations',
      'You feel comfortable with each interface',
      'You have working API keys & SDKs',
    ],
  },
  
  {
    id: 'module-02',
    number: '02',
    title: 'From Chatting to Specifying',
    subtitle: 'Configuration Files Are Your Superpower',
    duration: '50 min hands-on',
    objective: 'Learn why prompts fail at scale. Master CLAUDE.md, .cursorrules, AGENTS.md, and NotebookLM structure for consistent outputs.',
    icon: 'FileCode',
    sections: [
      {
        id: '02.1',
        title: 'Why Chat Prompts Fail at Scale',
        duration: '10 min',
        tools: ['claude-code', 'cursor'],
        content: `## The Chatbot Trap

You've been using AI the wrong way. Don't worry—everyone starts here.

**The pattern looks like this:**

1. Open ChatGPT or Claude
2. Type: *"Build me a React component for a user profile card"*
3. Get code back
4. Copy-paste into your project
5. Realize it doesn't match your existing code style
6. Go back: *"Can you use TypeScript with functional components and Tailwind?"*
7. Get new code
8. Realize it's missing error handling
9. Go back: *"Add error boundaries and loading states"*
10. **Repeat 5-10 more times**

**Total time:** 45 minutes for a single component.

Now multiply that by 50 components. You just spent **37.5 hours** re-explaining the same preferences over and over.

---

## The Real Problem: Context Amnesia

AI models don't remember your preferences between conversations. Every new chat is a blank slate.

**Here's what happens in practice:**

### Day 1: You build a login form
**Your prompt:**
> "Create a login form with email/password fields, validation, and submit button."

**Claude generates:**
- Class-based React component
- Inline styles
- No TypeScript
- Generic variable names (\`data\`, \`handleSubmit\`)

**You spend 20 minutes:** Re-prompting to get TypeScript, functional components, Tailwind, and your naming conventions.

---

### Day 3: You build a signup form
**Your prompt:**
> "Create a signup form with email/password/confirm password fields."

**Claude generates:**
- Class-based React component (again!)
- Inline styles (again!)
- No TypeScript (again!)

**Why?** Because this is a **new conversation**. Claude doesn't remember you prefer TypeScript and Tailwind. You just wasted another 20 minutes.

---

### Day 7: You build a password reset form
**Your prompt:**
> "Create a password reset form."

**Claude generates:**
- You guessed it: Class components, inline styles, no types.

**At this point, you're furious.** You've explained the same preferences **15 times across 15 conversations**. This doesn't feel like AI is making you faster—it feels like AI is making you a **professional prompt engineer**.

---

## The Math of Inconsistency

Let's calculate the real cost of chat-based prompting:

| Metric | Value |
|--------|-------|
| **Average iterations per feature** | 6-8 prompts |
| **Time per iteration** | 3-5 minutes (typing, reviewing, copy-pasting) |
| **Context-switching overhead** | 10-15% per conversation switch |
| **Re-explaining preferences** | 5-10 minutes per new chat |

**For a 50-component project:**
- **Without configuration:** 50 components × 7 iterations × 4 minutes = **1,400 minutes (23 hours)**
- **With configuration:** 50 components × 2 iterations × 2 minutes = **200 minutes (3.3 hours)**

**Time saved: 19.7 hours (83% reduction).**

---

## Why This Happens: The Stateless Nature of Chat

Every chat interface (ChatGPT, Claude, Gemini) operates in **stateless mode**:

- Each conversation starts fresh
- No memory of previous chats
- No persistent project context
- No awareness of your codebase structure

**It's like hiring a new developer every single day** and spending 2 hours onboarding them, only to fire them at 5 PM and hire someone new tomorrow.

---

## Real-World Failure Example

**Scenario:** You're building a SaaS dashboard with 20 different data tables.

### Conversation 1: Users Table
**Prompt:** *"Create a data table component for users with sorting and pagination."*

Claude generates a table component. You spend 15 minutes:
- Adding TypeScript types
- Switching to your preferred UI library (Shadcn)
- Matching your color scheme (cyan/violet)
- Adding your error handling pattern

**Total time:** 20 minutes. Result: ✅ Works perfectly.

---

### Conversation 2: Products Table (Next Day)
**Prompt:** *"Create a data table component for products with sorting and pagination."*

Claude generates:
- Completely different structure than the users table
- Different UI library (Material-UI this time)
- Different color scheme (blue/gray)
- Different error handling approach

**You realize:** Claude has **zero awareness** it already built a table component yesterday. You spend another 15 minutes re-explaining everything.

**Total time:** 20 minutes again.

---

### Conversations 3-20: More Tables
Same story. Every. Single. Time.

**Final tally:**
- **20 tables × 20 minutes = 400 minutes (6.7 hours)**
- If Claude remembered your preferences: **20 tables × 5 minutes = 100 minutes (1.7 hours)**

**You wasted 5 hours re-explaining the same thing 20 times.**

---

## The Three Types of Inconsistency

### 1. **Stylistic Inconsistency**
- One component uses \`async/await\`, another uses \`.then()\`
- One uses \`interface\`, another uses \`type\`
- One has detailed comments, another has none

**Impact:** Your codebase looks like it was written by 10 different developers.

### 2. **Architectural Inconsistency**
- One component fetches data directly, another uses React Query
- One handles errors with try/catch, another with .catch()
- One uses Zustand for state, another uses Context API

**Impact:** Future developers (or you in 3 months) can't understand the patterns.

### 3. **Quality Inconsistency**
- One component has comprehensive error handling, another crashes on null
- One has loading states, another shows blank screen
- One has accessibility attributes, another fails WCAG

**Impact:** Production bugs, user complaints, accessibility lawsuits.

---

## The Breaking Point: When Teams Get Involved

If you're solo, inconsistency is annoying. If you're on a team, **it's catastrophic**.

**Example scenario:**
- **Developer A** uses ChatGPT, prefers class components
- **Developer B** uses Claude, prefers functional components
- **Developer C** uses Gemini, prefers Vue-style composition

**Your codebase after 2 weeks:**
- 3 different React patterns
- 3 different state management approaches
- 3 different error handling strategies
- **Merge conflicts every single day**

**Project velocity:** **Slows to a crawl** because every PR requires 2 hours of "consistency refactoring."

---

## The Solution: Configuration-Driven AI

Instead of **prompting AI like a chatbot**, you configure AI like a **team member**.

**The shift:**

| Old Way (Chat) | New Way (Config) |
|----------------|------------------|
| Re-explain preferences in every conversation | Write preferences once in CLAUDE.md |
| Inconsistent outputs across conversations | Consistent outputs following your rules |
| AI as a tool you command | AI as a team member who knows the codebase |
| 10 iterations per feature | 2 iterations per feature |
| You're a prompt engineer | You're an architect |

---

## What Configuration Files Do

Think of configuration files as **"onboarding documents for AI agents."**

**Key files in the Vibe Coder stack:**

1. **CLAUDE.md** — Project context, architecture, subagent roles
2. **.cursorrules** — Code style, naming conventions, preferred patterns
3. **AGENTS.md** — Multi-agent orchestration rules (advanced)
4. **NotebookLM sources** — Research documents, architecture decisions

**When you set these up once**, every AI interaction:
- Automatically includes your project context
- Follows your architectural patterns
- Matches your code style
- Uses your preferred libraries

---

## Before & After Example

### Before (Chat-Based)

**Prompt:**
> "Create a user authentication service."

**Claude generates:**
- Generic \`auth.js\` file
- Uses \`fetch()\` directly
- No TypeScript
- No error handling
- Stores tokens in localStorage (insecure!)

**You spend 30 minutes:** Rewriting it to match your patterns.

---

### After (Config-Based)

**CLAUDE.md contains:**
\`\`\`markdown
## Authentication Standards
- Always use Axios instance from \`@/lib/api\`
- Store tokens in HttpOnly cookies (never localStorage)
- TypeScript with strict null checks
- Error handling with custom AuthError class
- Logging with Winston logger
\`\`\`

**Same prompt:**
> "Create a user authentication service."

**Claude now generates:**
- \`auth.service.ts\` (TypeScript!)
- Uses your Axios instance
- HttpOnly cookie storage
- Full error handling with AuthError
- Winston logging integrated

**You spend 5 minutes:** Reviewing and merging.

**Time saved: 25 minutes. Quality: 10x better.**

---

## What You'll Learn in This Module

By the end of Module 02, you'll have:

1. **CLAUDE.md** configured for your project
2. **.cursorrules** defining your code style
3. **AGENTS.md** for multi-agent workflows
4. **NotebookLM** knowledge base with your architecture docs

**Result:** AI that generates code **indistinguishable from your own hand-written code** on the first try.

---

## The Mindset Shift

**Stop thinking:**
> "AI is a chatbot I prompt when I need code."

**Start thinking:**
> "AI is a senior developer who read all my documentation before their first day."

When you onboard a human developer, you give them:
- Architecture diagrams
- Coding standards document
- Example code to reference
- Access to internal wikis

**Why wouldn't you do the same for AI?**

---

## Next Steps

In the next section, we'll create your **CLAUDE.md** file—the single most powerful configuration file in your AI workflow.

You're about to unlock **consistent, production-ready code on the first prompt.**`,
      },
      {
        id: '02.2',
        title: 'CLAUDE.md Deep-Dive',
        duration: '15 min',
        tools: ['claude-code'],
        content: `## What is CLAUDE.md?

**CLAUDE.md** is a configuration file that lives in your project root. When Claude Code (the terminal agent) reads your project, it automatically ingests this file and treats it as **persistent instructions**.

Think of it as:
- **Onboarding document** for AI agents
- **Project constitution** defining how code should be written
- **Knowledge base** containing architecture decisions
- **Subagent orchestrator** that splits tasks across specialized agents

**The magic:** Once you create CLAUDE.md, **every Claude interaction in this project** automatically follows these rules—no re-prompting needed.

---

## The Structure of CLAUDE.md

A well-structured CLAUDE.md has 6 key sections:

### 1. Project Overview
High-level description of what this project does.

### 2. Tech Stack
Exact versions of languages, frameworks, and libraries.

### 3. Architecture Patterns
How different parts of the codebase interact.

### 4. Code Style & Standards
Naming conventions, file structure, formatting rules.

### 5. Subagent Definitions
Specialized AI personas for different tasks.

### 6. Testing & Quality
Test coverage requirements, CI/CD expectations.

---

## Real Example: CLAUDE.md for a SaaS Dashboard

Let's build a production-ready CLAUDE.md step by step.

**Create \`CLAUDE.md\` in your project root:**

\`\`\`markdown
# Project: Vibe Analytics Dashboard

## Overview
A real-time analytics dashboard for tracking user engagement metrics. 
Built for founders who need actionable insights without hiring a data team.

**Target users:** Solo founders, small teams (2-10 people)  
**Key features:** Real-time charts, custom dashboards, AI-powered insights  
**Production URL:** https://vibe-analytics.com

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3 (strict mode)
- **Styling:** Tailwind CSS 3.4
- **UI Components:** Shadcn/ui (radix-ui primitives)
- **State Management:** Zustand 4.5
- **Data Fetching:** TanStack Query v5
- **Charts:** Recharts 2.10

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Express 4.18
- **Database:** PostgreSQL 16 with Prisma 5.8
- **Authentication:** NextAuth.js v5
- **API:** RESTful (migrating to tRPC in Q2)

### Infrastructure
- **Hosting:** Vercel (frontend), Railway (backend)
- **Database:** Supabase
- **Monitoring:** Sentry
- **Analytics:** Posthog

---

## Architecture Patterns

### Folder Structure
\\\`\\\`\\\`
app/
├── (auth)/           # Authentication routes
├── (dashboard)/      # Protected dashboard routes
├── api/              # API routes
├── components/       # Shared components
│   ├── ui/           # Shadcn components
│   └── features/     # Feature-specific components
├── lib/              # Utilities
└── hooks/            # Custom React hooks
\\\`\\\`\\\`

### Data Flow
1. **Client** makes request via TanStack Query
2. **TanStack Query** caches & deduplicates
3. **API route** validates with Zod schema
4. **Prisma** fetches from PostgreSQL
5. **Response** includes pagination metadata
6. **Client** updates Zustand store if needed

### Error Handling
- All API routes use try/catch with custom error types
- Frontend shows toast notifications (not alerts)
- Errors logged to Sentry with user context
- 404s redirect to custom error page

---

## Code Style & Standards

### Naming Conventions
- **Files:** kebab-case (\\\`user-profile.tsx\\\`)
- **Components:** PascalCase (\\\`UserProfile\\\`)
- **Functions:** camelCase (\\\`getUserData\\\`)
- **Constants:** SCREAMING_SNAKE_CASE (\\\`API_BASE_URL\\\`)
- **Types/Interfaces:** PascalCase (\\\`UserProfile\\\`, \\\`ApiResponse\\\`)

### Component Patterns
**Always use:**
- Functional components (no class components)
- TypeScript with explicit return types
- Destructured props with types
- Early returns for error states

**Example:**
\\\`\\\`\\\`typescript
interface UserCardProps {
  userId: string;
  onEdit?: (id: string) => void;
}

export function UserCard({ userId, onEdit }: UserCardProps): JSX.Element {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorCard error={error} />;
  if (!user) return <NotFound resource="user" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  );
}
\\\`\\\`\\\`

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Internal components (\\\`@/components\\\`)
4. Utilities (\\\`@/lib\\\`)
5. Types (\\\`@/types\\\`)
6. Styles (if any)

### State Management Rules
- **Server state:** TanStack Query (never Zustand)
- **Client UI state:** Zustand (modals, sidebars, filters)
- **URL state:** Next.js searchParams (pagination, tabs)
- **Form state:** React Hook Form + Zod validation

---

## Subagent Definitions

When working on this project, Claude should use specialized subagents:

### @frontend-agent
**Expertise:** React, Next.js, Tailwind, Shadcn  
**Responsibilities:**
- Building UI components
- Implementing responsive layouts
- Adding accessibility attributes
- Optimizing bundle size

**Code generation rules:**
- Always use Shadcn components (never build from scratch)
- Include \\\`aria-\\\` attributes for interactive elements
- Add loading skeletons for async data
- Use Tailwind responsive prefixes (\\\`md:\\\`, \\\`lg:\\\`)

### @backend-agent
**Expertise:** Node.js, Express, Prisma, PostgreSQL  
**Responsibilities:**
- Creating API endpoints
- Writing database queries
- Implementing authentication
- Handling data validation

**Code generation rules:**
- Validate all inputs with Zod schemas
- Use Prisma for all database operations (no raw SQL)
- Return consistent API response format
- Add request logging with correlation IDs

### @testing-agent
**Expertise:** Jest, React Testing Library, Playwright  
**Responsibilities:**
- Writing unit tests
- Creating integration tests
- Adding E2E test coverage
- Maintaining >80% code coverage

**Code generation rules:**
- Test files mirror source structure
- Use \\\`describe\\\` > \\\`it\\\` nesting
- Mock external APIs and database calls
- Include positive, negative, and edge cases

### @devops-agent
**Expertise:** Vercel, Railway, GitHub Actions  
**Responsibilities:**
- Setting up CI/CD pipelines
- Configuring environment variables
- Writing deployment scripts
- Monitoring setup

---

## Testing & Quality Standards

### Coverage Requirements
- **Overall:** Minimum 80%
- **Critical paths:** Minimum 95%
- **API routes:** Minimum 90%
- **UI components:** Minimum 70%

### Before Every Commit
- [ ] All tests pass locally
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build succeeds
- [ ] No console.logs left in code

### CI/CD Pipeline
1. **Lint & Type Check** (blocks merge)
2. **Unit Tests** (blocks merge)
3. **Integration Tests** (blocks merge)
4. **E2E Tests** (blocks deploy to prod)
5. **Lighthouse Score >90** (blocks deploy to prod)

---

## Development Workflow

### When Adding a New Feature
1. Create feature branch: \\\`feature/TICKET-description\\\`
2. Update CLAUDE.md if architecture changes
3. Write tests first (TDD approach)
4. Implement feature
5. Run full test suite
6. Create PR with template
7. Wait for CI checks + 1 approval
8. Squash and merge

### When Debugging
1. Check Sentry for error context
2. Reproduce locally with debug logs
3. Write failing test that reproduces bug
4. Fix bug
5. Verify test now passes
6. Add regression test
7. Deploy fix

---

## AI-Specific Instructions

### When Claude generates code, ALWAYS:
- Include TypeScript types
- Add error handling
- Use project's existing patterns (check similar files first)
- Follow ESLint rules (see \\\`.eslintrc.js\\\`)
- Match existing naming conventions
- Add JSDoc comments for complex functions
- Include examples in comments when helpful

### When Claude suggests refactoring, ALWAYS:
- Explain why the refactor is needed
- Show before/after code snippets
- Estimate time required
- List potential risks
- Suggest testing strategy

### When Claude encounters ambiguity, ALWAYS:
- Ask clarifying questions (don't guess)
- Reference existing code patterns
- Propose 2-3 options with trade-offs
- Wait for explicit approval before proceeding

---

## Glossary

- **User:** A person with an account on the platform
- **Workspace:** A team's container for dashboards
- **Widget:** A chart or metric on a dashboard
- **Event:** A tracked user action (click, pageview, etc.)
- **Insight:** AI-generated observation from data
\\\`\\\`\\\`

---

## How to Use CLAUDE.md

### Step 1: Create the File
Copy the template above and customize for your project.

### Step 2: Test It
Open Claude Code in your project directory and ask:

> "Create a new dashboard widget component for displaying total revenue."

**Claude will now:**
- Use Next.js 14 App Router patterns
- Generate TypeScript with strict types
- Use Shadcn Card component
- Follow your naming conventions
- Include loading skeleton
- Add error handling
- Match your folder structure

**All without you specifying any of this in your prompt.**

---

## Advanced: Subagent Orchestration

One of CLAUDE.md's most powerful features is **automatic subagent routing**.

**Example workflow:**

**Your prompt:**
> "Add user authentication with email/password and Google OAuth. Include tests."

**Claude automatically:**
1. Routes to **@backend-agent** for API endpoints
2. Routes to **@frontend-agent** for login UI
3. Routes to **@testing-agent** for test coverage
4. Routes to **@devops-agent** for environment variables

**You don't manage the agents. CLAUDE.md does.**

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| Making CLAUDE.md too generic | Be specific about versions, patterns, and examples |
| Forgetting to update it | Treat it as living documentation |
| Not including examples | Show, don't just tell |
| Too many subagents | Start with 3-4 specialized agents |
| No glossary | Define domain-specific terms |

---

## Real Results

**Before CLAUDE.md:**
- 8 iterations to get a component right
- 30% of code needed manual refactoring
- Inconsistent patterns across codebase
- New developers confused by mixed styles

**After CLAUDE.md:**
- 2 iterations to get a component right
- 5% of code needs manual refactoring
- Consistent patterns (Claude follows the doc)
- New developers onboard faster (humans read it too!)

---

## Next Steps

In the next section, we'll create **.cursorrules**—Cursor IDE's configuration file that works alongside CLAUDE.md for real-time code generation.

**Together, CLAUDE.md + .cursorrules = AI that writes code indistinguishable from your own.**`,
      },
      {
        id: '02.3',
        title: 'Cursor .cursorrules Configuration',
        duration: '12 min',
        tools: ['cursor'],
        content: `## What is .cursorrules?

**.cursorrules** is Cursor IDE's configuration file. While **CLAUDE.md** defines project-level context, **.cursorrules** defines **editor-level behavior**—how Cursor autocompletes code, what patterns to follow, and what to avoid.

**Key difference:**
- **CLAUDE.md** → Read by Claude Code (terminal agent)
- **.cursorrules** → Read by Cursor IDE (editor agent)

**Together, they create a unified AI workflow:**
- CLAUDE.md handles architecture and project patterns
- .cursorrules handles real-time code generation and autocomplete

---

## Where Does .cursorrules Live?

Create **.cursorrules** in your **project root** (same level as package.json):

\`\`\`
your-project/
├── .cursorrules          ← Create this file
├── .gitignore
├── package.json
├── CLAUDE.md
└── src/
\`\`\`

**Cursor automatically detects this file** and applies rules to all AI interactions in this project.

---

## Real Example: .cursorrules for React + TypeScript

Let's build a production-ready **.cursorrules** file.

**Create \`.cursorrules\` in project root:**

\`\`\`markdown
# Cursor AI Rules for Vibe Analytics Dashboard

## Language & Framework
- Use TypeScript exclusively (no JavaScript files)
- React 18+ with functional components only
- Next.js 14 App Router (not Pages Router)
- Strict mode enabled

## Code Style

### Naming Conventions
- **Files:** kebab-case (\`user-profile.tsx\`, \`api-client.ts\`)
- **Components:** PascalCase (\`UserProfile\`, \`DashboardCard\`)
- **Functions/Variables:** camelCase (\`getUserData\`, \`isLoading\`)
- **Constants:** SCREAMING_SNAKE_CASE (\`MAX_RETRY_ATTEMPTS\`)
- **Types/Interfaces:** PascalCase with descriptive names (\`UserProfileProps\`, \`ApiResponse\`)

### Component Structure
Always generate components in this order:
1. Imports (grouped and sorted)
2. Type definitions
3. Component function
4. Helper functions (if needed)
5. Exports

**Example template:**
\\\`\\\`\\\`typescript
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import type { User } from '@/types';

interface UserCardProps {
  userId: string;
  onEdit?: (user: User) => void;
}

export function UserCard({ userId, onEdit }: UserCardProps) {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  );
}
\\\`\\\`\\\`

## Import Rules

### Order
1. React imports
2. Next.js imports
3. Third-party libraries (alphabetical)
4. UI components (\`@/components/ui\`)
5. Feature components (\`@/components/features\`)
6. Hooks (\`@/hooks\`)
7. Utils (\`@/lib\`)
8. Types (\`@/types\`)

### Use Path Aliases
- ✅ \`import { Button } from '@/components/ui/button'\`
- ❌ \`import { Button } from '../../../components/ui/button'\`

## TypeScript Standards

### Always Define Types
- Function parameters must have explicit types
- Function return types must be declared
- No \`any\` type (use \`unknown\` if truly dynamic)
- Prefer \`interface\` for object shapes, \`type\` for unions/intersections

### Type Examples
\\\`\\\`\\\`typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ Bad
function getUser(id) {  // Missing types
  // ...
}

const user: any = await getUser('123');  // No any!
\\\`\\\`\\\`

## React Patterns

### State Management
- **Server state:** Use TanStack Query (\`useQuery\`, \`useMutation\`)
- **Client state:** Use Zustand for global, \`useState\` for local
- **URL state:** Use Next.js \`searchParams\` for filters/pagination
- **Form state:** Use React Hook Form + Zod

### Error Handling
Always handle loading and error states:

\\\`\\\`\\\`typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

if (isLoading) return <Skeleton />;
if (error) return <ErrorCard error={error} />;
if (!data) return <EmptyState />;

// Render success state
\\\`\\\`\\\`

### Accessibility
- All interactive elements must have \`aria-label\` or visible text
- Use semantic HTML (\`<button>\`, \`<nav>\`, \`<main>\`)
- Include \`alt\` text for images
- Ensure keyboard navigation works (\`tabIndex\`, \`onKeyDown\`)

## UI Component Rules

### Use Shadcn Components
- ✅ Import from \`@/components/ui\`
- ❌ Don't build custom buttons, cards, dialogs from scratch

### Styling
- Use Tailwind classes exclusively
- No inline styles (\`style={{}}\`)
- No CSS modules or styled-components
- Group classes logically (layout → spacing → colors → effects)

**Example:**
\\\`\\\`\\\`typescript
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  {/* Content */}
</div>
\\\`\\\`\\\`

## File Structure

### Component Files
\\\`\\\`\\\`
components/
├── ui/                    # Shadcn primitives
│   ├── button.tsx
│   └── card.tsx
├── features/              # Feature-specific
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   └── dashboard/
│       └── DashboardWidget.tsx
└── layouts/               # Page layouts
    └── AppLayout.tsx
\\\`\\\`\\\`

### Hooks
\\\`\\\`\\\`
hooks/
├── useUser.ts
├── useAuth.ts
└── useDebounce.ts
\\\`\\\`\\\`

### API Routes
\\\`\\\`\\\`
app/api/
├── auth/
│   └── route.ts
└── users/
    ├── route.ts
    └── [id]/
        └── route.ts
\\\`\\\`\\\`

## Performance Rules

### Code Splitting
- Use \`next/dynamic\` for heavy components
- Lazy load below-the-fold content
- Use React.lazy for client-only components

### Image Optimization
- Always use \`next/image\` (never \`<img>\`)
- Include \`width\` and \`height\`
- Add \`priority\` for above-the-fold images
- Use \`loading="lazy"\` for below-the-fold

\\\`\\\`\\\`typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Dashboard screenshot"
  width={1200}
  height={600}
  priority
/>
\\\`\\\`\\\`

## Error Handling Patterns

### API Calls
\\\`\\\`\\\`typescript
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(\\\`/api/users/\\\${id}\\\`);
    
    if (!response.ok) {
      throw new ApiError(\\\`Failed to fetch user: \\\${response.status}\\\`);
    }
    
    return response.json();
  } catch (error) {
    logger.error('User fetch failed', { userId: id, error });
    throw error;
  }
}
\\\`\\\`\\\`

### Form Validation
Use Zod schemas:

\\\`\\\`\\\`typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be 8+ characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const form = useForm<LoginForm>({
  resolver: zodResolver(loginSchema),
});
\\\`\\\`\\\`

## Testing Expectations

When generating components, also generate tests:

\\\`\\\`\\\`typescript
// UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  it('renders user name', () => {
    render(<UserCard userId="123" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<UserCard userId="123" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('handles errors gracefully', () => {
    // Mock error...
    render(<UserCard userId="invalid" />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
\\\`\\\`\\\`

## What to NEVER Generate

- ❌ Class components
- ❌ \`any\` types
- ❌ Inline styles
- ❌ \`var\` declarations
- ❌ Non-semantic HTML (\`<div onClick>\` instead of \`<button>\`)
- ❌ Hard-coded strings (use constants)
- ❌ Magic numbers (use named constants)
- ❌ Unhandled promises (always await or .catch())

## Comments & Documentation

### When to Comment
- Complex algorithms (explain the "why")
- Non-obvious workarounds
- Performance optimizations
- Public API functions (use JSDoc)

### When NOT to Comment
- Obvious code (\`// Increment counter\`)
- Outdated comments (update or delete)
- Commented-out code (use git history)

### JSDoc Example
\\\`\\\`\\\`typescript
/**
 * Fetches user data with automatic retry on failure.
 * 
 * @param userId - The unique identifier of the user
 * @param options - Optional fetch configuration
 * @returns User object or null if not found
 * @throws {ApiError} When API request fails after retries
 * 
 * @example
 * const user = await fetchUserWithRetry('user_123');
 */
async function fetchUserWithRetry(
  userId: string,
  options?: RequestOptions
): Promise<User | null> {
  // ...
}
\\\`\\\`\\\`

## Git Commit Guidelines

When suggesting code changes, also suggest commit messages:

**Format:** \`<type>(<scope>): <subject>\`

**Types:**
- \`feat\` - New feature
- \`fix\` - Bug fix
- \`refactor\` - Code restructuring
- \`style\` - Formatting only
- \`test\` - Adding tests
- \`docs\` - Documentation

**Examples:**
- \`feat(auth): add Google OAuth login\`
- \`fix(dashboard): resolve chart rendering bug\`
- \`refactor(api): extract validation logic\`

## AI-Specific Instructions

When I press Tab to accept an autocomplete suggestion:
- Complete the entire logical block (not just one line)
- Match surrounding code style exactly
- Use existing imports (don't add duplicates)
- Follow the patterns from similar files in the project

When I press Cmd+K for AI chat:
- Reference CLAUDE.md for architecture decisions
- Check existing similar components before generating new ones
- Ask clarifying questions if requirements are ambiguous
- Provide 2-3 options when there are trade-offs

When refactoring:
- Preserve existing functionality (no silent behavior changes)
- Maintain or improve test coverage
- Update related documentation
- Suggest running specific tests to verify changes
\`\`\`

---

## How .cursorrules Changes Your Workflow

### Before .cursorrules

**You press Tab:**
- Cursor suggests: \`const user = data\`
- You manually add types, error handling, etc.

**You ask for a component:**
- Cursor generates class component with inline styles
- You spend 10 minutes refactoring to match your patterns

---

### After .cursorrules

**You press Tab:**
- Cursor suggests: 
\`\`\`typescript
const { data: user, isLoading, error } = useUser(userId);

if (isLoading) return <Skeleton />;
if (error) return <ErrorCard error={error} />;
\`\`\`
- **Perfectly matches your patterns on first try**

**You ask for a component:**
- Cursor generates functional component with TypeScript, Shadcn UI, proper error handling, and tests
- **Ready to merge immediately**

---

## Testing Your .cursorrules

After creating the file, test it:

1. **Open any TypeScript file in Cursor**
2. **Type:** \`function handleSubmit\`
3. **Press Tab**

**Expected behavior:**
- Cursor autocompletes with proper TypeScript types
- Includes error handling
- Matches your naming conventions
- Uses async/await (not .then())

If this works, your .cursorrules is active!

---

## Advanced: Project-Specific Rules

You can add custom rules for your specific domain:

\`\`\`markdown
## Domain-Specific Rules

### User Roles
Our system has 3 roles:
- \`admin\` - Full access
- \`editor\` - Can edit, not delete
- \`viewer\` - Read-only

Always check permissions before rendering admin actions:

\\\`\\\`\\\`typescript
{user.role === 'admin' && (
  <Button onClick={handleDelete}>Delete</Button>
)}
\\\`\\\`\\\`

### Analytics Events
Track user actions with Posthog:

\\\`\\\`\\\`typescript
import { posthog } from '@/lib/analytics';

function handleClick() {
  posthog.capture('button_clicked', {
    button_name: 'signup',
    location: 'hero',
  });
}
\\\`\\\`\\\`
\`\`\`

---

## .cursorrules vs CLAUDE.md

| Aspect | .cursorrules | CLAUDE.md |
|--------|-------------|-----------|
| **Used by** | Cursor IDE | Claude Code (terminal) |
| **Focus** | Code style, patterns | Architecture, context |
| **Scope** | Real-time autocomplete | Autonomous tasks |
| **Updates** | Rarely (stable rules) | Often (evolving architecture) |
| **Examples** | Naming conventions, imports | Subagent definitions, tech stack |

**Pro tip:** Keep them in sync! If CLAUDE.md says "use Zustand for state," .cursorrules should define how to write Zustand stores.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Rules too vague ("write good code") | Be specific ("use z.object() for validation") |
| Conflicting with project eslint | Align .cursorrules with .eslintrc.js |
| Too many rules (100+ lines) | Focus on the 20% that matter 80% |
| Not testing after changes | Always verify autocomplete works |

---

## Next Steps

You now have:
- ✅ **CLAUDE.md** for project-wide context
- ✅ **.cursorrules** for editor-level behavior

**Next:** We'll create **AGENTS.md**—the advanced orchestration file that enables multi-agent workflows and autonomous task delegation.`,
      },
      {
        id: '02.4',
        title: 'AGENTS.md & NotebookLM Structure',
        duration: '13 min',
        tools: ['claude-code', 'notebooklm'],
        content: `## Part 1: AGENTS.md (Advanced Orchestration)

**AGENTS.md** is the most advanced configuration file in the stack. While CLAUDE.md defines *what* to build and .cursorrules defines *how* to write code, AGENTS.md defines **how multiple AI agents coordinate autonomously**.

**Think of it as:**
- **CLAUDE.md** = Project handbook
- **.cursorrules** = Style guide
- **AGENTS.md** = Workflow automation playbook

**Use AGENTS.md when:**
- You need 3+ AI agents working in parallel
- Tasks span multiple layers (frontend, backend, database, tests)
- You want autonomous execution with verification gates
- You're building complex features that require orchestration

---

## The Multi-Agent Problem

**Scenario:** You need to add a "forgot password" feature.

**Traditional approach (single-agent):**
1. Prompt Claude: "Add forgot password feature"
2. Claude generates backend API
3. You: "Now add the frontend form"
4. Claude generates frontend
5. You: "Now add email templates"
6. Claude generates emails
7. You: "Now add tests"
8. **Total: 4 separate conversations, 30 minutes**

**Multi-agent approach with AGENTS.md:**
1. You: "Add forgot password feature"
2. AGENTS.md automatically:
   - Routes **@backend-agent** to create API endpoint
   - Routes **@frontend-agent** to create form component
   - Routes **@email-agent** to create templates
   - Routes **@testing-agent** to write tests
   - **All agents work in parallel**
3. **Total: 1 conversation, 8 minutes**

---

## Real Example: AGENTS.md Structure

**Create \`AGENTS.md\` in your project root:**

\`\`\`markdown
# Multi-Agent Workflow Configuration

## Agent Definitions

### @backend-agent
**Expertise:** Node.js, Express, Prisma, PostgreSQL  
**Responsibilities:**
- API endpoint creation
- Database schema updates
- Data validation
- Error handling

**Output format:**
- Creates files in \`app/api/\`
- Updates Prisma schema if needed
- Generates migration scripts
- Returns list of created files

**Quality gates:**
- All inputs validated with Zod
- Error responses use standard format
- Database queries use Prisma (no raw SQL)
- Includes request/response logging

---

### @frontend-agent
**Expertise:** React, Next.js, Tailwind, Shadcn  
**Responsibilities:**
- UI component creation
- Form handling with React Hook Form
- Client-side validation
- Responsive design

**Output format:**
- Creates files in \`components/features/\`
- Includes TypeScript types
- Uses Shadcn components
- Returns component usage example

**Quality gates:**
- Includes loading/error states
- Accessible (ARIA labels, keyboard nav)
- Mobile-responsive
- Follows .cursorrules patterns

---

### @database-agent
**Expertise:** PostgreSQL, Prisma, database design  
**Responsibilities:**
- Schema design
- Migration creation
- Data modeling
- Index optimization

**Output format:**
- Updates \`prisma/schema.prisma\`
- Generates migration files
- Documents schema changes
- Returns migration command

**Quality gates:**
- Normalized database design
- Proper indexes on foreign keys
- Cascading deletes configured
- Timestamps on all tables

---

### @testing-agent
**Expertise:** Jest, React Testing Library, Playwright  
**Responsibilities:**
- Unit test creation
- Integration tests
- E2E test scenarios
- Test data generation

**Output format:**
- Creates files in \`__tests__/\`
- Mirrors source file structure
- Includes setup/teardown
- Returns coverage report

**Quality gates:**
- Minimum 80% code coverage
- Tests positive, negative, edge cases
- No hard-coded test data
- Tests run in isolation

---

### @devops-agent
**Expertise:** Docker, CI/CD, Vercel, Railway  
**Responsibilities:**
- Environment configuration
- CI/CD pipeline setup
- Deployment scripts
- Monitoring setup

**Output format:**
- Updates \`.github/workflows/\`
- Creates Docker configs if needed
- Documents deployment steps
- Returns verification checklist

**Quality gates:**
- All secrets in environment variables
- Build succeeds before deploy
- Tests pass in CI
- Rollback strategy documented

---

## Workflow Orchestration

### Workflow: Add New Feature

**Trigger:** User says "Add [feature name]"

**Step 1: Analysis**
- AGENTS.md parses the request
- Identifies which agents are needed
- Creates parallel task list

**Step 2: Parallel Execution**
\\\`\\\`\\\`
@database-agent    →  Create schema updates
@backend-agent     →  Create API endpoints (depends on schema)
@frontend-agent    →  Create UI components (depends on API)
@testing-agent     →  Write tests (depends on all above)
@devops-agent      →  Update CI/CD if needed
\\\`\\\`\\\`

**Step 3: Verification**
- Each agent reports completion
- Verification gates checked
- Integration tests run
- Human approval requested

**Step 4: Integration**
- All changes merged
- Migration applied
- Tests verified
- Deployed to staging

---

### Workflow: Fix Production Bug

**Trigger:** User provides error log

**Step 1: Root Cause Analysis**
- **@backend-agent** analyzes stack trace
- **@database-agent** checks for data issues
- **@frontend-agent** checks for UI state bugs

**Step 2: Fix Generation**
- Agent with highest confidence proposes fix
- Other agents review for side effects

**Step 3: Testing**
- **@testing-agent** writes regression test
- Test must fail before fix
- Test must pass after fix

**Step 4: Deploy**
- **@devops-agent** creates hotfix branch
- Automated deployment to staging
- Request human approval for production

---

## Verification Gates

Each agent must pass these gates before code is accepted:

### Code Quality Gates
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes with no warnings
- [ ] All imports resolve
- [ ] No console.log statements
- [ ] Follows .cursorrules patterns

### Testing Gates
- [ ] Unit tests exist and pass
- [ ] Integration tests pass
- [ ] Coverage meets minimum (80%)
- [ ] No flaky tests

### Security Gates
- [ ] No hard-coded secrets
- [ ] Input validation present
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (React escaping)

### Performance Gates
- [ ] No N+1 queries
- [ ] API responses < 200ms (p95)
- [ ] Bundle size increase < 50KB
- [ ] Lighthouse score > 90

---

## Agent Communication Protocol

Agents communicate through a standard message format:

\\\`\\\`\\\`json
{
  "agent": "@backend-agent",
  "task": "create-password-reset-endpoint",
  "status": "completed",
  "files_created": [
    "app/api/auth/reset-password/route.ts",
    "lib/email/templates/reset-password.tsx"
  ],
  "dependencies": {
    "requires": ["@database-agent:schema-update"],
    "blocks": ["@frontend-agent:reset-form"]
  },
  "verification": {
    "gates_passed": ["code_quality", "security"],
    "gates_pending": ["testing"]
  }
}
\\\`\\\`\\\`

---

## Real-World Example

**User prompt:**
> "Add a premium subscription feature with Stripe integration"

**AGENTS.md orchestration:**

\\\`\\\`\\\`
[1] @database-agent: Add subscription tables
    ├── users.subscription_tier (enum: free, pro, enterprise)
    ├── subscriptions table (Stripe metadata)
    └── Migration: 20250123_add_subscriptions.sql

[2] @backend-agent: Create Stripe webhook handler (depends on [1])
    ├── app/api/webhooks/stripe/route.ts
    ├── lib/stripe/client.ts
    └── Handles: subscription.created, subscription.updated

[3] @frontend-agent: Create checkout flow (depends on [2])
    ├── components/features/billing/CheckoutButton.tsx
    ├── components/features/billing/PricingTable.tsx
    └── app/checkout/page.tsx

[4] @testing-agent: Write test suite (depends on [1,2,3])
    ├── __tests__/api/stripe-webhook.test.ts
    ├── __tests__/components/CheckoutButton.test.tsx
    └── __tests__/e2e/subscription-flow.spec.ts

[5] @devops-agent: Add Stripe secrets to CI/CD
    ├── Update .env.example
    ├── Add secrets to Vercel/Railway
    └── Document webhook URL setup
\\\`\\\`\\\`

**Timeline:**
- Tasks [1,5] run immediately (no dependencies)
- Task [2] starts after [1] completes
- Task [3] starts after [2] completes
- Task [4] starts after [1,2,3] complete
- **Total time: ~15 minutes** (vs. 2+ hours manually)

---

## Part 2: NotebookLM Structure for Knowledge Preservation

While AGENTS.md handles **execution**, NotebookLM handles **research and knowledge management**.

**The problem NotebookLM solves:**
- You research a complex topic (OAuth flows, database sharding, etc.)
- You spend 3 hours reading docs
- Two weeks later, you need that knowledge again
- You've forgotten everything
- You waste another 2 hours re-learning

**NotebookLM solution:** Create a structured knowledge base that AI agents can reference.

---

## How to Structure NotebookLM for Reuse

### 1. Create Topic-Specific Notebooks

**Example notebooks:**
- **Authentication Patterns** (OAuth, JWT, session management)
- **Database Design** (normalization, indexes, migrations)
- **Payment Processing** (Stripe, webhooks, idempotency)
- **Performance Optimization** (caching, CDN, lazy loading)

### 2. Upload Sources

For each notebook, add:
- Official documentation
- Architecture decision records (ADRs)
- Blog posts that solved your problems
- Stack Overflow answers
- Your own notes and learnings

### 3. Generate Artifacts

**For each notebook, create:**
1. **Podcast** (10-15 min audio summary)
2. **Mind map** (visual concept connections)
3. **FAQ document** (generated from sources)
4. **Implementation checklist** (steps to follow)

### 4. Reference in AGENTS.md

Link NotebookLM notebooks in AGENTS.md:

\`\`\`markdown
### @backend-agent

**Knowledge bases:**
- Authentication: [NotebookLM - Auth Patterns](https://notebooklm.google.com/notebook/abc123)
- Payments: [NotebookLM - Stripe Integration](https://notebooklm.google.com/notebook/def456)

**When implementing authentication:**
1. Reference "Auth Patterns" notebook
2. Use JWT pattern documented in FAQ
3. Follow checklist for secure token storage
\`\`\`

---

## Real Workflow: Research → Build

**Scenario:** You need to implement real-time notifications.

### Step 1: Research (NotebookLM)
1. Create notebook: "Real-Time Architecture"
2. Upload sources:
   - WebSocket documentation
   - Server-Sent Events guide
   - Socket.io tutorial
   - Your competitor's tech blog post
3. Generate:
   - Podcast (listen while coding)
   - Mind map (visualize architecture)
   - FAQ (quick reference)

**Time: 15 minutes**

---

### Step 2: Architect (CLAUDE.md)
1. Update CLAUDE.md with chosen approach (WebSockets via Socket.io)
2. Define data flow patterns
3. Document authentication strategy

**Time: 10 minutes**

---

### Step 3: Build (AGENTS.md)
1. Trigger: "Implement real-time notifications"
2. **@backend-agent** references NotebookLM "Real-Time Architecture"
3. **@backend-agent** creates WebSocket server
4. **@frontend-agent** creates useWebSocket hook
5. **@testing-agent** writes connection tests

**Time: 20 minutes**

**Total: 45 minutes** (vs. 4+ hours without this system)

---

## The Complete Configuration Stack

You now have 4 layers of AI configuration:

| File | Purpose | Used By | Update Frequency |
|------|---------|---------|-----------------|
| **CLAUDE.md** | Project context, architecture | Claude Code | Weekly |
| **.cursorrules** | Code style, patterns | Cursor IDE | Monthly |
| **AGENTS.md** | Multi-agent workflows | Claude Code | As needed |
| **NotebookLM** | Knowledge preservation | All agents | Per research topic |

---

## Hands-On Exercise

**Create your first AGENTS.md:**

1. Copy the template above
2. Define 3 agents minimum:
   - @backend-agent
   - @frontend-agent
   - @testing-agent
3. Add one workflow (e.g., "Add new API endpoint")
4. Test by prompting: "Add a health check endpoint"

**Expected result:** Claude Code automatically routes work to the right agents and reports back with all files created.

---

## What You Just Learned

You've unlocked **autonomous AI workflows**:
- **AGENTS.md** orchestrates multiple specialized agents
- **Verification gates** ensure quality
- **NotebookLM** preserves research for reuse
- **Parallel execution** saves hours of sequential prompting

**Mental model shift:** You're no longer prompting AI. You're **configuring autonomous systems** that execute complex tasks while you focus on architecture and decision-making.

---

## Next Steps

You've completed **Module 02: From Chatting to Specifying**.

You now have:
- ✅ CLAUDE.md for project context
- ✅ .cursorrules for code style
- ✅ AGENTS.md for orchestration
- ✅ NotebookLM for knowledge bases

**Up next: Module 03: Agent Orchestration** — Hands-on practice building real multi-agent workflows with cost optimization strategies.`,
      },
    ],
    keyTakeaways: [
      'Configuration beats manual prompting',
      'CLAUDE.md provides persistent context',
      '.cursorrules enforces your standards',
      'AGENTS.md enables autonomous workflows',
      'NotebookLM preserves knowledge across features',
      'Plan Mode reduces iteration cycles',
    ],
  },
  
  {
    id: 'module-03',
    number: '03',
    title: 'Agent Orchestration',
    subtitle: 'Multi-Agent Workflows & Parallel Execution',
    duration: '60 min hands-on',
    objective: 'Build a real 3-agent workflow, run agents in parallel, judge outputs automatically, and iterate based on results.',
    icon: 'GitBranch',
    sections: [
      {
        id: '03.1',
        title: 'Multi-Agent Architecture',
        duration: '15 min',
        tools: ['claude-code', 'cursor', 'codemachine'],
        content: `## Why Multi-Agent Architecture?

**Single-agent limitation:** One AI model has strengths and weaknesses. Claude reasons deeply but slowly. Gemini processes massive context fast. GPT-5.2 debugs brilliantly but hallucinates on creative tasks.

**Multi-agent solution:** Use 3+ specialized models **in parallel**, each doing what it does best. An orchestrator coordinates them, and you pick the best output.

**Real impact:**
- **Speed:** 3 agents working in parallel = 3x faster
- **Quality:** Best-of-3 outputs = higher success rate
- **Cost:** Route cheap tasks to cheap models, complex tasks to expensive models

---

## The Architecture Pattern

### Traditional Single-Agent Flow

\`\`\`
You → Prompt → Claude → Code → Review → Iterate
                 ↓
              30 seconds
\`\`\`

**Problem:** Serial execution. One model. One approach.

---

### Multi-Agent Parallel Flow

\`\`\`
                        ┌──→ Claude (reasoning) ──┐
You → Orchestrator ─────┼──→ Gemini (speed)    ──┼──→ Judge → Best Output
                        └──→ GPT-5.2 (debug)  ──┘
                        
                        All run in parallel (10s)
\`\`\`

**Benefit:** 3 different approaches. Pick the best one. Total time = slowest agent (not sum of all).

---

## The 5 Roles in Multi-Agent Systems

### 1. **Orchestrator**
**Tool:** Claude Code (or CodeMachine)  
**Responsibility:** Parse user request, break into subtasks, route to specialists

**Example:**
> **User:** "Add export to CSV feature"
>
> **Orchestrator breaks down:**
> - Task A: Backend endpoint for CSV generation → @backend-agent
> - Task B: Frontend export button UI → @frontend-agent
> - Task C: CSV formatting utility → @utility-agent

---

### 2. **Specialist Agents**
**Tools:** Claude, Gemini, GPT-5.2 (or multiple Claude instances)  
**Responsibility:** Execute assigned tasks in their domain of expertise

**Example specialist agents:**

| Agent | Best For | Model Choice |
|-------|----------|--------------|
| **@reasoning-agent** | Architecture decisions, refactoring | Claude Sonnet 4.5 |
| **@speed-agent** | Boilerplate, CRUD endpoints | Gemini 3 Flash |
| **@debug-agent** | Error analysis, bug fixes | GPT-5.2 |
| **@multimodal-agent** | Design → Code, screenshot analysis | Gemini 3 Pro |

---

### 3. **Judge**
**Tool:** Cursor (or human review)  
**Responsibility:** Evaluate outputs from all agents, select best implementation

**Evaluation criteria:**
- Code quality (TypeScript strictness, error handling)
- Performance (time complexity, bundle size)
- Maintainability (readability, follows patterns)
- Completeness (handles edge cases)

---

### 4. **Integrator**
**Tool:** Claude Code (or Cursor)  
**Responsibility:** Merge selected implementations, resolve conflicts, run tests

**Example:**
- Agent A created API endpoint
- Agent B created frontend component
- **Integrator** connects them, updates imports, verifies integration

---

### 5. **Verifier**
**Tool:** Automated tests + CI/CD  
**Responsibility:** Run test suites, lint, type-check, build verification

**Gates:**
- ✅ TypeScript compiles
- ✅ ESLint passes
- ✅ Unit tests pass
- ✅ Integration tests pass
- ✅ Build succeeds

---

## Real Example: Export to CSV Feature

### Step 1: Orchestrator Parses Request

**User prompt:**
> "Add ability to export todo list to CSV file with filename based on current date."

**Orchestrator (Claude Code) breaks down:**

\`\`\`json
{
  "task": "export-todos-csv",
  "subtasks": [
    {
      "id": "backend-csv-generator",
      "description": "Create CSV formatting utility",
      "assigned_to": "@speed-agent",
      "model": "gemini-3-flash",
      "priority": "high"
    },
    {
      "id": "api-export-endpoint",
      "description": "Create API endpoint that returns CSV",
      "assigned_to": "@reasoning-agent",
      "model": "claude-sonnet-4.5",
      "priority": "high",
      "depends_on": ["backend-csv-generator"]
    },
    {
      "id": "frontend-export-button",
      "description": "Add export button to todo list UI",
      "assigned_to": "@speed-agent",
      "model": "gemini-3-flash",
      "priority": "medium"
    }
  ],
  "parallel_execution": true
}
\`\`\`

---

### Step 2: Specialist Agents Execute in Parallel

**Agent A (Gemini 3 Flash) - CSV Utility:**

\`\`\`typescript
// lib/csv-generator.ts
export function generateTodoCSV(todos: Todo[]): string {
  const headers = ['ID', 'Title', 'Status', 'Created At'];
  const rows = todos.map(todo => [
    todo.id,
    todo.title,
    todo.completed ? 'Done' : 'Pending',
    todo.createdAt.toISOString(),
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(cell => \`"\${cell}"\`).join(','))
    .join('\\n');
}
\`\`\`

**Time: 8 seconds**

---

**Agent B (Claude Sonnet 4.5) - API Endpoint:**

\`\`\`typescript
// app/api/todos/export/route.ts
import { generateTodoCSV } from '@/lib/csv-generator';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const todos = await db.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const csv = generateTodoCSV(todos);
    const filename = \`todos_\${new Date().toISOString().split('T')[0]}.csv\`;
    
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': \`attachment; filename="\${filename}"\`,
      },
    });
  } catch (error) {
    return new Response('Export failed', { status: 500 });
  }
}
\`\`\`

**Time: 12 seconds**

---

**Agent C (Gemini 3 Flash) - Frontend Button:**

\`\`\`typescript
// components/ExportButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function ExportButton() {
  const handleExport = async () => {
    const response = await fetch('/api/todos/export');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = \`todos_\${new Date().toISOString().split('T')[0]}.csv\`;
    a.click();
    
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      Export to CSV
    </Button>
  );
}
\`\`\`

**Time: 10 seconds**

---

### Step 3: Judge Evaluates Outputs

**Cursor (or human) reviews all 3 outputs:**

| Agent | Output Quality | Issues Found |
|-------|---------------|-------------|
| Agent A | ✅ Clean CSV formatting | None |
| Agent B | ✅ Proper error handling, filename generation | None |
| Agent C | ⚠️ Missing error handling on fetch | Needs try/catch |

**Judge decision:** Accept A and B, request fix for C.

---

### Step 4: Integrator Merges Code

**Cursor automatically:**
1. Creates \`lib/csv-generator.ts\`
2. Creates \`app/api/todos/export/route.ts\`
3. Creates \`components/ExportButton.tsx\`
4. Adds export button to todo list page
5. Updates imports

---

### Step 5: Verifier Runs Tests

\`\`\`bash
✓ TypeScript compilation passed
✓ ESLint: 0 errors, 0 warnings
✓ Unit tests: 3/3 passed
  ✓ generateTodoCSV formats correctly
  ✓ API endpoint returns valid CSV
  ✓ ExportButton triggers download
✓ Build succeeded
\`\`\`

**Total time: 25 seconds** (vs. 5 minutes single-agent)

---

## Cost Optimization Strategy

Different models have different costs:

| Model | Cost (per 1M tokens) | Best For |
|-------|---------------------|----------|
| Gemini 3 Flash | $0.075 | Boilerplate, simple tasks |
| Claude Sonnet 4.5 | $3.00 | Complex reasoning |
| GPT-5.2 | $30.00 | Debugging only |

**Smart routing:**
- **Simple CRUD endpoints** → Gemini 3 Flash ($0.075)
- **Architecture decisions** → Claude Sonnet 4.5 ($3.00)
- **Critical bug fixes** → GPT-5.2 ($30.00)

**Example cost calculation:**

**Scenario:** Build 10 features (5 simple, 3 medium, 2 complex)

**Without routing (all Claude):**
- 10 features × $0.15 = **$1.50**

**With smart routing:**
- 5 simple (Gemini) × $0.004 = $0.02
- 3 medium (Claude) × $0.15 = $0.45
- 2 complex (Claude) × $0.15 = $0.30
- **Total: $0.77** (49% savings)

---

## Architecture Patterns

### Pattern 1: Parallel Generation + Judge

**Use case:** Generate UI component with multiple approaches

\`\`\`
You: "Create a pricing table component"

Agent A (Claude)  → Generates table with Shadcn components
Agent B (Gemini)  → Generates table with custom Tailwind
Agent C (GPT-5.2) → Generates table with accessibility focus

Judge: Compares all 3, picks Agent C (best accessibility)
\`\`\`

---

### Pattern 2: Specialist Pipeline

**Use case:** Complex feature requiring multiple layers

\`\`\`
Step 1: @database-agent   → Create schema
Step 2: @backend-agent    → Create API (depends on step 1)
Step 3: @frontend-agent   → Create UI (depends on step 2)
Step 4: @testing-agent    → Create tests (depends on all above)
\`\`\`

**Note:** Not fully parallel, but each step uses the best model for that task.

---

### Pattern 3: Consensus Voting

**Use case:** Critical decisions (architecture, security)

\`\`\`
Question: "Should we use REST or GraphQL for this API?"

Agent A (Claude)  → Votes REST (reasoning: simpler, caching)
Agent B (Gemini)  → Votes GraphQL (reasoning: flexible queries)
Agent C (GPT-5.2) → Votes REST (reasoning: team expertise)

Majority: REST (2/3 votes)
\`\`\`

---

## When NOT to Use Multi-Agent

Multi-agent adds complexity. Use single-agent when:

| Scenario | Reason |
|----------|--------|
| Simple prompt ("fix typo") | Overhead > benefit |
| Highly sequential task | Can't parallelize |
| Budget constrained | Extra API calls cost money |
| Debugging existing code | One model with full context is better |

**Rule of thumb:** Use multi-agent for features that take >5 minutes to build manually.

---

## Tools for Multi-Agent Orchestration

### Option 1: Claude Code + AGENTS.md (Free)
- Define agents in AGENTS.md
- Manually trigger each agent
- Cursor merges outputs

**Pros:** Free, full control  
**Cons:** Manual orchestration

---

### Option 2: CodeMachine (Paid)
- Automated orchestration
- Built-in judge and integrator
- Visual workflow builder

**Pros:** Fully automated  
**Cons:** $50/month

---

### Option 3: Custom Scripts
- Write Node.js/Python scripts
- Call API endpoints directly
- DIY orchestration logic

**Pros:** Maximum flexibility  
**Cons:** Requires programming

---

## What You Just Learned

Multi-agent architecture enables:
- **Parallel execution** (3x speed improvement)
- **Best-of-N selection** (higher quality)
- **Cost optimization** (right model for right task)
- **Specialization** (each agent does what it does best)

**Mental model shift:** Stop thinking "which AI should I use?" Start thinking "which combination of AIs should I orchestrate?"

---

## Next Steps

In the next section, you'll **build a real 3-agent system** from scratch and see it execute a complete feature in under 2 minutes.`,
      },
      {
        id: '03.2',
        title: 'Hands-On: 3-Agent Build',
        duration: '25 min',
        tools: ['claude-code', 'gemini', 'gpt-5-2', 'cursor'],
        content: `## The Feature: User Profile Dashboard

We're going to build a **user profile dashboard** with:
- Avatar upload
- Profile form (name, bio, location)
- Activity timeline
- Settings panel

**Complexity:** Medium (touches frontend, backend, file uploads, state management)

**Goal:** Build this in **under 10 minutes** using 3 agents in parallel.

---

## Step 1: Create the Agent Brief

An **agent brief** is a structured specification that all agents receive. It ensures consistency.

**Create \`agent-brief.md\`:**

\`\`\`markdown
# Agent Brief: User Profile Dashboard

## Feature Overview
Add a user profile page where users can:
- Upload/change avatar image
- Edit profile information (name, bio, location)
- View recent activity timeline
- Manage account settings

## Technical Constraints
- **Stack:** Next.js 14, TypeScript, Tailwind, Shadcn
- **Database:** Prisma + PostgreSQL
- **Storage:** Vercel Blob for avatar uploads
- **Authentication:** NextAuth.js (already configured)

## Deliverables

### Backend (@backend-agent)
- [ ] Update Prisma schema with profile fields
- [ ] Create \`/api/profile\` endpoint (GET, PATCH)
- [ ] Create \`/api/upload/avatar\` endpoint
- [ ] Handle image validation (max 5MB, JPG/PNG only)

### Frontend (@frontend-agent)
- [ ] Create \`ProfilePage\` component
- [ ] Create \`AvatarUpload\` component
- [ ] Create \`ProfileForm\` with React Hook Form + Zod
- [ ] Create \`ActivityTimeline\` component
- [ ] Create \`SettingsPanel\` component

### Testing (@testing-agent)
- [ ] Unit tests for API endpoints
- [ ] Component tests for all UI
- [ ] E2E test for full profile update flow
- [ ] Minimum 80% coverage

## Success Criteria
- User can upload avatar and see preview
- Profile updates save to database
- Activity timeline shows last 10 actions
- All tests pass
- Mobile responsive
- Accessible (keyboard nav, screen reader)

## Constraints
- No external dependencies (use existing stack)
- Max bundle size increase: 50KB
- Avatar upload < 2s on 3G
\`\`\`

---

## Step 2: Configure AGENTS.md

Update your **AGENTS.md** to define the 3 agents:

\`\`\`markdown
## Agent Pool

### @backend-agent
**Model:** Claude Sonnet 4.5  
**Specialization:** API design, database schema  
**Tools:** Prisma, Zod validation, NextAuth  

**Instructions:**
- Always validate inputs with Zod schemas
- Use Prisma for all database operations
- Return consistent API response format
- Include error logging

---

### @frontend-agent
**Model:** Gemini 3 Flash  
**Specialization:** React components, UI/UX  
**Tools:** React Hook Form, Tailwind, Shadcn  

**Instructions:**
- Use Shadcn components exclusively
- Include loading skeletons
- Handle error states gracefully
- Mobile-first responsive design

---

### @testing-agent
**Model:** Gemini 3 Flash  
**Specialization:** Test coverage  
**Tools:** Jest, React Testing Library, Playwright  

**Instructions:**
- Mirror source file structure
- Test happy path + edge cases
- Mock external dependencies
- Target 80%+ coverage
\`\`\`

---

## Step 3: Launch 3 Agents in Parallel

### Terminal 1: Backend Agent (Claude)

\`\`\`bash
# Open terminal 1
cd your-project
claude --agent @backend-agent --brief agent-brief.md --output backend-output/
\`\`\`

**What happens:**
- Claude reads agent-brief.md
- Identifies backend deliverables
- Generates Prisma schema update
- Creates API endpoints
- **Completes in ~45 seconds**

**Output:**
\`\`\`
✓ Updated prisma/schema.prisma
✓ Created app/api/profile/route.ts
✓ Created app/api/upload/avatar/route.ts
✓ Generated migration: 20250123_add_profile_fields.sql

Files created: 3
Tokens used: 1,200
Cost: $0.036
\`\`\`

---

### Terminal 2: Frontend Agent (Gemini)

\`\`\`bash
# Open terminal 2
cd your-project
gemini-agent --role @frontend-agent --spec agent-brief.md --output frontend-output/
\`\`\`

**What happens:**
- Gemini reads the brief
- Generates 5 React components
- Includes form validation with Zod
- **Completes in ~30 seconds** (faster than Claude!)

**Output:**
\`\`\`
✓ Created app/profile/page.tsx
✓ Created components/profile/AvatarUpload.tsx
✓ Created components/profile/ProfileForm.tsx
✓ Created components/profile/ActivityTimeline.tsx
✓ Created components/profile/SettingsPanel.tsx

Files created: 5
Tokens used: 2,500
Cost: $0.0002
\`\`\`

---

### Terminal 3: Testing Agent (Gemini)

\`\`\`bash
# Open terminal 3
cd your-project
gemini-agent --role @testing-agent --spec agent-brief.md --output test-output/
\`\`\`

**What happens:**
- Gemini generates test suites
- Mirrors component structure
- Includes mocks for API calls
- **Completes in ~35 seconds**

**Output:**
\`\`\`
✓ Created __tests__/api/profile.test.ts
✓ Created __tests__/api/upload.test.ts
✓ Created __tests__/components/AvatarUpload.test.tsx
✓ Created __tests__/components/ProfileForm.test.tsx
✓ Created __tests__/e2e/profile-flow.spec.ts

Files created: 5
Coverage: 87%
Cost: $0.0003
\`\`\`

---

## Step 4: Monitor Progress (Real-Time Dashboard)

While agents work, open Cursor and run:

\`\`\`bash
cursor --multi-agent-dashboard
\`\`\`

**You'll see:**

\`\`\`
┌─────────────────────────────────────────────────┐
│  Multi-Agent Build Dashboard                   │
├─────────────────────────────────────────────────┤
│  @backend-agent (Claude)       ████████░░  80%  │
│  @frontend-agent (Gemini)      ██████████ 100%  │
│  @testing-agent (Gemini)       ███████░░░  70%  │
│                                                  │
│  Total Progress: 83%                            │
│  Elapsed Time: 42s                              │
│  Estimated Completion: 10s                      │
└─────────────────────────────────────────────────┘
\`\`\`

---

## Step 5: Judge Outputs with Cursor

All agents finished. Now Cursor evaluates their work.

**Cursor automatically runs:**

1. **Code Quality Check**
   - TypeScript compiles: ✅
   - ESLint passes: ✅
   - No unused imports: ✅

2. **Pattern Compliance**
   - Follows .cursorrules: ✅
   - Uses Shadcn components: ✅
   - Zod validation present: ✅

3. **Integration Check**
   - Frontend imports match backend endpoints: ✅
   - Types are consistent: ✅
   - No circular dependencies: ✅

4. **Test Coverage**
   - Overall coverage: 87% ✅
   - Critical paths covered: 100% ✅

**Cursor verdict:**

\`\`\`
✓ All agents passed quality gates
✓ No conflicts detected
✓ Ready to integrate

Suggested action: Merge all outputs
\`\`\`

---

## Step 6: Automatic Integration

**Run:**

\`\`\`bash
cursor --integrate backend-output/ frontend-output/ test-output/
\`\`\`

**Cursor automatically:**

1. **Merges all files** into project structure
2. **Resolves import paths**
3. **Updates package.json** if new deps added
4. **Runs database migration**
5. **Executes test suite**

**Output:**

\`\`\`
✓ Merged 13 files
✓ Resolved 0 conflicts
✓ Migration applied: 20250123_add_profile_fields
✓ Tests: 18/18 passed

Feature "User Profile Dashboard" complete!
Time: 2 minutes 15 seconds
Cost: $0.0365
\`\`\`

---

## Step 7: Human Review (Optional)

Even though AI did everything, **always review before deploying**.

**Quick checklist:**

\`\`\`bash
# 1. Visual inspection
npm run dev
# → Open http://localhost:3000/profile
# → Upload avatar, edit profile, check mobile view

# 2. Code review
git diff
# → Scan for anything unexpected

# 3. Run full test suite
npm test

# 4. Check bundle size
npm run build
# → Ensure increase is < 50KB

# 5. Security check
npm audit
\`\`\`

**Time for human review: 5 minutes**

**Total time (AI + human): 7 minutes 15 seconds**

**Compare to manual coding: 2-3 hours**

---

## Real Terminal Output Example

Here's what you'd actually see:

\`\`\`bash
$ claude --agent @backend-agent --brief agent-brief.md

🤖 Claude Backend Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reading brief... ✓
Analyzing requirements... ✓
Planning implementation... ✓

Tasks identified:
  1. Update Prisma schema
  2. Create profile API endpoint
  3. Create avatar upload endpoint
  4. Add validation schemas

Executing tasks in sequence...

[1/4] Updating Prisma schema...
  ✓ Added Profile model
  ✓ Added avatarUrl field to User
  ✓ Generated migration

[2/4] Creating profile API...
  ✓ Created app/api/profile/route.ts
  ✓ Added GET handler
  ✓ Added PATCH handler
  ✓ Zod validation included

[3/4] Creating avatar upload API...
  ✓ Created app/api/upload/avatar/route.ts
  ✓ Added Vercel Blob integration
  ✓ Image validation (5MB, JPG/PNG)
  ✓ Error handling

[4/4] Verifying implementation...
  ✓ TypeScript compiles
  ✓ ESLint passes
  ✓ No circular dependencies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Backend tasks complete

Files created: 3
Lines of code: 287
Tokens used: 1,203
Cost: $0.036
Time: 48 seconds

Next steps:
- Run: npx prisma migrate dev
- Test: curl http://localhost:3000/api/profile
\`\`\`

---

## Comparison: Multi-Agent vs Single-Agent

### Single-Agent Approach (Sequential)

\`\`\`
You → Claude (backend)    → 2 minutes
You → Claude (frontend)   → 3 minutes
You → Claude (tests)      → 2 minutes
You → Claude (integration) → 1 minute
You → Manual review       → 5 minutes

Total: 13 minutes
Cost: $0.12 (all Claude)
\`\`\`

---

### Multi-Agent Approach (Parallel)

\`\`\`
You → @backend-agent (Claude)    ━┓
You → @frontend-agent (Gemini)   ━┫ → 48 seconds (parallel)
You → @testing-agent (Gemini)    ━┛

You → Cursor (integration)       → 30 seconds
You → Manual review              → 5 minutes

Total: 7 minutes 18 seconds
Cost: $0.037 (smart routing)
\`\`\`

**Savings:**
- **Time:** 5 minutes 42 seconds (44% faster)
- **Cost:** $0.083 (69% cheaper)

---

## What Can Go Wrong?

### Issue 1: Conflicting Implementations

**Scenario:** Frontend agent uses different API endpoint path than backend agent defined.

**Solution:** Agent brief must specify exact paths.

**Fix in brief:**
\`\`\`markdown
## API Endpoints
- \`GET /api/profile\` - Fetch profile
- \`PATCH /api/profile\` - Update profile
- \`POST /api/upload/avatar\` - Upload image
\`\`\`

---

### Issue 2: Agents Ignore Brief

**Scenario:** Agent generates class components despite brief saying "functional only."

**Solution:** Make constraints explicit in AGENTS.md, not just the brief.

**Add to AGENTS.md:**
\`\`\`markdown
### @frontend-agent

**Hard constraints (NEVER violate):**
- ❌ No class components
- ❌ No inline styles
- ❌ No \`any\` types
\`\`\`

---

### Issue 3: Integration Conflicts

**Scenario:** Two agents modify the same file differently.

**Solution:** Use git branches + automated merge.

\`\`\`bash
# Each agent works on separate branch
git checkout -b backend-agent
# ... backend agent commits
git checkout main

git checkout -b frontend-agent
# ... frontend agent commits
git checkout main

# Auto-merge with conflict detection
git merge backend-agent
git merge frontend-agent
\`\`\`

---

## Pro Tips

### Tip 1: Start with Minimal Brief
Don't over-specify. Let agents be creative within constraints.

**Bad (too specific):**
> "Use \`useState\` hook with initial value \`false\`, then create \`handleToggle\` function..."

**Good (constraints only):**
> "Toggle modal visibility. Use React hooks. Follow .cursorrules patterns."

---

### Tip 2: Use Different Models for Different Complexity

| Task Complexity | Recommended Model |
|----------------|-------------------|
| Boilerplate (CRUD) | Gemini 3 Flash |
| Standard features | Gemini 3 Pro |
| Complex logic | Claude Sonnet 4.5 |
| Critical debugging | GPT-5.2 |

---

### Tip 3: Monitor Costs in Real-Time

Add to your \`package.json\`:

\`\`\`json
{
  "scripts": {
    "ai-cost": "node scripts/track-ai-costs.js"
  }
}
\`\`\`

**Track by agent:**
\`\`\`bash
$ npm run ai-cost

Today's AI Usage:
  @backend-agent (Claude):  $0.24
  @frontend-agent (Gemini): $0.03
  @testing-agent (Gemini):  $0.02
  
Total: $0.29
Monthly: $6.73 (projected)
\`\`\`

---

## What You Just Built

In **7 minutes**, you:
- ✅ Added database schema
- ✅ Created 2 API endpoints
- ✅ Built 5 React components
- ✅ Wrote 18 tests (87% coverage)
- ✅ Integrated everything

**Without AI:** 2-3 hours  
**With multi-agent AI:** 7 minutes  
**Speed improvement: 17-26x faster**

---

## Next Steps

Now that you've mastered parallel multi-agent builds, the next section covers **Cursor Debug Mode**—how to use AI to automatically instrument, diagnose, and fix bugs in real-time.`,
      },
      {
        id: '03.3',
        title: 'Cursor Debug Mode Workflow',
        duration: '15 min',
        tools: ['cursor', 'gpt-5-2'],
        content: `## What is Cursor Debug Mode?

**Cursor Debug Mode** is an AI-powered debugging assistant that:
1. **Instruments** your code with automatic logging
2. **Reproduces** bugs by simulating user actions
3. **Captures** runtime data (variables, stack traces, memory)
4. **Analyzes** with AI (GPT-5.2 by default)
5. **Generates** fixes and **retests** automatically

**Think of it as:** A senior developer sitting next to you, watching your code run, and pointing out exactly what's wrong.

---

## The Problem: Large File Export Failure

**Scenario:** Your CSV export feature works fine for small datasets, but crashes when exporting >100MB of data.

**Traditional debugging:**
1. Add \`console.log\` statements (10 min)
2. Reproduce the bug manually (5 min)
3. Read logs, hypothesize root cause (15 min)
4. Google the error message (10 min)
5. Try a fix, test again (5 min)
6. Repeat 3-5 times
7. **Total: 30-60 minutes**

**With Cursor Debug Mode: 3 minutes**

---

## Step 1: Enable Debug Mode

### Option A: Global Enable (Recommended for Learning)

1. Open Cursor Settings (\`Cmd+,\`)
2. Search for **"Debug Mode"**
3. Toggle **"AI-Assisted Debugging"** ON
4. Set **Debug Model** to \`GPT-5.2\` (best for debugging)

### Option B: File-Specific Enable

Add to top of file:

\`\`\`typescript
// @cursor-debug: enable
// @cursor-model: gpt-5-2

export async function exportLargeCSV(data: any[]) {
  // ...
}
\`\`\`

---

## Step 2: Trigger the Bug

**In Cursor's terminal:**

\`\`\`bash
npm run dev
\`\`\`

**Then manually trigger the bug:**
1. Open your app
2. Navigate to export page
3. Select "Export all users" (200,000 rows)
4. Click "Export to CSV"

**What happens:**
- Browser freezes for 10 seconds
- Error appears: \`RangeError: Invalid array length\`

---

## Step 3: Cursor Automatically Instruments Code

**Behind the scenes, Cursor rewrites your function:**

**Original code:**
\`\`\`typescript
export async function exportLargeCSV(data: User[]): Promise<string> {
  const rows = data.map(user => [
    user.id,
    user.name,
    user.email,
  ]);
  
  const csv = rows.join('\\n');
  return csv;
}
\`\`\`

**Cursor's instrumented version (invisible to you):**
\`\`\`typescript
export async function exportLargeCSV(data: User[]): Promise<string> {
  console.log('[CURSOR DEBUG] exportLargeCSV called');
  console.log('[CURSOR DEBUG] Input data length:', data.length);
  console.time('[CURSOR DEBUG] Total execution time');
  
  try {
    const rows = data.map((user, index) => {
      if (index % 10000 === 0) {
        console.log(\`[CURSOR DEBUG] Processed \${index} rows\`);
        console.log('[CURSOR DEBUG] Memory usage:', process.memoryUsage());
      }
      return [user.id, user.name, user.email];
    });
    
    console.log('[CURSOR DEBUG] Rows created:', rows.length);
    
    const csv = rows.join('\\n');
    
    console.log('[CURSOR DEBUG] CSV size:', csv.length, 'bytes');
    console.timeEnd('[CURSOR DEBUG] Total execution time');
    
    return csv;
  } catch (error) {
    console.error('[CURSOR DEBUG] Error caught:', error);
    console.error('[CURSOR DEBUG] Stack trace:', error.stack);
    throw error;
  }
}
\`\`\`

**Key additions:**
- Logs function entry
- Tracks progress every 10,000 rows
- Monitors memory usage
- Measures execution time
- Captures full error details

---

## Step 4: Cursor Captures Runtime Data

**Console output:**

\`\`\`
[CURSOR DEBUG] exportLargeCSV called
[CURSOR DEBUG] Input data length: 200000
[CURSOR DEBUG] Processed 0 rows
[CURSOR DEBUG] Memory usage: { rss: 45MB, heapUsed: 12MB }
[CURSOR DEBUG] Processed 10000 rows
[CURSOR DEBUG] Memory usage: { rss: 120MB, heapUsed: 89MB }
[CURSOR DEBUG] Processed 20000 rows
[CURSOR DEBUG] Memory usage: { rss: 245MB, heapUsed: 198MB }
[CURSOR DEBUG] Processed 30000 rows
[CURSOR DEBUG] Memory usage: { rss: 512MB, heapUsed: 445MB }
[CURSOR DEBUG] Error caught: RangeError: Invalid array length
[CURSOR DEBUG] Stack trace: at Array.join (native)
\`\`\`

**Cursor identifies the problem:**
> Memory grows linearly with data size. At row 30,000, heap usage hits 445MB. The \`.join()\` operation tries to allocate a single massive string, causing heap overflow.

---

## Step 5: AI Analysis with GPT-5.2

Cursor sends this data to GPT-5.2 with a debugging prompt:

**Prompt sent to GPT-5.2:**

\`\`\`
Analyze this runtime trace for a CSV export function:

Function: exportLargeCSV
Input: 200,000 user records
Error: RangeError: Invalid array length

Runtime observations:
- Memory grows from 12MB to 445MB in 30,000 iterations
- Crash occurs at Array.join() call
- CSV string would be ~500MB if successful

Codebase context:
- Running in Node.js 20
- Heap limit: 512MB (default)
- Output delivered via HTTP response

Task: Provide root cause analysis and propose 3 fixes with pros/cons.
\`\`\`

---

## Step 6: GPT-5.2 Responds with Analysis

**GPT-5.2 output (displayed in Cursor sidebar):**

\`\`\`markdown
## Root Cause Analysis

**Problem:** You're trying to hold the entire CSV (500MB) in memory as a single string.

**Why it fails:**
1. The \`.map()\` creates an array of 200,000 string arrays (~200MB)
2. The \`.join()\` tries to allocate a 500MB string
3. Node.js default heap limit is 512MB
4. Heap exhaustion → crash

---

## Fix Proposals

### Option 1: Streaming (Recommended)
**Approach:** Write CSV line-by-line to a stream instead of building in memory.

**Code:**
\\\`\\\`\\\`typescript
import { Readable } from 'stream';

export function exportLargeCSV(data: User[]): Readable {
  let index = 0;

  return new Readable({
    read() {
      if (index >= data.length) {
        this.push(null); // End stream
        return;
      }

      const user = data[index++];
      const row = \\\`\\\${user.id},\\\${user.name},\\\${user.email}\\\\n\\\`;
      this.push(row);
    },
  });
}
\\\`\\\`\\\`

**Pros:**
- Constant memory usage (~10MB regardless of dataset size)
- Can handle infinite datasets
- Works with HTTP streaming

**Cons:**
- Requires changing API response to use streams
- Slightly more complex code

**Memory usage:** ~10MB (constant)  
**Recommendation:** ⭐⭐⭐⭐⭐

---

### Option 2: Chunked Processing
**Approach:** Build CSV in chunks, write to temp file.

**Code:**
\\\`\\\`\\\`typescript
import fs from 'fs';
import path from 'path';

export async function exportLargeCSV(data: User[]): Promise<string> {
  const tempFile = path.join('/tmp', \\\`export-\\\${Date.now()}.csv\\\`);
  const writeStream = fs.createWriteStream(tempFile);

  for (const user of data) {
    const row = \\\`\\\${user.id},\\\${user.name},\\\${user.email}\\\\n\\\`;
    writeStream.write(row);
  }

  writeStream.end();

  return new Promise((resolve) => {
    writeStream.on('finish', () => resolve(tempFile));
  });
}
\\\`\\\`\\\`

**Pros:**
- Memory-efficient
- Simpler than streaming
- File can be served directly

**Cons:**
- Requires disk I/O
- Temp files need cleanup
- Slower than in-memory

**Memory usage:** ~15MB  
**Recommendation:** ⭐⭐⭐⭐

---

### Option 3: Increase Heap Size
**Approach:** Raise Node.js heap limit.

**Code:**
\\\`\\\`\\\`bash
# In package.json
{
  "scripts": {
    "start": "node --max-old-space-size=4096 server.js"
  }
}
\\\`\\\`\\\`

**Pros:**
- No code changes needed
- Quick fix

**Cons:**
- Doesn't scale (what if user exports 2M rows?)
- Wastes resources
- Not a real solution

**Memory usage:** Up to 4GB  
**Recommendation:** ⭐ (Band-aid, not a fix)
\`\`\`

---

## Step 7: Cursor Generates Fix Automatically

**Cursor asks:**
> I recommend **Option 1: Streaming**. Apply this fix?

**You click:** "Yes, apply and test"

**Cursor automatically:**

1. **Rewrites the function:**

\`\`\`typescript
import { Readable } from 'stream';

export function exportLargeCSV(data: User[]): Readable {
  let index = 0;

  return new Readable({
    read() {
      if (index >= data.length) {
        this.push(null);
        return;
      }

      const user = data[index++];
      const row = \`\${user.id},\${user.name},\${user.email}\\n\`;
      this.push(row);
    },
  });
}
\`\`\`

2. **Updates the API endpoint:**

\`\`\`typescript
// app/api/export/route.ts
import { exportLargeCSV } from '@/lib/csv';

export async function GET(req: Request) {
  const users = await db.user.findMany();
  const stream = exportLargeCSV(users);

  return new Response(stream as any, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="export.csv"',
    },
  });
}
\`\`\`

3. **Adds a test:**

\`\`\`typescript
describe('exportLargeCSV', () => {
  it('handles large datasets without crashing', async () => {
    const largeDataset = Array.from({ length: 200000 }, (_, i) => ({
      id: \`\${i}\`,
      name: \`User \${i}\`,
      email: \`user\${i}@example.com\`,
    }));

    const stream = exportLargeCSV(largeDataset);
    
    // Consume stream
    const chunks: string[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk.toString());
    }

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.join('')).toContain('User 199999');
  });
});
\`\`\`

4. **Runs the test:**

\`\`\`bash
✓ exportLargeCSV handles large datasets without crashing (2.1s)

Memory usage during test: 12MB (constant)
Test passed ✓
\`\`\`

---

## Step 8: Verify the Fix

**Cursor automatically triggers a retest:**

\`\`\`bash
[CURSOR DEBUG] Retesting with 200,000 rows...
[CURSOR DEBUG] Memory usage: 11MB (constant)
[CURSOR DEBUG] Export completed in 3.2 seconds
[CURSOR DEBUG] No errors detected ✓
\`\`\`

**Success! The bug is fixed.**

---

## Real-World Debugging Session

Here's what the full Cursor Debug Mode UI looks like:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ Cursor Debug Session: exportLargeCSV                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 🔴 Bug Detected                                             │
│ RangeError: Invalid array length                           │
│ at line 245: const csv = rows.join('\\n');                  │
│                                                              │
│ 📊 Runtime Analysis (GPT-5.2)                               │
│ • Memory grew from 12MB → 445MB                            │
│ • Heap exhaustion at 30,000 rows                           │
│ • Root cause: Trying to allocate 500MB string              │
│                                                              │
│ 💡 Recommended Fix: Stream-based CSV generation            │
│ Confidence: 95%                                             │
│                                                              │
│ [Apply Fix] [Show Alternative Fixes] [Manual Debug]        │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## When to Use Debug Mode

| Scenario | Use Debug Mode? |
|----------|----------------|
| App crashes with cryptic error | ✅ Yes |
| Performance degradation | ✅ Yes |
| Intermittent race condition | ✅ Yes |
| Logic error (wrong calculation) | ✅ Yes |
| Syntax error | ❌ No (linter handles this) |
| Styling issue | ❌ No (visual inspection faster) |

---

## Debug Mode Best Practices

### 1. Start with Reproduction Steps

**Good:**
> "Export fails when dataset > 100,000 rows. Steps: Go to /export, click 'Export All Users', browser freezes."

**Bad:**
> "Export doesn't work."

---

### 2. Use Descriptive Variable Names

Debug logs are easier to understand with clear names:

\`\`\`typescript
// Bad
const d = await fetchData();
const r = d.map(x => x.y);

// Good
const users = await fetchUsers();
const userNames = users.map(user => user.name);
\`\`\`

---

### 3. Let AI Analyze First, Then Manual Debug

**Workflow:**
1. Enable Debug Mode
2. Trigger bug
3. Wait for AI analysis (30 seconds)
4. If AI fix doesn't work, add breakpoints manually

**Don't skip the AI step!** It catches 80% of bugs instantly.

---

## Advanced: Custom Debug Agents

You can create specialized debug agents in AGENTS.md:

\`\`\`markdown
### @performance-debug-agent
**Model:** GPT-5.2  
**Specialization:** Performance issues, memory leaks  

**Instructions:**
- Instrument with memory profiling
- Analyze heap snapshots
- Suggest optimization strategies
- Benchmark before/after fixes

### @security-debug-agent
**Model:** Claude Sonnet 4.5  
**Specialization:** Security vulnerabilities  

**Instructions:**
- Check for SQL injection
- Validate input sanitization
- Review authentication logic
- Scan for XSS vulnerabilities
\`\`\`

---

## Cost Considerations

Debug Mode uses AI models, which cost money:

| Model | Cost per Debug Session |
|-------|----------------------|
| GPT-5.2 | $0.05 - $0.15 |
| Claude Sonnet 4.5 | $0.03 - $0.10 |
| Gemini 3 Pro | $0.001 - $0.005 |

**Budget tip:** Use Gemini for simple bugs, GPT-5.2 for complex ones.

**Monthly estimate (20 bugs):**
- With GPT-5.2: ~$2.00
- With Gemini: ~$0.10

---

## What You Just Learned

Cursor Debug Mode automates:
- ✅ Code instrumentation
- ✅ Bug reproduction
- ✅ Runtime data capture
- ✅ AI-powered root cause analysis
- ✅ Fix generation
- ✅ Automated retesting

**Time savings:** 30-60 minutes → 3 minutes (90% reduction)

**Mental model shift:** Stop manually adding \`console.log\`. Let AI instrument, analyze, and fix bugs while you review the solution.

---

## Next Steps

Final section of Module 03: **Cost Optimization Through Specialization**—how to reduce AI costs by 65% through intelligent model routing.`,
      },
      {
        id: '03.4',
        title: 'Cost Optimization Through Specialization',
        duration: '10 min',
        tools: ['claude-code', 'gemini', 'gpt-5-2'],
        content: `## The Cost Problem

AI-powered development is cheap compared to hiring, but **costs add up fast** if you're inefficient.

**Reality check:**
- Building a 50-feature SaaS with only Claude Sonnet 4.5: **~$60/month**
- Same app with smart model routing: **~$18/month**
- **Savings: $42/month (70%)**

Over a year: **$504 saved** just by choosing the right model for each task.

---

## The Pricing Landscape (January 2025)

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Sweet Spot |
|-------|---------------------|----------------------|------------|
| **Gemini 3 Flash** | $0.075 | $0.30 | Boilerplate, CRUD, simple UI |
| **Gemini 3 Pro** | $1.25 | $5.00 | Multimodal, large context |
| **Claude Sonnet 4.5** | $3.00 | $15.00 | Complex logic, architecture |
| **GPT-5.2** | $30.00 | $60.00 | Debugging ONLY |

**Key insight:** There's a **40x price difference** between Gemini Flash and GPT-5.2. Using the wrong model is expensive.

---

## The Routing Decision Matrix

### Task Classification

Every coding task falls into one of these categories:

| Category | Complexity | Example Tasks | Best Model | Cost |
|----------|-----------|---------------|-----------|------|
| **Boilerplate** | Low | CRUD endpoints, simple forms | Gemini Flash | $0.075/M |
| **Standard** | Medium | Component with state, validation | Gemini Pro | $1.25/M |
| **Complex** | High | Multi-step workflows, architecture | Claude Sonnet | $3.00/M |
| **Critical** | Debugging | Production bugs, security issues | GPT-5.2 | $30.00/M |

---

## Real Examples: Task-by-Task Routing

### Example 1: "Create a Login Form"

**Task breakdown:**
1. Form UI with email/password inputs (simple)
2. Validation logic (medium)
3. API integration (simple)

**Routing decision:**

| Subtask | Model | Reason | Cost |
|---------|-------|--------|------|
| Form UI | Gemini Flash | Standard HTML/React, no complexity | $0.001 |
| Validation | Gemini Flash | Regex + Zod schema (common pattern) | $0.001 |
| API call | Gemini Flash | Boilerplate fetch code | $0.0005 |

**Total cost: $0.0025** (vs. $0.09 if using Claude for everything)

---

### Example 2: "Add Real-Time Notifications"

**Task breakdown:**
1. WebSocket server setup (complex)
2. React component for notifications (simple)
3. State management with Zustand (medium)

**Routing decision:**

| Subtask | Model | Reason | Cost |
|---------|-------|--------|------|
| WebSocket server | Claude Sonnet | Complex: connection handling, auth, reconnect logic | $0.12 |
| Notification UI | Gemini Flash | Standard component pattern | $0.002 |
| State management | Gemini Pro | Moderate complexity, edge cases | $0.015 |

**Total cost: $0.137** (vs. $0.36 if using Claude for everything)

**Savings: 62%**

---

### Example 3: "Debug Production Crash"

**Task breakdown:**
1. Analyze error logs (critical)
2. Identify root cause (critical)
3. Generate fix (complex)
4. Write regression test (simple)

**Routing decision:**

| Subtask | Model | Reason | Cost |
|---------|-------|--------|------|
| Log analysis | GPT-5.2 | Best debugging model | $0.30 |
| Root cause | GPT-5.2 | Critical path, can't afford mistakes | $0.20 |
| Generate fix | Claude Sonnet | Complex logic, needs reasoning | $0.10 |
| Write test | Gemini Flash | Standard test pattern | $0.001 |

**Total cost: $0.601**

**Don't cheap out on debugging!** This is where GPT-5.2 earns its price.

---

## The Routing Algorithm

### Simple Heuristic

Use this decision tree:

\`\`\`
Is it a production bug or security issue?
├─ Yes → GPT-5.2
└─ No → Continue

Does it require architectural decisions or complex logic?
├─ Yes → Claude Sonnet 4.5
└─ No → Continue

Does it involve multimodal input (images, PDFs, videos)?
├─ Yes → Gemini 3 Pro
└─ No → Continue

Is it standard boilerplate or CRUD?
├─ Yes → Gemini 3 Flash
└─ No → Gemini 3 Pro (default)
\`\`\`

---

## Implementing Smart Routing in AGENTS.md

Update your AGENTS.md to include cost-aware routing:

\`\`\`markdown
## Agent Routing Rules

### @cheap-agent (Gemini 3 Flash)
**Cost:** $0.075 per 1M input tokens  
**Use for:**
- CRUD endpoints
- Simple forms (login, signup, contact)
- List/table components
- Data fetching hooks
- Basic validation logic

**Cost ceiling:** $0.01 per task

---

### @balanced-agent (Gemini 3 Pro)
**Cost:** $1.25 per 1M input tokens  
**Use for:**
- Components with complex state
- Multi-step forms
- Data visualization (charts, graphs)
- API clients with error handling
- Moderate business logic

**Cost ceiling:** $0.10 per task

---

### @smart-agent (Claude Sonnet 4.5)
**Cost:** $3.00 per 1M input tokens  
**Use for:**
- Architecture decisions
- Complex refactoring
- Authentication/authorization flows
- Real-time features (WebSockets, SSE)
- Database schema design
- Performance optimization

**Cost ceiling:** $0.50 per task

---

### @debug-agent (GPT-5.2)
**Cost:** $30.00 per 1M input tokens  
**Use for:**
- Production crashes
- Memory leaks
- Security vulnerabilities
- Performance bottlenecks
- Race conditions

**Cost ceiling:** $2.00 per task (but worth it!)
\`\`\`

---

## Real-World Cost Tracking

### Week 1: No Routing (All Claude Sonnet)

| Task | Tokens Used | Cost |
|------|------------|------|
| Create login form | 8,000 | $0.024 |
| Create user dashboard | 15,000 | $0.045 |
| Add profile page | 12,000 | $0.036 |
| Debug API error | 20,000 | $0.060 |
| Create settings page | 10,000 | $0.030 |
| **Total** | **65,000** | **$0.195** |

**Projected monthly cost (4 weeks):** $0.78

---

### Week 2: Smart Routing

| Task | Model | Tokens Used | Cost |
|------|-------|------------|------|
| Create login form | Gemini Flash | 8,000 | $0.0006 |
| Create user dashboard | Gemini Pro | 15,000 | $0.019 |
| Add profile page | Gemini Flash | 12,000 | $0.0009 |
| Debug API error | GPT-5.2 | 20,000 | $0.600 |
| Create settings page | Gemini Flash | 10,000 | $0.00075 |
| **Total** | **Mixed** | **65,000** | **$0.621** |

**Projected monthly cost (4 weeks):** $2.48

**Wait, that's MORE expensive!**

---

## The Debugging Cost Trap

**The problem:** GPT-5.2 for debugging is expensive, but **you debug less often** when you use better models upfront.

### Adjusted Comparison (Realistic Usage)

| Metric | All Claude | Smart Routing |
|--------|-----------|---------------|
| Feature tasks (40/month) | $0.78 | $0.50 |
| Debugging tasks (10/month) | $0.60 | $0.30 |
| **Refactoring** (fewer bugs) | N/A | -$0.20 |
| **Total monthly** | **$1.38** | **$0.60** |

**Actual savings: 56%**

**Why?** Better models (Claude) write better code → fewer bugs → less debugging needed.

---

## Advanced: Dynamic Cost Ceilings

Set per-feature budgets in AGENTS.md:

\`\`\`markdown
## Feature Budget Limits

### Low-priority features
**Budget:** $0.05 maximum  
**Strategy:** Use Gemini Flash, accept lower quality  
**Examples:** Marketing pages, blog posts

### Medium-priority features
**Budget:** $0.25 maximum  
**Strategy:** Gemini Pro for most, Claude for critical parts  
**Examples:** User profiles, dashboards

### High-priority features
**Budget:** $1.00 maximum  
**Strategy:** Claude Sonnet for everything, GPT-5.2 for debugging  
**Examples:** Payment processing, authentication
\`\`\`

---

## Monitoring AI Spend

### Create a Cost Tracking Script

\`\`\`typescript
// scripts/track-ai-costs.ts
import fs from 'fs';

interface AIUsage {
  date: string;
  model: string;
  task: string;
  tokensIn: number;
  tokensOut: number;
  cost: number;
}

const PRICING = {
  'gemini-flash': { input: 0.075, output: 0.30 },
  'gemini-pro': { input: 1.25, output: 5.00 },
  'claude-sonnet': { input: 3.00, output: 15.00 },
  'gpt-5.2': { input: 30.00, output: 60.00 },
};

function calculateCost(usage: AIUsage): number {
  const model = PRICING[usage.model];
  const inputCost = (usage.tokensIn / 1_000_000) * model.input;
  const outputCost = (usage.tokensOut / 1_000_000) * model.output;
  return inputCost + outputCost;
}

function generateReport() {
  const usage: AIUsage[] = JSON.parse(
    fs.readFileSync('.ai-usage.json', 'utf-8')
  );

  const totalCost = usage.reduce((sum, u) => sum + calculateCost(u), 0);
  const byModel = usage.reduce((acc, u) => {
    const model = u.model;
    acc[model] = (acc[model] || 0) + calculateCost(u);
    return acc;
  }, {} as Record<string, number>);

  console.log('AI Usage Report');
  console.log('===============');
  console.log(\`Total cost: $\${totalCost.toFixed(2)}\`);
  console.log('\\nBy model:');
  Object.entries(byModel).forEach(([model, cost]) => {
    console.log(\`  \${model}: $\${cost.toFixed(2)}\`);
  });
}

generateReport();
\`\`\`

**Run weekly:**
\`\`\`bash
npm run ai-cost-report
\`\`\`

---

## Red Flags: When You're Overspending

| Warning Sign | Fix |
|-------------|-----|
| Using Claude for simple CRUD | Route to Gemini Flash |
| Debugging with Claude (not GPT-5.2) | Switch to GPT-5.2 for faster resolution |
| Re-generating same component 5+ times | Improve your brief/prompts |
| Monthly bill > $50 for solo project | Review routing rules |
| Using GPT-5.2 for non-debugging tasks | Reserve GPT-5.2 for critical issues only |

---

## The 80/20 Rule for AI Costs

**80% of your tasks are simple** (forms, CRUD, lists) → Use Gemini Flash  
**15% are moderate complexity** (state management, validation) → Use Gemini Pro  
**5% are complex** (architecture, algorithms) → Use Claude Sonnet  
**1% are critical** (production bugs) → Use GPT-5.2

**Optimal spend distribution:**
- Gemini Flash: 80% of tasks, 10% of budget
- Gemini Pro: 15% of tasks, 30% of budget
- Claude Sonnet: 5% of tasks, 40% of budget
- GPT-5.2: 1% of tasks, 20% of budget

---

## What You Just Learned

Cost optimization strategies:
- ✅ Task classification (boilerplate → complex → critical)
- ✅ Model routing matrix
- ✅ Cost ceilings per feature
- ✅ Spend tracking with scripts
- ✅ The 80/20 rule for AI usage

**Real savings:** 56-70% reduction in AI costs through intelligent routing.

**Mental model shift:** Stop thinking "which AI should I use?" Start thinking "what's the cheapest model that can do this job well?"

---

## Module 03 Complete

You've mastered **Agent Orchestration**:
- ✅ Multi-agent architecture (parallel execution)
- ✅ Hands-on 3-agent build (7 minutes for full feature)
- ✅ Cursor Debug Mode (90% faster debugging)
- ✅ Cost optimization (56-70% savings)

**Next:** **Module 04: The Synthesis** — Build a real production feature end-to-end using everything you've learned.`,
      },
    ],
    keyTakeaways: [
      'Parallel agents beat sequential execution',
      'Multi-agent judging auto-selects best output',
      'Cursor Debug Mode reduces debug cycles by 10x',
      'Cost optimization through intelligent routing',
      'MCP servers enable external integrations',
    ],
  },
  
  {
    id: 'module-04',
    number: '04',
    title: 'The Synthesis',
    subtitle: 'Build a Real Feature End-to-End',
    duration: '90 min guided project',
    objective: 'Build complete "analytics dashboard" feature using full orchestration stack. From research to deployment.',
    icon: 'Layers',
    sections: [
      {
        id: '04.1',
        title: 'Research Phase with NotebookLM',
        duration: '15 min',
        tools: ['notebooklm', 'gemini'],
        content: `## The Feature: Analytics Dashboard

We're building a **real-time analytics dashboard** that shows:
- User activity metrics (DAU, MAU, retention)
- Revenue tracking (MRR, churn, LTV)
- Performance charts (API latency, error rates)
- Custom reports with filters

**Complexity:** High (real-time data, complex queries, visualizations)

**This module walks you through the ENTIRE process** from research → planning → build → deploy.

---

## Why Start with Research?

**The problem:** Most developers skip research and jump straight to coding. Then:
1. They realize they don't understand the requirements (2 hours wasted)
2. They pick the wrong tech stack (refactor needed)
3. They miss edge cases (bugs in production)

**NotebookLM solves this** by:
- Synthesizing existing docs
- Identifying knowledge gaps
- Generating aligned understanding for whole team
- Creating reusable artifacts (podcasts, mind maps)

---

## Step 1: Gather Source Materials

### What to Upload to NotebookLM

Create a new notebook: **"Analytics Dashboard Research"**

**Upload these sources:**

1. **Internal docs:**
   - Your existing codebase README
   - Architecture diagrams (if any)
   - API documentation
   - Database schema

2. **External references:**
   - Google Analytics documentation
   - Chart.js / Recharts documentation
   - Real-time data best practices articles
   - Competitor dashboards (screenshots)

3. **Requirements:**
   - Product spec (if exists)
   - User stories
   - Wireframes / mockups

**Example sources list:**

\`\`\`
✓ README.md (your project)
✓ Prisma schema
✓ https://analytics.google.com/analytics/academy/
✓ https://recharts.org/en-US/guide
✓ https://vercel.com/blog/real-time-dashboard
✓ Mixpanel dashboard (screenshot)
✓ Product requirements doc (PDF)
\`\`\`

**Time to upload: 5 minutes**

---

## Step 2: Generate Mind Map

**In NotebookLM:**
1. Click **"Generate Mind Map"**
2. Wait 30 seconds

**NotebookLM will create:**

\`\`\`
                    Analytics Dashboard
                           |
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
    Data Layer        UI Layer          Real-Time Layer
        |                  |                  |
   ┌────┴────┐        ┌────┴────┐        ┌────┴────┐
   ▼         ▼        ▼         ▼        ▼         ▼
Database  API     Charts   Filters  WebSocket  Updates
\`\`\`

**Expanded view reveals:**

**Data Layer:**
- PostgreSQL for historical data
- Redis for real-time metrics
- Prisma ORM
- Background jobs for aggregation

**UI Layer:**
- React + TypeScript
- Recharts for visualization
- Shadcn UI components
- Responsive grid layout

**Real-Time Layer:**
- WebSocket connection
- Server-Sent Events (alternative)
- Optimistic updates
- Error recovery

**This is your architecture blueprint.** Copy it to your CLAUDE.md later.

---

## Step 3: Generate Audio Podcast

**In NotebookLM:**
1. Click **"Generate Audio Overview"**
2. Select format: **"Deep Dive"** (10-15 min podcast with 2 hosts)
3. Wait 3 minutes

**You'll get a podcast like this:**

> **Host 1:** So we're building an analytics dashboard. What's the core challenge here?
>
> **Host 2:** The main complexity is real-time data. Most dashboards show stale data refreshed every 5 minutes. But modern users expect live updates—like seeing active users RIGHT NOW.
>
> **Host 1:** Right, so we need WebSockets or Server-Sent Events. What did the Vercel article recommend?
>
> **Host 2:** They suggested SSE for one-way data flow, WebSockets for bidirectional. Since we're just pushing metrics to the client, SSE is simpler.
>
> **Host 1:** Makes sense. What about the database? The schema shows we have a \`metrics\` table with 50 million rows. How do we query that fast enough?
>
> **Host 2:** Great question. The pattern is to aggregate data in the background. Create hourly/daily rollups so queries hit summary tables, not raw event logs.
>
> **Host 1:** So instead of \`SELECT COUNT(*) FROM events WHERE...\`, we query the \`hourly_metrics\` table?
>
> **Host 2:** Exactly. Pre-compute heavy queries. The dashboard just reads the results.

**Listen to this while coding.** It's like pair programming with an AI that read all your docs.

---

## Step 4: Generate FAQ Document

**In NotebookLM:**
1. Click **"Generate Study Guide"**
2. NotebookLM creates a Q&A document

**Example output:**

\`\`\`markdown
# Analytics Dashboard FAQ

## Architecture

**Q: Should we use WebSockets or Server-Sent Events?**  
A: Server-Sent Events (SSE) are simpler for one-way data push. WebSockets add complexity for bidirectional communication we don't need. Recommendation: Start with SSE.

**Q: How do we handle 50M rows in the events table?**  
A: Don't query raw events directly. Create hourly/daily aggregation tables. Background jobs compute rollups. Dashboard queries pre-aggregated data.

**Q: What chart library should we use?**  
A: Recharts is recommended for React projects. It's declarative, responsive, and handles real-time updates well. Alternative: Chart.js if you need more control.

## Data Flow

**Q: How often should metrics update?**  
A: Real-time for critical metrics (active users, errors). Every 60 seconds for less critical (revenue, signups). Use SSE to push updates when data changes.

**Q: How do we prevent dashboard from slowing down with many widgets?**  
A: Virtualize off-screen components. Use React.memo for expensive charts. Debounce filter changes. Lazy-load charts below the fold.

## Security

**Q: Can users see other tenants' data?**  
A: NO. Filter all queries by \`tenant_id\` at the database level. Use Row-Level Security (RLS) in PostgreSQL to enforce. Never trust client-side filtering.

**Q: How do we rate-limit dashboard API requests?**  
A: Use Redis to track requests per user. Limit: 100 requests/minute per user. Return 429 status if exceeded.
\`\`\`

**Save this FAQ** in your project docs. Reference it when building.

---

## Step 5: Ask Clarifying Questions

**Use NotebookLM's chat to fill knowledge gaps:**

**You:** "What's the best way to handle timezone differences in the dashboard?"

**NotebookLM:**
> Based on the Google Analytics documentation, the best practice is to:
> 1. Store all timestamps in UTC in the database
> 2. Detect user's timezone on frontend (\`Intl.DateTimeFormat().resolvedOptions().timeZone\`)
> 3. Convert UTC to local time for display
> 4. Allow users to override timezone in settings
>
> Example libraries: \`date-fns-tz\`, \`luxon\`, or native \`Intl\` API.

**You:** "How should we structure the Prisma schema for metrics?"

**NotebookLM:**
> Based on your existing schema and the real-time dashboard article, create separate tables:
> 
> \`\`\`prisma
> model RawEvent {
>   id        String   @id
>   type      String
>   userId    String
>   timestamp DateTime
>   metadata  Json
>   tenantId  String
> }
> 
> model HourlyMetric {
>   id           String   @id
>   metricName   String
>   value        Float
>   hour         DateTime
>   tenantId     String
>   
>   @@unique([metricName, hour, tenantId])
> }
> \`\`\`
> 
> Raw events go to \`RawEvent\`. Background job aggregates into \`HourlyMetric\`. Dashboard queries \`HourlyMetric\`.

**This is research gold.** You just saved 2 hours of trial-and-error.

---

## Step 6: Export Research Artifacts

**NotebookLM lets you export to:**

1. **Google Slides** (for stakeholder presentations)
2. **Markdown** (for documentation)
3. **Audio file** (MP3 for team onboarding)

**Export everything:**
- Mind map → Save as PNG
- FAQ → Export to \`docs/analytics-faq.md\`
- Podcast → Share with team on Slack

---

## What You Just Created

In **15 minutes**, you have:
- ✅ Comprehensive architecture understanding
- ✅ Mind map of system components
- ✅ 15-minute podcast explaining design decisions
- ✅ FAQ document with answers to common questions
- ✅ Prisma schema recommendations
- ✅ Technology stack decisions (SSE, Recharts, Redis)

**Without NotebookLM:** This would take 3-4 hours of reading docs, watching tutorials, and taking notes.

**With NotebookLM:** 15 minutes of uploading → AI synthesizes everything.

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| Uploading too many sources (50+) | Limit to 10-15 most relevant docs |
| Not asking follow-up questions | Treat NotebookLM like a research assistant |
| Skipping the podcast | Listen while coding for passive learning |
| Forgetting to export | Save FAQ and mind map for team reference |

---

## Pro Tips

### Tip 1: Update NotebookLM as You Learn

When you discover something new during development:
1. Add it as a note in NotebookLM
2. Regenerate the FAQ
3. Updated FAQ becomes your living documentation

---

### Tip 2: Use Notebooks per Feature

Don't create one giant notebook. Create focused notebooks:
- "Analytics Dashboard Research"
- "Payment Integration Research"
- "Real-Time Notifications Research"

Each feature gets its own knowledge base.

---

### Tip 3: Share Podcasts with Team

**Use case:** Onboarding new developer.

Instead of 2-hour knowledge transfer call:
1. Share the 15-minute podcast
2. Share the FAQ
3. 30-minute Q&A after they listen

**Time saved:** 1.5 hours per new developer.

---

## Next Steps

You've completed the **Research Phase**. You now have:
- Architecture blueprint
- Technology decisions
- Database schema design
- FAQ for common questions

**Next:** **Planning Phase with Claude Code** — Turn research into a detailed technical specification with architecture diagrams and API contracts.`,
      },
      {
        id: '04.2',
        title: 'Planning Phase with Claude Code',
        duration: '15 min',
        tools: ['claude-code', 'cursor'],
        content: `## From Research to Plan

You have research artifacts from NotebookLM. Now we need to turn that into **executable specifications** that AI agents can build from.

**The Planning Phase generates:**
1. Architecture diagrams
2. Database schema
3. API endpoint definitions
4. Component breakdown
5. Agent task assignments

---

## Step 1: Use Claude Code in "Plan Mode"

Claude Code has a special mode for architectural planning.

**In terminal:**

\`\`\`bash
claude --mode plan --context docs/analytics-faq.md
\`\`\`

**Your prompt:**

> I need to build a real-time analytics dashboard. Based on the research in analytics-faq.md, create a detailed technical specification including:
> - System architecture
> - Database schema (Prisma format)
> - API endpoints with request/response formats
> - Frontend component tree
> - Task breakdown for multi-agent build

---

## Step 2: Claude Generates Architecture Diagram

**Claude outputs a Mermaid diagram:**

\`\`\`mermaid
graph TB
    Client[React Dashboard]
    SSE[Server-Sent Events]
    API[Express API]
    Worker[Background Worker]
    PG[(PostgreSQL)]
    Redis[(Redis Cache)]

    Client -->|HTTP| API
    Client -->|Subscribe| SSE
    API --> PG
    API --> Redis
    SSE --> Redis
    Worker -->|Aggregate| PG
    Worker -->|Publish| Redis

    subgraph Frontend
        Client
    end

    subgraph Backend
        API
        SSE
        Worker
    end

    subgraph Data
        PG
        Redis
    end
\`\`\`

**Render this in Cursor:**
1. Create \`docs/architecture.md\`
2. Paste the Mermaid code
3. Cursor preview shows visual diagram

---

## Step 3: Database Schema Definition

**Claude generates Prisma schema:**

\`\`\`prisma
// prisma/schema.prisma

model Tenant {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  
  events    RawEvent[]
  metrics   HourlyMetric[]
  users     User[]
}

model User {
  id       String   @id @default(cuid())
  email    String   @unique
  tenantId String
  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  
  events   RawEvent[]
  
  @@index([tenantId])
}

model RawEvent {
  id        String   @id @default(cuid())
  type      String   // 'pageview', 'click', 'signup', etc.
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  timestamp DateTime @default(now())
  metadata  Json
  
  @@index([type, timestamp])
  @@index([tenantId, timestamp])
}

model HourlyMetric {
  id          String   @id @default(cuid())
  metricName  String   // 'active_users', 'pageviews', 'signups'
  value       Float
  hour        DateTime
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  
  @@unique([metricName, hour, tenantId])
  @@index([tenantId, hour])
}
\`\`\`

**Save this to \`prisma/schema.prisma\`**

---

## Step 4: API Endpoint Definitions

**Claude defines all endpoints with contracts:**

\`\`\`typescript
// API Specification

// 1. Get dashboard metrics
GET /api/metrics?tenantId={id}&range={hour|day|week}

Response:
{
  "success": true,
  "data": {
    "activeUsers": 1243,
    "pageviews": 45821,
    "signups": 34,
    "revenue": 2890.50,
    "errorRate": 0.12
  },
  "timestamp": "2025-01-23T10:30:00Z"
}

// 2. Get historical data for chart
GET /api/metrics/history?metric={name}&range={range}&granularity={hour|day}

Response:
{
  "success": true,
  "data": [
    { "timestamp": "2025-01-23T09:00:00Z", "value": 1200 },
    { "timestamp": "2025-01-23T10:00:00Z", "value": 1243 }
  ]
}

// 3. Subscribe to real-time updates
GET /api/metrics/stream?tenantId={id}

SSE Stream:
event: metric_update
data: {"metric":"activeUsers","value":1244,"timestamp":"2025-01-23T10:31:00Z"}

event: metric_update
data: {"metric":"pageviews","value":45850,"timestamp":"2025-01-23T10:31:05Z"}

// 4. Create custom report
POST /api/reports

Request:
{
  "name": "Daily Signups",
  "metrics": ["signups"],
  "filters": {
    "dateRange": { "start": "2025-01-01", "end": "2025-01-31" }
  },
  "groupBy": "day"
}

Response:
{
  "success": true,
  "data": {
    "reportId": "rpt_123",
    "downloadUrl": "/api/reports/rpt_123/download"
  }
}
\`\`\`

---

## Step 5: Component Breakdown

**Claude generates React component tree:**

\`\`\`
DashboardPage
├── Header
│   ├── TenantSelector
│   └── DateRangePicker
├── MetricsGrid
│   ├── MetricCard (Active Users)
│   ├── MetricCard (Pageviews)
│   ├── MetricCard (Revenue)
│   └── MetricCard (Error Rate)
├── ChartsRow
│   ├── LineChart (Users over time)
│   ├── BarChart (Signups by source)
│   └── PieChart (Traffic sources)
├── ReportsPanel
│   ├── ReportList
│   └── CreateReportButton
└── RealtimeIndicator
\`\`\`

**With file paths:**

\`\`\`
app/dashboard/page.tsx           # Main dashboard page
components/dashboard/
  ├── Header.tsx
  ├── TenantSelector.tsx
  ├── DateRangePicker.tsx
  ├── MetricsGrid.tsx
  ├── MetricCard.tsx
  ├── ChartsRow.tsx
  ├── LineChart.tsx
  ├── BarChart.tsx
  ├── PieChart.tsx
  ├── ReportsPanel.tsx
  └── RealtimeIndicator.tsx
\`\`\`

---

## Step 6: Agent Task Assignments

**Claude creates agent breakdown:**

\`\`\`markdown
# Multi-Agent Build Plan

## @database-agent (Priority 1)
**Model:** Claude Sonnet 4.5  
**Tasks:**
- [ ] Create Prisma schema (already defined above)
- [ ] Generate migration
- [ ] Add indexes for performance
- [ ] Create seed data for testing

**Deliverables:**
- \`prisma/schema.prisma\`
- \`prisma/migrations/\`
- \`prisma/seed.ts\`

**Estimated time:** 5 minutes

---

## @backend-agent (Priority 2, depends on database-agent)
**Model:** Claude Sonnet 4.5  
**Tasks:**
- [ ] Create \`/api/metrics\` endpoint
- [ ] Create \`/api/metrics/history\` endpoint
- [ ] Create \`/api/metrics/stream\` (SSE)
- [ ] Create \`/api/reports\` endpoint
- [ ] Add authentication middleware
- [ ] Add tenant isolation middleware

**Deliverables:**
- \`app/api/metrics/route.ts\`
- \`app/api/metrics/history/route.ts\`
- \`app/api/metrics/stream/route.ts\`
- \`app/api/reports/route.ts\`
- \`middleware/auth.ts\`

**Estimated time:** 15 minutes

---

## @worker-agent (Priority 2, parallel with backend-agent)
**Model:** Gemini 3 Pro  
**Tasks:**
- [ ] Create background worker for aggregating metrics
- [ ] Schedule hourly aggregation job
- [ ] Implement metric calculation logic
- [ ] Publish updates to Redis for SSE

**Deliverables:**
- \`workers/metrics-aggregator.ts\`
- \`lib/scheduler.ts\`

**Estimated time:** 10 minutes

---

## @frontend-agent (Priority 3, depends on backend-agent)
**Model:** Gemini 3 Flash  
**Tasks:**
- [ ] Create all components from component tree
- [ ] Integrate with API endpoints
- [ ] Add real-time updates via SSE
- [ ] Implement responsive layout
- [ ] Add loading states

**Deliverables:**
- \`app/dashboard/page.tsx\`
- All components in \`components/dashboard/\`

**Estimated time:** 20 minutes

---

## @testing-agent (Priority 4, depends on all above)
**Model:** Gemini 3 Flash  
**Tasks:**
- [ ] API endpoint tests
- [ ] Component unit tests
- [ ] Integration tests for SSE
- [ ] E2E test for full dashboard flow

**Deliverables:**
- \`__tests__/api/\`
- \`__tests__/components/\`
- \`__tests__/e2e/dashboard.spec.ts\`

**Estimated time:** 15 minutes

---

## Total Estimated Time: 65 minutes
(If run sequentially. With parallel execution: ~30 minutes)
\`\`\`

---

## Step 7: Generate Implementation Checklist

**Claude creates a human-readable checklist:**

\`\`\`markdown
# Analytics Dashboard Implementation Checklist

## Database Setup
- [ ] Update \`prisma/schema.prisma\` with models
- [ ] Run \`npx prisma migrate dev --name add_analytics\`
- [ ] Run \`npx prisma generate\`
- [ ] Run \`npx prisma db seed\` for test data

## Backend API
- [ ] Install dependencies: \`npm install ioredis\`
- [ ] Create \`/api/metrics\` endpoint
- [ ] Create \`/api/metrics/history\` endpoint
- [ ] Create \`/api/metrics/stream\` (SSE)
- [ ] Create \`/api/reports\` endpoint
- [ ] Add Redis client configuration
- [ ] Add authentication middleware
- [ ] Test all endpoints with curl/Postman

## Background Worker
- [ ] Create \`workers/metrics-aggregator.ts\`
- [ ] Set up cron job (every hour)
- [ ] Test aggregation logic
- [ ] Verify Redis pub/sub works

## Frontend
- [ ] Create dashboard page
- [ ] Build all components
- [ ] Integrate API calls
- [ ] Add SSE connection
- [ ] Test real-time updates
- [ ] Verify mobile responsive

## Testing
- [ ] Write API tests
- [ ] Write component tests
- [ ] Write E2E test
- [ ] Achieve 80%+ coverage

## Deployment
- [ ] Set environment variables
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
\`\`\`

---

## Step 8: Save Everything to CLAUDE.md

**Update your \`CLAUDE.md\` with the plan:**

\`\`\`markdown
# Analytics Dashboard Feature

## Architecture
[Paste Mermaid diagram here]

## Database Schema
[Paste Prisma schema here]

## API Endpoints
[Paste API definitions here]

## Component Structure
[Paste component tree here]

## Agent Assignments
[Paste agent task breakdown here]

## Implementation Checklist
[Paste checklist here]
\`\`\`

**Now all AI agents can reference this plan.**

---

## What You Just Created

In **15 minutes with Claude Code**, you generated:
- ✅ System architecture diagram (Mermaid)
- ✅ Complete Prisma database schema
- ✅ API endpoint specifications (4 endpoints)
- ✅ Frontend component tree (11 components)
- ✅ Agent task assignments (5 agents)
- ✅ Implementation checklist (25+ tasks)

**Without AI:** This planning phase would take 2-3 hours of meetings, whiteboarding, and documentation.

**With Claude Code:** 15 minutes of prompting.

---

## Pro Tips

### Tip 1: Iterate on the Plan

If something doesn't look right, refine it:

> "Update the architecture to use WebSockets instead of SSE. Show the updated diagram."

Claude regenerates the Mermaid diagram instantly.

---

### Tip 2: Ask "Why" Questions

> "Why did you choose hourly aggregation instead of real-time aggregation?"

Claude explains the trade-offs, helping you learn.

---

### Tip 3: Generate Multiple Options

> "Show me 3 different database schema designs for this feature, with pros/cons."

Claude presents alternatives, you pick the best one.

---

## Next Steps

You've completed the **Planning Phase**. You now have:
- Complete technical specification
- Architecture diagrams
- Task breakdown for agents

**Next:** **Build Phase: Parallel Agents** — Execute the plan with 3 AI agents working simultaneously to build the entire feature in ~30 minutes.`,
      },
      {
        id: '04.3',
        title: 'Build Phase: Parallel Agents',
        duration: '30 min',
        tools: ['claude-code', 'gemini', 'gpt-5-2'],
        content: `## Execute the Plan with 5 Parallel Agents

You have the complete specification from the Planning Phase. Now we execute with **5 AI agents working simultaneously**.

**Timeline:**
- Agents 1-2 (database, worker): Start immediately (no dependencies)
- Agent 3 (backend): Starts after database completes
- Agent 4 (frontend): Starts after backend completes
- Agent 5 (testing): Starts after all others complete

**Total time: ~30 minutes** (vs. 4-6 hours manually)

---

## Agent 1: Database Schema (@database-agent)

### Launch Command

\`\`\`bash
claude --agent @database-agent --task "Implement Prisma schema from CLAUDE.md" --output database/
\`\`\`

### What It Does

**Reads from CLAUDE.md:**
- Tenant, User, RawEvent, HourlyMetric models
- Indexes for performance
- Relations between tables

**Generates:**

1. **prisma/schema.prisma** (complete schema)
2. **Migration file**

\`\`\`bash
npx prisma migrate dev --name add_analytics_tables
\`\`\`

3. **Seed file** (\`prisma/seed.ts\`)

\`\`\`typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test tenant
  const tenant = await prisma.tenant.create({
    data: {
      id: 'tenant_test',
      name: 'Test Company',
    },
  });

  // Create test users
  for (let i = 0; i < 100; i++) {
    await prisma.user.create({
      data: {
        email: \`user\${i}@test.com\`,
        tenantId: tenant.id,
      },
    });
  }

  // Create 10,000 test events
  for (let i = 0; i < 10000; i++) {
    await prisma.rawEvent.create({
      data: {
        type: ['pageview', 'click', 'signup'][Math.floor(Math.random() * 3)],
        tenantId: tenant.id,
        userId: \`user\${Math.floor(Math.random() * 100)}@test.com\`,
        metadata: {},
      },
    });
  }
}

main();
\`\`\`

**Completion time: 5 minutes**

**Output:**
\`\`\`
✓ Schema created
✓ Migration generated
✓ Seed data created (100 users, 10,000 events)
\`\`\`

---

## Agent 2: Background Worker (@worker-agent)

### Launch Command (Runs in Parallel with Agent 1)

\`\`\`bash
gemini-agent --role @worker-agent --spec CLAUDE.md --output worker/
\`\`\`

### What It Does

**Creates:**

1. **workers/metrics-aggregator.ts**

\`\`\`typescript
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

const prisma = new PrismaClient();
const redis = createClient();

async function aggregateHourlyMetrics() {
  const now = new Date();
  const hourStart = new Date(now.setMinutes(0, 0, 0));
  const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

  // Get all tenants
  const tenants = await prisma.tenant.findMany();

  for (const tenant of tenants) {
    // Aggregate metrics
    const pageviews = await prisma.rawEvent.count({
      where: {
        tenantId: tenant.id,
        type: 'pageview',
        timestamp: { gte: hourStart, lt: hourEnd },
      },
    });

    const activeUsers = await prisma.rawEvent.findMany({
      where: {
        tenantId: tenant.id,
        timestamp: { gte: hourStart, lt: hourEnd },
      },
      select: { userId: true },
      distinct: ['userId'],
    });

    const signups = await prisma.rawEvent.count({
      where: {
        tenantId: tenant.id,
        type: 'signup',
        timestamp: { gte: hourStart, lt: hourEnd },
      },
    });

    // Save to database
    await prisma.hourlyMetric.createMany({
      data: [
        {
          metricName: 'pageviews',
          value: pageviews,
          hour: hourStart,
          tenantId: tenant.id,
        },
        {
          metricName: 'activeUsers',
          value: activeUsers.length,
          hour: hourStart,
          tenantId: tenant.id,
        },
        {
          metricName: 'signups',
          value: signups,
          hour: hourStart,
          tenantId: tenant.id,
        },
      ],
    });

    // Publish to Redis for SSE
    await redis.publish('metrics_update', JSON.stringify({
      tenantId: tenant.id,
      metrics: {
        pageviews,
        activeUsers: activeUsers.length,
        signups,
      },
    }));
  }
}

// Run every hour
setInterval(aggregateHourlyMetrics, 60 * 60 * 1000);
\`\`\`

**Completion time: 10 minutes**

---

## Agent 3: Backend API (@backend-agent)

### Launch Command (Starts After Agent 1 Completes)

\`\`\`bash
claude --agent @backend-agent --depends-on database-agent --spec CLAUDE.md --output backend/
\`\`\`

### What It Does

**Creates 4 API endpoints:**

1. **app/api/metrics/route.ts** (GET current metrics)
2. **app/api/metrics/history/route.ts** (GET historical data)
3. **app/api/metrics/stream/route.ts** (SSE real-time updates)
4. **app/api/reports/route.ts** (POST create custom report)

**Example: Metrics Endpoint**

\`\`\`typescript
// app/api/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const tenantId = req.nextUrl.searchParams.get('tenantId');
  
  if (!tenantId) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_TENANT_ID' } },
      { status: 400 }
    );
  }

  const now = new Date();
  const hourStart = new Date(now.setMinutes(0, 0, 0));

  const metrics = await prisma.hourlyMetric.findMany({
    where: {
      tenantId,
      hour: hourStart,
    },
  });

  const response = {
    activeUsers: metrics.find(m => m.metricName === 'activeUsers')?.value || 0,
    pageviews: metrics.find(m => m.metricName === 'pageviews')?.value || 0,
    signups: metrics.find(m => m.metricName === 'signups')?.value || 0,
    revenue: 0, // TODO: Add revenue calculation
    errorRate: 0, // TODO: Add error rate calculation
  };

  return NextResponse.json({
    success: true,
    data: response,
    timestamp: new Date().toISOString(),
  });
}
\`\`\`

**Example: SSE Stream Endpoint**

\`\`\`typescript
// app/api/metrics/stream/route.ts
import { createClient } from 'redis';

export async function GET(req: Request) {
  const tenantId = new URL(req.url).searchParams.get('tenantId');

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const redis = createClient();
      await redis.connect();

      await redis.subscribe('metrics_update', (message) => {
        const data = JSON.parse(message);
        
        if (data.tenantId === tenantId) {
          const event = \`event: metric_update\\ndata: \${JSON.stringify(data.metrics)}\\n\\n\`;
          controller.enqueue(encoder.encode(event));
        }
      });

      // Keep alive ping every 30 seconds
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(':ping\\n\\n'));
      }, 30000);

      // Cleanup on close
      req.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        redis.disconnect();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
\`\`\`

**Completion time: 15 minutes**

**Output:**
\`\`\`
✓ Created 4 API endpoints
✓ Added authentication middleware
✓ Added tenant isolation
✓ All TypeScript types defined
\`\`\`

---

## Agent 4: Frontend UI (@frontend-agent)

### Launch Command (Starts After Agent 3 Completes)

\`\`\`bash
gemini-agent --role @frontend-agent --depends-on backend-agent --spec CLAUDE.md --output frontend/
\`\`\`

### What It Does

**Creates 11 React components:**

**Main Dashboard:**

\`\`\`typescript
// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { ChartsRow } from '@/components/dashboard/ChartsRow';
import { RealtimeIndicator } from '@/components/dashboard/RealtimeIndicator';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const tenantId = 'tenant_test';

  // Fetch initial metrics
  useEffect(() => {
    fetch(\`/api/metrics?tenantId=\${tenantId}\`)
      .then(res => res.json())
      .then(data => setMetrics(data.data));
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const eventSource = new EventSource(\`/api/metrics/stream?tenantId=\${tenantId}\`);

    eventSource.addEventListener('metric_update', (event) => {
      const newMetrics = JSON.parse(event.data);
      setMetrics(prev => ({ ...prev, ...newMetrics }));
    });

    return () => eventSource.close();
  }, []);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="p-8 space-y-8">
      <RealtimeIndicator />
      <MetricsGrid metrics={metrics} />
      <ChartsRow tenantId={tenantId} />
    </div>
  );
}
\`\`\`

**Metric Cards:**

\`\`\`typescript
// components/dashboard/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  const isPositive = (change || 0) >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {change !== undefined && (
          <div className={\`text-xs flex items-center gap-1 \${isPositive ? 'text-green-600' : 'text-red-600'}\`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
\`\`\`

**Completion time: 20 minutes**

**Output:**
\`\`\`
✓ Created 11 components
✓ Integrated with all API endpoints
✓ Real-time updates working
✓ Mobile responsive
✓ Accessibility attributes added
\`\`\`

---

## Agent 5: Testing (@testing-agent)

### Launch Command (Starts After All Others Complete)

\`\`\`bash
gemini-agent --role @testing-agent --spec CLAUDE.md --output tests/
\`\`\`

### What It Does

**Creates comprehensive test suite:**

\`\`\`typescript
// __tests__/api/metrics.test.ts
import { GET } from '@/app/api/metrics/route';

describe('/api/metrics', () => {
  it('returns current metrics for tenant', async () => {
    const req = new Request('http://localhost/api/metrics?tenantId=tenant_test');
    const response = await GET(req as any);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('activeUsers');
    expect(data.data).toHaveProperty('pageviews');
  });

  it('returns 400 if tenantId missing', async () => {
    const req = new Request('http://localhost/api/metrics');
    const response = await GET(req as any);

    expect(response.status).toBe(400);
  });
});
\`\`\`

**Completion time: 15 minutes**

**Output:**
\`\`\`
✓ 25 tests created
✓ Coverage: 87%
✓ All tests passing
\`\`\`

---

## Real-Time Progress Dashboard

While agents work, monitor in Cursor:

\`\`\`
┌──────────────────────────────────────────────────────┐
│ Multi-Agent Build: Analytics Dashboard              │
├──────────────────────────────────────────────────────┤
│                                                      │
│ @database-agent     ████████████ 100% ✓             │
│ @worker-agent       ████████████ 100% ✓             │
│ @backend-agent      ██████████░░  85%               │
│ @frontend-agent     ████░░░░░░░░  30%               │
│ @testing-agent      ░░░░░░░░░░░░   0% (waiting)     │
│                                                      │
│ Elapsed: 18m 32s                                    │
│ Estimated completion: 12m                           │
│ Cost so far: $0.42                                  │
└──────────────────────────────────────────────────────┘
\`\`\`

---

## Final Integration

**After all agents complete:**

\`\`\`bash
# Run Cursor integration
cursor --integrate database/ worker/ backend/ frontend/ tests/

✓ Merged 28 files
✓ Resolved 0 conflicts
✓ Updated imports
✓ Applied migrations
✓ Tests: 25/25 passing
✓ Build: SUCCESS

Feature complete in 31 minutes!
Total cost: $0.58
\`\`\`

---

## What You Just Built

In **30 minutes** with 5 parallel agents:
- ✅ Database schema (4 tables, indexes, seed data)
- ✅ 4 API endpoints (metrics, history, stream, reports)
- ✅ Background worker (hourly aggregation)
- ✅ 11 React components (dashboard, cards, charts)
- ✅ Real-time updates via SSE
- ✅ 25 tests (87% coverage)

**Manual coding time:** 12-16 hours  
**With AI:** 30 minutes  
**Speed improvement: 24-32x faster**

---

## Next Steps

Feature is built but needs polish. **Next:** **Asset Generation** with Imagen, Veo, and Google Stitch for marketing materials and UI refinements.`,
      },
      {
        id: '04.4',
        title: 'Asset Generation',
        duration: '15 min',
        tools: ['imagen-3', 'veo-3-1', 'google-stitch'],
        content: `## Why Assets Matter

You've built the feature, but you need **marketing materials** to launch it:
- Landing page hero image
- Demo video for social media
- Screenshots for documentation
- Email announcement graphics

**Traditional approach:** Hire designer ($500-1000, 1-2 weeks)  
**AI approach:** Generate everything in 15 minutes for ~$2

---

## Asset 1: Hero Image (Imagen 3)

### Task: Landing Page Hero

**Go to:** [labs.google/imagen](https://labs.google/imagen)

**Prompt:**

> Professional dashboard analytics interface displayed on a modern laptop screen. Dark theme with cyan and violet accent colors. Real-time charts showing metrics, bar graphs, and pie charts. Floating UI elements with subtle shadows. Clean workspace with coffee mug and notepad. Studio lighting, 16:9 aspect ratio, high quality, photorealistic.

**Click "Generate" → Wait 30 seconds**

**Result:** 4 variations to choose from

**Pick the best one**, download as PNG (1920x1080).

**Use for:**
- Landing page hero section
- Blog post header
- Social media announcement

**Cost:** $0.02

---

## Asset 2: Feature Mockup (Google Stitch)

### Task: Refined Dashboard UI

**Go to:** [labs.google/stitch](https://labs.google/stitch)

**Prompt:**

> Analytics dashboard with these exact components:
> - Top header: "Analytics Dashboard" title, date range picker, tenant selector
> - Metrics row: 4 metric cards showing Active Users, Pageviews, Revenue, Error Rate
> - Charts row: Line chart (users over time), Bar chart (signups by source), Pie chart (traffic sources)
> - Bottom section: Reports panel with "Create Report" button
> - Real-time indicator (green dot + "Live")
> - Dark theme, cyan/violet accent colors, Shadcn UI style

**Click "Generate" → Wait 60 seconds**

**Result:** Pixel-perfect mockup with responsive breakpoints

**Export options:**
1. **Figma** (for iteration)
2. **PNG** (for documentation)
3. **React + Tailwind code** (to compare with your build)

**Download PNG** for documentation.

**Compare generated code** with your actual implementation—you'll see they're 90% similar!

**Cost:** $0.05

---

## Asset 3: Demo Video (Veo 3.1)

### Task: 15-Second Product Demo

**Go to:** [labs.google/veo](https://labs.google/veo)

**Prompt:**

> Screen recording of analytics dashboard in use. Mouse cursor clicks through the interface: selecting date range, hovering over metric cards to show tooltips, scrolling down to view charts, clicking "Create Report" button. Dashboard shows real-time updates with numbers changing. Smooth camera pan across the screen. Professional UI with dark theme and cyan/violet accents. 15 seconds, 1080p.

**Click "Generate" → Wait 3 minutes**

**Result:** 15-second MP4 video

**Use for:**
- Twitter/X announcement
- LinkedIn post
- Product Hunt launch
- Website demo section

**Cost:** $0.10

---

## Asset 4: Email Announcement Graphic (Imagen 3)

### Task: Email Header

**Prompt:**

> Email header graphic for "New Feature: Real-Time Analytics Dashboard". Split design: left side shows abstract data visualization (network of connected nodes, cyan and violet glowing lines), right side shows text "Real-Time Analytics" in modern sans-serif font. Dark background with gradient. 1200x400px, web-optimized.

**Result:** Email-ready graphic

**Export:** PNG, optimize for web

**Use in:** Email announcement to users

**Cost:** $0.02

---

## Asset 5: Social Media Carousel (Imagen 3)

### Task: 4-Slide Instagram/LinkedIn Carousel

**Generate 4 images:**

**Slide 1: Announcement**

> Modern tech announcement card: "Introducing Real-Time Analytics" in large bold text. Gradient background (dark purple to dark blue). Subtle dashboard UI elements in background. Instagram post format, 1080x1080px.

**Slide 2: Feature Highlight**

> Dashboard screenshot showing metric cards with numbers: Active Users: 1,243, Pageviews: 45,821, Revenue: $2,890. Real-time indicator glowing green. Dark theme. Clean design. 1080x1080px.

**Slide 3: Benefit**

> Infographic style: Icon of lightning bolt, text "Get insights in real-time, not hours later". Minimal design, cyan accent color on dark background. 1080x1080px.

**Slide 4: Call to Action**

> CTA card: "Try it now" button, URL at bottom. Clean modern design. 1080x1080px.

**Result:** 4-image carousel ready for social media

**Cost:** $0.08 (4 images × $0.02)

---

## Asset 6: Documentation Screenshots (Manual + Cursor)

### Task: Annotated Screenshots

Since you have the working dashboard, take real screenshots:

1. **Full dashboard view**
2. **Metric cards close-up**
3. **Charts section**
4. **Create report modal**

**Use Cursor to add annotations:**

\`\`\`bash
cursor --annotate screenshot.png --add-arrows --add-labels
\`\`\`

**Cursor AI:**
- Detects UI elements
- Adds helpful arrows
- Labels key features
- Generates annotated version

**Export:** PNG for docs

**Cost:** Free (uses Cursor's included credits)

---

## Asset 7: Feature Comparison Table (Imagen 3)

### Task: Before/After Graphic

**Prompt:**

> Side-by-side comparison graphic: "Before" (left) shows static dashboard with old data timestamp "Updated 2 hours ago", "After" (right) shows real-time dashboard with green "Live" indicator. Checkmarks on "After" side highlighting: Real-time updates, SSE connection, Instant metrics. Professional infographic style. 1600x900px.

**Result:** Comparison graphic

**Use for:** Blog post explaining the upgrade

**Cost:** $0.02

---

## Total Assets Generated

In **15 minutes**, you created:
- ✅ Hero image (landing page)
- ✅ Feature mockup (Stitch refinement)
- ✅ 15-second demo video
- ✅ Email header graphic
- ✅ 4-slide social media carousel
- ✅ Annotated screenshots (4)
- ✅ Before/after comparison

**Total cost:** $0.29

**Designer cost for same assets:** $800-1200  
**Savings: $800-1200 (99.9% cost reduction)**

---

## Organizing Your Assets

Create an assets folder:

\`\`\`
public/assets/analytics-dashboard/
├── hero-image.png              # Landing page
├── feature-mockup.png          # Stitch output
├── demo-video.mp4              # 15-second demo
├── email-header.png            # Email campaign
├── social-carousel/
│   ├── slide-1-announcement.png
│   ├── slide-2-features.png
│   ├── slide-3-benefit.png
│   └── slide-4-cta.png
├── docs-screenshots/
│   ├── full-dashboard.png
│   ├── metric-cards.png
│   ├── charts-section.png
│   └── create-report.png
└── comparison-graphic.png      # Before/after
\`\`\`

---

## Launch Checklist with Assets

### Landing Page
- [ ] Add hero image to \`/features/analytics\` page
- [ ] Embed demo video below hero
- [ ] Add annotated screenshots to features section

### Email Campaign
- [ ] Use email header graphic
- [ ] Include comparison graphic
- [ ] Link to demo video

### Social Media
- [ ] Post carousel to LinkedIn
- [ ] Share demo video on Twitter/X
- [ ] Add comparison graphic to blog post

### Documentation
- [ ] Add screenshots to docs
- [ ] Embed demo video in "Getting Started"
- [ ] Update README with feature mockup

---

## Pro Tips

### Tip 1: Generate Multiple Variations

For important assets (hero image), generate 10-20 variations:

> Same prompt, click "Generate" 5 times → 20 variations total

Pick the absolute best one. **Still cheaper than hiring a designer.**

---

### Tip 2: Iterate on Prompts

If first result isn't perfect:

**Bad result:** Dashboard looks cluttered

**Updated prompt:** "...with minimal, clean design, plenty of white space, Apple-style aesthetics"

Refine until perfect.

---

### Tip 3: Use Stitch for A/B Testing

Generate 3 different dashboard layouts with Stitch, show to users, pick the winner.

**Cost:** $0.15 (3 layouts)  
**Value:** Know which design converts best before building

---

## Asset Quality Checklist

Before publishing, verify:

| Asset Type | Quality Check |
|-----------|---------------|
| **Images** | High resolution (1920px+ width) |
| **Images** | Optimized for web (< 500KB) |
| **Videos** | 1080p minimum |
| **Videos** | Subtitles added for accessibility |
| **All** | Brand colors consistent (cyan/violet) |
| **All** | Mobile-friendly formats |

---

## What You Just Learned

Asset generation with AI enables:
- ✅ Professional graphics in minutes
- ✅ 99.9% cost savings vs. hiring
- ✅ Unlimited iterations
- ✅ Consistent brand aesthetic

**Mental model shift:** Stop waiting for designers. Generate assets on-demand, iterate instantly, and launch faster.

---

## Next Steps

Feature is built, assets are ready. **Final step:** **Debug & Deploy** with Cursor Debug Mode and automated deployment.`,
      },
      {
        id: '04.5',
        title: 'Debug & Deploy',
        duration: '15 min',
        tools: ['cursor', 'gpt-5-2'],
        content: `## Pre-Deployment Testing

Before deploying, we need to **catch bugs with AI** instead of users finding them in production.

---

## Step 1: Enable Cursor Debug Mode

**In Cursor:**
1. Open Settings (\`Cmd+,\`)
2. Search "Debug Mode"
3. Toggle ON
4. Set model to **GPT-5.2** (best for debugging)

---

## Step 2: Run the Application Locally

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## Step 3: Manual Testing with AI Monitoring

**Cursor auto-instruments your code** while you test.

### Test Scenario 1: Load Dashboard

**Action:** Refresh the page

**Cursor monitors:**
- API response times
- Component render times
- Memory usage
- Network requests

**Cursor output:**

\`\`\`
[CURSOR DEBUG] Dashboard loaded
[CURSOR DEBUG] /api/metrics responded in 245ms
[CURSOR DEBUG] SSE connection established
[CURSOR DEBUG] 4 metric cards rendered
[CURSOR DEBUG] Memory: 45MB
✓ No issues detected
\`\`\`

---

### Test Scenario 2: Real-Time Updates

**Action:** Wait for metric updates (should happen every 60 seconds)

**Cursor detects potential issue:**

\`\`\`
[CURSOR DEBUG] SSE message received
[CURSOR DEBUG] State update triggered
[CURSOR DEBUG] Re-render: MetricsGrid
⚠️ WARNING: Unnecessary re-render detected
   Component: ChartsRow
   Reason: Parent state changed but component props unchanged
   Recommendation: Wrap ChartsRow in React.memo()
\`\`\`

**Cursor automatically suggests fix:**

> I noticed ChartsRow re-renders unnecessarily. Apply React.memo?

**Click "Yes"**

**Cursor updates the code:**

\`\`\`typescript
export const ChartsRow = React.memo(function ChartsRow({ tenantId }: ChartsRowProps) {
  // ... existing code
});
\`\`\`

**Immediate performance improvement!**

---

### Test Scenario 3: Edge Case (No Data)

**Action:** Switch to a tenant with no events

**Cursor catches error:**

\`\`\`
[CURSOR DEBUG] ERROR: Cannot read property 'value' of undefined
   File: components/dashboard/MetricCard.tsx:12
   Cause: metrics array is empty
   Stack trace: [...]

🤖 GPT-5.2 Analysis:
   Root cause: Metrics API returns empty array for new tenants.
   MetricCard assumes metrics always exist.
   
   Fix: Add null checks and fallback UI.
\`\`\`

**GPT-5.2 generates fix:**

\`\`\`typescript
export function MetricCard({ title, metricName, metrics }: MetricCardProps) {
  const metric = metrics?.find(m => m.metricName === metricName);
  const value = metric?.value ?? 0;  // Fallback to 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {metrics?.length === 0 ? (
          <p className="text-sm text-gray-500">No data yet</p>
        ) : (
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}
\`\`\`

**Apply fix → Test again → Works perfectly!**

---

### Test Scenario 4: Slow Network

**Action:** Throttle network to "Slow 3G" in Chrome DevTools

**Cursor detects issue:**

\`\`\`
[CURSOR DEBUG] /api/metrics took 4,200ms (expected < 500ms)
⚠️ PERFORMANCE: API response is slow on 3G

🤖 GPT-5.2 Analysis:
   Recommendation: Add loading skeleton while fetching.
   Current UX: Blank screen for 4 seconds (bad UX).
\`\`\`

**GPT-5.2 generates skeleton:**

\`\`\`typescript
function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(\`/api/metrics?tenantId=\${tenantId}\`)
      .then(res => res.json())
      .then(data => {
        setMetrics(data.data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;  // New component
  }

  // ... rest of code
}
\`\`\`

**Cursor also generates the skeleton component automatically.**

---

## Step 4: Automated Integration Tests

**Run Cursor's AI-generated test suite:**

\`\`\`bash
npm test
\`\`\`

**Results:**

\`\`\`
 PASS  __tests__/api/metrics.test.ts
 PASS  __tests__/components/MetricCard.test.tsx
 PASS  __tests__/components/Dashboard.test.tsx
 FAIL  __tests__/e2e/dashboard.spec.ts

● Dashboard E2E › should load metrics

  Timeout waiting for SSE connection

  at waitForSSE (__tests__/e2e/dashboard.spec.ts:34)
\`\`\`

**Cursor analyzes the failure:**

> E2E test failed because SSE connection requires authentication in test environment. I'll update the test to mock the auth.

**Cursor fixes the test automatically.**

**Re-run:**

\`\`\`bash
npm test

✓ All 25 tests passing
✓ Coverage: 87%
\`\`\`

---

## Step 5: Production Readiness Checklist

**Cursor generates a deployment checklist:**

\`\`\`markdown
# Pre-Deployment Checklist

## Code Quality
- [✓] TypeScript compiles with no errors
- [✓] ESLint passes with 0 warnings
- [✓] All tests pass (25/25)
- [✓] Code coverage > 80% (87%)

## Performance
- [✓] API responses < 500ms (p95: 245ms)
- [✓] Bundle size < 500KB (current: 342KB)
- [✓] Lighthouse score > 90 (current: 94)
- [✓] No memory leaks detected

## Security
- [✓] Environment variables not committed
- [✓] API endpoints require authentication
- [✓] Tenant isolation enforced
- [✓] Input validation with Zod
- [✓] SQL injection prevention (Prisma)

## User Experience
- [✓] Loading states for all async actions
- [✓] Error states with user-friendly messages
- [✓] Mobile responsive (tested on 3 screen sizes)
- [✓] Accessibility: keyboard nav works
- [✓] Real-time updates functional

## Database
- [✓] Migrations applied successfully
- [✓] Indexes created for performance
- [✓] Seed data works
- [✓] Backup strategy documented

## Monitoring
- [ ] Error logging configured (Sentry)
- [ ] Analytics tracking added
- [ ] Performance monitoring setup
- [ ] Uptime alerts configured

## Documentation
- [✓] README updated
- [✓] API docs generated
- [✓] Component docs written
- [ ] Video tutorial created (optional)

**Status: 22/26 items complete (85%)**
**Recommendation: Complete monitoring setup before deploying to production**
\`\`\`

---

## Step 6: Set Up Monitoring (Quick)

**Add Sentry for error tracking:**

\`\`\`bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
\`\`\`

**Cursor auto-configures Sentry** with your DSN.

**Add to \`app/layout.tsx\`:**

\`\`\`typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
\`\`\`

**Now all errors auto-report to Sentry.**

---

## Step 7: Deploy to Vercel

### Connect Repository

\`\`\`bash
git add .
git commit -m "feat: add real-time analytics dashboard"
git push origin main
\`\`\`

**Go to Vercel:**
1. Click "New Project"
2. Import your GitHub repo
3. Vercel auto-detects Next.js
4. Click "Deploy"

**Wait 2 minutes...**

\`\`\`
✓ Build completed
✓ Deployed to https://your-app.vercel.app
✓ SSL certificate issued
✓ CDN configured
\`\`\`

---

## Step 8: Post-Deployment Verification

**Cursor can test your production deployment:**

\`\`\`bash
cursor --test-production https://your-app.vercel.app
\`\`\`

**Cursor runs automated checks:**

\`\`\`
✓ Homepage loads (200 status)
✓ /dashboard loads (200 status)
✓ /api/metrics responds (authenticated)
✓ SSE connection works
✓ Real-time updates functional
✓ Mobile responsive
✓ Lighthouse score: 92 (PASS)

All checks passed ✓
\`\`\`

---

## Step 9: Monitor in Real-Time

**After deployment, watch Sentry for errors:**

**Sentry Dashboard:**

\`\`\`
Last 24 hours:
  Errors: 0
  Users affected: 0
  Uptime: 100%

Performance:
  p50 response time: 180ms
  p95 response time: 420ms
  Apdex score: 0.98 (excellent)
\`\`\`

**If errors appear, Cursor can debug remotely:**

\`\`\`bash
cursor --debug-sentry <error-id>
\`\`\`

Cursor fetches the error, analyzes it with GPT-5.2, and suggests a fix.

---

## Complete Workflow Timeline

| Phase | Time | Cumulative |
|-------|------|-----------|
| Research (NotebookLM) | 15 min | 15 min |
| Planning (Claude Code) | 15 min | 30 min |
| Build (5 parallel agents) | 30 min | 60 min |
| Assets (Imagen, Veo, Stitch) | 15 min | 75 min |
| Debug & Deploy | 15 min | **90 min** |

**Total: 1.5 hours from idea to production**

**Manual development time:** 40-60 hours  
**Speed improvement: 27-40x faster**

---

## What You Just Accomplished

You shipped a **production-ready feature** including:
- ✅ Research & planning
- ✅ Database design
- ✅ 4 API endpoints
- ✅ 11 React components
- ✅ Real-time updates (SSE)
- ✅ 25 automated tests
- ✅ Marketing assets
- ✅ Deployed to production
- ✅ Monitoring configured

**All in 90 minutes.**

**This is the power of AI-orchestrated development.**

---

## Key Learnings

### What Worked Well
- Multi-agent parallelization (saved ~50% time)
- Cursor Debug Mode (caught 4 bugs pre-deployment)
- NotebookLM research (avoided 2 hours of reading docs)
- Asset generation (saved $800+ on design)

### What to Improve
- More specific agent briefs (reduce iterations)
- Earlier performance testing
- Automated security scanning

### Cost Breakdown
- AI API calls: $0.87
- Asset generation: $0.29
- Vercel hosting: $0 (free tier)
- **Total: $1.16**

Compare to:
- Hiring developer: $2,000-4,000
- Hiring designer: $800-1,200
- **Total traditional: $2,800-5,200**

**Savings: 99.96%**

---

## Next Steps

**Module 04 complete!** You've mastered the full workflow.

**Final module:** **Module 05: Practicum** — Build your own feature solo, get certified, and join the Vibe Coder community.`,
      },
    ],
    keyTakeaways: [
      'You\'ve built a real feature end-to-end',
      'You used every tool in the stack',
      'You understand the full workflow',
      'You saved 70% time vs manual coding',
      'You have a repeatable process',
    ],
  },
  
  {
    id: 'module-05',
    number: '05',
    title: 'Practicum',
    subtitle: 'Solo Build: Ship Your First Feature',
    duration: 'Self-paced (2-4 weeks)',
    objective: 'You pick a feature. You build it using full orchestration. Submit for mentor feedback and earn certification.',
    icon: 'Award',
    sections: [
      {
        id: '05.1',
        title: 'Project Selection & Setup',
        duration: 'Week 1',
        tools: ['notebooklm', 'claude-code'],
        content: `## The Practicum Challenge

You've learned the tools. You've seen the workflows. Now **build something real**.

**Goal:** Ship a production-ready feature using AI orchestration in 2-3 weeks.

**Why this matters:** This proves you can apply everything independently. Your submission becomes your portfolio piece.

---

## Project Selection Criteria

Pick a project that:
- ✅ Solves a real problem (not a tutorial)
- ✅ Requires 3+ AI tools from the stack
- ✅ Has clear success metrics
- ✅ Can ship in 2-3 weeks
- ✅ You're excited to build

**Complexity sweet spot:** Medium complexity (not too simple, not too ambitious)

---

## Three Project Paths

### Path 1: Extend an Existing Product

**Best for:** Founders with active projects

**Examples:**
- Add AI chat support to your SaaS
- Build analytics dashboard for your app
- Create API documentation generator
- Add payment retry logic with notifications
- Build user onboarding flow

**Pros:** Real users, immediate feedback, solves actual need  
**Cons:** Must integrate with existing codebase

---

### Path 2: Build a Micro-SaaS

**Best for:** Solo builders wanting a new product

**Examples:**
- Invoice generator for freelancers
- Screenshot-to-code converter
- Meeting notes summarizer
- Social media scheduler
- Personal CRM for networkers

**Pros:** Green field project, full control  
**Cons:** No users yet, need to market

---

### Path 3: Internal Tool / Automation

**Best for:** People solving workflow problems

**Examples:**
- Code review bot for your team
- Automated standup report generator
- Customer support ticket triage system
- Sales lead enrichment pipeline
- Content repurposing tool

**Pros:** Immediate ROI for your team  
**Cons:** Harder to showcase publicly

---

## Project Idea Generator

**Not sure what to build? Answer these:**

1. **What repetitive task do you hate doing?**
   - Example: "I manually export data from 5 tools every Monday"
   - Project idea: Multi-source data aggregator

2. **What do you wish existed but doesn't?**
   - Example: "I wish I could turn Figma designs into working code"
   - Project idea: Design-to-code converter

3. **What are you currently paying for that you could build?**
   - Example: "$50/month for email marketing, but I only use 10% of features"
   - Project idea: Simple email sender for founders

4. **What do others ask you to help with repeatedly?**
   - Example: "Friends always ask me to review their contracts"
   - Project idea: Contract analyzer with AI suggestions

---

## Scope Definition Template

Once you have an idea, define scope clearly:

\`\`\`markdown
# Project: [Name]

## Problem Statement
[Who has this problem? How bad is it? What are they doing now?]

## Solution
[1-2 sentences describing what you'll build]

## Core Features (MVP)
- [ ] Feature 1: [Must have]
- [ ] Feature 2: [Must have]
- [ ] Feature 3: [Must have]
- [ ] Feature 4: [Nice to have - cut if needed]

## Success Metrics
- Technical: [e.g., "Deploys successfully, 80%+ test coverage"]
- User: [e.g., "3 friends use it and give feedback"]
- Personal: [e.g., "Saves me 2 hours per week"]

## Tech Stack
- Frontend: [Next.js / React / etc.]
- Backend: [Node.js / Python / etc.]
- Database: [PostgreSQL / MongoDB / etc.]
- AI Tools: [Claude Code, Gemini, etc.]

## Timeline
- Week 1: Research & setup
- Week 2: Build core features
- Week 3: Polish & deploy

## Constraints
- Budget: $[amount] for AI API calls
- Time: [X] hours per week available
- Blockers: [Any known dependencies]
\`\`\`

---

## Example Project Scope: "LinkHub"

\`\`\`markdown
# Project: LinkHub

## Problem Statement
Founders share links constantly (articles, tools, resources) across Slack, Twitter, email. They're impossible to organize or find later. Current solutions (Notion, bookmarks) are too manual.

## Solution
A link-saving app that auto-categorizes with AI, generates summaries, and sends weekly digests of saved links you haven't read yet.

## Core Features (MVP)
- [x] Browser extension to save links
- [x] AI auto-categorization (using GPT-5.2)
- [x] Full-text search
- [ ] Weekly email digest
- [ ] Share collections publicly

## Success Metrics
- Technical: Deploys to production, 85%+ test coverage
- User: I use it daily for 2 weeks, save 50+ links
- Personal: Find old links 3x faster than before

## Tech Stack
- Frontend: Next.js 14 (App Router)
- Backend: Next.js API routes
- Database: PostgreSQL (Prisma)
- Auth: NextAuth.js
- AI Tools: GPT-5.2 (categorization), NotebookLM (research)

## Timeline
- Week 1: Setup, browser extension scaffold
- Week 2: AI categorization, search
- Week 3: Email digest, polish, deploy

## Constraints
- Budget: $10 for AI API calls
- Time: 10 hours/week
- Blockers: Need to learn Chrome extension APIs
\`\`\`

---

## Setup Phase (Week 1)

### Day 1-2: Research with NotebookLM

**Create notebook:** "LinkHub Research"

**Upload sources:**
- Chrome Extension documentation
- NextAuth.js guide
- GPT-5.2 API docs
- Competitor products (Raindrop.io, Pocket)

**Generate:**
- Mind map of architecture
- Podcast explaining design decisions
- FAQ for common questions

**Output:** You understand the domain deeply.

---

### Day 3: Create Configuration Files

**1. CLAUDE.md**

Define project context, tech stack, architecture patterns.

**2. .cursorrules**

Code style, component patterns, testing standards.

**3. AGENTS.md**

Define specialist agents:
- @extension-agent (Chrome extension)
- @backend-agent (API endpoints)
- @ai-agent (GPT-5.2 integration)
- @testing-agent (test coverage)

**4. package.json**

Install dependencies, define scripts.

---

### Day 4-5: Scaffold Project

**Use Claude Code to generate:**

\`\`\`bash
claude --mode plan --project-name linkhub --stack nextjs-postgres-prisma
\`\`\`

**Claude generates:**
- Folder structure
- Database schema
- API route stubs
- Component templates
- Test setup

**Commit to Git:**

\`\`\`bash
git init
git add .
git commit -m "chore: initial project scaffold"
\`\`\`

---

### Day 6-7: Get Feedback

**Share your scope document:**
- Post in Vibe Coder community Slack
- Ask for feedback on scope
- Get mentor approval (optional but recommended)

**Common feedback:**
> "Your MVP has 8 features. Cut it to 3-4 core features for week 1."

**Revise scope based on feedback.**

---

## Week 1 Deliverables Checklist

By end of Week 1, you should have:

- [ ] Project idea selected and validated
- [ ] Scope document written (problem, solution, features, metrics)
- [ ] NotebookLM research complete (mind map, podcast, FAQ)
- [ ] CLAUDE.md created
- [ ] .cursorrules created
- [ ] AGENTS.md created
- [ ] Project scaffolded with Claude Code
- [ ] Git repository initialized
- [ ] Feedback received from community
- [ ] Ready to start building

---

## Red Flags to Avoid

| Warning Sign | Fix |
|-------------|-----|
| "I'll build 20 features" | Cut to 3-4 core features |
| "No idea how to start" | Use Claude Code to scaffold |
| "I don't know the tech yet" | NotebookLM research first |
| "Scope keeps growing" | Lock scope, write it down |
| "I'm blocked on X" | Ask community for help |

---

## Success Stories from Past Cohorts

**Example 1: "QuickInvoice"**  
Founder built invoice generator in 2 weeks. Now has 50 paying customers at $10/month.

**Example 2: "CodeReview Bot"**  
Developer automated PR reviews for their team. Saved 5 hours/week.

**Example 3: "MeetingNotes AI"**  
Product manager built meeting summarizer. Shared on Twitter, went viral, got acquired 6 months later.

**Your project can be next.**

---

## Community Support

**Join the Vibe Coder Slack:**
- \`#practicum\` channel for project help
- \`#feedback\` for scope reviews
- \`#wins\` to share progress

**Office hours:** Tuesdays & Thursdays, 2pm PT (optional)

---

## Next Steps

Once Week 1 is complete, move to **Module 05.2: Build & Iterate** where you'll execute the plan with parallel agents and ship the feature.`,
      },
      {
        id: '05.2',
        title: 'Build & Iterate',
        duration: 'Week 2-3',
        tools: ['claude-code', 'cursor', 'gemini', 'gpt-5-2'],
        content: `## Week 2: Core Build

You have your project scoped and configured. Now **execute the build** using multi-agent orchestration.

---

## Day 1-2: Architecture & Planning

### Use Claude Code Plan Mode

\`\`\`bash
claude --mode plan --context CLAUDE.md
\`\`\`

**Your prompt:**

> Based on the project scope in CLAUDE.md, create a detailed technical specification including:
> - System architecture (Mermaid diagram)
> - Database schema (Prisma format)
> - API endpoint definitions
> - Component breakdown
> - Agent task assignments

**Claude generates everything from Module 04.2.**

**Save outputs to:**
- \`docs/architecture.md\` (Mermaid diagrams)
- \`prisma/schema.prisma\` (database)
- \`docs/api-spec.md\` (endpoints)
- \`docs/agent-tasks.md\` (task breakdown)

**Review with community** (optional): Post diagrams in Slack #feedback channel.

---

## Day 3-7: Parallel Agent Build

### Execute Multi-Agent Workflow

Following the pattern from Module 04.3, launch agents in parallel:

**Terminal 1: Database Agent**
\`\`\`bash
claude --agent @database-agent --spec docs/agent-tasks.md
\`\`\`

**Terminal 2: Backend Agent** (depends on database)
\`\`\`bash
claude --agent @backend-agent --depends-on database-agent --spec docs/agent-tasks.md
\`\`\`

**Terminal 3: Frontend Agent** (parallel with backend)
\`\`\`bash
gemini-agent --role @frontend-agent --spec docs/agent-tasks.md
\`\`\`

**Terminal 4: Testing Agent** (runs last)
\`\`\`bash
gemini-agent --role @testing-agent --spec docs/agent-tasks.md
\`\`\`

### Monitor Progress

\`\`\`bash
cursor --multi-agent-dashboard
\`\`\`

Watch agents work in real-time. Total build time: **~2-4 hours** depending on complexity.

---

## Daily Stand-Up Template

**Track progress each day:**

\`\`\`markdown
# Day [X] Progress

## What I Accomplished
- [List completed tasks]

## What Blocked Me
- [Any issues encountered]

## AI Usage
- Claude: [X] requests, $[Y] cost
- Gemini: [X] requests, $[Y] cost
- GPT-5.2: [X] requests, $[Y] cost

## Tomorrow's Plan
- [Top 3 priorities]
\`\`\`

**Post in Slack #practicum** to keep yourself accountable.

---

## Day 8-10: Debugging & Refinement

### Enable Cursor Debug Mode

Test your feature manually while Cursor monitors:

**Common bugs it catches:**
- Null pointer exceptions
- Missing error handling
- Performance issues (N+1 queries, slow renders)
- Memory leaks
- Accessibility issues

**Let Cursor fix 80% automatically.** You review the other 20%.

---

### Integration Testing

\`\`\`bash
npm test
\`\`\`

**If tests fail:**
1. Read the error message
2. Cursor analyzes with GPT-5.2
3. Cursor suggests fix
4. Apply → Retest

**Target:** 80%+ test coverage before moving forward.

---

## Week 3: Polish & Ship

### Day 11-12: Asset Generation

Following Module 04.4, create marketing assets:

**Imagen 3:**
- Hero image for landing page
- Feature mockups (3-4 variations)
- Social media graphics

**Veo 3.1:**
- 30-second demo video
- Feature walkthrough

**Google Stitch:**
- Refined UI mockups
- Export to Figma for iteration

**Time:** 2-3 hours  
**Cost:** ~$1-2

---

### Day 13-14: User Testing

**Get 3 people to test your feature:**

1. **Share the deployed link**
2. **Give them a task:** "Try to [core use case]"
3. **Watch them (screen share or in-person)**
4. **Note where they get confused**

**Don't explain anything!** Just observe.

**After testing:**
- Identify top 3 pain points
- Use Cursor to fix them
- Retest with 1-2 more people

---

### Day 15: Final Polish

**Pre-launch checklist:**

#### Performance
- [ ] Lighthouse score > 90
- [ ] Bundle size < 500KB
- [ ] API responses < 500ms (p95)

#### User Experience
- [ ] Loading states for all async actions
- [ ] Error messages are helpful (not "Error 500")
- [ ] Mobile responsive (test on 3 screen sizes)
- [ ] Keyboard navigation works
- [ ] Dark mode (if applicable)

#### Documentation
- [ ] README with setup instructions
- [ ] API documentation (if applicable)
- [ ] Screenshot walkthrough
- [ ] Demo video embedded

#### Deployment
- [ ] Environment variables configured
- [ ] Error monitoring (Sentry)
- [ ] Analytics tracking
- [ ] SSL certificate
- [ ] Custom domain (optional)

---

## Day 16-17: Launch

### Soft Launch (to friends/community)

**Share in these places:**
1. Vibe Coder Slack #wins channel
2. Your Twitter/X feed
3. Relevant Discord/Slack communities
4. Product Hunt (optional)

**Ask for feedback:**
> "I just shipped [feature]. Would love your feedback: [link]"

**Iterate based on feedback** for 24-48 hours.

---

## Documentation Requirements

Throughout Weeks 2-3, document:

### 1. Architecture Decisions (docs/adr/)

**Format:**

\`\`\`markdown
# ADR 001: Use Server-Sent Events for Real-Time Updates

## Status
Accepted

## Context
Need real-time updates for dashboard. Options: WebSockets, SSE, polling.

## Decision
Use Server-Sent Events (SSE).

## Consequences
- Simpler than WebSockets (one-way communication)
- Better browser support than WebSockets
- Can't do bidirectional (but we don't need it)

## Alternatives Considered
- WebSockets: Too complex for our use case
- Polling: Too slow, wastes resources
\`\`\`

**Create 1 ADR per major decision.**

---

### 2. Agent Usage Log (logs/ai-usage.csv)

**Track every AI request:**

\`\`\`csv
Date,Agent,Model,Task,TokensIn,TokensOut,Cost
2025-01-20,@backend-agent,claude-sonnet,Create API endpoints,5200,8900,$0.042
2025-01-20,@frontend-agent,gemini-flash,Build components,3100,6200,$0.001
2025-01-21,@debug-agent,gpt-5.2,Fix memory leak,2400,1800,$0.108
\`\`\`

**Why?** You'll need this for your submission to show cost efficiency.

---

### 3. Iteration Notes (logs/iterations.md)

**Document what changed and why:**

\`\`\`markdown
# Iteration Log

## Iteration 1 (Day 8)
**What:** Initial build complete
**Issues:** Dashboard load time was 4 seconds
**Fix:** Added caching with Redis, load time now 400ms
**Agent used:** Claude Code (optimization suggestions)

## Iteration 2 (Day 12)
**What:** User testing feedback
**Issues:** Users confused by "Create Report" button (didn't know what it does)
**Fix:** Changed to "Export Data as PDF" with icon
**Agent used:** Gemini (icon suggestions)

## Iteration 3 (Day 15)
**What:** Performance audit
**Issues:** Bundle size 820KB (too large)
**Fix:** Code splitting, lazy loading charts. New size: 340KB
**Agent used:** Cursor (automatic bundle analysis)
\`\`\`

---

## Cost Tracking

**Budget:** $10-20 for entire project

**Typical breakdown:**
- Research (NotebookLM): Free
- Planning (Claude): $1-2
- Build (Claude + Gemini): $3-5
- Debugging (GPT-5.2): $2-4
- Assets (Imagen, Veo): $1-2
- **Total:** $7-15

**If you go over budget:**
- Use Gemini Flash instead of Claude for simple tasks
- Reduce iterations (be more specific in prompts)
- Skip asset generation (use Canva manually)

---

## Common Challenges & Solutions

### Challenge 1: Agent Generates Wrong Code

**Symptom:** Agent builds something that doesn't match your spec.

**Solution:**
1. Review your CLAUDE.md (is spec clear?)
2. Add examples to .cursorrules
3. Re-run agent with more specific prompt

---

### Challenge 2: Stuck on a Bug

**Symptom:** Same bug for 2+ hours, can't figure it out.

**Solution:**
1. Enable Cursor Debug Mode
2. Use GPT-5.2 (don't cheap out on debugging)
3. Ask in Slack #practicum
4. Rubber duck debug with Claude

---

### Challenge 3: Scope Creep

**Symptom:** "I just thought of 5 more features..."

**Solution:**
1. Write them down in \`backlog.md\`
2. **Do NOT build them now**
3. Ship MVP first
4. Add features in v2 (after certification)

---

### Challenge 4: Imposter Syndrome

**Symptom:** "I'm just prompting AI, am I even coding?"

**Reality check:**
- You architected the system
- You made all technical decisions
- You reviewed and understood all code
- You debugged and optimized
- **You're an AI-assisted developer, not a prompt monkey**

**This is the future of development.** Embrace it.

---

## Week 2-3 Deliverables Checklist

By end of Week 3, you should have:

- [ ] All core features built and working
- [ ] 80%+ test coverage
- [ ] Deployed to production
- [ ] 3+ users tested it
- [ ] Marketing assets created
- [ ] Architecture decision records written
- [ ] AI usage log complete
- [ ] Iteration notes documented
- [ ] Cost under budget
- [ ] Ready for submission

---

## Next Steps

Once your feature is live and polished, move to **Module 05.3: Submission & Certification** to submit your work and get certified as a Vibe Coder.`,
      },
      {
        id: '05.3',
        title: 'Submission & Certification',
        duration: 'Week 4',
        tools: ['imagen-3', 'veo-3-1'],
        content: `## Certification Requirements

To earn your **Vibe Coder Academy Certificate**, you must submit a complete project that demonstrates mastery of AI orchestration.

**What the certificate proves:**
- You can build production features with AI agents
- You understand multi-agent coordination
- You optimize for cost and speed
- You can work independently with AI tools

**Certificate unlocks:**
- Alumni network access
- Job board (companies hiring AI-first developers)
- Mentor program (help future cohorts)
- Portfolio showcase on vibecoder.ai

---

## Submission Checklist

Your submission package must include **all 7 components**:

### 1. Project Overview (README.md)

\`\`\`markdown
# Project: [Name]

## Problem & Solution
[2-3 sentences: What problem does this solve? For whom?]

## Live Demo
- **URL:** [https://your-project.com]
- **Demo Video:** [Veo-generated video link]
- **Screenshots:** [See /assets folder]

## Tech Stack
- Frontend: [Framework]
- Backend: [Runtime + framework]
- Database: [PostgreSQL, etc.]
- AI Tools Used: [List with usage breakdown]

## Key Features
- Feature 1: [Description]
- Feature 2: [Description]
- Feature 3: [Description]

## Success Metrics
- [Metric 1]: [Result]
- [Metric 2]: [Result]
- [User feedback]: [Quote from tester]

## Time & Cost
- **Total time:** [X] hours over [Y] weeks
- **AI API costs:** $[Z]
- **Manual coding estimate:** [X] hours (vs. [Y] hours with AI)
- **Speed improvement:** [Z]x faster
\`\`\`

---

### 2. Architecture Documentation (docs/architecture.md)

**Must include:**

**A. System Architecture Diagram (Mermaid)**

\`\`\`mermaid
graph TB
    Client[Frontend]
    API[Backend API]
    DB[(Database)]
    Worker[Background Jobs]
    
    Client --> API
    API --> DB
    Worker --> DB
\`\`\`

**B. Data Flow Explanation**

> When a user saves a link:
> 1. Frontend sends POST to /api/links
> 2. Backend validates with Zod schema
> 3. GPT-5.2 categorizes the link
> 4. Prisma saves to PostgreSQL
> 5. Background worker fetches metadata
> 6. Frontend receives success response

**C. Technology Decisions**

| Decision | Reasoning |
|----------|-----------|
| Why Next.js? | Server-side rendering for SEO, built-in API routes |
| Why GPT-5.2? | Best at categorization tasks, 30% fewer hallucinations |
| Why Prisma? | Type-safe queries, easy migrations |

---

### 3. Source Code (GitHub Repository)

**Repository must have:**

- [ ] All source code
- [ ] CLAUDE.md configuration file
- [ ] .cursorrules configuration file
- [ ] AGENTS.md (if using multi-agent)
- [ ] Comprehensive README
- [ ] Test suite (80%+ coverage)
- [ ] Deployment configuration

**Make repository public** so reviewers can assess code quality.

**Example:** \`github.com/yourusername/linkhub\`

---

### 4. Test Coverage Report (coverage/)

**Run:**

\`\`\`bash
npm test -- --coverage
\`\`\`

**Export results:**

\`\`\`bash
npm run test:coverage:export
\`\`\`

**Include screenshot of coverage report showing:**
- Overall coverage > 80%
- All critical paths covered

---

### 5. AI Usage Log (logs/ai-usage.csv)

**Format:**

\`\`\`csv
Date,Agent,Model,Task,Tokens In,Tokens Out,Cost,Success
2025-01-20,@backend-agent,claude-sonnet-4.5,Create API endpoints,5200,8900,$0.042,Yes
2025-01-21,@frontend-agent,gemini-3-flash,Build UI components,3100,6200,$0.001,Yes
2025-01-22,@debug-agent,gpt-5.2,Fix N+1 query bug,2400,1800,$0.108,Yes
2025-01-23,@testing-agent,gemini-3-flash,Write test suite,1800,4200,$0.0005,Yes
...
TOTAL,,,,$7.42,
\`\`\`

**Summary statistics to include:**

| Metric | Value |
|--------|-------|
| Total AI requests | [X] |
| Total tokens used | [Y] |
| Total cost | $[Z] |
| Cost per feature | $[Z/features] |
| Most expensive agent | [@agent-name] |
| Cost optimization savings | [%] (vs. all-Claude) |

---

### 6. Marketing Assets (public/assets/)

**Required assets:**

1. **Hero image** (Imagen 3)
   - Landing page quality
   - 1920x1080px minimum
   - Showcases your feature

2. **Demo video** (Veo 3.1)
   - 30-60 seconds
   - Shows core workflow
   - Uploaded to YouTube/Vimeo

3. **Feature mockups** (Google Stitch or Imagen)
   - 3-4 key screens
   - Before/after comparison (optional)

4. **Social media graphics** (Imagen 3)
   - 1-2 announcement graphics
   - Optimized for Twitter/LinkedIn

**Assets prove you can ship production-ready features end-to-end.**

---

### 7. Reflection Document (docs/reflection.md)

**Answer these questions (500-1000 words):**

#### What did you build and why?

> [Explain the problem, your solution, who it's for]

#### What was your multi-agent workflow?

> [Describe how you used different agents for different tasks. Which agents worked best for what?]

#### What challenges did you face?

> [Biggest blocker? How did you solve it? Which AI tool helped most?]

#### What would you do differently next time?

> [What you learned about prompt engineering, agent coordination, or the tools]

#### Cost analysis: Was it worth it?

> [Compare time/cost with vs. without AI. Show ROI.]

#### What surprised you most?

> [Unexpected wins or challenges]

---

## Submission Process

### Step 1: Package Your Submission

**Create a submission folder:**

\`\`\`
practicum-submission/
├── README.md                    # Project overview
├── docs/
│   ├── architecture.md         # System design
│   └── reflection.md           # What you learned
├── logs/
│   ├── ai-usage.csv            # Cost tracking
│   └── iterations.md           # Build log
├── assets/
│   ├── hero-image.png
│   ├── demo-video.mp4
│   └── mockups/
├── coverage/                    # Test coverage report
└── GITHUB_REPO_URL.txt         # Link to code
\`\`\`

---

### Step 2: Submit to Vibe Coder Academy

**Go to:** [vibecoder.ai/submit](https://vibecoder.ai/submit)

**Fill out submission form:**
- Your name
- Project name
- GitHub repository URL
- Live demo URL
- Upload submission folder (ZIP)

**Submission deadline:** End of Week 4

---

### Step 3: Peer Review (Optional but Recommended)

Before official submission, get feedback from 2-3 peers:

**Post in Slack #practicum:**

> "Submitting my project this week! Would love feedback on [GitHub link]. Specifically looking for input on [X]."

**Peers review for:**
- Code quality
- Documentation clarity
- Test coverage
- AI usage efficiency

**Iterate based on feedback.**

---

## Review Process

### What Reviewers Evaluate

| Criteria | Weight | What We Look For |
|----------|--------|-----------------|
| **Feature Quality** | 30% | Works as specified, handles edge cases, good UX |
| **AI Orchestration** | 25% | Effective multi-agent usage, cost optimization |
| **Code Quality** | 20% | Clean, tested, follows best practices |
| **Documentation** | 15% | Clear architecture docs, reflection shows learning |
| **Innovation** | 10% | Creative use of tools, solves real problem |

**Passing score:** 75/100

---

### Typical Review Timeline

- **Day 1-2:** Reviewer tests your live demo
- **Day 3-4:** Reviewer reads code and docs
- **Day 5:** Reviewer provides feedback
- **Day 6-7:** You iterate on feedback (if needed)
- **Day 8:** Final approval + certificate issued

**Total:** ~1 week from submission to certification

---

## Common Rejection Reasons (and How to Avoid)

### 1. Incomplete Documentation

**Issue:** Missing architecture diagrams or AI usage logs.

**Fix:** Use the checklists above. Submit nothing without all 7 components.

---

### 2. Low Test Coverage

**Issue:** Only 40% test coverage (requirement is 80%).

**Fix:** Use @testing-agent to generate comprehensive test suite.

---

### 3. Feature Doesn't Work

**Issue:** Demo URL is broken or has critical bugs.

**Fix:** Test in incognito mode before submitting. Get 3 people to test it.

---

### 4. Insufficient AI Usage

**Issue:** Used AI for 1-2 tasks, mostly manual coding.

**Fix:** Review Module 03-04. Use multi-agent orchestration for all major features.

---

### 5. Plagiarism / Tutorial Clone

**Issue:** Project is a copy of an existing tutorial.

**Fix:** Build something original. Even simple original ideas beat complex clones.

---

## After Certification

### You'll Receive:

1. **Digital Certificate (PDF)**
   - Your name
   - Project title
   - Certification date
   - Unique verification code

2. **LinkedIn Badge**
   - Add "Vibe Coder Academy Graduate" to profile
   - Link to certificate verification page

3. **Alumni Network Access**
   - Private Slack channel
   - Monthly meetups
   - Exclusive job postings

4. **Portfolio Showcase**
   - Your project featured on vibecoder.ai
   - Searchable by companies hiring

---

### What's Next?

**Career paths for certified Vibe Coders:**

1. **AI-First Developer**
   - Companies hiring for AI-augmented development
   - 30-50% higher salary than traditional devs
   - Remote-friendly roles

2. **Solo Founder**
   - Ship MVPs 10x faster
   - Validate ideas cheaply
   - Build products solo that used to require teams

3. **AI Consultant**
   - Help companies adopt AI dev workflows
   - $150-300/hour consulting rates
   - Teach teams to orchestrate agents

4. **Educator / Mentor**
   - Become a Vibe Coder mentor
   - Create content about AI development
   - Paid opportunities for course creation

---

## Success Story Spotlight

**Sarah M., Cohort 3:**
> "I submitted a customer support automation tool. After certification, I posted it on Product Hunt. It hit #2 Product of the Day. Now I have 200 paying customers at $29/month. The course paid for itself 1000x over."

**Marcus T., Cohort 5:**
> "I used the skills to automate 80% of my agency's client work. We went from 4 employees to 2 (me + AI). Profit margins tripled. I now consult other agencies on AI adoption."

**Your success story could be next.**

---

## Final Submission Checklist

Before you hit "Submit," verify:

- [ ] All 7 components included
- [ ] GitHub repo is public
- [ ] Live demo works (test in incognito)
- [ ] Demo video uploaded and linked
- [ ] Test coverage > 80%
- [ ] AI usage log complete with costs
- [ ] Reflection document (500+ words)
- [ ] No placeholder content (e.g., "TODO", "Coming soon")
- [ ] Spell-checked all documentation
- [ ] At least 1 peer reviewed it

**When all boxes are checked, you're ready to submit!**

---

## Congratulations!

You've completed all 6 modules of the **Vibe Coder Academy**.

You've learned:
- ✅ The mental shift from coding to orchestration
- ✅ How to set up 12 AI tools
- ✅ Configuration-driven AI (CLAUDE.md, .cursorrules, AGENTS.md)
- ✅ Multi-agent parallel execution
- ✅ Cost optimization through specialization
- ✅ Full end-to-end feature development
- ✅ Solo project execution

**You're now an AI-orchestration expert.**

**Ship your project. Get certified. Change how you build software forever.**

---

## Questions?

- **Technical issues:** #help in Slack
- **Submission questions:** #practicum in Slack
- **General inquiries:** hello@vibecoder.ai

**We're here to help you succeed.**

---

## Submit Your Project

**Ready?** [Submit at vibecoder.ai/submit](https://vibecoder.ai/submit)

**Not ready yet?** Review Modules 00-05 and ask questions in Slack.

**Good luck, future Vibe Coder! 🚀**`,
      },
    ],
    keyTakeaways: [
      'You\'ve shipped a real feature independently',
      'You understand when to use each tool',
      'You can coordinate multiple agents',
      'You optimize for cost automatically',
      'You teach this to others',
    ],
  },
];

/**
 * Complete curriculum data export
 */
export const curriculumData: Curriculum = {
  tools,
  modules,
};
