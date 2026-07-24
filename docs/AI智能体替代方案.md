# AI 智能体替代方案（替代扣子智能体）

目标：不要每个月换智能体；能设置系统提示词；尽量免费或低成本；展会现场不能因为网络或额度问题导致游戏卡死。

## 推荐结论

1. **默认保留本地脚本 AI 老师兜底**  
   已接入 `js/ai-provider.js`。不需要网络、不需要 Key，适合展会现场保底。缺点是回答不够智能，但稳定。

2. **首选：Google Gemini API**  
   适合你想要“免费开始 + 系统提示词 + 后续可升级”的路线。官方文档写明可以用 `system_instruction` 控制模型行为；价格页也明确有 Free 档。  
   缺点：国内网络环境可能不稳定，展会现场最好不要只依赖它。

3. **国内低成本备选：硅基流动 SiliconFlow**  
   API 是 OpenAI Chat Completions 格式，`messages` 里可以传 `role: "system"`，适合做 AI 老师。  
   优点是国内访问通常更顺，接入也简单。缺点是免费/价格和可用模型会变，正式用前要看后台当前模型列表。

4. **速度备选：Groq**  
   也能走 OpenAI 兼容的聊天接口，适合轻量问答。  
   缺点是免费额度/限速会变，适合作为备选，不建议当唯一方案。

5. **聚合备选：OpenRouter**  
   可以一个接口切很多模型，甚至找免费模型。  
   缺点是免费模型稳定性和质量不固定，更适合测试。

## 当前项目怎么配置

项目已经新增：

- `js/ai-provider.js`
- 2D：`index.html` 已引入该文件
- 3D：`校园企业家，教学楼小副本/index.html` 已引入该文件

现在默认配置是：

```js
localStorage.setItem('campus_ai_config', JSON.stringify({
  provider: 'scripted'
}));
```

如果你后面有自己的后端代理，建议这样填：

```js
localStorage.setItem('campus_ai_config', JSON.stringify({
  provider: 'siliconflow',
  endpoint: '你的后端代理地址，例如 https://你的域名/api/ai-chat',
  model: 'Qwen/Qwen2.5-7B-Instruct',
  apiKey: '',
  systemPrompt: '你是爱哲安民未来学校模拟器里的AI老师，回答简短、温和、适合新同学。'
}));
```

注意：不要把真实 API Key 直接写进网页前端。网页发布后，别人能在浏览器里看到它。

## 后续建议

短期先用“脚本兜底 + 可配置在线 AI”。等 2D/3D 的剧情稳定后，再单独做一个小后端代理，把 AI Key 放在后端，这样既安全，也不用每个月换扣子智能体。

## 参考依据

- Gemini API 文档：支持用 `system_instruction` 控制模型行为。  
  https://ai.google.dev/gemini-api/docs/text-generation
- Gemini API 计费/额度文档：新账号有 Free Tier，具体可用模型和限制以官方页为准。  
  https://ai.google.dev/gemini-api/docs/billing
- 硅基流动 Chat Completions 文档：OpenAI 兼容格式，示例里 `messages` 支持 `role: "system"`。  
  https://docs.siliconflow.cn/cn/api-reference/chat-completions/chat-completions
- Unreal Engine Blend Space 文档：角色运动常用速度与方向作为输入，混合 idle / walk / jog / run 动画。  
  https://dev.epicgames.com/documentation/unreal-engine/locomotion-based-blending-in-unreal-engine
