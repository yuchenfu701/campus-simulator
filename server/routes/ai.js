const express = require('express');
const router = express.Router();

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent';
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

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

router.post('/ai-teacher', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: 'GEMINI_API_KEY 未配置，AI 老师已回退到本地脚本。'
      });
    }

    const model = safeString(req.body.model || DEFAULT_MODEL, 80);
    const systemPrompt = safeString(req.body.systemPrompt, 6000);
    const contents = normalizeMessages(req.body.messages);

    if (!contents.length) {
      contents.push({
        role: 'user',
        parts: [{ text: '请根据当前老师身份，给我一个校园探索建议。' }]
      });
    }

    const endpoint = GEMINI_ENDPOINT.replace('{model}', encodeURIComponent(model));
    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.75,
          topP: 0.9,
          maxOutputTokens: 360
        }
      })
    });

    const json = await geminiRes.json().catch(() => ({}));
    if (!geminiRes.ok) {
      console.error('Gemini proxy error:', geminiRes.status, json);
      return res.status(geminiRes.status).json({
        success: false,
        message: 'Gemini 请求失败',
        status: geminiRes.status
      });
    }

    const reply = json?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();

    res.json({
      success: true,
      provider: 'gemini',
      model,
      reply: reply || '我现在有点卡住了。你可以先看任务提示，去校门、教学楼、食堂或操场完成一个打卡。'
    });
  } catch (error) {
    console.error('AI teacher proxy failed:', error);
    res.status(500).json({
      success: false,
      message: 'AI 老师代理服务异常'
    });
  }
});

module.exports = router;

