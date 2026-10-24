import Link from "next/link";
import {
  AlertCircle,
  Bookmark,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col items-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header Hero */}
        <div className="text-center space-y-3 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <span role="img" aria-label="sloth">🦥</span>
            <span>International Sloth Day Edition</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            The Async Cognitive Buffer
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Eliminating developer communication dread by batch-triaging unformatted Slack threads, email chains, and issue backlogs into three clean buckets with pre-drafted replies.
          </p>

          <div className="pt-2">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-9 px-5 cursor-pointer shadow-md">
                Launch Triage Workspace <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* The Problem */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span>The Problem: Communication Dread</span>
          </h2>
          <Card className="bg-card border-border shadow-xs">
            <CardContent className="p-5 text-xs text-muted-foreground leading-relaxed space-y-3">
              <p>
                Remote engineers, tech leads, and freelancers experience chronic cognitive fatigue from accumulating unread communications. Opening Slack or your email inbox after deep work produces genuine dread:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                <li>Dozens of unstructured threads mixed with automated CI/CD bot alerts.</li>
                <li>Casual coffee chats buried right next to production incident reports.</li>
                <li>The mental resistance of drafting polite, professional replies for every single message.</li>
              </ul>
              <p>
                This leads to communication avoidance, delayed decisions, and high context-switching overhead.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* The Sloth Philosophy */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            <span>The Sloth Philosophy: Slow Down to Speed Up</span>
          </h2>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border text-xs text-muted-foreground leading-relaxed space-y-2">
            <p>
              Sloths are nature's ultimate energy conservation champions. They do not react hastily to every leaf falling in the jungle; they move with extreme intention.
            </p>
            <p className="text-foreground font-medium">
              SlothTriage applies this exact principle to modern developer communication: Never react in real-time to noisy message streams. Instead, dump backlogs into an async cognitive buffer that reads, separates, and drafts your work for you.
            </p>
          </div>
        </div>

        {/* The 3-Bucket System */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span>The 3-Bucket System</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Act */}
            <Card className="bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
              <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
                <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-primary" />
                  Act
                </span>
                <Badge variant="destructive" className="text-[9px] uppercase">
                  High Priority
                </Badge>
              </CardHeader>
              <CardContent className="p-4 text-xs text-muted-foreground space-y-2">
                <p>
                  Items that strictly require a human decision or approval.
                </p>
                <div className="p-2 bg-secondary/60 rounded text-[11px] text-foreground font-medium border border-border">
                  ⚡ Pre-drafts a concise, professional reply you can copy with one click.
                </div>
              </CardContent>
            </Card>

            {/* Park */}
            <Card className="bg-card border-border shadow-xs hover:border-border/80 transition-colors">
              <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
                <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5 text-primary" />
                  Park
                </span>
                <Badge variant="secondary" className="text-[9px] uppercase">
                  Informational
                </Badge>
              </CardHeader>
              <CardContent className="p-4 text-xs text-muted-foreground space-y-2">
                <p>
                  Low-urgency updates, cloud pricing notices, and documentation updates.
                </p>
                <div className="p-2 bg-secondary/60 rounded text-[11px] text-foreground font-medium border border-border">
                  🗄️ Summarized in 1 sentence with tags and saved into your searchable archive.
                </div>
              </CardContent>
            </Card>

            {/* Compost */}
            <Card className="bg-card border-border shadow-xs hover:border-border/80 transition-colors">
              <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
                <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Compost
                </span>
                <Badge variant="outline" className="text-[9px] uppercase text-muted-foreground">
                  Noise
                </Badge>
              </CardHeader>
              <CardContent className="p-4 text-xs text-muted-foreground space-y-2">
                <p>
                  Social chatter, bagel banter, automated CI greetings, and non-actionable fluff.
                </p>
                <div className="p-2 bg-secondary/60 rounded text-[11px] text-muted-foreground font-medium border border-border">
                  🌱 Pruned completely so you never waste attention reading them.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* The Lazy Payoff Formula */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>The "Lazy Payoff" Metric Formula</span>
          </h2>
          <Card className="bg-card border-border shadow-xs">
            <CardContent className="p-5 text-xs text-muted-foreground leading-relaxed space-y-3">
              <p>
                Every triage run quantifies your exact cognitive savings using an empirical productivity model:
              </p>
              <div className="p-3 bg-secondary/60 rounded-lg border border-border space-y-1.5 font-mono text-[11px] text-foreground">
                <div>Reading Time Saved = (Raw Words Avoided) ÷ 200 wpm</div>
                <div>Drafting Time Saved = (Action Items) × 3.0 minutes</div>
                <div className="text-primary font-bold">Total Time Reclaimed = Reading Saved + Drafting Saved</div>
              </div>
              <p>
                A typical messy backlog of 1,200 words yields <strong className="text-foreground">~15 to 25 minutes</strong> of focus time reclaimed per run!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ready CTA */}
        <div className="text-center pt-4 pb-8">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold h-11 px-8 cursor-pointer shadow-md rounded-lg">
              Start Triaging Your Backlogs <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
