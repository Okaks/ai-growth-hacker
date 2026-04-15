AI Growth Advisor
A consultant-grade AI growth strategy tool for product teams and founders. Paste in your product details and get a structured growth strategy, funnel analysis, tracking blueprint, and priority roadmap, powered by your choice of AI engine.
Live: ai-growth-hacker.vercel.app
What It Does
The app adapts its output based on three states:
State	Input	Output
New product	Name, description, audience	Tracking blueprint (AARRR) + 3-month tactical plan + 6-month strategic plan
Existing product, no metrics	Name, description, audience	Metrics gap analysis + tracking blueprint + 6-month growth & retention plan
Existing product, with metrics	Above + MAU, signups, activation, retention, revenue	Full funnel analysis + growth strategy + retention plan + revenue opportunities + priority roadmap


Features
•	Three-state advisory logic: output adapts to the product's lifecycle stage
•	AARRR tracking blueprint: 7–12 metrics organized by funnel stage with how-to-track guidance and benchmarks
•	Multi-provider AI: Groq (free), OpenRouter (free), OpenAI GPT-4o Mini, Claude Sonnet
•	PDF export: download your strategy as a formatted report
•	Copy to clipboard: per-section and full report copy buttons
•	Premium protection: password gate + daily usage cap via Upstash Redis
•	Refine prompts: one-click strategy refinement buttons
Tech Stack
•	Next.js 15 (App Router) + TypeScript
•	Groq SDK, OpenAI SDK, Anthropic SDK
•	Upstash Redis: serverless daily rate limiting
•	jsPDF: client-side PDF generation
•	Vercel: deployment


Getting Started
Prerequisites
•	Node.js 18+
•	Accounts for the AI providers you want to use


Installation
git clone https://github.com/Okaks/ai-growth-hacker.git
cd ai-growth-hacker
npm install


Environment Variables
•	Create a .env.local file in the root:
•	GROQ_API_KEY=your_groq_key
•	OPENAI_API_KEY=your_openai_key
•	OPENROUTER_API_KEY=your_openrouter_key
•	CLAUDE_API_KEY=your_claude_key
•	PREMIUM_PASSWORD=your_secret_password


# Upstash Redis (for rate limiting)
•	KV_REST_API_URL=your_upstash_url
•	KV_REST_API_TOKEN=your_upstash_token


Run locally
npm run dev
Open http://localhost:3000


Deployment
This app is optimised for Vercel. The rate limiter uses Upstash Redis which works correctly in serverless environments.
1.	Push to GitHub
2.	Import repo in Vercel
3.	Set framework to Next.js
4.	Add all environment variables
5.	Deploy


About
Built by Blessing Okakwu, data analyst with a background in BI, product analytics, and accounting. This project sits at the intersection of domain knowledge and AI, using prompt engineering and product thinking to deliver contextually intelligent growth advice.
LinkedIn · Portfolio

