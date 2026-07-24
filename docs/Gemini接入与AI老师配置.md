# Gemini 接入与 AI 老师配置

当前项目的实际线上方案是：

```text
GitHub Pages 前端
  → Supabase Edge Function: ai-teacher
  → Gemini API
```

不要用 Render。`server/` 和 `render.yaml` 是历史遗留方向，项目文档里也写过旧的 Railway / Render / MongoDB Node 方案已废弃。

## 线上要填的密钥位置

进入 Supabase 项目：

```text
https://supabase.com/dashboard/project/qfoaoaggyfhkkvoxyxrb
```

在 Edge Functions / Secrets 里添加：

```env
GEMINI_API_KEY=你的 Gemini API Key
GEMINI_MODEL=gemini-2.5-flash
```

这个密钥不能写进 GitHub Pages 的网页源码，因为任何访问者都能看到前端文件。

## 代码位置

- 前端 AI 接口地址：[js/ai-public-config.js](../js/ai-public-config.js)
- AI 老师性格、人设、系统提示词：[js/ai-teachers.js](../js/ai-teachers.js)
- 前端调用逻辑：[js/ai-provider.js](../js/ai-provider.js)
- Supabase Edge Function：[supabase/functions/ai-teacher/index.ts](../supabase/functions/ai-teacher/index.ts)
- Supabase Function 配置：[supabase/config.toml](../supabase/config.toml)

默认接口：

```js
window.CAMPUS_AI_PROXY_ENDPOINT = 'https://qfoaoaggyfhkkvoxyxrb.supabase.co/functions/v1/ai-teacher';
```

## 本地兜底

如果 Supabase Function 暂时没部署，2D/3D 会自动退回本地脚本 AI 老师，不会直接坏掉。

3D 控制台可用命令：

```text
ai
ai teachers
ai scripted
ai reset
```

## 新增或修改 AI 老师性格

改 [js/ai-teachers.js](../js/ai-teachers.js) 里的 `TEACHERS`：

- `displayName`：游戏里显示的名字
- `subject`：负责主题
- `personality`：性格描述
- `opening`：开场白
- `systemPrompt`：真正发给 Gemini 的系统提示词

新增老师时给一个唯一 `id`，然后在 2D/3D 互动入口里引用这个 `id` 即可。
