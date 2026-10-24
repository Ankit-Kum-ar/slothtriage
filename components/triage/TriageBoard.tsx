"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bookmark, Trash2 } from "lucide-react";
import ActCard from "@/components/triage/ActCard";
import ParkCard from "@/components/triage/ParkCard";
import CompostList from "@/components/triage/CompostList";
import { ActItem, ParkItem, CompostItem } from "@/lib/ai-engine";

interface TriageBoardProps {
  buckets?: {
    act?: ActItem[];
    park?: ParkItem[];
    compost?: CompostItem[];
  };
}

export default function TriageBoard({ buckets }: TriageBoardProps) {
  if (!buckets) return null;

  const actCount = buckets.act?.length || 0;
  const parkCount = buckets.park?.length || 0;
  const compostCount = buckets.compost?.length || 0;

  return (
    <div className="space-y-4">
      <Tabs defaultValue="act" className="w-full">
        <TabsList className="grid grid-cols-3 w-full h-11 bg-secondary/80 p-1 rounded-lg border border-border">
          <TabsTrigger
            value="act"
            className="flex items-center justify-center gap-2 cursor-pointer font-semibold text-xs data-active:bg-card data-active:text-foreground data-active:shadow-xs rounded-md"
          >
            <AlertCircle className="h-3.5 w-3.5 text-primary" />
            <span>Act</span>
            <Badge
              variant="default"
              className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground font-bold rounded-full"
            >
              {actCount}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="park"
            className="flex items-center justify-center gap-2 cursor-pointer font-semibold text-xs data-active:bg-card data-active:text-foreground data-active:shadow-xs rounded-md"
          >
            <Bookmark className="h-3.5 w-3.5 text-primary" />
            <span>Park</span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 bg-muted text-foreground font-medium rounded-full"
            >
              {parkCount}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="compost"
            className="flex items-center justify-center gap-2 cursor-pointer font-semibold text-xs data-active:bg-card data-active:text-foreground data-active:shadow-xs rounded-md"
          >
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Compost</span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 text-muted-foreground font-medium rounded-full"
            >
              {compostCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="act" className="mt-4 space-y-3">
          {actCount === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg space-y-1">
              <div className="text-base">🎉</div>
              <div className="font-semibold text-foreground">Zero Action Items</div>
              <p>No critical human decisions required in this backlog.</p>
            </div>
          ) : (
            buckets.act!.map((item, idx) => (
              <ActCard item={item} key={item.id || idx} />
            ))
          )}
        </TabsContent>

        <TabsContent value="park" className="mt-4 space-y-3">
          {parkCount === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg space-y-1">
              <div className="font-semibold text-foreground">Nothing to Park</div>
              <p>No low-urgency informational items were found.</p>
            </div>
          ) : (
            buckets.park!.map((item, idx) => (
              <ParkCard item={item} key={item.id || idx} />
            ))
          )}
        </TabsContent>

        <TabsContent value="compost" className="mt-4">
          <CompostList items={buckets.compost} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
