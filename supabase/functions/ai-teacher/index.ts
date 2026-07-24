const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ChatMessage = {
  role?: string;
  content?: string;
  text?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function normalizeMessages(messages: ChatMessage[] = []) {
  const normalized = messages
    .map((message) => {
      const role = message.role === "assistant" || message.role === "model" ? "model" : "user";
      const text = String(message.content || message.text || "").trim();
      if (!text) return null;
      return {
        role,
        parts: [{ text }],
      };
    })
    .filter(Boolean);

  if (normalized.length) return normalized;
  return [{ role: "user", parts: [{ text: "你好，请用校园老师的身份和我聊聊。" }] }];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Only POST is supported" }, 405);
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return jsonResponse({
      success: false,
      error: "GEMINI_API_KEY is not configured in Supabase Function Secrets",
      fallback: true,
    }, 503);
  }

  try {
    const body = await req.json().catch(() => ({}));
    const model = String(body.model || Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash");
    const systemPrompt = String(body.systemPrompt || "").trim();
    const contents = normalizeMessages(body.messages);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: systemPrompt
            ? { parts: [{ text: systemPrompt }] }
            : undefined,
          contents,
          generationConfig: {
            temperature: 0.75,
            topP: 0.9,
            maxOutputTokens: 900,
          },
        }),
      },
    );

    const data = await geminiRes.json().catch(() => ({}));
    if (!geminiRes.ok) {
      return jsonResponse({
        success: false,
        error: data?.error?.message || `Gemini request failed: ${geminiRes.status}`,
        details: data,
      }, 502);
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("")
      .trim();

    return jsonResponse({
      success: true,
      provider: "gemini",
      model,
      reply: reply || "我刚才有点走神了，你再问我一次好吗？",
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});
