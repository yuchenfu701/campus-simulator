# Gemini 接入与 AI 老师配置说明

这套项目现在有两层 AI：默认是本地脚本兜底，展会现场断网也能回答；如果你想换成真正的大模型，可以接 Gemini API。

## 1. 推荐方案

优先用 Gemini。原因是它支持 system instruction，能给不同老师设置不同性格，而且有免费额度/免费层级可用；具体额度会变，最终以 Google 官方页面为准：

- API Key 官方说明：https://ai.google.dev/gemini-api/docs/api-key
- 文本生成与 system instruction：https://ai.google.dev/gemini-api/docs/text-generation
- 费用与免费层级：https://ai.google.dev/gemini-api/docs/billing
- 速率限制：https://ai.google.dev/gemini-api/docs/rate-limits

## 2. 正式推荐：后端代理接入

现在前端默认会请求：

```text
/api/ai-teacher
```

这个接口会在后端读取环境变量：

```text
GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
```

这样同学访问网站时都能使用真正的 AI 老师，但浏览器源码里看不到 API Key。

不同平台填写位置：

- Render：项目 Dashboard → Environment → Add Environment Variable。
- Vercel：Project Settings → Environment Variables。
- Netlify：Site configuration → Environment variables。
- 本机 Express 后端：写在 `server/.env`，这个文件不会提交。

部署后，2D/3D 页面会自动优先使用后端 Gemini 代理；如果代理不可用，会退回本地脚本回答，展会现场不至于直接坏掉。

如果前端和后端不是同一个域名，比如前端放 GitHub Pages、后端放 Render，就在这里填写后端接口地址：

```text
js/ai-public-config.js
```

示例：

```js
window.CAMPUS_AI_PROXY_ENDPOINT = 'https://你的后端域名.onrender.com/api/ai-teacher';
```

## 3. 展会/本机快速接入

如果只是你自己电脑演示，并且已经启动了后端：

```text
cd server
npm start
```

前端会请求本机/同源的 `/api/ai-teacher`。如果你暂时没有部署后端，也可以进入 3D 校园控制台，手动输入：

```text
ai gemini 你的API_KEY gemini-2.5-flash
```

这个方式会把 key 保存在当前浏览器的 localStorage，只适合本机演示，不适合正式给同学访问。

其他常用命令：

```text
ai
ai teachers
ai scripted
ai reset
```

- `ai`：查看当前 AI 配置。
- `ai teachers`：查看已有 AI 老师 ID。
- `ai scripted`：切回本地脚本兜底。
- `ai reset`：清空本机 AI 配置，刷新后恢复默认。

也可以在浏览器开发者工具 Console 里直接设置：

```js
CampusAI.saveConfig({
  provider: 'gemini',
  model: 'gemini-2.5-flash',
  apiKey: '你的API_KEY',
  endpoint: ''
});
```

## 4. 正式上线安全提醒

不要把 API Key 写进网页源码。前端项目会被任何访问者看到源码，直接暴露 key 不安全。

正确做法就是现在项目采用的后端代理：

1. 前端只请求你自己的接口，比如 `/api/ai-teacher`。
2. API Key 放在服务器环境变量里。
3. 服务器再去请求 Gemini。
4. 前端只拿到 AI 老师的回答，拿不到 key。

## 5. AI 老师性格放在哪里

AI 老师统一放在：

```text
js/ai-teachers.js
```

每个老师主要改这些字段：

- `displayName`：游戏里显示的老师名字。
- `subject`：老师负责的主题。
- `personality`：性格描述。
- `catchphrase`：口头禅。
- `opening`：打开 AI 老师面板时的开场白。
- `systemPrompt`：真正发给模型的系统提示词。

如果想新增老师，就在 `TEACHERS` 里加一个对象，并保证有唯一的 `id`。

## 6. AI 调用逻辑放在哪里

- AI 统一适配层：`js/ai-provider.js`
- AI 公开代理地址配置：`js/ai-public-config.js`
- 老师性格配置：`js/ai-teachers.js`
- Express 后端代理：`server/routes/ai.js`
- Vercel 函数代理：`api/ai-teacher.js`
- Netlify 函数代理：`netlify/functions/ai-teacher.js`
- 2D 地图里的 AI 老师交互点：`js/map.js`
- 2D 地图弹窗与问答逻辑：`js/ui.js`
- 3D 校园 AI 老师面板：`校园企业家，教学楼小副本/index.html`
- 2D/3D 共用剧情任务进度：`js/campus-quests.js`

## 7. 现在已经有的互动

2D 地图：

- AI 导览老师：新生路线、任务提示、校园介绍。
- AI 班主任：班级适应、今日任务、老师/同学关系。
- AI 语文老师：观察校园、把槽点和真实细节转成剧情素材。
- AI 数学老师：路线规划、坐标感、步骤拆解。
- AI 英语老师：鼓励式引导，夹一点简单英文。
- AI 体育老师：操场训练、跑步任务、运动剧情。
- AI 信息老师：解释 AI、软件、bug 和功能用法。
- AI 生物老师：健康、环境、食堂和实验室相关引导。
- AI 保安大叔：校门规则、找路、失物招领式提示。

3D 校园：

- 3D AI 老师面板可切换不同老师。
- 任务热点包含：校门打卡、领取校园手册、食堂熟悉、操场训练、办公室咨询、图书馆检索、班级剧情、社团招新、校园广播。
- 老师回答会结合当前任务进度提示下一步，让玩家不只是“到处逛”，而是有目标地熟悉校园。
