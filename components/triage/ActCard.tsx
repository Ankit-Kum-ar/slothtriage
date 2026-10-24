"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle } from "lucide-react";
import { ActItem } from "@/lib/ai-engine";

export default function ActCard({ item }: { item: ActItem }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!item.suggestedReply) return;
    navigator.clipboard.writeText(item.suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
      <CardHeader className="py-2.5 px-4 flex flex-row items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground">{item.sender}</span>
        </div>
        <Badge
          className="text-[10px] uppercase font-semibold tracking-wider"
          variant={item.urgency === "high" ? "destructive" : "secondary"}
        >
          {item.urgency} priority
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{item.context}</p>

        <div className="p-3 bg-secondary/50 rounded-lg border border-border space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-primary font-bold flex items-center justify-between">
            <span>Pre-Drafted Reply</span>
            <span className="text-[9px] text-muted-foreground font-normal">Ready to send</span>
          </div>
          <p className="text-xs text-foreground italic leading-relaxed">
            "{item.suggestedReply}"
          </p>
        </div>

        <Button
          className="w-full min-h-[38px] text-xs border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center justify-center gap-1.5 cursor-pointer rounded-md font-medium"
          onClick={handleCopy}
          variant="outline"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span>{copied ? "Copied to Clipboard!" : "Copy Suggested Reply"}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
