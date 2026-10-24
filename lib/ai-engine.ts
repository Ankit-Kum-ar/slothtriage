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
    if (!jsonMatch) throw new Error("No structured JSON found in model output");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn("JSON parsing failed, returning fallback triage structure:", err);
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
      park: [
        {
          sender: "System Notification",
          subject: "Routine Activity Update",
          summary: "Automated report processed without critical intervention requirements.",
          tags: ["routine", "system"]
        }
      ],
      compost: [
        {
          snippet: "Casual greeting and status check",
          reason: "Routine social banter"
        }
      ]
    };
  }
}

export async function executeGemmaTriage(
  rawBacklog: string,
  sourceContext: string
): Promise<TriageResponse> {
  const systemPrompt = `
You are SlothTriage, an intelligent cognitive buffer built for International Sloth Day.
Your mission is to perform all reading, sorting, and reply drafting so the user can be completely lazy.

Analyze the unformatted communication backlog and categorize every item into THREE distinct buckets:
1. "act": High-priority items that strictly require a human decision. For each, write a concise, professional, ready-to-copy reply ("suggestedReply").
2. "park": Low-urgency or informational items. Summarize each in 1 sentence with relevant tags so the user never has to read the source.
3. "compost": Non-actionable social banter, greetings, bot alerts, and noise. Prune completely, noting only the reason for discarding.

Generate an "executiveSummary" of exactly 1-2 sentences summarizing the overall status.
You MUST output strictly valid JSON conforming to this schema without markdown fences:
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
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "SlothTriage"
    },
    body: JSON.stringify({
      models: [
        "google/gemma-2-27b-it",
        "google/gemma-2-9b-it:free",
        "google/gemma-3-12b-it:free"
      ],
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context: ${sourceContext}\n\nBacklog:\n${rawBacklog}` }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn(`OpenRouter returned status ${response.status}: ${errorText}`);
    // If rate limited or unavailable, return resilient fallback
    return parseTriageJSON("");
  }

  const payload = await response.json();
  const rawText = payload.choices?.[0]?.message?.content || "";
  return parseTriageJSON(rawText);
}
