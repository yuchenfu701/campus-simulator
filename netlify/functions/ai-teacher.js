const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent';

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

function safeString(value, max = 4000) {
  return String(value || '').slice(0, max);
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(Boolean)
    .slice(-10)
    .map((message) => ({
      role: message.role === 'assistant' || message.role === 'model' ? 'model' : 'user',
      parts: [{ text: safeString(message.content || message.text || '', 1600) }]
    }))
    .filter((message) => message.parts[0].text.trim());
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return response(204, {});
  if (event.httpMethod !== 'POST') return response(405, { success: false, message: 'Method Not Allowed' });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return response(503, { success: false, message: 'GEMINI_API_KEY 未配置' });

    const body = JSON.parse(event.body || '{}');
    const model = safeString(body.model || process.env.GEMINI_MODEL || 'gemini-2.5-flash', 80);
    const systemPrompt = safeString(body.systemPrompt, 6000);
    const contents = normalizeMessages(body.messages);
    if (!contents.length) {
      contents.push({ role: 'user', parts: [{ text: '请根据当前老师身份，给我一个校园探索建议。' }] });
    }

    const geminiRes = await fetch(GEMINI_ENDPOINT.replace('{model}', encodeURIComponent(model)), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.75, topP: 0.9, maxOutputTokens: 360 }
      })
    });

    const json = await geminiRes.json().catch(() => ({}));
    if (!geminiRes.ok) {
      return response(geminiRes.status, { success: false, message: 'Gemini 请求失败', status: geminiRes.status });
    }

    const reply = json?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    return response(200, { success: true, provider: 'gemini', model, reply });
  } catch (error) {
    console.error('Netlify AI teacher proxy failed:', error);
    return response(500, { success: false, message: 'AI 老师代理服务异常' });
  }
};

