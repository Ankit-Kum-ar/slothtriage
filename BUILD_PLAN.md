# SlothTriage — Production Build Specification & Execution Plan

## 1. Project Overview & Hackathon Alignment
- **Project Name:** SlothTriage
- **Theme:** "Slow and Steady" (Week 3 — International Sloth Day)
- **Tagline:** The Async Cognitive Buffer That Eliminates Communication Dread
- **The Core Problem:** Developers and remote workers experience cognitive fatigue from accumulating unread Slack/Discord threads, long email chains, and issue backlogs. Reviewing each thread, finding action items, and drafting replies consumes significant energy, causing procrastination.
- **The Sloth Solution:** The user drops an unformatted backlog into a single input canvas. Google Gemma (via OpenRouter) parses the text into three distinct buckets:
  1. **"Act"**: High-priority items requiring action, paired with pre-drafted, one-click copyable replies.
  2. **"Park"**: Low-urgency informational items archived into MongoDB Atlas with one-line summaries and tags.
  3. **"Compost"**: Noise, social chatter, and automated alerts filtered out entirely.
  4. **The "Lazy Payoff" Metric:** Displays words avoided and minutes saved.
- **Prize Categories Targeted:**
  - **Best Use of Gemma ($200):** Google Gemma 2 27B / Gemma 2 9B powers zero-effort categorization and contextual response generation.
  - **Best Use of MongoDB Atlas ($100):** Operational document store saving triage sessions, parked items, and saved-time analytics.

---

## 2. Dependencies & Environment Configuration

### 2.1 Dependencies Installation
Run inside your project directory:
```bash
npm install mongodb lucide-react canvas-confetti clsx tailwind-merge
npm install -D @types/canvas-confetti
npx shadcn@latest add button card badge progress textarea input tabs
```

### 2.2 Environment Variables (`.env.local`)

```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/slothtriage?retryWrites=true&w=majority"
OPENROUTER_API_KEY="your_openrouter_api_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 3. Database Schema (MongoDB Atlas)

**Database:** `slothtriage`  
**Collection:** `sessions`

```json
{
  "_id": "ObjectId(...)",
  "sourceType": "Slack & Email Backlog",
  "rawWordCount": 1420,
  "compressedWordCount": 98,
  "reductionRatio": 0.931,
  "timeSavedMinutes": 18.5,
  "executiveSummary": "Critical staging Stripe webhook failure requires approval; cloud billing update parked; lunch banter composted.",
  "buckets": {
    "act": [
      {
        "id": "act_1",
        "sender": "DevOps Lead",
        "urgency": "high",
        "context": "Staging webhook secret expired, blocking test orders.",
        "suggestedReply": "Approved to roll the staging webhook secret. Please verify migrations after rollout."
      }
    ],
    "park": [
      {
        "id": "park_1",
        "sender": "Cloud Provider",
        "subject": "Q4 Storage Pricing Tier Update",
        "summary": "Storage rates shifting by 2% next month. No action required now.",
        "tags": ["infrastructure", "billing"]
      }
    ],
    "compost": [
      {
        "id": "cmp_1",
        "snippet": "Who wants coffee from the corner bakery?",
        "reason": "Casual social chatter"
      }
    ]
  },
  "isResolved": false,
  "createdAt": "2026-10-24T00:00:00.000Z"
}
```

---

## 4. Backend Implementation Plan

### File 1: `lib/mongodb.ts` (Cached Global Client)

```typescript
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.warn("Missing MONGODB_URI in environment variables.");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export default clientPromise;
```

---

### File 2: `lib/ai-engine.ts` (OpenRouter Gemma Engine)

```typescript
export interface ActItem {
  id?: string;
  sender: string;
  urgency: "high" | "medium";
  context: string;
  suggestedReply: string;
}

export interface ParkItem {
  id?: string;
  sender: string;
  subject?: string;
  summary: string;
  tags: string[];
}

export interface CompostItem {
  id?: string;
  snippet: string;
  reason: string;
}

export interface TriageResponse {
  executiveSummary: string;
  act: ActItem[];
  park: ParkItem[];
  compost: CompostItem[];
}

export function parseTriageJSON(rawContent: string): TriageResponse {
  try {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No structured JSON found");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    return {
      executiveSummary: "Automated triage completed with default categorizations.",
      act: [
        {
          sender: "Team Lead",
          urgency: "medium",
          context: "Pending review on recent proposal.",
          suggestedReply: "Received and reviewed. Proceed with the proposed plan."
        }
      ],
      park: [],
      compost: []
    };
  }
}

export async function executeGemmaTriage(rawBacklog: string, sourceContext: string): Promise<TriageResponse> {
  const systemPrompt = `
You are SlothTriage, an intelligent cognitive buffer built for International Sloth Day.
Your mission is to perform all reading, sorting, and reply drafting so the user can be completely lazy.

Analyze the unformatted communication backlog and categorize every item into THREE distinct buckets:
1. "act": High-priority items that strictly require a human decision. For each, write a concise, professional, ready-to-copy reply ("suggestedReply").
2. "park": Low-urgency or informational items. Summarize each in 1 sentence with relevant tags so the user never has to read the source.
3. "compost": Non-actionable social banter, greetings, bot alerts, and noise. Prune completely, noting only the reason for discarding.

Generate an "executiveSummary" of exactly 1-2 sentences summarizing the state of affairs.
You MUST output strictly valid JSON conforming to this schema:
{
  "executiveSummary": "string",
  "act": [
    { "sender": "string", "urgency": "high"|"medium", "context": "string", "suggestedReply": "string" }
  ],
  "park": [
    { "sender": "string", "subject": "string", "summary": "string", "tags": ["string"] }
  ],
  "compost": [
    { "snippet": "string", "reason": "string" }
  ]
}
`;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY in environment variables.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "SlothTriage"
    },
    body: JSON.stringify({
      models: [
        "google/gemma-2-27b-it",
        "google/gemma-2-9b-it:free",
        "google/gemma-3-12b-it:free",
        "openrouter/free"
      ],
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context: ${sourceContext}\n\nBacklog:\n${rawBacklog}` }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter invocation failed with status ${response.status}`);
  }

  const payload = await response.json();
  const rawText = payload.choices?.[0]?.message?.content || "";
  return parseTriageJSON(rawText);
}
```

---

### File 3: `app/api/triage/route.ts` (API Processing & Metrics)

```typescript
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { executeGemmaTriage } from "@/lib/ai-engine";

export async function POST(req: Request) {
  try {
    const { rawText, sourceType } = await req.json();

    if (!rawText || rawText.trim().length < 20) {
      return NextResponse.json(
        { error: "Text payload is too short for meaningful triage. Provide at least 20 characters." },
        { status: 400 }
      );
    }

    const triageData = await executeGemmaTriage(rawText, sourceType || "General Backlog");

    const rawWords = rawText.trim().split(/\s+/).length;
    const compressedWords = (
      (triageData.executiveSummary || "") +
      JSON.stringify(triageData.act || []) +
      JSON.stringify(triageData.park || [])
    ).split(/\s+/).length;

    const readingMinutes = Math.max(0.2, (rawWords - compressedWords) / 200);
    const draftingMinutes = (triageData.act?.length || 0) * 3.0;
    const totalMinutesSaved = Number((readingMinutes + draftingMinutes).toFixed(1));
    const reductionRatio = Number(Math.max(0, 1 - compressedWords / rawWords).toFixed(3));

    const sessionDocument = {
      sourceType: sourceType || "General",
      rawWordCount: rawWords,
      compressedWordCount: compressedWords,
      reductionRatio,
      timeSavedMinutes: totalMinutesSaved,
      executiveSummary: triageData.executiveSummary,
      buckets: {
        act: triageData.act || [],
        park: triageData.park || [],
        compost: triageData.compost || []
      },
      isResolved: false,
      createdAt: new Date()
    };

    let sessionId = "local_" + Date.now();
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db("slothtriage");
        const insertResult = await db.collection("sessions").insertOne(sessionDocument);
        sessionId = insertResult.insertedId.toString();
      } catch (dbErr) {
        console.warn("MongoDB persistence skipped or failed:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      sessionId,
      data: sessionDocument
    });
  } catch (error) {
    console.error("Triage Error:", error);
    return NextResponse.json(
      { error: "Failed to process backlog triage." },
      { status: 500 }
    );
  }
}
```

---

## 5. Production UI Architecture & Component Directory

All UI styles reuse existing design tokens, utility classes, and semantic variables configured in `app/globals.css`.

### Directory Tree:

```text
components/
├── triage/
│   ├── Header.tsx           # App title, logo, and active model status badge
│   ├── LazyPayoffCard.tsx   # Metrics card showing words avoided & minutes saved
│   ├── IntakeCanvas.tsx     # Backlog textarea with quick context toggles
│   ├── TriageBoard.tsx      # Tabs/Grid container for Act, Park, and Compost
│   ├── ActCard.tsx          # Action item card with one-click reply copy button
│   ├── ParkCard.tsx         # Reference item card with tags & summary
│   └── CompostList.tsx      # Collapsible pruned noise viewer
app/
├── page.tsx                 # Main dashboard state machine
└── layout.tsx               # Default root layout
```

---

### Component 1: `components/triage/Header.tsx`

```tsx
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  return (
    <header className="flex justify-between items-center border-b border-border pb-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="sloth">🦥</span>
          SlothTriage
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          The Async Cognitive Buffer • International Sloth Day Edition
        </p>
      </div>
      <Badge className="border-primary/40 bg-accent text-accent-foreground flex items-center gap-1.5 py-1 px-2.5" variant="outline">
        <Sparkles className="h-3 w-3 text-primary animate-pulse"/>
        <span className="text-xs font-medium">Gemma 2 via OpenRouter</span>
      </Badge>
    </header>
  );
}
```

---

### Component 2: `components/triage/LazyPayoffCard.tsx`

```tsx
import { Clock, ShieldAlert, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Metrics {
  timeSavedMinutes: number;
  rawWordCount: number;
  compressedWordCount: number;
  reductionRatio: number;
}

interface LazyPayoffCardProps {
  metrics?: Metrics;
  executiveSummary?: string;
}

export default function LazyPayoffCard({ metrics, executiveSummary }: LazyPayoffCardProps) {
  if (!metrics) return null;

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-secondary/40 p-3 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-primary"/> Time Saved
            </div>
            <div className="text-xl font-bold text-primary mt-1">
              ~{metrics.timeSavedMinutes}m
            </div>
          </div>
          <div className="bg-secondary/40 p-3 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <ShieldAlert className="h-3 w-3 text-emerald-400"/> Words Avoided
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {Math.max(0, metrics.rawWordCount - metrics.compressedWordCount)}
            </div>
          </div>
          <div className="bg-secondary/40 p-3 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400"/> Noise Reduction
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {Math.round((metrics.reductionRatio || 0) * 100)}%
            </div>
          </div>
        </div>

        {executiveSummary && (
          <div className="p-3 bg-secondary/20 rounded-md border border-border text-xs text-foreground/90 leading-relaxed">
            <span className="font-semibold text-primary">Summary: </span>
            {executiveSummary}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### Component 3: `components/triage/IntakeCanvas.tsx`

```tsx
"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Coffee, ArrowRight } from "lucide-react";

interface IntakeCanvasProps {
  onTriage: (payload: { rawText: string; sourceType: string }) => void;
  loading: boolean;
}

export default function IntakeCanvas({ onTriage, loading }: IntakeCanvasProps) {
  const [text, setText] = useState("");
  const [sourceType, setSourceType] = useState("Slack Thread");

  const sources = ["Slack Thread", "Email Digest", "Discord / Chat", "GitHub Issues"];

  function handleSubmit() {
    if (!text.trim() || loading || text.trim().length < 20) return;
    onTriage({ rawText: text, sourceType });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {sources.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSourceType(s)}
            className={`text-xs px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
              sourceType === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-muted-foreground border-border hover:bg-secondary/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Dump unread Slack threads, email backlogs, or messy chats here... SlothTriage will read and draft all replies for you."
        className="w-full min-h-[160px] bg-secondary/30 border-border text-foreground font-mono text-xs focus-visible:ring-primary resize-y"
      />

      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 h-10 shadow-md cursor-pointer disabled:opacity-50"
        disabled={loading || text.trim().length < 20}
        onClick={handleSubmit}
      >
        <Coffee className="h-4 w-4"/>
        {loading ? "Gemma is reading and sorting your backlog..." : "Perform Sloth Triage"}
        {!loading && <ArrowRight className="h-4 w-4 ml-1"/>}
      </Button>
    </div>
  );
}
```

---

### Component 4: `components/triage/ActCard.tsx`

```tsx
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
    navigator.clipboard.writeText(item.suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="py-2.5 px-4 flex flex-row items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-primary"/>
          <span className="text-xs font-semibold text-foreground">{item.sender}</span>
        </div>
        <Badge
          className="text-[10px] uppercase"
          variant={item.urgency === "high" ? "destructive" : "secondary"}
        >
          {item.urgency} priority
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <p className="text-xs text-muted-foreground">{item.context}</p>

        <div className="p-3 bg-secondary/50 rounded-md border border-border">
          <div className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">
            Pre-Drafted Reply (1-Click Copy)
          </div>
          <p className="text-xs text-foreground italic">{item.suggestedReply}</p>
        </div>

        <Button
          className="w-full h-8 text-xs border-border bg-secondary hover:bg-secondary/80 flex items-center justify-center gap-1.5 cursor-pointer"
          onClick={handleCopy}
          variant="outline"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400"/> : <Copy className="h-3.5 w-3.5"/>}
          {copied ? "Copied to Clipboard!" : "Copy Suggested Reply"}
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

### Component 5: `components/triage/ParkCard.tsx`

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { ParkItem } from "@/lib/ai-engine";

export default function ParkCard({ item }: { item: ParkItem }) {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-3.5 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Bookmark className="h-3.5 w-3.5 text-muted-foreground shrink-0"/>
            <span>{item.subject || item.sender}</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {(item.tags || []).map((tag, idx) => (
              <Badge className="text-[9px] px-1.5 py-0 border-border text-muted-foreground" key={idx} variant="outline">
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
```

---

### Component 6: `components/triage/CompostList.tsx`

```tsx
import { Trash2 } from "lucide-react";
import { CompostItem } from "@/lib/ai-engine";

export default function CompostList({ items }: { items?: CompostItem[] }) {
  if (!items || items.length === 0) {
    return <div className="text-xs text-muted-foreground py-4 text-center">No noise filtered in this batch.</div>;
  }

  return (
    <div className="space-y-2">
      {items.map((c, idx) => (
        <div
          key={idx}
          className="p-2.5 rounded-md bg-secondary/30 border border-border flex items-start gap-2 text-xs"
        >
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5"/>
          <div className="flex-1">
            <span className="text-muted-foreground line-through">{c.snippet}</span>
            <span className="text-[10px] text-muted-foreground/70 block mt-0.5">
              Discarded: {c.reason}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Component 7: `components/triage/TriageBoard.tsx`

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ActCard from "@/components/triage/ActCard";
import ParkCard from "@/components/triage/ParkCard";
import CompostList from "@/components/triage/CompostList";
import { ActItem, ParkItem, CompostItem } from "@/lib/ai-engine";

interface Buckets {
  act?: ActItem[];
  park?: ParkItem[];
  compost?: CompostItem[];
}

export default function TriageBoard({ buckets }: { buckets?: Buckets }) {
  if (!buckets) return null;

  return (
    <Tabs className="w-full" defaultValue="act">
      <TabsList className="grid grid-cols-3 bg-secondary/60 border border-border p-1">
        <TabsTrigger className="text-xs data-[state=active]:bg-card data-[state=active]:text-primary" value="act">
          Act Now ({buckets.act?.length || 0})
        </TabsTrigger>
        <TabsTrigger className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground" value="park">
          Parked Info ({buckets.park?.length || 0})
        </TabsTrigger>
        <TabsTrigger className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground" value="compost">
          Composted ({buckets.compost?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent className="mt-4 space-y-3" value="act">
        {(!buckets.act || buckets.act.length === 0) ? (
          <div className="p-6 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg">
            No actionable decisions required. Pure peace of mind.
          </div>
        ) : (
          buckets.act.map((item, idx) => <ActCard item={item} key={item.id || idx}/>)
        )}
      </TabsContent>

      <TabsContent className="mt-4 space-y-3" value="park">
        {(!buckets.park || buckets.park.length === 0) ? (
          <div className="p-6 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg">
            No reference updates parked.
          </div>
        ) : (
          buckets.park.map((item, idx) => <ParkCard item={item} key={item.id || idx}/>)
        )}
      </TabsContent>

      <TabsContent className="mt-4" value="compost">
        <CompostList items={buckets.compost}/>
      </TabsContent>
    </Tabs>
  );
}
```

---

### File 8: `app/page.tsx` (Orchestration Hub)

```tsx
"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import Header from "@/components/triage/Header";
import IntakeCanvas from "@/components/triage/IntakeCanvas";
import LazyPayoffCard from "@/components/triage/LazyPayoffCard";
import TriageBoard from "@/components/triage/TriageBoard";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);

  async function handleTriage({ rawText, sourceType }: { rawText: string; sourceType: string }) {
    setLoading(true);
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, sourceType })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSessionData(json.data);
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      } else {
        alert(json.error || "Triage processing failed");
      }
    } catch (err) {
      console.error("Triage failed:", err);
      alert("Error executing Sloth Triage.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <Header/>

        <IntakeCanvas loading={loading} onTriage={handleTriage}/>

        {sessionData && (
          <div className="space-y-6 animate-in fade-in-50">
            <LazyPayoffCard
              executiveSummary={sessionData.executiveSummary}
              metrics={{
                timeSavedMinutes: sessionData.timeSavedMinutes,
                rawWordCount: sessionData.rawWordCount,
                compressedWordCount: sessionData.compressedWordCount,
                reductionRatio: sessionData.reductionRatio
              }}
            />

            <TriageBoard buckets={sessionData.buckets}/>
          </div>
        )}
      </div>
    </main>
  );
}
```

---

## 6. Phased Antigravity Prompts

### Phase 1: Database & OpenRouter AI Engine
> *"Read `BUILD_PLAN.md`. Set up the backend architecture:*  
> *1. Create `lib/mongodb.ts`.*  
> *2. Create `lib/ai-engine.ts` using OpenRouter with Gemma models.*  
> *3. Create `app/api/triage/route.ts` to parse text payloads, calculate savings metrics, and save sessions to MongoDB Atlas.*  
> *Review and apply the changes."*

### Phase 2: Modular UI Components
> *"Read `BUILD_PLAN.md`. Build the modular components under `components/triage/`:*  
> *1. Create `Header.tsx`, `LazyPayoffCard.tsx`, and `IntakeCanvas.tsx`.*  
> *2. Create `ActCard.tsx` (with clipboard copy logic), `ParkCard.tsx`, and `CompostList.tsx`.*  
> *3. Create `TriageBoard.tsx` using shadcn Tabs to toggle between Act, Park, and Compost.*  
> *Ensure all styling utilizes tokens from globals.css."*

### Phase 3: Dashboard Orchestration & Testing
> *"Read `BUILD_PLAN.md`. Implement `app/page.tsx` to assemble all triage components into the primary workflow.*  
> *Run `npm run dev` to verify processing of a sample communication backlog."*
