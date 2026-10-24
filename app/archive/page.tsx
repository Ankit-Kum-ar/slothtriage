"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Archive,
  Search,
  Filter,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Bookmark,
  Trash2,
  Copy,
  Check,
  Inbox,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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

export default function ArchivePage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
          if (json.sessions.length > 0) {
            setExpandedId(json.sessions[0]._id || null);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch archive sessions:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const sources = ["All", "Slack Thread", "Email Digest", "Discord / Chat", "GitHub Issues"];

  const filteredSessions = sessions.filter((s) => {
    const matchesSource =
      selectedSource === "All" ||
      s.sourceType?.toLowerCase().includes(selectedSource.toLowerCase());

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesSource;

    const matchesQuery =
      s.executiveSummary?.toLowerCase().includes(query) ||
      s.sourceType?.toLowerCase().includes(query) ||
      s.buckets?.act?.some((a) => a.context?.toLowerCase().includes(query) || a.sender?.toLowerCase().includes(query)) ||
      s.buckets?.park?.some((p) => p.summary?.toLowerCase().includes(query) || p.tags?.some((t) => t.toLowerCase().includes(query)));

    return matchesSource && matchesQuery;
  });

  const totalTimeSaved = Number(
    sessions.reduce((acc, curr) => acc + (curr.timeSavedMinutes || 0), 0).toFixed(1)
  );

  return (
    <main className="flex-1 flex flex-col items-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Archive className="h-6 w-6 text-primary" />
              <span>Triage Archive</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explore past triaged threads, archived reference items, and ready-to-copy replies.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="bg-card border border-border px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-xs">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Cumulative Saved:</span>
              <span className="font-bold text-foreground">~{totalTimeSaved}m</span>
            </div>
            <Link href="/">
              <Button size="sm" className="bg-primary text-primary-foreground text-xs font-semibold h-8.5 cursor-pointer">
                <Inbox className="h-3.5 w-3.5 mr-1" />
                New Triage
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Channel Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, sender, summary, or tags..."
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3" /> Filter by channel:
            </span>
            {sources.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedSource(src)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer font-medium ${
                  selectedSource === src
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
            <span>Loading archived sessions...</span>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-lg p-8 space-y-3">
            <div className="text-3xl">🦥</div>
            <div className="text-sm font-semibold text-foreground">No archived sessions found</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || selectedSource !== "All"
                ? "No sessions match your search or filter criteria. Try clearing filters."
                : "Your archive is currently empty. Start by triaging your first communication backlog!"}
            </p>
            <Link href="/" className="inline-block mt-2">
              <Button size="sm" className="bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
                Start a Triage Run
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground px-1">
              Showing {filteredSessions.length} {filteredSessions.length === 1 ? "session" : "sessions"}
            </div>

            {filteredSessions.map((session, idx) => {
              const isExpanded = expandedId === (session._id || String(idx));
              const currentId = session._id || String(idx);
              const formattedDate = session.createdAt
                ? new Date(session.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recent";

              return (
                <Card
                  key={currentId}
                  className={`bg-card border-border transition-all duration-200 shadow-xs ${
                    isExpanded ? "border-primary/50 shadow-md ring-1 ring-primary/20" : "hover:border-border/80"
                  }`}
                >
                  <CardHeader
                    onClick={() => setExpandedId(isExpanded ? null : currentId)}
                    className="p-4 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/60 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-secondary font-semibold">
                          {session.sourceType || "General Backlog"}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{formattedDate}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground leading-relaxed">
                        {session.executiveSummary || "Automated triage session summary."}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-primary block">
                          +{session.timeSavedMinutes}m saved
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {Math.round((session.reductionRatio || 0) * 100)}% noise cut
                        </span>
                      </div>
                      <div className="p-1 rounded-md bg-secondary text-muted-foreground">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="p-4 space-y-4 animate-in fade-in-50 duration-200 bg-secondary/10">
                      {/* Act Bucket */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                          <AlertCircle className="h-3.5 w-3.5 text-primary" />
                          <span>Action Items ({session.buckets?.act?.length || 0})</span>
                        </div>

                        {(!session.buckets?.act || session.buckets.act.length === 0) ? (
                          <div className="p-3 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg">
                            No critical action items.
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {session.buckets.act.map((act, aIdx) => {
                              const replyKey = `reply_${currentId}_${aIdx}`;
                              const isCopied = copiedId === replyKey;

                              return (
                                <div
                                  key={aIdx}
                                  className="p-3.5 bg-card border border-border rounded-lg space-y-2 shadow-xs"
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="text-xs font-semibold text-foreground">
                                      {act.sender}
                                    </span>
                                    <Badge
                                      variant={act.urgency === "high" ? "destructive" : "secondary"}
                                      className="text-[9px] uppercase tracking-wider"
                                    >
                                      {act.urgency} priority
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {act.context}
                                  </p>

                                  <div className="p-2.5 bg-secondary/60 rounded-md border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
                                    <span className="italic text-foreground text-[11px] leading-relaxed">
                                      "{act.suggestedReply}"
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(act.suggestedReply, replyKey);
                                      }}
                                      className="h-8 sm:h-7 text-[11px] px-2.5 shrink-0 bg-card hover:bg-secondary cursor-pointer w-full sm:w-auto font-medium"
                                    >
                                      {isCopied ? (
                                        <Check className="h-3 w-3 text-emerald-500 mr-1" />
                                      ) : (
                                        <Copy className="h-3 w-3 mr-1 text-muted-foreground" />
                                      )}
                                      {isCopied ? "Copied" : "Copy Reply"}
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Park Bucket */}
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <div className="text-[11px] font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                          <Bookmark className="h-3.5 w-3.5 text-primary" />
                          <span>Parked References ({session.buckets?.park?.length || 0})</span>
                        </div>

                        {(!session.buckets?.park || session.buckets.park.length === 0) ? (
                          <div className="p-3 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg">
                            No reference updates parked.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {session.buckets.park.map((park, pIdx) => (
                              <div
                                key={pIdx}
                                className="p-3 bg-card border border-border rounded-lg space-y-1.5 text-xs shadow-xs"
                              >
                                <div className="flex justify-between items-center gap-1">
                                  <span className="font-semibold text-foreground text-[11px]">
                                    {park.subject || park.sender}
                                  </span>
                                  <div className="flex gap-1 flex-wrap">
                                    {(park.tags || []).map((t, tIdx) => (
                                      <Badge key={tIdx} variant="outline" className="text-[8px] px-1 py-0">
                                        #{t}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                  {park.summary}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Compost Bucket */}
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <div className="text-[11px] font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Filtered Noise ({session.buckets?.compost?.length || 0})</span>
                        </div>

                        {(!session.buckets?.compost || session.buckets.compost.length === 0) ? (
                          <div className="p-2.5 text-center text-[11px] text-muted-foreground bg-card border border-border rounded-lg">
                            No noise filtered in this batch.
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {session.buckets.compost.map((c, cIdx) => (
                              <div
                                key={cIdx}
                                className="p-2 rounded bg-card/60 border border-border flex items-center justify-between text-[11px] gap-2"
                              >
                                <span className="line-through text-muted-foreground text-[11px] truncate">
                                  "{c.snippet}"
                                </span>
                                <span className="text-[9px] text-destructive/80 font-medium shrink-0">
                                  Pruned: {c.reason}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
