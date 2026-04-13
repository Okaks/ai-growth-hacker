'use client';

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Score = "Good" | "Fair" | "Weak";

interface BlueprintMetric { metric: string; definition: string; why: string; howToTrack: string; benchmark: string; }
interface BlueprintStage { stage: string; stageWhy: string; metrics: BlueprintMetric[]; }
interface WeekPlan { period: string; focus: string; actions: string[]; }
interface MilestonePlan { month: string; milestone: string; lever: string; }
interface PhasePlan { phase: string; theme: string; focus: string; actions: string[]; }
interface RetentionStrategy { strategy: string; tactic: string; impact?: string; metric?: string; timeline?: string; }
interface FunnelStage { stage: string; status: string; insight: string; action: string; }
interface GrowthChannel { channel: string; priority: string; rationale: string; tactic: string; }
interface RevenueOpportunity { opportunity: string; description: string; effort: string; impact: string; }
interface RoadmapItem { rank: number; action: string; why: string; owner: string; timeline: string; }
interface MetricScore { label: string; score: Score; note: string; }

interface AnalysisResult {
  state: string;
  summary: string;
  trackingBlueprint?: BlueprintStage[];
  plan3Months?: { goal: string; weeks: WeekPlan[]; };
  plan6Months?: { goal: string; milestones?: MilestonePlan[]; phases?: PhasePlan[]; };
  returnMessage?: string;
  metricsGap?: { headline: string; blockedInsights: string[]; };
  dataRequest?: string;
  metrics?: { headline: string; scores: MetricScore[]; };
  funnelAnalysis?: { headline: string; stages: FunnelStage[]; };
  growthStrategy?: { headline: string; channels: GrowthChannel[]; };
  retentionPlan?: { headline?: string; strategies?: RetentionStrategy[]; } | RetentionStrategy[];
  revenueOpportunities?: RevenueOpportunity[];
  priorityRoadmap?: RoadmapItem[];
}

// ─── PDF Export ───────────────────────────────────────────────────────────────

function buildReportText(result: AnalysisResult, productName: string): string {
  const lines: string[] = [];
  const divider = "─".repeat(60);

  lines.push(`GROWTH STRATEGY REPORT`);
  lines.push(`Product: ${productName}`);
  lines.push(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`);
  lines.push(divider);
  lines.push("");

  lines.push("EXECUTIVE SUMMARY");
  lines.push(result.summary);
  lines.push("");

  if (result.trackingBlueprint?.length) {
    lines.push(divider);
    lines.push("TRACKING BLUEPRINT");
    result.trackingBlueprint.forEach(stage => {
      lines.push(`\n[${stage.stage.toUpperCase()}]`);
      lines.push(stage.stageWhy);
      stage.metrics.forEach((m, i) => {
        lines.push(`  ${i + 1}. ${m.metric}`);
        lines.push(`     What it measures: ${m.definition}`);
        lines.push(`     Why it matters: ${m.why}`);
        lines.push(`     How to track: ${m.howToTrack}`);
        lines.push(`     Benchmark: ${m.benchmark}`);
      });
    });
    lines.push("");
  }

  if (result.plan3Months) {
    lines.push(divider);
    lines.push("3-MONTH TACTICAL PLAN");
    lines.push(`Goal: ${result.plan3Months.goal}`);
    lines.push("");
    result.plan3Months.weeks.forEach(w => {
      lines.push(`${w.period} — ${w.focus}`);
      w.actions.forEach(a => lines.push(`  • ${a}`));
      lines.push("");
    });
  }

  if (result.plan6Months) {
    lines.push(divider);
    lines.push("6-MONTH STRATEGIC PLAN");
    lines.push(`Goal: ${result.plan6Months.goal}`);
    lines.push("");
    result.plan6Months.milestones?.forEach(m => {
      lines.push(`${m.month}: ${m.milestone}`);
      lines.push(`   Growth lever: ${m.lever}`);
      lines.push("");
    });
    result.plan6Months.phases?.forEach(p => {
      lines.push(`${p.phase}: ${p.theme}`);
      lines.push(`   Focus: ${p.focus}`);
      p.actions.forEach(a => lines.push(`  • ${a}`));
      lines.push("");
    });
  }

  if (result.metricsGap) {
    lines.push(divider);
    lines.push("METRICS GAP");
    lines.push(result.metricsGap.headline);
    result.metricsGap.blockedInsights.forEach(b => lines.push(`  • ${b}`));
    lines.push("");
  }

  if (result.metrics) {
    lines.push(divider);
    lines.push("METRICS HEALTH CHECK");
    lines.push(result.metrics.headline);
    lines.push("");
    result.metrics.scores.forEach(s => {
      lines.push(`${s.label}: ${s.score} — ${s.note}`);
    });
    lines.push("");
  }

  if (result.funnelAnalysis) {
    lines.push(divider);
    lines.push("FUNNEL ANALYSIS");
    lines.push(result.funnelAnalysis.headline);
    lines.push("");
    result.funnelAnalysis.stages.forEach(s => {
      lines.push(`${s.stage} [${s.status}]`);
      lines.push(`   Insight: ${s.insight}`);
      lines.push(`   Action: ${s.action}`);
      lines.push("");
    });
  }

  if (result.growthStrategy) {
    lines.push(divider);
    lines.push("GROWTH STRATEGY");
    lines.push(result.growthStrategy.headline);
    lines.push("");
    result.growthStrategy.channels.forEach(c => {
      lines.push(`${c.channel} [Priority: ${c.priority}]`);
      lines.push(`   Why: ${c.rationale}`);
      lines.push(`   First step: ${c.tactic}`);
      lines.push("");
    });
  }

  const retentionIsArray = Array.isArray(result.retentionPlan);
  const retentionStrategies = retentionIsArray
    ? (result.retentionPlan as RetentionStrategy[])
    : (result.retentionPlan as { strategies?: RetentionStrategy[] })?.strategies || [];

  if (retentionStrategies.length) {
    lines.push(divider);
    lines.push("RETENTION PLAN");
    retentionStrategies.forEach(r => {
      lines.push(`${r.strategy}`);
      lines.push(`   Tactic: ${r.tactic}`);
      if (r.metric) lines.push(`   Measure: ${r.metric}`);
      if (r.timeline) lines.push(`   Timeline: ${r.timeline}`);
      if (r.impact) lines.push(`   Impact: ${r.impact}`);
      lines.push("");
    });
  }

  if (result.revenueOpportunities?.length) {
    lines.push(divider);
    lines.push("REVENUE OPPORTUNITIES");
    result.revenueOpportunities.forEach(r => {
      lines.push(`${r.opportunity} [Effort: ${r.effort} | Impact: ${r.impact}]`);
      lines.push(`   ${r.description}`);
      lines.push("");
    });
  }

  if (result.priorityRoadmap?.length) {
    lines.push(divider);
    lines.push("PRIORITY ROADMAP");
    result.priorityRoadmap.forEach(r => {
      lines.push(`${r.rank}. ${r.action} (${r.timeline})`);
      lines.push(`   Why: ${r.why}`);
      lines.push(`   Owner: ${r.owner}`);
      lines.push("");
    });
  }

  if (result.dataRequest) {
    lines.push(divider);
    lines.push("NEXT STEPS");
    lines.push(result.dataRequest);
    lines.push("");
  }

  if (result.returnMessage) {
    lines.push(divider);
    lines.push(result.returnMessage);
  }

  return lines.join("\n");
}

async function exportToPDF(result: AnalysisResult, productName: string) {
  // Dynamically import jsPDF to avoid SSR issues
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  function checkPageBreak(needed = 10) {
    if (y + needed > pageHeight - 20) {
      doc.addPage();
      y = margin;
    }
  }

  function addHeader() {
    // Purple header bar
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("AI Growth Advisor", margin, 12);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Growth Strategy Report", margin, 20);
    doc.text(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), pageWidth - margin, 20, { align: "right" });
    y = 38;
  }

  function addSectionTitle(title: string) {
    checkPageBreak(14);
    doc.setFillColor(238, 242, 255);
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setTextColor(67, 56, 202);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), margin + 4, y + 5.5);
    y += 12;
    doc.setTextColor(17, 24, 39);
  }

  function addText(text: string, opts: { bold?: boolean; size?: number; color?: [number, number, number]; indent?: number } = {}) {
    const size = opts.size || 9;
    const indent = opts.indent || 0;
    doc.setFontSize(size);
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    if (opts.color) doc.setTextColor(...opts.color);
    else doc.setTextColor(55, 65, 81);

    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, margin + indent, y);
      y += 5.5;
    });
  }

  function addGap(size = 4) { y += size; }

  function addBullet(text: string, indent = 4) {
    checkPageBreak(6);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    doc.setFillColor(99, 102, 241);
    doc.circle(margin + indent + 1, y - 1.5, 0.8, "F");
    const lines = doc.splitTextToSize(text, contentWidth - indent - 6);
    lines.forEach((line: string, i: number) => {
      if (i > 0) checkPageBreak(6);
      doc.text(line, margin + indent + 4, y);
      y += 5.5;
    });
  }

  function addDivider() {
    checkPageBreak(6);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  }

  // ── Build PDF ──────────────────────────────────────────────────────────────

  addHeader();

  // Product name + summary
  addText(productName, { bold: true, size: 14, color: [17, 24, 39] });
  addGap(2);
  addText(result.summary, { size: 9 });
  addGap(6);

  // Tracking blueprint
  if (result.trackingBlueprint?.length) {
    addSectionTitle("Tracking Blueprint");
    const stageColors: Record<string, [number, number, number]> = {
      Acquisition: [99, 102, 241],
      Activation: [16, 185, 129],
      Retention: [245, 158, 11],
      Revenue: [239, 68, 68],
      Referral: [139, 92, 246],
    };
    result.trackingBlueprint.forEach(stage => {
      checkPageBreak(20);
      const color = stageColors[stage.stage] || [99, 102, 241];
      // Stage header
      doc.setFillColor(...color);
      doc.rect(margin, y - 4, contentWidth, 9, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(stage.stage.toUpperCase(), margin + 4, y + 1.5);
      y += 10;
      addText(stage.stageWhy, { color: [107, 114, 128] });
      addGap(2);
      stage.metrics.forEach((m, i) => {
        checkPageBreak(24);
        addText(`${i + 1}. ${m.metric}`, { bold: true, color });
        addText(`What it measures: ${m.definition}`, { indent: 6 });
        addText(`Why it matters: ${m.why}`, { indent: 6 });
        addText(`How to track: ${m.howToTrack}`, { indent: 6, color: [67, 56, 202] });
        addText(`Benchmark: ${m.benchmark}`, { indent: 6, color: [5, 150, 105] });
        addGap(3);
      });
      addGap(2);
    });
  }

  // 3-month plan
  if (result.plan3Months) {
    addSectionTitle("3-Month Tactical Plan");
    addText(`Goal: ${result.plan3Months.goal}`, { bold: true });
    addGap(3);
    result.plan3Months.weeks.forEach(w => {
      checkPageBreak(16);
      addText(`${w.period} — ${w.focus}`, { bold: true, color: [67, 56, 202] });
      w.actions.forEach(a => addBullet(a));
      addGap(3);
    });
    addGap(2);
  }

  // 6-month plan
  if (result.plan6Months) {
    addSectionTitle("6-Month Strategic Plan");
    addText(`Goal: ${result.plan6Months.goal}`, { bold: true });
    addGap(3);
    result.plan6Months.milestones?.forEach(m => {
      checkPageBreak(14);
      addText(m.month, { bold: true, color: [67, 56, 202] });
      addText(m.milestone, { indent: 4 });
      addText(`Growth lever: ${m.lever}`, { indent: 4, color: [107, 114, 128] });
      addGap(3);
    });
    result.plan6Months.phases?.forEach(p => {
      checkPageBreak(18);
      addText(`${p.phase}: ${p.theme}`, { bold: true, color: [67, 56, 202] });
      addText(p.focus, { indent: 4, color: [107, 114, 128] });
      p.actions.forEach(a => addBullet(a, 6));
      addGap(3);
    });
    addGap(2);
  }

  // Metrics gap
  if (result.metricsGap) {
    addSectionTitle("What's Blocked Without Data");
    addText(result.metricsGap.headline, { bold: true, color: [146, 64, 14] });
    addGap(2);
    result.metricsGap.blockedInsights.forEach(b => addBullet(b));
    addGap(4);
  }

  // Metrics health
  if (result.metrics) {
    addSectionTitle("Metrics Health Check");
    addText(result.metrics.headline, { bold: true });
    addGap(3);
    result.metrics.scores.forEach(s => {
      const colorMap: Record<string, [number, number, number]> = {
        Good: [22, 101, 52], Fair: [146, 64, 14], Weak: [153, 27, 27]
      };
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...(colorMap[s.score] || [55, 65, 81]));
      doc.text(`${s.label} [${s.score}]`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.text(` — ${s.note}`, margin + doc.getTextWidth(`${s.label} [${s.score}]`), y);
      y += 6;
    });
    addGap(4);
  }

  // Funnel analysis
  if (result.funnelAnalysis) {
    addSectionTitle("Funnel Analysis");
    addText(result.funnelAnalysis.headline, { bold: true });
    addGap(3);
    result.funnelAnalysis.stages.forEach(s => {
      checkPageBreak(16);
      addText(`${s.stage} [${s.status}]`, { bold: true, color: [67, 56, 202] });
      addText(`Insight: ${s.insight}`, { indent: 4 });
      addText(`Action: ${s.action}`, { indent: 4, color: [5, 150, 105] });
      addGap(3);
    });
    addGap(2);
  }

  // Growth strategy
  if (result.growthStrategy) {
    addSectionTitle("Growth Strategy");
    addText(result.growthStrategy.headline, { bold: true });
    addGap(3);
    result.growthStrategy.channels.forEach(c => {
      checkPageBreak(16);
      const priorityColor: Record<string, [number, number, number]> = {
        High: [153, 27, 27], Medium: [146, 64, 14], Low: [22, 101, 52]
      };
      addText(`${c.channel} — ${c.priority} Priority`, { bold: true, color: priorityColor[c.priority] || [55, 65, 81] });
      addText(c.rationale, { indent: 4 });
      addText(`First step: ${c.tactic}`, { indent: 4, color: [99, 102, 241] });
      addGap(3);
    });
    addGap(2);
  }

  // Retention
  const retentionIsArray = Array.isArray(result.retentionPlan);
  const retentionStrategies: RetentionStrategy[] = retentionIsArray
    ? (result.retentionPlan as RetentionStrategy[])
    : (result.retentionPlan as { strategies?: RetentionStrategy[] })?.strategies || [];
  const retentionHeadline = !retentionIsArray
    ? (result.retentionPlan as { headline?: string })?.headline
    : undefined;

  if (retentionStrategies.length) {
    addSectionTitle("Retention Plan");
    if (retentionHeadline) { addText(retentionHeadline, { bold: true }); addGap(3); }
    retentionStrategies.forEach(r => {
      checkPageBreak(16);
      addText(r.strategy, { bold: true, color: [67, 56, 202] });
      addText(`Tactic: ${r.tactic}`, { indent: 4 });
      if (r.metric) addText(`Measure: ${r.metric}`, { indent: 4, color: [107, 114, 128] });
      if (r.timeline) addText(`Timeline: ${r.timeline}`, { indent: 4, color: [5, 150, 105] });
      if (r.impact) addText(`Impact: ${r.impact}`, { indent: 4, color: [5, 150, 105] });
      addGap(3);
    });
    addGap(2);
  }

  // Revenue
  if (result.revenueOpportunities?.length) {
    addSectionTitle("Revenue Opportunities");
    result.revenueOpportunities.forEach(r => {
      checkPageBreak(16);
      addText(r.opportunity, { bold: true, color: [67, 56, 202] });
      addText(r.description, { indent: 4 });
      addText(`Effort: ${r.effort}  |  Impact: ${r.impact}`, { indent: 4, color: [107, 114, 128] });
      addGap(3);
    });
    addGap(2);
  }

  // Roadmap
  if (result.priorityRoadmap?.length) {
    addSectionTitle("Priority Roadmap");
    result.priorityRoadmap.forEach(r => {
      checkPageBreak(18);
      // Numbered circle
      doc.setFillColor(r.rank === 1 ? 99 : 229, r.rank === 1 ? 102 : 231, r.rank === 1 ? 241 : 235);
      doc.circle(margin + 3, y - 1.5, 3, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(r.rank === 1 ? 255 : 55, r.rank === 1 ? 255 : 65, r.rank === 1 ? 255 : 81);
      doc.text(String(r.rank), margin + 3, y - 0.2, { align: "center" });
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(9);
      doc.text(r.action, margin + 9, y);
      y += 5.5;
      addText(`Why: ${r.why}`, { indent: 9, color: [75, 85, 99] });
      addText(`Owner: ${r.owner}  |  ${r.timeline}`, { indent: 9, color: [107, 114, 128] });
      addGap(3);
    });
    addGap(2);
  }

  // Footer messages
  if (result.dataRequest) {
    addDivider();
    addText("Next Steps", { bold: true, size: 10 });
    addGap(2);
    addText(result.dataRequest);
    addGap(4);
  }

  if (result.returnMessage) {
    addDivider();
    addText(result.returnMessage, { color: [67, 56, 202] });
  }

  // Footer on each page
 const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("AI Growth Advisor — Confidential", margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  }

  doc.save(`${productName.replace(/\s+/g, "-").toLowerCase()}-growth-strategy.pdf`);
}

// ─── UI Components ────────────────────────────────────────────────────────────

const scoreColor: Record<Score, { bg: string; text: string; dot: string }> = {
  Good: { bg: "#f0fdf4", text: "#166534", dot: "#16a34a" },
  Fair: { bg: "#fffbeb", text: "#92400e", dot: "#d97706" },
  Weak: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
};

function Badge({ label }: { label: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    High: { bg: "#fef2f2", text: "#991b1b" },
    Medium: { bg: "#fffbeb", text: "#92400e" },
    Low: { bg: "#f0fdf4", text: "#166534" },
    Good: { bg: "#f0fdf4", text: "#166534" },
    Fair: { bg: "#fffbeb", text: "#92400e" },
    Weak: { bg: "#fef2f2", text: "#991b1b" },
  };
  const style = map[label] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 99, background: style.bg, color: style.text }}>
      {label}
    </span>
  );
}

function Card({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14,
      padding: "1.5rem", marginBottom: "1rem",
      borderLeft: accent ? `4px solid ${accent}` : "1px solid #e5e7eb"
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 10, margin: "0 0 10px" }}>
      {children}
    </p>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ fontSize: 12, padding: "4px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", cursor: "pointer" }}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ─── Result Renderers ─────────────────────────────────────────────────────────

function ResultNewNoMetrics({ data }: { data: AnalysisResult }) {
  const stageColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    Acquisition: { bg: "#eef2ff", border: "#6366f1", text: "#4338ca", badge: "#6366f1" },
    Activation:  { bg: "#f0fdf4", border: "#10b981", text: "#065f46", badge: "#10b981" },
    Retention:   { bg: "#fffbeb", border: "#f59e0b", text: "#92400e", badge: "#f59e0b" },
    Revenue:     { bg: "#fef2f2", border: "#ef4444", text: "#991b1b", badge: "#ef4444" },
    Referral:    { bg: "#f5f3ff", border: "#8b5cf6", text: "#5b21b6", badge: "#8b5cf6" },
  };

  return (
    <>
      <Card accent="#6366f1">
        <SectionLabel>Strategy Summary</SectionLabel>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#111827" }}>{data.summary}</p>
      </Card>

      {data.trackingBlueprint && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <SectionLabel>Full Tracking Blueprint</SectionLabel>
            <CopyButton text={data.trackingBlueprint.map(s =>
              `[${s.stage}]\n${s.metrics.map((m, i) => `${i+1}. ${m.metric} — ${m.why} | Benchmark: ${m.benchmark}`).join("\n")}`
            ).join("\n\n")} />
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>
            Instrument all of these before your next analysis session — they cover every stage of your growth funnel.
          </p>
          {data.trackingBlueprint.map((stage, si) => {
            const c = stageColors[stage.stage] || stageColors.Acquisition;
            return (
              <div key={si} style={{ marginBottom: 16 }}>
                {/* Stage header */}
                <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ background: c.badge, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99 }}>{stage.stage}</span>
                  </div>
                  <p style={{ fontSize: 12, color: c.text, margin: 0 }}>{stage.stageWhy}</p>
                </div>
                {/* Metrics */}
                <div style={{ display: "grid", gap: 8, paddingLeft: 4 }}>
                  {stage.metrics.map((m, mi) => (
                    <div key={mi} style={{ background: "#f9fafb", borderRadius: 10, padding: "0.875rem", borderLeft: `3px solid ${c.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ width: 20, height: 20, borderRadius: "50%", background: c.badge, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{mi + 1}</span>
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{m.metric}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#4b5563", marginBottom: 3 }}><strong>What it measures:</strong> {m.definition}</p>
                      <p style={{ fontSize: 12, color: "#4b5563", marginBottom: 3 }}><strong>Why it matters:</strong> {m.why}</p>
                      <p style={{ fontSize: 12, color: "#6366f1", marginBottom: 3 }}><strong>How to track:</strong> {m.howToTrack}</p>
                      <p style={{ fontSize: 12, color: "#059669", fontWeight: 500 }}>Benchmark: {m.benchmark}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {data.plan3Months && (
        <Card>
          <SectionLabel>3-Month Tactical Plan</SectionLabel>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14, fontStyle: "italic" }}>Goal: {data.plan3Months.goal}</p>
          {data.plan3Months.weeks.map((w, i) => (
            <div key={i} style={{ borderLeft: "3px solid #6366f1", paddingLeft: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 4 }}>{w.period} <span style={{ color: "#6b7280", fontWeight: 400 }}>— {w.focus}</span></div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {w.actions.map((a, j) => <li key={j} style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>{a}</li>)}
              </ul>
            </div>
          ))}
        </Card>
      )}

      {data.plan6Months?.milestones && (
        <Card>
          <SectionLabel>6-Month Strategic Plan</SectionLabel>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14, fontStyle: "italic" }}>Goal: {data.plan6Months.goal}</p>
          {data.plan6Months.milestones.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 14, background: "#f9fafb", borderRadius: 10, padding: "0.875rem", marginBottom: 8 }}>
              <div style={{ minWidth: 72, fontWeight: 600, fontSize: 13, color: "#6366f1" }}>{m.month}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{m.milestone}</p>
                <p style={{ fontSize: 12, color: "#6b7280" }}>Growth lever: {m.lever}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      {data.returnMessage && (
        <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 12, padding: "1.25rem 1.5rem" }}>
          <p style={{ fontSize: 13, color: "#4338ca", lineHeight: 1.7 }}>💡 {data.returnMessage}</p>
        </div>
      )}
    </>
  );
}

function ResultExistingNoMetrics({ data }: { data: AnalysisResult }) {
  return (
    <>
      <Card accent="#f59e0b">
        <SectionLabel>Consultant Assessment</SectionLabel>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#111827" }}>{data.summary}</p>
      </Card>

      {data.metricsGap && (
        <Card>
          <SectionLabel>What&apos;s Blocked Without Data</SectionLabel>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#92400e", marginBottom: 10 }}>{data.metricsGap.headline}</p>
          <ul style={{ paddingLeft: 16 }}>
            {data.metricsGap.blockedInsights.map((b, i) => (
              <li key={i} style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{b}</li>
            ))}
          </ul>
        </Card>
      )}

      {data.trackingBlueprint && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <SectionLabel>Tracking Blueprint — Start Immediately</SectionLabel>
            <CopyButton text={data.trackingBlueprint.map(s =>
              `[${s.stage}]\n${s.metrics.map((m, i) => `${i+1}. ${m.metric} — ${m.why} | Benchmark: ${m.benchmark}`).join("\n")}`
            ).join("\n\n")} />
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>
            Your product is live but flying blind. Every day without these metrics is a missed opportunity to improve.
          </p>
          {(() => {
            const stageColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
              Acquisition: { bg: "#eef2ff", border: "#6366f1", text: "#4338ca", badge: "#6366f1" },
              Activation:  { bg: "#f0fdf4", border: "#10b981", text: "#065f46", badge: "#10b981" },
              Retention:   { bg: "#fffbeb", border: "#f59e0b", text: "#92400e", badge: "#f59e0b" },
              Revenue:     { bg: "#fef2f2", border: "#ef4444", text: "#991b1b", badge: "#ef4444" },
              Referral:    { bg: "#f5f3ff", border: "#8b5cf6", text: "#5b21b6", badge: "#8b5cf6" },
            };
            return data.trackingBlueprint!.map((stage, si) => {
              const c = stageColors[stage.stage] || stageColors.Acquisition;
              return (
                <div key={si} style={{ marginBottom: 16 }}>
                  <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ background: c.badge, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99 }}>{stage.stage}</span>
                    </div>
                    <p style={{ fontSize: 12, color: c.text, margin: 0 }}>{stage.stageWhy}</p>
                  </div>
                  <div style={{ display: "grid", gap: 8, paddingLeft: 4 }}>
                    {stage.metrics.map((m, mi) => (
                      <div key={mi} style={{ background: "#f9fafb", borderRadius: 10, padding: "0.875rem", borderLeft: `3px solid ${c.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ width: 20, height: 20, borderRadius: "50%", background: c.badge, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{mi + 1}</span>
                          <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{m.metric}</span>
                        </div>
                        <p style={{ fontSize: 12, color: "#4b5563", marginBottom: 3 }}><strong>What it measures:</strong> {m.definition}</p>
                        <p style={{ fontSize: 12, color: "#4b5563", marginBottom: 3 }}><strong>Why it matters:</strong> {m.why}</p>
                        <p style={{ fontSize: 12, color: "#6366f1", marginBottom: 3 }}><strong>How to track:</strong> {m.howToTrack}</p>
                        <p style={{ fontSize: 12, color: "#059669", fontWeight: 500 }}>Benchmark: {m.benchmark}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </Card>
      )}

      {data.plan6Months?.phases && (
        <Card>
          <SectionLabel>6-Month Growth Plan</SectionLabel>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14, fontStyle: "italic" }}>Goal: {data.plan6Months.goal}</p>
          {data.plan6Months.phases.map((p, i) => (
            <div key={i} style={{ borderLeft: "3px solid #f59e0b", paddingLeft: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 2 }}>{p.phase}: {p.theme}</div>
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{p.focus}</p>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {p.actions.map((a, j) => <li key={j} style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>{a}</li>)}
              </ul>
            </div>
          ))}
        </Card>
      )}

      {Array.isArray(data.retentionPlan) && (data.retentionPlan as RetentionStrategy[]).length > 0 && (
        <Card>
          <SectionLabel>Retention Strategies</SectionLabel>
          {(data.retentionPlan as RetentionStrategy[]).map((r, i) => (
            <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "0.875rem", marginBottom: 8 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 4 }}>{r.strategy}</p>
              <p style={{ fontSize: 13, color: "#4b5563" }}>{r.tactic}</p>
              {r.impact && <p style={{ fontSize: 12, color: "#059669", marginTop: 4 }}>Impact: {r.impact}</p>}
            </div>
          ))}
        </Card>
      )}

      {data.dataRequest && (
        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, padding: "1.25rem 1.5rem" }}>
          <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.7 }}>📊 {data.dataRequest}</p>
        </div>
      )}
    </>
  );
}

function ResultExistingWithMetrics({ data }: { data: AnalysisResult }) {
  const retentionIsArray = Array.isArray(data.retentionPlan);
  const retentionStrategies: RetentionStrategy[] = retentionIsArray
    ? (data.retentionPlan as RetentionStrategy[])
    : (data.retentionPlan as { strategies?: RetentionStrategy[] })?.strategies || [];
  const retentionHeadline = !retentionIsArray
    ? (data.retentionPlan as { headline?: string })?.headline
    : undefined;

  return (
    <>
      <Card accent="#10b981">
        <SectionLabel>Executive Summary</SectionLabel>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#111827" }}>{data.summary}</p>
      </Card>

      {data.metrics && (
        <Card>
          <SectionLabel>Metrics Health Check</SectionLabel>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>{data.metrics.headline}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {data.metrics.scores.map((s, i) => {
              const c = scoreColor[s.score as Score] || scoreColor.Fair;
              return (
                <div key={i} style={{ background: c.bg, borderRadius: 10, padding: "0.875rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{s.label}</span>
                    <Badge label={s.score} />
                  </div>
                  <p style={{ fontSize: 12, color: "#4b5563" }}>{s.note}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {data.funnelAnalysis && (
        <Card>
          <SectionLabel>Funnel Analysis</SectionLabel>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 14 }}>{data.funnelAnalysis.headline}</p>
          {data.funnelAnalysis.stages.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: 12, background: "#f9fafb", borderRadius: 10, padding: "0.875rem", marginBottom: 8, alignItems: "start" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", margin: 0 }}>{s.stage}</p>
                <span style={{ fontSize: 11, color: "#6b7280" }}>{s.status}</span>
              </div>
              <p style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5, margin: 0 }}>{s.insight}</p>
              <p style={{ fontSize: 12, color: "#059669", lineHeight: 1.5, margin: 0 }}>→ {s.action}</p>
            </div>
          ))}
        </Card>
      )}

      {data.growthStrategy && (
        <Card>
          <SectionLabel>Growth Strategy</SectionLabel>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 14 }}>{data.growthStrategy.headline}</p>
          {data.growthStrategy.channels.map((c, i) => (
            <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "0.875rem", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{c.channel}</span>
                <Badge label={c.priority} />
              </div>
              <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 4 }}>{c.rationale}</p>
              <p style={{ fontSize: 13, color: "#6366f1", fontWeight: 500 }}>First step: {c.tactic}</p>
            </div>
          ))}
        </Card>
      )}

      {retentionStrategies.length > 0 && (
        <Card>
          <SectionLabel>Retention Plan</SectionLabel>
          {retentionHeadline && <p style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 14 }}>{retentionHeadline}</p>}
          {retentionStrategies.map((r, i) => (
            <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "0.875rem", marginBottom: 8 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 4 }}>{r.strategy}</p>
              <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 4 }}>{r.tactic}</p>
              <div style={{ display: "flex", gap: 12 }}>
                {r.metric && <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Measure: {r.metric}</p>}
                {r.timeline && <p style={{ fontSize: 12, color: "#059669", margin: 0 }}>Timeline: {r.timeline}</p>}
              </div>
            </div>
          ))}
        </Card>
      )}

      {data.revenueOpportunities && (
        <Card>
          <SectionLabel>Revenue Opportunities</SectionLabel>
          {data.revenueOpportunities.map((r, i) => (
            <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "0.875rem", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{r.opportunity}</span>
                <Badge label={r.impact} />
              </div>
              <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 6 }}>{r.description}</p>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Effort: <strong>{r.effort}</strong></span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Impact: <strong>{r.impact}</strong></span>
              </div>
            </div>
          ))}
        </Card>
      )}

      {data.priorityRoadmap && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <SectionLabel>Priority Roadmap</SectionLabel>
            <CopyButton text={data.priorityRoadmap.map(r => `${r.rank}. ${r.action} — ${r.why} (${r.timeline})`).join("\n")} />
          </div>
          {data.priorityRoadmap.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 14, background: "#f9fafb", borderRadius: 10, padding: "0.875rem", marginBottom: 8, alignItems: "start" }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "#6366f1" : "#e5e7eb", color: i === 0 ? "#fff" : "#374151", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.rank}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 2 }}>{r.action}</p>
                <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 4 }}>{r.why}</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Owner: {r.owner}</span>
                  <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 500 }}>{r.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PREMIUM_PROVIDERS = ["openai", "claude"];

export default function Home() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState("");
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const [stage, setStage] = useState("early");
  const [monthlyUsers, setMonthlyUsers] = useState("");
  const [monthlySignups, setMonthlySignups] = useState("");
  const [activationRate, setActivationRate] = useState("");
  const [retentionRate, setRetentionRate] = useState("");
  const [revenue, setRevenue] = useState("");
  const [provider, setProvider] = useState("groq");
  const [premiumPassword, setPremiumPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const isPremium = PREMIUM_PROVIDERS.includes(provider);
  const canSubmit = productName.trim() && description.trim() && users.trim() && isNew !== null &&
    (!isPremium || premiumPassword.trim());

  const handleProviderChange = (val: string) => {
    setProvider(val);
    setShowPasswordField(PREMIUM_PROVIDERS.includes(val));
    if (!PREMIUM_PROVIDERS.includes(val)) setPremiumPassword("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName, description, users, isNew, stage,
          monthlyUsers, monthlySignups, activationRate, retentionRate, revenue,
          provider, premiumPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 403 || data.error === "premium_locked") {
        setError("Incorrect password for premium AI engine. Please check your password and try again.");
      } else if (response.status === 429 || data.error === "daily_limit_exceeded") {
        setError("Daily premium limit exceeded. Please try again tomorrow.");
      } else if (data.error) {
        setError("Something went wrong generating your strategy. Try a different AI engine or try again.");
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Failed to connect. Please try again.");
    }

    setLoading(false);
  };

  const handleExportPDF = async () => {
    if (!result) return;
    setExporting(true);
    try {
      await exportToPDF(result, productName);
    } catch (e) {
      console.error(e);
      setError("PDF export failed. Please try again.");
    }
    setExporting(false);
  };

  const handleCopyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(buildReportText(result, productName));
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 16 }}>📈</span>
        </div>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>AI Growth Advisor</h1>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Consultant-grade strategy, powered by AI</p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Intake Form */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "1.75rem", marginBottom: "1.5rem" }}>

          {/* New / Existing Toggle */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 10 }}>
              Is this a new or existing product?
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { val: true, label: "🚀 New Product", sub: "Pre-launch or under 3 months" },
                { val: false, label: "📊 Existing Product", sub: "Already live with users" }
              ].map(opt => (
                <button key={String(opt.val)} onClick={() => setIsNew(opt.val)} style={{
                  flex: 1, padding: "0.875rem", borderRadius: 12, cursor: "pointer", textAlign: "left",
                  border: isNew === opt.val ? "2px solid #6366f1" : "1.5px solid #e5e7eb",
                  background: isNew === opt.val ? "#eef2ff" : "#fff", transition: "all 0.15s"
                }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: isNew === opt.val ? "#4338ca" : "#111827", margin: 0 }}>{opt.label}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Stage selector */}
          {isNew === false && (
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 8 }}>Product Stage</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ val: "early", label: "Early (0–6 mo)" }, { val: "growth", label: "Growth (6–18 mo)" }, { val: "scaling", label: "Scaling (18 mo+)" }].map(s => (
                  <button key={s.val} onClick={() => setStage(s.val)} style={{
                    padding: "6px 14px", borderRadius: 99, fontSize: 13, cursor: "pointer",
                    border: stage === s.val ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
                    background: stage === s.val ? "#eef2ff" : "#fff",
                    color: stage === s.val ? "#4338ca" : "#6b7280", fontWeight: stage === s.val ? 600 : 400
                  }}>{s.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Core fields */}
          <div style={{ display: "grid", gap: 14, marginBottom: "1.25rem" }}>
            {[
              { label: "Product Name *", placeholder: "e.g. Fintech Dashboard SaaS", val: productName, set: setProductName, multi: false },
              { label: "Product Description *", placeholder: "What does your product do? What problem does it solve?", val: description, set: setDescription, multi: true },
              { label: "Target Audience *", placeholder: "e.g. SME business owners in West Africa", val: users, set: setUsers, multi: false },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>{f.label}</label>
                {f.multi
                  ? <textarea placeholder={f.placeholder} style={{ width: "100%", fontSize: 15, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, minHeight: 90, resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} value={f.val} onChange={e => f.set(e.target.value)} />
                  : <input placeholder={f.placeholder} style={{ width: "100%", fontSize: 15, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, outline: "none", boxSizing: "border-box" }} value={f.val} onChange={e => f.set(e.target.value)} />
                }
              </div>
            ))}
          </div>

          {/* Metrics (existing only) */}
          {isNew === false && (
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 4 }}>
                Current Metrics <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional but recommended)</span>
              </label>
              <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>More data = more precise advice. Leave blank for general strategic guidance.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Monthly Active Users", placeholder: "e.g. 2500", val: monthlyUsers, set: setMonthlyUsers },
                  { label: "Monthly Signups", placeholder: "e.g. 300", val: monthlySignups, set: setMonthlySignups },
                  { label: "Activation Rate (%)", placeholder: "e.g. 42", val: activationRate, set: setActivationRate },
                  { label: "Retention Rate (%)", placeholder: "e.g. 35", val: retentionRate, set: setRetentionRate },
                  { label: "Monthly Revenue ($)", placeholder: "e.g. 8000", val: revenue, set: setRevenue },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: "block", fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>{f.label}</label>
                    <input placeholder={f.placeholder} style={{ width: "100%", fontSize: 14, padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, outline: "none", boxSizing: "border-box" }} value={f.val} onChange={e => f.set(e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Engine */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>AI Engine</label>
            <select style={{ width: "100%", fontSize: 14, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, outline: "none", background: "#fff" }} value={provider} onChange={e => handleProviderChange(e.target.value)}>
              <option value="groq">Groq — Fast &amp; Free (LLaMA 3.3 70B)</option>
              <option value="openrouter">OpenRouter — Free Models</option>
              <option value="openai">OpenAI — GPT-4o Mini 🔒</option>
              <option value="claude">Claude — Sonnet (Best quality) 🔒</option>
            </select>
          </div>

          {/* Premium password */}
          {showPasswordField && (
            <div style={{ marginBottom: "1.25rem", background: "#fafafa", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>🔒</span>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Premium Access Password</label>
              </div>
              <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>This AI engine requires a password. Enter it below to continue.</p>
              <input
                type="password"
                placeholder="Enter password"
                style={{ width: "100%", fontSize: 14, padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, outline: "none", boxSizing: "border-box" }}
                value={premiumPassword}
                onChange={e => setPremiumPassword(e.target.value)}
              />
            </div>
          )}

          <button onClick={handleSubmit} disabled={!canSubmit || loading} style={{
            width: "100%", padding: "13px", fontSize: 15, fontWeight: 600,
            background: canSubmit && !loading ? "#6366f1" : "#d1d5db",
            color: "#fff", border: "none", borderRadius: 10,
            cursor: canSubmit && !loading ? "pointer" : "not-allowed", transition: "background 0.15s"
          }}>
            {loading ? "Generating your strategy..." : "Generate Growth Strategy →"}
          </button>

          {!canSubmit && !loading && (
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8, textAlign: "center" }}>
              {isPremium && !premiumPassword.trim()
                ? "Enter your premium password to use this AI engine"
                : "Fill in the required fields and select new or existing product to continue"}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #e5e7eb", borderTop: "3px solid #6366f1", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontSize: 14, color: "#6b7280" }}>Analyzing your product with a consultant lens...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem" }}>
            <p style={{ fontSize: 14, color: "#991b1b", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Export bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Growth Strategy Report</p>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>{productName}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleCopyAll} style={{ fontSize: 13, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer" }}>
                  Copy Report
                </button>
                <button onClick={handleExportPDF} disabled={exporting} style={{ fontSize: 13, padding: "7px 16px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", cursor: exporting ? "not-allowed" : "pointer", fontWeight: 500, opacity: exporting ? 0.7 : 1 }}>
                  {exporting ? "Generating PDF..." : "Download Report ↓"}
                </button>
              </div>
            </div>

            {result.state === "new_no_metrics" && <ResultNewNoMetrics data={result} />}
            {result.state === "existing_no_metrics" && <ResultExistingNoMetrics data={result} />}
            {result.state === "existing_with_metrics" && <ResultExistingWithMetrics data={result} />}

            {/* Refine prompts */}
            <div style={{ marginTop: "1.5rem", padding: "1.25rem 1.5rem", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 10 }}>Refine your strategy →</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Focus only on retention", "Give me a paid acquisition plan", "What should I do in the first 30 days?", "How do I improve activation?"].map(q => (
                  <button key={q} onClick={() => { setDescription(d => d + `\n\nFollow-up focus: ${q}`); setTimeout(handleSubmit, 100); }}
                    style={{ fontSize: 13, padding: "7px 14px", borderRadius: 99, border: "1.5px solid #c7d2fe", background: "#eef2ff", color: "#4338ca", cursor: "pointer" }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
