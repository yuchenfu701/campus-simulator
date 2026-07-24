/*
 * AI 公共配置：这里不能放 API Key。
 * - 同域部署 Vercel/Netlify/后端时，保持空字符串即可，前端会请求 /api/ai-teacher。
 * - 如果前端在 GitHub Pages，后端在 Render，请把下面改成 Render 后端接口：
 *   window.CAMPUS_AI_PROXY_ENDPOINT = 'https://你的后端域名.onrender.com/api/ai-teacher';
 */
window.CAMPUS_AI_PROXY_ENDPOINT = window.CAMPUS_AI_PROXY_ENDPOINT || 'https://campus-simulator-api.onrender.com/api/ai-teacher';
