interface Env {
  QIANWEN_API_KEY: string;
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { headers, status: 405 });
  }

  try {
    const params = await context.request.json();

    const travelTypeDesc: Record<string, string> = {
      solo: "solo traveler (efficient, budget-friendly, social spots)",
      couple: "couple (romantic, cozy dining, scenic views, less walking)",
      family: "family (kid-friendly, less crowded spots, moderate pace)",
      friends: "friends (fun group activities, nightlife, energetic)",
    };

    const budgetLabel = params.budgetLevel === "budget"
      ? "Budget (300-500 CNY/day per person, street food, public transport, free attractions)"
      : params.budgetLevel === "comfort"
        ? "Comfort (600-1200 CNY/day per person, nice restaurants, metro/taxi, paid attractions)"
        : "Luxury (1500-4000+ CNY/day per person, fine dining, private car, VIP experiences)";

    const prefNames = (params.preferences || []).map((p: string) => {
      const labels: Record<string, string> = {
        history_culture: "History & Culture",
        nature_scenery: "Nature & Scenery",
        food: "Food & Culinary",
        citywalk: "City Walk",
        instagram: "Instagram-worthy Spots",
        shopping: "Shopping",
        outdoor_adventure: "Outdoor & Adventure",
        art_culture: "Art & Culture",
      };
      return labels[p] || p;
    }).join(", ");

    const sysPrompt = `You are an expert travel planner specializing in China tourism. You have deep knowledge of Chinese cities, hidden gems, local cuisine, transportation networks, and cultural etiquette.

CRITICAL RULES:
- Respond ONLY with valid JSON. No markdown, no code fences, no explanation text.
- All text MUST be in English. For food names, keep the Chinese name with English explanation in parentheses.
- Every recommendation must be practical, specific, and realistic.
- Include real attraction names (in Chinese + English), genuine restaurant names, actual public transport routes.
- Costs must be realistic CNY estimates for the given budget level.
- Activities must make logistical sense — group nearby attractions together.
- Each day needs balanced pacing: don't overload or underfill the schedule.
- For transport tips, give specific metro lines, bus routes, or practical advice — not generic statements.`;

    const userPrompt = `Create a detailed, personalized China travel itinerary in pure JSON format (no markdown, no explanation).

USER PROFILE:
- Destination: ${params.destination}
- Duration: ${params.days} days
- Travelers: ${params.travelers}
- Travel Type: ${travelTypeDesc[params.travelType] || params.travelType}
- Budget: ${budgetLabel}
- Interests: ${prefNames || "General sightseeing"}

OUTPUT JSON STRUCTURE (pure JSON only):
{
  "destination": "${params.destination}",
  "days": ${params.days},
  "travelers": ${params.travelers},
  "travelType": "${params.travelType}",
  "budgetLevel": "${params.budgetLevel}",
  "preferences": ${JSON.stringify(params.preferences || [])},
  "overview": "A compelling 2-3 sentence overview capturing the trip essence",
  "dayPlans": [
    {
      "day": 1,
      "title": "Day theme",
      "description": "Paragraph describing the day",
      "activities": [
        { "time": "09:00", "name": "Name (中文)", "description": "Why special + tips", "duration": "2 hours", "cost": 0 }
      ],
      "meals": [
        { "type": "Breakfast", "recommendation": "Restaurant (中文) — dish", "estimatedCost": 30 }
      ],
      "transportTips": "Specific metro/bus/taxi advice"
    }
  ],
  "totalEstimatedCost": 0,
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.env.QIANWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: `AI API error: ${response.status}`, detail: err }), { headers, status: 502 });
    }

    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "Empty AI response" }), { headers, status: 502 });
    }

    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    }

    // Validate parseable
    JSON.parse(cleaned);

    return new Response(cleaned, { headers: { ...headers, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), { headers, status: 500 });
  }
}
