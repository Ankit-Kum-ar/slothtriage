"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Clock,
  ShieldAlert,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ActItem, ParkItem, CompostItem } from "@/lib/ai-engine";

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

const COLORS = ["#4880ff", "#00b69b", "#ef3826", "#ff9f43", "#6226ef"];

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    setLoading(true);
    try {
      const res = await fetch("/api/triage");
      if (res.ok) {
        const json = await res.json();
        if (json.sessions && Array.isArray(json.sessions)) {
          setSessions(json.sessions);
        }
      }
    } catch (err) {
      console.warn("Failed to load analytics sessions:", err);
    } finally {
      setLoading(false);
    }
  }

  // Aggregate Metrics
  const totalSessions = sessions.length;
  const totalTimeSaved = Number(
    sessions.reduce((acc, curr) => acc + (curr.timeSavedMinutes || 0), 0).toFixed(1)
  );
  const totalWordsAvoided = sessions.reduce(
    (acc, curr) => acc + Math.max(0, curr.rawWordCount - curr.compressedWordCount),
    0
  );
  const avgReduction =
    totalSessions > 0
      ? Math.round(
          (sessions.reduce((acc, curr) => acc + (curr.reductionRatio || 0), 0) /
            totalSessions) *
            100
        )
      : 0;

  // Total bucket item counts
  const totalActItems = sessions.reduce(
    (acc, curr) => acc + (curr.buckets?.act?.length || 0),
    0
  );
  const totalParkItems = sessions.reduce(
    (acc, curr) => acc + (curr.buckets?.park?.length || 0),
    0
  );
  const totalCompostItems = sessions.reduce(
    (acc, curr) => acc + (curr.buckets?.compost?.length || 0),
    0
  );

  const distributionData = [
    { name: "Act (High Priority)", value: totalActItems || 1 },
    { name: "Park (Informational)", value: totalParkItems || 1 },
    { name: "Compost (Pruned)", value: totalCompostItems || 1 },
  ];

  // Channel breakdown
  const channelMap: Record<string, number> = {};
  sessions.forEach((s) => {
    const channel = s.sourceType || "General";
    channelMap[channel] = (channelMap[channel] || 0) + 1;
  });

  const channelData = Object.entries(channelMap).map(([name, count]) => ({
    name,
    count,
  }));

  // Trend data (chronological)
  const trendData = [...sessions]
    .reverse()
    .slice(-10)
    .map((s, idx) => ({
      session: `#${idx + 1}`,
      minutesSaved: s.timeSavedMinutes,
      wordsAvoided: Math.max(0, s.rawWordCount - s.compressedWordCount),
    }));

  return (
    <main className="flex-1 flex flex-col items-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span>Cognitive Analytics & ROI</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cumulative metrics tracking developer cognitive dread eliminated and hours reclaimed.
            </p>
          </div>

          <Link href="/">
            <Button size="sm" className="bg-primary text-primary-foreground text-xs font-semibold h-8.5 cursor-pointer">
              <Inbox className="h-3.5 w-3.5 mr-1" />
              New Triage
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
            <span>Calculating cognitive analytics...</span>
          </div>
        ) : totalSessions === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-lg p-8 space-y-3">
            <div className="text-3xl">📊</div>
            <div className="text-sm font-semibold text-foreground">No triage data to visualize yet</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Run your first communication backlog triage to start tracking saved minutes and noise reduction trends.
            </p>
            <Link href="/" className="inline-block mt-2">
              <Button size="sm" className="bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
                Run First Triage
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-card border-border shadow-xs">
                <CardContent className="p-4 space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Time Reclaimed</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mt-1">
                    ~{totalTimeSaved}m
                  </div>
                  <p className="text-[10px] text-muted-foreground">Reading + Drafting saved</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-xs">
                <CardContent className="p-4 space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <ShieldAlert className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Words Avoided</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-1">
                    {totalWordsAvoided}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Fluff bypassed</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-xs">
                <CardContent className="p-4 space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Avg Reduction</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-1">
                    {avgReduction}%
                  </div>
                  <p className="text-[10px] text-muted-foreground">Backlog density ratio</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-xs">
                <CardContent className="p-4 space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Batches Triaged</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-1">
                    {totalSessions}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Indexed in archive</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Chart 1: Time Saved Trend */}
              <Card className="bg-card border-border shadow-xs">
                <CardHeader className="py-3 px-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      Time Saved Per Session (Minutes)
                    </span>
                    <span className="text-[10px] text-muted-foreground">Recent runs</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4880ff" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#4880ff" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="session" stroke="#737791" fontSize={10} tickLine={false} />
                        <YAxis stroke="#737791" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#202224",
                            color: "#ffffff",
                            borderRadius: "8px",
                            fontSize: "11px",
                            border: "none",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="minutesSaved"
                          name="Minutes Saved"
                          stroke="#4880ff"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#timeGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Chart 2: 3-Bucket Distribution */}
              <Card className="bg-card border-border shadow-xs">
                <CardHeader className="py-3 px-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      Cognitive Triage Distribution
                    </span>
                    <span className="text-[10px] text-muted-foreground">Items sorted</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#202224",
                            color: "#ffffff",
                            borderRadius: "8px",
                            fontSize: "11px",
                            border: "none",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconSize={8}
                          wrapperStyle={{ fontSize: "10px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart 3: Volume by Source */}
            {channelData.length > 0 && (
              <Card className="bg-card border-border shadow-xs">
                <CardHeader className="py-3 px-4 border-b border-border">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                    Triage Activity By Backlog Source
                  </span>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={channelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#737791" fontSize={11} tickLine={false} />
                        <YAxis stroke="#737791" fontSize={10} tickLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#202224",
                            color: "#ffffff",
                            borderRadius: "8px",
                            fontSize: "11px",
                            border: "none",
                          }}
                        />
                        <Bar dataKey="count" name="Sessions" fill="#4880ff" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sloth Philosophy Callout */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent to-secondary border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-foreground block">
                  The Sloth Cognitive Payoff
                </span>
                <p className="text-muted-foreground mt-0.5">
                  By batching communication asynchronously into Act, Park, and Compost, you prevent attention fragmentation and save ~3 minutes per pre-drafted reply.
                </p>
              </div>
              <Link href="/about">
                <Button size="sm" variant="outline" className="text-xs font-semibold cursor-pointer shrink-0">
                  Read Philosophy <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
