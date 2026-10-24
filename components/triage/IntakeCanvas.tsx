"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Coffee, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

interface IntakeCanvasProps {
  onTriage: (payload: { rawText: string; sourceType: string }) => void;
  loading: boolean;
}

const PRESETS = [
  {
    label: "🚨 Staging Webhook Outage",
    source: "Slack Thread",
    text: `[10:14 AM] Alex (DevOps): @here Urgent: Staging stripe webhook secret expired after the cert rotation. All test checkouts are throwing 500 errors. Can someone approve rotating the secret in Doppler and redeploying the staging worker?
[10:16 AM] Sam: I'm in a client call right now, can someone on backend check?
[10:18 AM] Priya: Also FYI AWS sent a notification regarding scheduled maintenance on RDS eu-west-1 next Sunday at 03:00 UTC. No downtime expected.
[10:20 AM] Jordan: Who wants to grab tacos for lunch from that new food truck outside?
[10:21 AM] Maya: Me! Count me in for two carnitas tacos 🌮`
  },
  {
    label: "📧 S3 Pricing & Security Digest",
    source: "Email Digest",
    text: `From: Cloud Infrastructure Updates <alerts@cloudprovider.com>
Subject: Scheduled Q4 S3 Pricing Updates & Maintenance
Summary: AWS Cloud has published updated tiering pricing for S3 Infrequent Access. Rates will shift by 2% next billing cycle. No immediate configuration change is required.

From: VP of Engineering <lead@company.com>
Subject: Action Required: Review Q3 SOC2 Access Log Policy
Please review the attached updated access control policy and sign off by end of day Friday so we can submit compliance records.

From: Social Committee <fun@company.com>
Subject: Friday Trivia Night signup!
Join us this Friday at 5 PM for developer trivia! Drinks and snacks provided.`
  }
];

export default function IntakeCanvas({ onTriage, loading }: IntakeCanvasProps) {
  const [text, setText] = useState("");
  const [sourceType, setSourceType] = useState("Slack Thread");

  const sources = [
    "Slack Thread",
    "Email Digest",
    "Discord / Chat",
    "GitHub Issues"
  ];

  function handleSubmit() {
    if (!text.trim() || loading || text.trim().length < 20) return;
    onTriage({ rawText: text, sourceType });
  }

  function loadPreset(preset: typeof PRESETS[0]) {
    setText(preset.text);
    setSourceType(preset.source);
  }

  return (
    <div className="space-y-3.5 w-full">
      {/* Channel Selectors: 2x2 grid on mobile, 4-col on desktop */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
          Select Source Channel
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
          {sources.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSourceType(s)}
              className={`text-xs px-2.5 py-2 rounded-lg border transition-all cursor-pointer font-medium min-h-[38px] flex items-center justify-center text-center leading-tight ${
                sourceType === s
                  ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                  : "bg-secondary/70 text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Sample Presets */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <Sparkles className="h-3 w-3 text-primary shrink-0" />
          <span>Quick Sample Presets</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p)}
              className="text-xs px-3 py-2 min-h-[36px] rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/40 text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5 font-medium shadow-xs text-left"
            >
              <span className="truncate">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Textarea */}
      <div className="space-y-1 pt-1">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Drop your unread Slack threads, email backlogs, or noisy chat dumps here... SlothTriage will automatically sort into Act, Park, & Compost and pre-draft your replies."
          className="w-full min-h-[170px] bg-secondary/30 border-border text-foreground font-mono text-xs sm:text-sm focus-visible:ring-primary focus-visible:border-primary resize-y leading-relaxed p-3.5 rounded-lg shadow-xs"
        />

        <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1 pt-0.5">
          <span>
            {text.trim()
              ? `${text.trim().split(/\s+/).length} words entered`
              : "Minimum 20 characters required"}
          </span>
          {text && (
            <button
              type="button"
              onClick={() => setText("")}
              className="hover:text-destructive transition-colors cursor-pointer py-1 font-medium"
            >
              Clear text
            </button>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 h-12 shadow-md cursor-pointer disabled:opacity-50 text-sm font-semibold rounded-lg"
        disabled={loading || text.trim().length < 20}
        onClick={handleSubmit}
      >
        {loading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
            <span className="truncate">Analyzing backlog & drafting replies...</span>
          </>
        ) : (
          <>
            <Coffee className="h-4 w-4 shrink-0" />
            <span>Perform Sloth Triage</span>
            <ArrowRight className="h-4 w-4 ml-1 shrink-0" />
          </>
        )}
      </Button>
    </div>
  );
}
