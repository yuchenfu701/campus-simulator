/*
 * 校园模拟器 AI 适配层
 * - 默认不依赖外部服务：使用脚本兜底，保证展会现场稳定。
 * - 如需接入真实模型，建议把 key 放在自己的后端代理里，不要直接写到前端。
 */
(function () {
    const DEFAULT_SYSTEM_PROMPT = [
        '你是“爱哲安民未来学校模拟器”里的AI导览老师。',
        '你的任务是帮助新同学认识校园、了解老师和同学、推荐可做任务。',
        '回答要短、温和、像学校里的导览老师，不要编造不存在的地点。'
    ].join('\n');

    const PROVIDERS = {
        scripted: {
            label: '本地脚本兜底',
            free: true,
            supportsSystemPrompt: true,
            note: '无网络也能用，适合展会保底。'
        },
        proxy: {
            label: '后端代理 Gemini',
            endpoint: '/api/ai-teacher',
            defaultModel: 'gemini-2.5-flash',
            supportsSystemPrompt: true,
            note: '推荐正式使用：API Key 放在后端环境变量里，所有同学都能用，前端看不到 key。'
        },
        gemini: {
            label: 'Google Gemini API',
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
            defaultModel: 'gemini-2.5-flash',
            supportsSystemPrompt: true,
            note: '有免费额度，支持 system instruction；国内网络环境需自行确认。'
        },
        groq: {
            label: 'Groq API',
            endpoint: 'https://api.groq.com/openai/v1/chat/completions',
            defaultModel: 'llama-3.1-8b-instant',
            supportsSystemPrompt: true,
            note: 'OpenAI 兼容格式，速度快，适合轻量问答。'
        },
        siliconflow: {
            label: '硅基流动 SiliconFlow',
            endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
            defaultModel: 'Qwen/Qwen2.5-7B-Instruct',
            supportsSystemPrompt: true,
            note: '国内访问通常更方便，OpenAI 兼容格式，适合作为低成本备选。'
        },
        openrouter: {
            label: 'OpenRouter',
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            defaultModel: 'qwen/qwen-2.5-7b-instruct:free',
            supportsSystemPrompt: true,
            note: '聚合多家模型，部分模型有免费选项，稳定性取决于所选模型。'
        }
    };

    function getDefaultProxyEndpoint() {
        const explicit = window.CAMPUS_AI_PROXY_ENDPOINT || localStorage.getItem('campus_ai_proxy_endpoint') || '';
        if (explicit) return explicit;
        const legacyApiServer = localStorage.getItem('api_server_url') || '';
        if (legacyApiServer && !legacyApiServer.includes('supabase.co')) {
            return legacyApiServer.replace(/\/+$/, '') + '/ai-teacher';
        }
        return '/api/ai-teacher';
    }

    function buildProxyHeaders(endpoint) {
        const headers = { 'Content-Type': 'application/json' };
        const isSupabaseFunction = /^https:\/\/[^/]+\.supabase\.co\/functions\/v1\//i.test(String(endpoint || ''));
        const publishableKey = window.CAMPUS_SUPABASE_PUBLISHABLE_KEY || window.SUPABASE_KEY || '';
        if (isSupabaseFunction && publishableKey) {
            headers.apikey = publishableKey;
            headers.Authorization = `Bearer ${publishableKey}`;
        }
        return headers;
    }

    function getConfig() {
        try {
            const localConfig = window.CAMPUS_AI_LOCAL_CONFIG || {};
            const savedConfig = JSON.parse(localStorage.getItem('campus_ai_config') || '{}');
            const preferLocalConfig = !!(localConfig.apiKey || localConfig.endpoint || localConfig.provider) && (!savedConfig.apiKey || savedConfig.provider === 'scripted');
            return {
                provider: 'proxy',
                model: 'gemini-2.5-flash',
                apiKey: '',
                endpoint: getDefaultProxyEndpoint(),
                systemPrompt: DEFAULT_SYSTEM_PROMPT,
                ...(preferLocalConfig ? savedConfig : localConfig),
                ...(preferLocalConfig ? localConfig : savedConfig)
            };
        } catch (err) {
            console.warn('AI配置读取失败，使用默认脚本兜底', err);
            return { provider: 'scripted', model: '', apiKey: '', endpoint: '', systemPrompt: DEFAULT_SYSTEM_PROMPT };
        }
    }

    function saveConfig(config) {
        localStorage.setItem('campus_ai_config', JSON.stringify({ ...getConfig(), ...config }));
    }

    function fallbackTeacherReply(question = '', scene = 'campus', teacherId = 'guide') {
        if (window.CampusAITeachers) {
            return window.CampusAITeachers.fallbackReply(question, teacherId, scene);
        }
        const q = String(question).toLowerCase();
        if (q.includes('食堂') || q.includes('吃')) return '食堂在校园生活区附近。建议先去“食堂点餐”，恢复体力后再做课程任务。';
        if (q.includes('操场') || q.includes('跑')) return '操场适合做“操场训练”和跑步任务。跑完可以解锁运动相关剧情。';
        if (q.includes('老师') || q.includes('办公室')) return '想找老师可以去教师办公室，那里可以触发“教师办公室咨询”和AI老师问答。';
        if (window.CampusQuests && (q.includes('任务') || q.includes('下一步') || q.includes('做什么'))) return window.CampusQuests.getNextHint();
        if (q.includes('新生') || q.includes('迷路') || q.includes('去哪')) return window.CampusQuests ? window.CampusQuests.getNextHint() : '先完成“新生导览”：校门打卡、领取校园手册，然后去教学楼、食堂、操场各熟悉一次。';
        if (scene.includes('3d')) return '你现在在3D校园里，可以先看教学楼正门、操场、食堂和厕所布局；靠近我按 E 可以继续问路。';
        return '建议从最近的互动开始：新生导览、AI老师问答、任务看板、食堂点餐和操场训练。';
    }

    function normalizeMessages(messages, systemPrompt) {
        const clean = Array.isArray(messages) ? messages.filter(Boolean) : [];
        if (clean.some(m => m.role === 'system')) return clean;
        return [{ role: 'system', content: systemPrompt || DEFAULT_SYSTEM_PROMPT }, ...clean];
    }

    function buildPrompt(systemPrompt, teacherId) {
        if (systemPrompt) return systemPrompt;
        if (window.CampusAITeachers) return window.CampusAITeachers.buildSystemPrompt(teacherId || 'guide');
        return getConfig().systemPrompt || DEFAULT_SYSTEM_PROMPT;
    }

    async function chat({ messages = [], systemPrompt, scene = 'campus', teacherId = 'guide' } = {}) {
        const config = getConfig();
        const provider = PROVIDERS[config.provider] || PROVIDERS.scripted;
        const prompt = systemPrompt
            || (config.systemPrompt && config.systemPrompt !== DEFAULT_SYSTEM_PROMPT ? config.systemPrompt : buildPrompt('', teacherId));

        if (config.provider === 'scripted' || (!config.apiKey && !config.endpoint)) {
            const lastUser = [...messages].reverse().find(m => m?.role === 'user')?.content || '';
            return fallbackTeacherReply(lastUser, scene, teacherId);
        }

        if (config.provider === 'proxy') {
            const endpoint = config.endpoint || getDefaultProxyEndpoint();
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: buildProxyHeaders(endpoint),
                body: JSON.stringify({
                    model: config.model || provider.defaultModel,
                    messages,
                    systemPrompt: prompt,
                    scene,
                    teacherId
                })
            });
            if (!res.ok) throw new Error(`AI代理请求失败：${res.status}`);
            const json = await res.json();
            return json?.reply || json?.text || fallbackTeacherReply('', scene, teacherId);
        }

        if (config.provider === 'gemini') {
            const model = config.model || provider.defaultModel;
            const endpoint = (config.endpoint || provider.endpoint)
                .replace('{model}', encodeURIComponent(model));
            const contents = messages
                .filter(m => m.role !== 'system')
                .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(m.content || '') }] }));
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': config.apiKey || ''
                },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: prompt }] },
                    contents
                })
            });
            if (!res.ok) throw new Error(`Gemini请求失败：${res.status}`);
            const json = await res.json();
            return json?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || fallbackTeacherReply('', scene, teacherId);
        }

        const endpoint = config.endpoint || provider.endpoint;
        const model = config.model || provider.defaultModel;
        const headers = { 'Content-Type': 'application/json' };
        if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;
        if (config.provider === 'openrouter') {
            headers['HTTP-Referer'] = location.origin;
            headers['X-Title'] = 'Campus Simulator';
        }

        const res = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model,
                messages: normalizeMessages(messages, prompt),
                temperature: 0.7,
                max_tokens: 350
            })
        });
        if (!res.ok) throw new Error(`AI请求失败：${res.status}`);
        const json = await res.json();
        return json?.choices?.[0]?.message?.content || fallbackTeacherReply('', scene, teacherId);
    }

    window.CampusAIProviders = PROVIDERS;
    window.CampusAI = {
        DEFAULT_SYSTEM_PROMPT,
        providers: PROVIDERS,
        getConfig,
        saveConfig,
        chat,
        fallbackTeacherReply
    };
})();
