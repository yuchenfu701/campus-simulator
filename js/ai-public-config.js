/*
 * AI 公共配置：这里不能放 Gemini API Key。
 * 当前项目的真实部署方式是 GitHub Pages + Supabase，所以 AI 老师默认走 Supabase Edge Function。
 * Gemini Key 应放在 Supabase Function Secrets 里，而不是前端源码里。
 */
window.CAMPUS_AI_PROXY_ENDPOINT = window.CAMPUS_AI_PROXY_ENDPOINT || 'https://qfoaoaggyfhkkvoxyxrb.supabase.co/functions/v1/ai-teacher';
