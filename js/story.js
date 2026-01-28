/**
 * 爱哲安民未来学校校园模拟器 - 剧情系统
 * 管理主线剧情、事件触发和智能体对话
 */

class StorySystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // 当前学期和周次
        this.currentSemester = 1; // 1-6: 初一上、初一下、初二上、初二下、初三上、初三下
        this.currentWeek = 1;
        this.isHoliday = false;
        
        // 剧情状态
        this.completedEvents = new Set();
        this.activeDialogue = null;
        this.playerChoices = [];
        
        // 智能体状态
        this.agentStates = {
            '体育老师': { mood: 'frustrated', relationship: 0 },
            '信息技术老师': { mood: 'calm', relationship: 0 },
            '刘语晴': { mood: 'excited', relationship: 0 },
            '道德与法治老师': { mood: 'irritated', relationship: 0 },
            '保安': { mood: 'strict', relationship: 0 },
            '复印老师': { mood: 'guarded', relationship: 0 },
            '教导主任': { mood: 'angry', relationship: 0 }
        };
        
        // 主线剧情数据
        this.mainStoryEvents = this.initMainStoryEvents();
        
        // 智能体对话系统
        this.agentDialogues = this.initAgentDialogues();
    }
    
    // 初始化主线剧情事件
    initMainStoryEvents() {
        return {
            // 初一上学期
            '1-1': {
                id: 'military_training',
                name: '军训',
                description: '新学期开始，军训拉开序幕',
                choices: [
                    {
                        text: '认真训练',
                        effects: { health: 30, energy: -10 },
                        relationships: { '教官': 20, '语文老师': 20, '数学老师': 20 }
                    },
                    {
                        text: '偷懒划水',
                        effects: { health: -10, energy: 20 },
                        relationships: { '教官': -10, '语文老师': -10, '数学老师': -10 }
                    },
                    {
                        text: '帮助同学',
                        effects: { social: 10 },
                        relationships: { '林浩阳': 20 },
                        triggerDialogue: 'military_help_linHaoyang'
                    }
                ]
            },
            
            '1-2': {
                id: 'class_election',
                name: '开学典礼与班干部竞选',
                description: '班级选举班干部',
                choices: [
                    {
                        text: '竞选班长',
                        effects: { energy: -15 },
                        relationships: { '语文老师': 20, allStudents: 30 }
                    },
                    {
                        text: '竞选学习委员',
                        effects: { energy: -15 },
                        relationships: { '语文老师': 20, allStudents: 30 }
                    },
                    {
                        text: '保持低调',
                        effects: { energy: 30 }
                    }
                ]
            },
            
            '1-3': {
                id: 'meet_classmates',
                name: '认识班级同学',
                description: '和新同学们互相认识',
                dialogue: 'meet_all_classmates'
            },
            
            '1-4': {
                id: 'first_monthly_exam',
                name: '第一次月考',
                description: '第一次考试来临',
                choices: [
                    {
                        text: '疯狂刷题',
                        effects: { academic: 40, energy: -30, allSubjects: 40 }
                    },
                    {
                        text: '请教学霸',
                        effects: { academic: 30, energy: -20, allSubjects: 30 },
                        relationships: { '李昕瑶': 10 },
                        triggerDialogue: 'ask_lixinyao_study'
                    },
                    {
                        text: '正常复习',
                        effects: { academic: 15, energy: -10, allSubjects: 15 }
                    }
                ]
            }
            // ... 更多剧情事件
        };
    }
    
    // 初始化智能体对话系统
    initAgentDialogues() {
        return {
            // 体育老师 - 抢课剧情
            '体育老师': {
                state: 'frustrated',
                dialogue: [
                    {
                        speaker: '体育老师',
                        text: '什么？！又占？！(捏扁瓶子) 体育课不是玩的！是正课！',
                        mood: 'angry',
                        action: 'squeeze_bottle'
                    },
                    {
                        speaker: '体育老师', 
                        text: '...唉，算了，我去说也没用，上次就被怼回来了...(垂头)',
                        mood: 'frustrated',
                        action: 'look_down'
                    },
                    {
                        speaker: '体育老师',
                        text: '你们是真想上，还是就想逃语文课？(怀疑盯)',
                        mood: 'suspicious',
                        waitForInput: true,
                        validKeywords: ['健康', '学习效率', '全班支持', '懦弱']
                    }
                ],
                responses: {
                    '健康': [
                        {
                            speaker: '体育老师',
                            text: '蔫了吧唧的确实不像话！(皱眉) 但语文老师肯定说"课间不能活动？"...难办啊',
                            mood: 'concerned',
                            action: 'frown'
                        }
                    ],
                    '学习效率': [
                        {
                            speaker: '体育老师',
                            text: '有道理啊！(挺直腰) 体育是给脑子充电！... (声调转低) 但领导能信吗？',
                            mood: 'hopeful',
                            action: 'straighten_up'
                        }
                    ],
                    '全班支持': [
                        {
                            speaker: '体育老师',
                            text: '真...真的？(动容) 联名？别搞成闹事啊...(紧张张望)',
                            mood: 'moved',
                            action: 'look_around'
                        }
                    ],
                    '懦弱': [
                        {
                            speaker: '体育老师',
                            text: '我怕？！(哨子狂吹) 我是为你们好！... 不管了，你们自己看着办！',
                            mood: 'angry',
                            action: 'blow_whistle',
                            failState: true
                        }
                    ]
                },
                successCondition: '学习效率+全班支持',
                successDialogue: [
                    {
                        speaker: '体育老师',
                        text: '行！拼了！(握拳) 但你们必须做到：认真训练！偷懒就永远别想我出头！',
                        mood: 'determined',
                        action: 'clench_fist'
                    },
                    {
                        speaker: '体育老师',
                        text: '操场集合！(响亮吹哨) 记住你们的承诺！',
                        mood: 'confident',
                        action: 'blow_whistle_loud'
                    }
                ]
            },
            
            // 信息技术老师 - 玩游戏剧情
            '信息技术老师': {
                state: 'teaching',
                dialogue: [
                    {
                        speaker: '信息技术老师',
                        text: '请求接收…分析中…（停顿2秒）',
                        mood: 'processing',
                        action: 'adjust_glasses',
                        delay: 2000
                    },
                    {
                        speaker: '信息技术老师',
                        text: '同学，计算机是求知之门，非娱乐终端。拒绝执行。',
                        mood: 'calm',
                        action: 'push_glasses'
                    }
                ],
                responses: {
                    '游戏': [
                        {
                            speaker: '信息技术老师',
                            text: '检测到重复无效请求。启动替代方案——建议完成《信息技术发展史思维导图》',
                            mood: 'systematic',
                            action: 'type_slowly'
                        }
                    ],
                    '无聊': [
                        {
                            speaker: '信息技术老师', 
                            text: '无聊状态已检测。正在生成学习任务…任务已生成：《计算机硬件维护实践报告》500字',
                            mood: 'helpful',
                            action: 'generate_task'
                        }
                    ],
                    '威胁': [
                        {
                            speaker: '信息技术老师',
                            text: '安全协议已触发。请先阅读《校园网络安全守则》（屏幕锁定，全文加载）',
                            mood: 'security_mode',
                            action: 'lock_screen'
                        }
                    ]
                },
                infiniteLoop: true // 永远生成新任务
            },
            
            // 刘语晴 - 写作业剧情
            '刘语晴': {
                state: 'excited_about_anime',
                dialogue: [
                    {
                        speaker: '刘语晴',
                        text: '哎呀！新番更新了！快来一起看吧！(兴奋地拉着你)',
                        mood: 'excited',
                        action: 'pull_arm'
                    },
                    {
                        speaker: '刘语晴',
                        text: '作业什么的明天再说嘛～这个番超好看的！',
                        mood: 'persuasive',
                        action: 'wave_hand'
                    }
                ],
                painPoint: '被老师批评',
                successKeyword: '老师会批评',
                successDialogue: [
                    {
                        speaker: '刘语晴',
                        text: '啊...对哦，明天老师检查作业...(脸色变了)',
                        mood: 'worried',
                        action: 'face_change'
                    },
                    {
                        speaker: '刘语晴', 
                        text: '我和你一起写作业吧。(无奈但坚定)',
                        mood: 'determined',
                        action: 'nod_firmly'
                    }
                ]
            }
            
            // ... 其他智能体对话
        };
    }
    
    // 检查并触发主线事件
    checkMainStoryEvents() {
        const eventKey = `${this.currentSemester}-${this.currentWeek}`;
        const event = this.mainStoryEvents[eventKey];
        
        if (event && !this.completedEvents.has(event.id)) {
            this.triggerEvent(event);
        }
    }
    
    // 触发事件
    triggerEvent(event) {
        console.log('📖 触发主线事件:', event.name);
        
        if (event.choices) {
            this.showChoiceDialog(event);
        } else if (event.dialogue) {
            this.startDialogue(event.dialogue);
        }
    }
    
    // 显示选择对话框
    showChoiceDialog(event) {
        const ui = this.gameEngine.getSystem('ui');
        if (!ui) return;
        
        ui.showChoiceDialog(event.name, event.description, event.choices, (choice) => {
            this.handleChoice(event, choice);
        });
    }
    
    // 处理玩家选择
    handleChoice(event, choice) {
        console.log('🎯 玩家选择:', choice.text);
        
        // 应用效果
        this.applyEffects(choice.effects);
        this.applyRelationshipChanges(choice.relationships);
        
        // 触发后续对话
        if (choice.triggerDialogue) {
            this.startDialogue(choice.triggerDialogue);
        }
        
        // 标记事件完成
        this.completedEvents.add(event.id);
        this.playerChoices.push({
            eventId: event.id,
            choice: choice.text,
            timestamp: Date.now()
        });
    }
    
    // 应用属性效果
    applyEffects(effects) {
        if (!effects) return;
        
        const player = this.gameEngine.getSystem('player');
        if (!player) return;
        
        Object.entries(effects).forEach(([attr, value]) => {
            if (attr === 'allSubjects') {
                // 应用到所有学科
                ['chinese', 'math', 'english', 'physics', 'chemistry', 'biology'].forEach(subject => {
                    player.subjects[subject] = Math.max(0, Math.min(100, (player.subjects[subject] || 0) + value));
                });
            } else if (player.attributes[attr] !== undefined) {
                player.attributes[attr] = Math.max(0, Math.min(100, player.attributes[attr] + value));
            }
        });
    }
    
    // 应用关系变化
    applyRelationshipChanges(relationships) {
        if (!relationships) return;
        
        const relationshipSystem = this.gameEngine.getSystem('relationship');
        if (!relationshipSystem) return;
        
        Object.entries(relationships).forEach(([character, value]) => {
            if (character === 'allStudents') {
                // 应用到所有学生
                const allStudents = ['张俊熙', '林浩阳', '刘语晴', '李昕瑶', '郑兴冉', '周泽宇', '王艺辰', '陈梓墨'];
                allStudents.forEach(student => {
                    relationshipSystem.modifyRelationship(student, value);
                });
            } else {
                relationshipSystem.modifyRelationship(character, value);
            }
        });
    }
    
    // 开始智能体对话
    startAgentDialogue(agentName) {
        const agentData = this.agentDialogues[agentName];
        if (!agentData) {
            console.log('❌ 未找到智能体:', agentName);
            return false;
        }
        
        console.log('🤖 开始智能体对话:', agentName);
        this.activeDialogue = {
            agent: agentName,
            data: agentData,
            currentIndex: 0,
            userInputs: [],
            state: agentData.state
        };
        
        // 显示第一句对话
        this.showNextAgentDialogue();
        return true;
    }
    
    // 显示下一句智能体对话
    showNextAgentDialogue() {
        if (!this.activeDialogue) return;
        
        const dialogue = this.activeDialogue.data.dialogue[this.activeDialogue.currentIndex];
        if (!dialogue) return;
        
        const ui = this.gameEngine.getSystem('ui');
        if (!ui) return;
        
        // 显示对话内容
        ui.showAgentDialogue(dialogue, (userInput) => {
            if (dialogue.waitForInput) {
                this.handleAgentInput(userInput);
            } else {
                this.nextAgentDialogue();
            }
        });
    }
    
    // 处理智能体输入
    handleAgentInput(userInput) {
        if (!this.activeDialogue) return;
        
        const agentData = this.activeDialogue.data;
        const dialogue = agentData.dialogue[this.activeDialogue.currentIndex];
        
        // 检查关键词
        let matchedKeyword = null;
        for (const keyword of dialogue.validKeywords || []) {
            if (userInput.includes(keyword)) {
                matchedKeyword = keyword;
                break;
            }
        }
        
        if (matchedKeyword && agentData.responses[matchedKeyword]) {
            this.showAgentResponse(matchedKeyword);
        } else {
            // 默认回复
            this.showDefaultAgentResponse();
        }
        
        this.activeDialogue.userInputs.push(userInput);
    }
    
    // 显示智能体回应
    showAgentResponse(keyword) {
        const response = this.activeDialogue.data.responses[keyword];
        const ui = this.gameEngine.getSystem('ui');
        
        response.forEach((line, index) => {
            setTimeout(() => {
                ui.showAgentDialogue(line, () => {
                    if (index === response.length - 1) {
                        this.checkAgentSuccess();
                    }
                });
            }, index * 2000);
        });
    }
    
    // 检查智能体对话成功条件
    checkAgentSuccess() {
        const agentData = this.activeDialogue.data;
        const userInputs = this.activeDialogue.userInputs.join(' ');
        
        if (agentData.successCondition) {
            const conditions = agentData.successCondition.split('+');
            const allMet = conditions.every(condition => userInputs.includes(condition));
            
            if (allMet && agentData.successDialogue) {
                this.showAgentSuccessDialogue();
                return;
            }
        }
        
        if (agentData.painPoint && userInputs.includes(agentData.painPoint)) {
            this.showAgentSuccessDialogue();
            return;
        }
        
        // 继续对话或循环
        if (agentData.infiniteLoop) {
            this.generateInfiniteTask();
        }
    }
    
    // 显示智能体成功对话
    showAgentSuccessDialogue() {
        const successDialogue = this.activeDialogue.data.successDialogue;
        const ui = this.gameEngine.getSystem('ui');
        
        successDialogue.forEach((line, index) => {
            setTimeout(() => {
                ui.showAgentDialogue(line, () => {
                    if (index === successDialogue.length - 1) {
                        this.endAgentDialogue(true);
                    }
                });
            }, index * 2000);
        });
    }
    
    // 生成无限循环任务（信息老师专用）
    generateInfiniteTask() {
        const tasks = [
            '《计算机发展史研究报告》1000字',
            '《软件工程实践指南》阅读笔记',
            '《网络安全防护体系》思维导图',
            '《人工智能伦理思考》论文',
            '《数据结构优化方案》设计书'
        ];
        
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        const ui = this.gameEngine.getSystem('ui');
        
        ui.showAgentDialogue({
            speaker: '信息技术老师',
            text: `检测到学习进度良好。新任务已生成：${randomTask}`,
            mood: 'systematic',
            action: 'generate_task'
        }, () => {
            this.endAgentDialogue(false);
        });
    }
    
    // 结束智能体对话
    endAgentDialogue(success) {
        console.log('🎭 智能体对话结束:', this.activeDialogue.agent, success ? '成功' : '失败');
        
        // 记录结果
        if (success) {
            this.completedEvents.add(`agent_${this.activeDialogue.agent}`);
        }
        
        this.activeDialogue = null;
    }
    
    // 推进时间
    advanceWeek() {
        this.currentWeek++;
        
        // 检查学期结束
        const weeksPerSemester = this.isHoliday ? 8 : 16;
        if (this.currentWeek > weeksPerSemester) {
            this.advanceSemester();
        }
        
        // 检查主线事件
        this.checkMainStoryEvents();
    }
    
    // 推进学期
    advanceSemester() {
        this.currentSemester++;
        this.currentWeek = 1;
        this.isHoliday = !this.isHoliday;
        
        console.log('📅 进入新学期:', this.getSemesterName());
    }
    
    // 获取学期名称
    getSemesterName() {
        const semesterNames = [
            '',
            '初一上学期', '初一上学期寒假', '初一下学期', '初一下学期暑假',
            '初二上学期', '初二上学期寒假', '初二下学期', '初二下学期暑假', 
            '初三上学期', '初三上学期寒假', '初三下学期'
        ];
        
        return semesterNames[this.currentSemester] || '未知学期';
    }
    
    // 获取剧情进度
    getProgress() {
        return {
            semester: this.getSemesterName(),
            week: this.currentWeek,
            completedEvents: Array.from(this.completedEvents),
            playerChoices: this.playerChoices
        };
    }
    
    // 保存剧情数据
    save() {
        return {
            currentSemester: this.currentSemester,
            currentWeek: this.currentWeek,
            isHoliday: this.isHoliday,
            completedEvents: Array.from(this.completedEvents),
            playerChoices: this.playerChoices,
            agentStates: this.agentStates
        };
    }
    
    // 加载剧情数据
    load(data) {
        this.currentSemester = data.currentSemester || 1;
        this.currentWeek = data.currentWeek || 1;
        this.isHoliday = data.isHoliday || false;
        this.completedEvents = new Set(data.completedEvents || []);
        this.playerChoices = data.playerChoices || [];
        this.agentStates = { ...this.agentStates, ...data.agentStates };
    }
}

// 导出类
window.StorySystem = StorySystem; 