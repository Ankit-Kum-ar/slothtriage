import { Clock, ShieldAlert, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface Metrics {
  timeSavedMinutes: number;
  rawWordCount: number;
  compressedWordCount: number;
  reductionRatio: number;
}

interface LazyPayoffCardProps {
  metrics?: Metrics;
  executiveSummary?: string;
}

export default function LazyPayoffCard({
  metrics,
  executiveSummary
}: LazyPayoffCardProps) {
  if (!metrics) return null;

  return (
    <Card className="bg-card border-border shadow-md">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          <div className="bg-secondary/60 p-2.5 sm:p-3.5 rounded-lg border border-border">
            <div className="text-[11px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1 font-medium">
              <Clock className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate">Time Saved</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-primary mt-1">
              ~{metrics.timeSavedMinutes}m
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground block truncate">Reading + Drafting</span>
          </div>

          <div className="bg-secondary/60 p-2.5 sm:p-3.5 rounded-lg border border-border">
            <div className="text-[11px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1 font-medium">
              <ShieldAlert className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="truncate">Avoided</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-foreground mt-1">
              {Math.max(0, metrics.rawWordCount - metrics.compressedWordCount)}
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground block truncate">Words Cut</span>
          </div>

          <div className="bg-secondary/60 p-2.5 sm:p-3.5 rounded-lg border border-border">
            <div className="text-[11px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1 font-medium">
              <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
              <span className="truncate">Noise Cut</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-foreground mt-1">
              {Math.round((metrics.reductionRatio || 0) * 100)}%
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground block truncate">Density</span>
          </div>
        </div>

        {executiveSummary && (
          <div className="p-3.5 bg-secondary/40 rounded-lg border border-border text-xs text-foreground/90 leading-relaxed">
            <span className="font-semibold text-primary mr-1">Executive Summary:</span>
            {executiveSummary}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
