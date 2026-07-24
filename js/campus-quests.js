/*
 * 2D/3D 共用校园任务系统
 * 用 localStorage 保存进度：玩家在 2D 和 3D 完成的导览任务能互通。
 */
(function () {
    const STORAGE_KEY = 'campus_quest_state_v1';

    const QUESTS = {
        freshman_route: {
            title: '新生校园导览',
            description: '帮助新来的同学快速认识校园、老师和主要活动点。',
            steps: [
                { id: 'gate_checkin', label: '校门打卡', hint: '先到校门/入口完成第一站打卡。' },
                { id: 'manual', label: '领取校园手册', hint: '领取校园手册，知道教学楼、食堂和操场的位置。' },
                { id: 'ai_teacher', label: '询问AI老师', hint: '找AI导览老师问一次路。' },
                { id: 'canteen', label: '熟悉食堂', hint: '到食堂点餐或查看排队动线。' },
                { id: 'playground', label: '操场训练', hint: '到操场完成一次训练。' },
                { id: 'office', label: '教师办公室咨询', hint: '去教师办公室问课程或老师位置。' }
            ]
        },
        campus_life: {
            title: '校园生活初体验',
            description: '认识同学、社团和图书馆，让校园不只是建筑。',
            steps: [
                { id: 'class_story', label: '触发班级剧情', hint: '进教室和同学聊聊学校的槽点。' },
                { id: 'club', label: '了解社团招新', hint: '去学生会或活动室看看社团。' },
                { id: 'library', label: '图书馆检索', hint: '去图书馆查一次资料。' },
                { id: 'broadcast', label: '校园广播', hint: '去广播室录一段校园介绍。' }
            ]
        }
    };

    const INTERACTION_TO_STEP = {
        '校门打卡': 'gate_checkin',
        '领取校园手册': 'manual',
        '新生导览': 'gate_checkin',
        'AI老师问答': 'ai_teacher',
        'AI语文老师': 'ai_teacher',
        'AI数学老师': 'ai_teacher',
        'AI英语老师': 'ai_teacher',
        'AI体育老师': 'ai_teacher',
        'AI信息老师': 'ai_teacher',
        'AI生物老师': 'ai_teacher',
        'AI班主任': 'ai_teacher',
        'AI保安大叔': 'ai_teacher',
        '食堂点餐': 'canteen',
        '吃午餐': 'canteen',
        '操场训练': 'playground',
        '跑步': 'playground',
        '篮球': 'playground',
        '踢球': 'playground',
        '教师办公室咨询': 'office',
        '找老师': 'office',
        '班级剧情': 'class_story',
        '社团招新': 'club',
        '任务看板': 'club',
        '图书馆检索': 'library',
        '查资料': 'library',
        '借书': 'library',
        '校园广播': 'broadcast'
    };

    function loadState() {
        try {
            const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return {
                completedSteps: Array.isArray(state.completedSteps) ? state.completedSteps : [],
                completedQuests: Array.isArray(state.completedQuests) ? state.completedQuests : [],
                lastUpdated: state.lastUpdated || 0
            };
        } catch (err) {
            return { completedSteps: [], completedQuests: [], lastUpdated: 0 };
        }
    }

    function saveState(state) {
        state.lastUpdated = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function getQuestProgress(questId, state = loadState()) {
        const quest = QUESTS[questId];
        if (!quest) return null;
        const completed = quest.steps.filter(step => state.completedSteps.includes(step.id));
        return {
            quest,
            completedCount: completed.length,
            total: quest.steps.length,
            done: completed.length >= quest.steps.length,
            nextStep: quest.steps.find(step => !state.completedSteps.includes(step.id)) || null
        };
    }

    function completeStep(stepId) {
        const state = loadState();
        if (!stepId || state.completedSteps.includes(stepId)) {
            return { changed: false, state, completedQuest: null, progress: findStepProgress(stepId, state) };
        }

        state.completedSteps.push(stepId);
        let completedQuest = null;
        Object.keys(QUESTS).forEach(questId => {
            const progress = getQuestProgress(questId, state);
            if (progress?.done && !state.completedQuests.includes(questId)) {
                state.completedQuests.push(questId);
                completedQuest = progress.quest;
            }
        });
        saveState(state);
        return { changed: true, state, completedQuest, progress: findStepProgress(stepId, state) };
    }

    function findStepProgress(stepId, state = loadState()) {
        for (const questId of Object.keys(QUESTS)) {
            const quest = QUESTS[questId];
            if (quest.steps.some(step => step.id === stepId)) {
                return getQuestProgress(questId, state);
            }
        }
        return null;
    }

    function completeInteraction(interactionName) {
        return completeStep(INTERACTION_TO_STEP[interactionName]);
    }

    function getNextHint() {
        const state = loadState();
        for (const questId of Object.keys(QUESTS)) {
            const progress = getQuestProgress(questId, state);
            if (progress && !progress.done && progress.nextStep) {
                return `${progress.quest.title}：下一步是「${progress.nextStep.label}」。${progress.nextStep.hint}`;
            }
        }
        return '两条校园任务线都完成了。可以继续自由探索，或者找AI老师问新的挑战。';
    }

    function getSummary() {
        const state = loadState();
        return Object.keys(QUESTS).map(questId => {
            const progress = getQuestProgress(questId, state);
            return `${progress.quest.title} ${progress.completedCount}/${progress.total}`;
        }).join(' · ');
    }

    window.CampusQuests = {
        quests: QUESTS,
        interactionToStep: INTERACTION_TO_STEP,
        loadState,
        saveState,
        completeStep,
        completeInteraction,
        getQuestProgress,
        getNextHint,
        getSummary
    };
})();
