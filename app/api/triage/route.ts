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
        act: (triageData.act || []).map((item, idx) => ({
          ...item,
          id: item.id || `act_${idx + 1}`
        })),
        park: (triageData.park || []).map((item, idx) => ({
          ...item,
          id: item.id || `park_${idx + 1}`
        })),
        compost: (triageData.compost || []).map((item, idx) => ({
          ...item,
          id: item.id || `cmp_${idx + 1}`
        }))
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

export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ sessions: [] });
    }
    const client = await clientPromise;
    const db = client.db("slothtriage");
    const sessions = await db
      .collection("sessions")
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ sessions });
  } catch (err) {
    console.warn("Failed to fetch sessions:", err);
    return NextResponse.json({ sessions: [] });
  }
}
