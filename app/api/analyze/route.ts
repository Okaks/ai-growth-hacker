import { NextResponse } from "next/server";
import OpenAI from "openai";
import Groq from "groq-sdk";
import Anthropic from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";

type ProductState = "new_no_metrics" | "existing_no_metrics" | "existing_with_metrics";

const PREMIUM_PROVIDERS = ["openai", "claude"];

// ─── Daily Usage Limiter (Upstash Redis) ──────────────────────────────────────

const LIMITS: Record<string, number> = {
  openai: 2,
  claude: 2,
};

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

async function checkAndIncrementUsage(provider: string): Promise<{ allowed: boolean }> {
  const limit = LIMITS[provider];
  if (!limit) return { allowed: true };

  const key = `usage:${provider}:${getTodayDate()}`;
  const count = await redis.incr(key);
  await redis.expire(key, 172800); // auto-cleanup after 48 hours

  if (count > limit) {
    return { allowed: false };
  }

  return { allowed: true };
}

// ─── State Detection ───────────────────────────────────────────────────────────

function detectState(
  isNew: boolean,
  monthlyUsers: string,
  monthlySignups: string,
  activationRate: string,
  retentionRate: string,
  revenue: string
): ProductState {
  const hasMetrics =
    monthlyUsers?.trim() ||
    monthlySignups?.trim() ||
    activationRate?.trim() ||
    retentionRate?.trim() ||
    revenue?.trim();

  if (isNew) return "new_no_metrics";
  if (!hasMetrics) return "existing_no_metrics";
  return "existing_with_metrics";
}

// ─── Prompt Builder ────────────────────────────────────────────────────────────

function buildPrompt(
  state: ProductState,
  productName: string,
  description: string,
  users: string,
  stage: string,
  monthlyUsers: string,
  monthlySignups: string,
  activationRate: string,
  retentionRate: string,
  revenue: string
): string {
  const baseContext = `
Product Name: ${productName}
Product Description: ${description}
Target Audience: ${users}
Product Stage: ${stage}
`;

  const metricsContext = `
Monthly Active Users: ${monthlyUsers || "Not provided"}
Monthly Signups: ${monthlySignups || "Not provided"}
Activation Rate: ${activationRate ? activationRate + "%" : "Not provided"}
Retention Rate: ${retentionRate ? retentionRate + "%" : "Not provided"}
Monthly Revenue: ${revenue ? "$" + revenue : "Not provided"}
`;

  const outputInstructions = `
CRITICAL: You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no text before or after.
The JSON must be parseable by JSON.parse().
Use \\n for line breaks within string values. Never use actual newlines inside JSON string values.
`;

  if (state === "new_no_metrics") {
    return `${outputInstructions}

You are a senior product growth consultant with 15 years of experience advising early-stage startups and growth-stage companies. You are analytical, direct, and strategic — like McKinsey meets Y Combinator.

A founder has just described their new product. They have no metrics yet. Your job is to:
1. Build a focused tracking blueprint organized by AARRR funnel stage. Select the 7 to 8 MOST IMPORTANT metrics for this specific product — not a generic list, but the ones that matter most given what this product does and who it serves. Distribute them across the 5 AARRR stages (some stages may have 1 metric, others 2 — prioritize based on what matters most for this product type). Quality over quantity: a founder should be able to master all of these in their first 3 months.
2. For each metric, explain exactly what it measures, why it matters for THIS specific product, how to track it, and a realistic early benchmark.
3. Provide a 3-month tactical plan with week-by-week actions — this is MANDATORY, do not skip it.
4. Provide a 6-month strategic plan with milestones — this is MANDATORY, do not skip it. Both plans must always be present in your response.
5. End with a warm but professional nudge to return once they have data.

CRITICAL: Your JSON response MUST include all four of these keys: "trackingBlueprint", "plan3Months", "plan6Months", and "returnMessage". Omitting any of them is an error.

${baseContext}

Return this exact JSON structure:
{
  "state": "new_no_metrics",
  "summary": "2-3 sentence consultant-style assessment of this product's growth potential and the key challenge to solve first",
  "trackingBlueprint": [
    {
      "stage": "Acquisition",
      "stageWhy": "one sentence on why tracking acquisition matters for this product",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this specific metric matters for this product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "realistic early benchmark or industry standard"
        }
      ]
    },
    {
      "stage": "Activation",
      "stageWhy": "one sentence on why tracking activation matters for this product",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this specific metric matters for this product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "realistic early benchmark or industry standard"
        }
      ]
    },
    {
      "stage": "Retention",
      "stageWhy": "one sentence on why tracking retention matters for this product",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this specific metric matters for this product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "realistic early benchmark or industry standard"
        }
      ]
    },
    {
      "stage": "Revenue",
      "stageWhy": "one sentence on why tracking revenue matters for this product",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this specific metric matters for this product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "realistic early benchmark or industry standard"
        }
      ]
    },
    {
      "stage": "Referral",
      "stageWhy": "one sentence on why tracking referral matters for this product",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this specific metric matters for this product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "realistic early benchmark or industry standard"
        }
      ]
    }
  ],
  "plan3Months": {
    "goal": "single sentence goal for month 3",
    "weeks": [
      { "period": "Weeks 1-2", "focus": "theme", "actions": ["action 1", "action 2", "action 3"] },
      { "period": "Weeks 3-4", "focus": "theme", "actions": ["action 1", "action 2", "action 3"] },
      { "period": "Month 2", "focus": "theme", "actions": ["action 1", "action 2", "action 3"] },
      { "period": "Month 3", "focus": "theme", "actions": ["action 1", "action 2", "action 3"] }
    ]
  },
  "plan6Months": {
    "goal": "single sentence goal for month 6",
    "milestones": [
      { "month": "Month 4", "milestone": "what should be achieved", "lever": "primary growth lever" },
      { "month": "Month 5", "milestone": "what should be achieved", "lever": "primary growth lever" },
      { "month": "Month 6", "milestone": "what should be achieved", "lever": "primary growth lever" }
    ]
  },
  "returnMessage": "A warm, motivating message telling them to come back with their tracking data. Mention 3-4 specific metrics by name and the funnel stages they unlock."
}`;
  }

  if (state === "existing_no_metrics") {
    return `${outputInstructions}

You are a senior product growth consultant. An existing product team has come to you without sharing any metrics. You must:
1. Professionally explain what insights are blocked without data - be specific about which funnel decisions cannot be made.
2. Build a tracking blueprint organized by AARRR funnel stage. Select between 8 and 12 metrics based on the complexity of this specific product — a simple consumer app needs fewer, a B2B SaaS with a sales funnel needs more. Do not pad the list; every metric must be genuinely important for this product. For each metric explain what it measures, why it matters for THIS product specifically, how to track it, and an industry benchmark.
3. Provide a 6-month growth and retention plan — this is MANDATORY and must always be present in your response.
4. End with a direct, specific ask for what data to bring back.

CRITICAL: Your JSON response MUST include all four of these keys: "trackingBlueprint", "plan6Months", "retentionPlan", and "dataRequest". Omitting any of them is an error.

${baseContext}

Return this exact JSON structure:
{
  "state": "existing_no_metrics",
  "summary": "2-3 sentence honest assessment: what you can and cannot advise without metrics, and the specific risk of flying blind for a live product",
  "metricsGap": {
    "headline": "one sentence on the core problem — what decisions are being made blindly right now",
    "blockedInsights": [
      "specific funnel insight that cannot be determined without data",
      "specific funnel insight that cannot be determined without data",
      "specific funnel insight that cannot be determined without data",
      "specific funnel insight that cannot be determined without data"
    ]
  },
  "trackingBlueprint": [
    {
      "stage": "Acquisition",
      "stageWhy": "one sentence on what acquisition blind spots exist for this live product right now",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this is critical to track for this specific product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "industry benchmark or realistic target for this stage"
        }
      ]
    },
    {
      "stage": "Activation",
      "stageWhy": "one sentence on what activation blind spots exist for this live product right now",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this is critical to track for this specific product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "industry benchmark or realistic target for this stage"
        }
      ]
    },
    {
      "stage": "Retention",
      "stageWhy": "one sentence on what retention blind spots exist for this live product right now",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this is critical to track for this specific product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "industry benchmark or realistic target for this stage"
        }
      ]
    },
    {
      "stage": "Revenue",
      "stageWhy": "one sentence on what revenue blind spots exist for this live product right now",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this is critical to track for this specific product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "industry benchmark or realistic target for this stage"
        }
      ]
    },
    {
      "stage": "Referral",
      "stageWhy": "one sentence on what referral blind spots exist for this live product right now",
      "metrics": [
        {
          "metric": "metric name",
          "definition": "what exactly this measures",
          "why": "why this is critical to track for this specific product",
          "howToTrack": "specific tool or method to capture this data",
          "benchmark": "industry benchmark or realistic target for this stage"
        }
      ]
    }
  ],
  "plan6Months": {
    "goal": "single sentence strategic goal",
    "phases": [
      { "phase": "Months 1-2", "theme": "theme name", "focus": "what to focus on", "actions": ["action 1", "action 2", "action 3"] },
      { "phase": "Months 3-4", "theme": "theme name", "focus": "what to focus on", "actions": ["action 1", "action 2", "action 3"] },
      { "phase": "Months 5-6", "theme": "theme name", "focus": "what to focus on", "actions": ["action 1", "action 2", "action 3"] }
    ]
  },
  "retentionPlan": [
    { "strategy": "strategy name", "tactic": "specific action", "impact": "expected outcome" }
  ],
  "dataRequest": "A direct, specific ask — name the exact metrics from the tracking blueprint they should bring back and explain how each one unlocks a deeper layer of analysis"
}`;
  }

  return `${outputInstructions}

You are a senior product growth consultant - part McKinsey analyst, part growth hacker. You have real data. Do not shy away from hard truths. Benchmark their metrics against industry standards. Be specific, numerical where possible, and prioritize ruthlessly.

${baseContext}
${metricsContext}

Return this exact JSON structure:
{
  "state": "existing_with_metrics",
  "summary": "3-4 sentence executive summary: overall health, biggest opportunity, biggest risk",
  "metrics": {
    "headline": "one sentence verdict on their current metrics",
    "scores": [
      { "label": "Acquisition", "score": "Good/Fair/Weak", "note": "one line insight" },
      { "label": "Activation", "score": "Good/Fair/Weak", "note": "one line insight" },
      { "label": "Retention", "score": "Good/Fair/Weak", "note": "one line insight" },
      { "label": "Revenue", "score": "Good/Fair/Weak", "note": "one line insight" }
    ]
  },
  "funnelAnalysis": {
    "headline": "where the biggest leak is",
    "stages": [
      { "stage": "Awareness", "status": "status", "insight": "specific insight", "action": "recommended action" },
      { "stage": "Acquisition", "status": "status", "insight": "specific insight", "action": "recommended action" },
      { "stage": "Activation", "status": "status", "insight": "specific insight", "action": "recommended action" },
      { "stage": "Retention", "status": "status", "insight": "specific insight", "action": "recommended action" },
      { "stage": "Revenue", "status": "status", "insight": "specific insight", "action": "recommended action" },
      { "stage": "Referral", "status": "status", "insight": "specific insight", "action": "recommended action" }
    ]
  },
  "growthStrategy": {
    "headline": "primary growth thesis in one sentence",
    "channels": [
      { "channel": "channel name", "priority": "High/Medium/Low", "rationale": "why this channel fits", "tactic": "specific first action" }
    ]
  },
  "retentionPlan": {
    "headline": "retention diagnosis",
    "strategies": [
      { "strategy": "strategy name", "tactic": "specific action", "metric": "what to measure", "timeline": "when to expect results" }
    ]
  },
  "revenueOpportunities": [
    { "opportunity": "opportunity name", "description": "what it is", "effort": "Low/Medium/High", "impact": "Low/Medium/High" }
  ],
  "priorityRoadmap": [
    { "rank": 1, "action": "action title", "why": "why this first", "owner": "who should own this", "timeline": "timeframe" },
    { "rank": 2, "action": "action title", "why": "why this second", "owner": "who should own this", "timeline": "timeframe" },
    { "rank": 3, "action": "action title", "why": "why this third", "owner": "who should own this", "timeline": "timeframe" },
    { "rank": 4, "action": "action title", "why": "why this fourth", "owner": "who should own this", "timeline": "timeframe" },
    { "rank": 5, "action": "action title", "why": "why this fifth", "owner": "who should own this", "timeline": "timeframe" }
  ]
}`;
}

// ─── JSON Extractor ────────────────────────────────────────────────────────────

function extractJSON(raw: string): string {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    return raw.slice(start, end + 1);
  }
  return raw;
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productName,
      description,
      users,
      isNew,
      stage,
      monthlyUsers,
      monthlySignups,
      activationRate,
      retentionRate,
      revenue,
      provider,
      premiumPassword,
    } = body;

    // 1. Password check for premium providers
    if (PREMIUM_PROVIDERS.includes(provider)) {
      const correctPassword = process.env.PREMIUM_PASSWORD;
      if (!correctPassword || premiumPassword !== correctPassword) {
        return NextResponse.json(
          { error: "premium_locked", message: "Incorrect password for premium AI engine." },
          { status: 403 }
        );
      }

      // 2. Daily usage limit check
      const { allowed } = await checkAndIncrementUsage(provider);
      if (!allowed) {
        return NextResponse.json(
          { error: "daily_limit_exceeded", message: "Daily premium limit exceeded. Please try again tomorrow." },
          { status: 429 }
        );
      }
    }

    // 3. Build prompt and call AI
    const state = detectState(isNew, monthlyUsers, monthlySignups, activationRate, retentionRate, revenue);
    const prompt = buildPrompt(
      state, productName, description, users, stage,
      monthlyUsers, monthlySignups, activationRate, retentionRate, revenue
    );

    let rawResult = "";

    if (provider === "groq") {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const chat = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
      });
      rawResult = chat.choices[0].message.content || "";
    }

    if (provider === "openai") {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        response_format: { type: "json_object" },
      });
      rawResult = response.choices[0].message.content || "";
    }

    if (provider === "openrouter") {
      const openrouter = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });
      const response = await openrouter.chat.completions.create({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });
      rawResult = response.choices[0].message.content || "";
    }

    if (provider === "claude") {
      const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 6000,
        messages: [{ role: "user", content: prompt }],
      });
      rawResult = message.content[0]?.type === "text" ? message.content[0].text : "";
    }

    const cleaned = extractJSON(rawResult);
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "parse_failed", raw: rawResult }, { status: 200 });
    }

    return NextResponse.json({ result: parsed, state });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "server_error", message: "Failed to generate strategy" },
      { status: 500 }
    );
  }
}