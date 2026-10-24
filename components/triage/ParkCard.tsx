import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { ParkItem } from "@/lib/ai-engine";

export default function ParkCard({ item }: { item: ParkItem }) {
  return (
    <Card className="bg-card border-border shadow-xs hover:border-border/80 transition-colors">
      <CardContent className="p-3.5 sm:p-4 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Bookmark className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{item.subject || item.sender}</span>
          </div>
          <div className="flex gap-1 flex-wrap justify-end">
            {(item.tags || []).map((tag, idx) => (
              <Badge
                className="text-[9px] px-1.5 py-0 border-border text-muted-foreground bg-secondary/60"
                key={idx}
                variant="outline"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed pl-5">
          {item.summary}
        </p>
      </CardContent>
    </Card>
  );
}
