"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import Header from "@/components/triage/Header";
import IntakeCanvas from "@/components/triage/IntakeCanvas";
import LazyPayoffCard from "@/components/triage/LazyPayoffCard";
import TriageBoard from "@/components/triage/TriageBoard";
import { ActItem, ParkItem, CompostItem } from "@/lib/ai-engine";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

interface SessionData {
  _id?: string;
  sourceType: string;
  rawWordCount: number;
  compressedWordCount: number;
  reductionRatio: number;
  timeSavedMinutes: number;
  executiveSummary: string;
  buckets: {
    act: ActItem[];
    park: ParkItem[];
    compost: CompostItem[];
  };
  createdAt?: string | Date;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ensure fresh page visits start scrolled at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handleReset() {
    setSessionData(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleTriage({
    rawText,
    sourceType
  }: {
    rawText: string;
    sourceType: string;
  }) {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, sourceType })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSessionData(json.data);
        // Trigger celebratory confetti
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });

        // Smoothly scroll down to the newly generated results
        setTimeout(() => {
          const resultsEl = document.getElementById("triage-results");
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      } else {
        setErrorMessage(json.error || "Triage processing failed. Please try again.");
      }
    } catch (err) {
      console.error("Triage failed:", err);
      setErrorMessage("Error executing Sloth Triage. Check network connectivity.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center py-5 sm:py-8 px-3.5 sm:px-6 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-3xl space-y-5 sm:space-y-6">
        <Header />

        {/* Intake Canvas */}
        <IntakeCanvas loading={loading} onTriage={handleTriage} />

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold underline cursor-pointer ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Triage Session Output */}
        {sessionData && (
          <div
            id="triage-results"
            className="space-y-5 sm:space-y-6 animate-in fade-in-50 duration-300 pt-2"
          >
            {/* Status & Reset Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 sm:py-2.5 sm:px-4 rounded-lg text-xs font-medium gap-2.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Session automatically archived and indexed.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded bg-background hover:bg-secondary border border-border text-foreground text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <RotateCcw className="h-3 w-3 text-muted-foreground" />
                  <span>Start New Triage</span>
                </button>

                <Link
                  href="/archive"
                  className="hover:underline flex items-center gap-1 font-semibold text-xs shrink-0"
                >
                  <span>View in Archive</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <LazyPayoffCard
              executiveSummary={sessionData.executiveSummary}
              metrics={{
                timeSavedMinutes: sessionData.timeSavedMinutes,
                rawWordCount: sessionData.rawWordCount,
                compressedWordCount: sessionData.compressedWordCount,
                reductionRatio: sessionData.reductionRatio
              }}
            />

            <TriageBoard buckets={sessionData.buckets} />

            {/* Bottom Reset Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Clear Output & Start New Triage</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
