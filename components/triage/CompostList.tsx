import { Trash2 } from "lucide-react";
import { CompostItem } from "@/lib/ai-engine";

export default function CompostList({ items }: { items?: CompostItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-xs text-muted-foreground py-6 text-center bg-card border border-border rounded-lg">
        No non-actionable chatter was filtered in this batch.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-[11px] text-muted-foreground px-1 pb-1">
        Discarded items pruned from your cognitive buffer:
      </div>
      {items.map((c, idx) => (
        <div
          key={c.id || idx}
          className="p-3 rounded-lg bg-secondary/30 border border-border flex items-start gap-2.5 text-xs hover:bg-secondary/40 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-muted-foreground/80 line-through leading-relaxed">
              "{c.snippet}"
            </span>
            <div className="text-[10px] text-muted-foreground/70 flex items-center gap-1 mt-1">
              <span className="font-medium text-destructive/80">Pruned:</span>
              <span>{c.reason}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
