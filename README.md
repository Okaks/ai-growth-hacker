# AI Growth Advisor

> A consultant-grade AI growth strategy tool for product teams and founders.

Describe your product, your audience, and where you are in your growth journey. AI Growth Advisor returns a structured growth strategy, funnel analysis, metrics tracking blueprint, and priority roadmap — powered by your choice of AI engine.

**Live:** [ai-growth-hacker.vercel.app](https://ai-growth-hacker.vercel.app)

---

## What It Does

Most growth advice is generic. AI Growth Advisor adapts its output based on where your product actually is — so the strategy you receive is always appropriate to your situation.

The tool works across three states:

| State | Your Input | What You Get |
|---|---|---|
| **New product** | Name, description, target audience | Tracking blueprint (AARRR) + 3-month tactical plan + 6-month strategic plan |
| **Existing product, no metrics** | Name, description, target audience | Metrics gap analysis + tracking blueprint + 6-month growth & retention plan |
| **Existing product, with metrics** | Above + MAU, signups, activation, retention, revenue | Full funnel analysis + growth strategy + retention plan + revenue opportunities + priority roadmap |

---

## Features

- **Three-state advisory logic** — output adapts to the product's lifecycle stage, not a one-size-fits-all response
- **AARRR tracking blueprint** — 7–12 metrics organised by funnel stage with how-to-track guidance and industry benchmarks
- **Multi-provider AI** — choose your engine: Groq (free), OpenRouter (free), OpenAI GPT-4o Mini, or Claude Sonnet
- **PDF export** — download your full strategy as a formatted, professional report
- **Copy to clipboard** — per-section and full report copy buttons for quick sharing
- **Refine prompts** — one-click buttons to drill deeper into Retention, Acquisition, First 30 Days, or Activation
- **Premium protection** — password gate + daily usage cap via Upstash Redis

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend & Backend | Next.js 15 (App Router) + TypeScript |
| AI Providers | Groq SDK, OpenAI SDK, Anthropic SDK, OpenRouter |
| Rate Limiting | Upstash Redis (serverless) |
| PDF Generation | jsPDF (client-side) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- API keys for the AI providers you want to use
- An Upstash Redis account (for rate limiting)

### Installation

```bash
git clone https://github.com/Okaks/ai-growth-hacker.git
cd ai-growth-hacker
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI Providers
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key
CLAUDE_API_KEY=your_claude_key

# Premium Access
PREMIUM_PASSWORD=your_secret_password

# Upstash Redis (rate limiting)
KV_REST_API_URL=your_upstash_url
KV_REST_API_TOKEN=your_upstash_token
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

This app is optimised for Vercel. The rate limiter uses Upstash Redis, which works correctly in serverless environments.

1. Push your repository to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set the framework to Next.js
4. Add all environment variables from the section above
5. Deploy

----
Demo video: https://www.loom.com/share/01b716d1b70b471da3b12ed93405d982
---

[LinkedIn](https://www.linkedin.com/in/blessing-okakwu/) · [Portfolio](https://bokakwu.wixsite.com/okakwus-analytics) · [Live App](https://ai-growth-hacker.vercel.app)
