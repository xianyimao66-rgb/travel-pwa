interface Env {
  QIANWEN_API_KEY: string;
}

const ROUND_BY_BUDGET = {
  budget: (v: number) => Math.round(v / 50) * 50,
  comfort: (v: number) => Math.round(v / 100) * 100,
  luxury: (v: number) => Math.round(v / 200) * 200,
};

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (context.request.method === "OPTIONS") return new Response(null, { headers, status: 204 });
  if (context.request.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { headers, status: 405 });

  try {
    const params = await context.request.json();

    const descMap: Record<string, string> = {
      solo: "Solo explorer (efficient, social hostels, street eats, meet locals)",
      couple: "Couple's getaway (romantic spots, cozy dinners, slow pace, photo moments)",
      family: "Family trip (kid-friendly activities, easy logistics, rest breaks)",
      friends: "Friends group (fun experiences, nightlife, group activities, food crawl)",
    };

    const budgetMap: Record<string, string> = {
      budget: "Budget (¥300-500/day per person — hostels/dorm, street food, metro+bus, free sights)",
      comfort: "Comfort (¥600-1200/day per person — nice hotels, sit-down restaurants, Didi+metro, paid attractions)",
      luxury: "Luxury (¥1500-4000/day per person — boutique hotels, fine dining, private driver, VIP access)",
    };

    const prefLabels: Record<string, string> = {
      history_culture: "History & Culture", nature_scenery: "Nature & Scenery",
      food: "Food & Culinary", citywalk: "City Walk",
      instagram: "Instagram-worthy", shopping: "Shopping",
      outdoor_adventure: "Outdoor & Adventure", art_culture: "Art & Culture",
    };
    const prefStr = (params.preferences || []).map((p: string) => prefLabels[p] || p).join(", ");
    const customPref = params.customPreference || "";
    const allPrefs = prefStr + (prefStr && customPref ? ", " : "") + customPref;

    // Rounding function
    const round = ROUND_BY_BUDGET[params.budgetLevel as keyof typeof ROUND_BY_BUDGET] || ((n: number) => n);

    const sysPrompt = `You are a travel writer and personal trip designer for international visitors to China. You write like a knowledgeable friend sharing their favorite secrets — warm, vivid, and practical.

YOUR WRITING STYLE:
- Each day starts with a short, poetic 1-2 sentence intro that sets the mood (like a travel journal entry)
- Activity descriptions are warm and visual — explain WHY this place is special, not just what it is
- Use natural, conversational English. Think "Rick Steves meets a millennial travel blogger"
- For transport: ALWAYS recommend Didi (Chinese Uber) first for comfort travelers, with ¥ range estimates. Only suggest metro when it's genuinely faster/easier
- For each attraction, mention: entry cost (¥), how long to spend, best time to go, one insider tip
- Practical needs: bathroom availability, hydration, sun protection, phone charging — small things that matter on the road
- Mention which apps they'll actually need (WeChat, Alipay, Didi, MetroMan) and when

CONTENT PHILOSOPHY:
- Never recommend more than 3-4 major stops per day. Traveling in China is more tiring than people expect
- Build in rest breaks (tea house, park bench, café) naturally between activities
- For couples and solos: add romantic/contemplative moments — sunset spots, quiet gardens
- For families: mention playgrounds, kids' menus, rest areas, nap-friendly timing
- Always include one "hidden gem" per day — a spot most tourists miss
- Give cultural context: why this temple matters, what to look for, proper etiquette

JSON OUTPUT RULES:
- Pure JSON. No markdown, no code fences, no extra text.
- All text in English. Chinese names in parentheses for landmarks and dishes.`;

    const userPrompt = `Create a warm, human-written travel itinerary for China in pure JSON format.

THE TRAVELER:
- Destination: ${params.destination}
- Duration: ${params.days} days
- Travelers: ${params.travelers}
- Travel Type: ${descMap[params.travelType] || params.travelType}
- Budget: ${budgetMap[params.budgetLevel] || params.budgetLevel}
- Interests: ${allPrefs || "General sightseeing"}

OUTPUT JSON STRUCTURE (ONLY return this JSON, nothing else):
{
  "destination": "${params.destination}",
  "days": ${params.days},
  "travelers": ${params.travelers},
  "travelType": "${params.travelType}",
  "budgetLevel": "${params.budgetLevel}",
  "preferences": ${JSON.stringify(params.preferences || [])},
  "overview": "A warm, enticing 2-3 sentence summary that makes them excited for this trip",
  "dayPlans": [
    {
      "day": 1,
      "title": "A short, evocative day title (e.g., 'Pandas & Teahouse Whispers')",
      "intro": "One poetic sentence setting the day's mood — like a diary entry. E.g.: 'Morning mist rises over bamboo groves as the city awakens to the sound of mahjong tiles...'",
      "description": "A paragraph (3-5 sentences) describing the day's flow in narrative style — not a dry list, but a story",
      "activities": [
        {
          "time": "09:00",
          "name": "Chengdu Research Base of Giant Panda Breeding (成都大熊猫繁育研究基地)",
          "description": "An evocative, helpful paragraph. Not just 'visit pandas.' Say: 'Arrive early (7:30-8:00) when pandas are most active and crowds are thin. The cub nursery is the highlight — baby pandas tumbling over each other like fluffy dumplings. Pro tip: skip the queue by booking online 3 days ahead. Allow 2.5-3 hours. Entry ¥55.'",
          "duration": "2-3 hours",
          "cost": ${round(55)}
        }
      ],
      "meals": [
        { "type": "Breakfast", "recommendation": "Vivid recommendation like: 'Start at your hotel or a nearby bakery — try a freshly baked egg tart (蛋挞) from a local pastry shop, ¥5-8'", "estimatedCost": ${round(30)} }
      ],
      "transportTips": "Friendly, practical transport advice. Always lead with Didi for comfort. E.g.: 'Take Didi from your hotel (¥15-20, 15 mins). Show the driver this address in Chinese: 成都大熊猫繁育研究基地. For comfort travelers, this is totally worth it over the 40-min metro+shuttle combo.'"
    }
  ],
  "totalEstimatedCost": ${round(1000)},
  "tips": [
    "Warm, practical tip like: 'Download Alipay before you arrive — most places won't take foreign credit cards. You can link it to your Visa/Mastercard.'",
    "Cultural tip like: 'When visiting temples, avoid pointing your feet at Buddha statues. It's considered disrespectful.'",
    "Money-saving tip"
  ]
}

Make it feel human, not automated. Think: a well-traveled friend writing to another friend who's about to visit China for the first time.`;

    const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.env.QIANWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen-turbo-latest",
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.85,
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

    JSON.parse(cleaned);

    return new Response(cleaned, { headers: { ...headers, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), { headers, status: 500 });
  }
}
