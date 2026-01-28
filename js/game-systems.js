/**
 * 爱哲安民未来学校校园模拟器 - 基础游戏系统
 * 包含时间、事件、任务、关系、学术等系统
 */

// 时间系统
class TimeSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // 时间状态
        this.currentTime = {
            hour: 8,
            minute: 0,
            day: 1,
            week: 1,
            month: 9, // 9月开学
            year: 2024
        };
        
        // 时间流逝速度 (毫秒/游戏分钟)
        this.timeSpeed = 1000; // 1秒 = 1游戏分钟
        this.timeAccumulator = 0;
        
        // 星期名称
        this.dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    }
    
    async init() {
        console.log('⏰ 初始化时间系统');
        return true;
    }
    
    update(deltaTime) {
        this.timeAccumulator += deltaTime;
        
        if (this.timeAccumulator >= this.timeSpeed) {
            this.timeAccumulator -= this.timeSpeed;
            this.advanceTime(1); // 前进1分钟
        }
    }
    
    advanceTime(minutes) {
        this.currentTime.minute += minutes;
        
        if (this.currentTime.minute >= 60) {
            this.currentTime.hour += Math.floor(this.currentTime.minute / 60);
            this.currentTime.minute = this.currentTime.minute % 60;
        }
        
        if (this.currentTime.hour >= 24) {
            this.currentTime.day += Math.floor(this.currentTime.hour / 24);
            this.currentTime.hour = this.currentTime.hour % 24;
            
            // 广播新的一天事件
            if (this.gameEngine) {
                this.gameEngine.broadcastEvent('newDay', {
                    day: this.currentTime.day,
                    week: this.currentTime.week
                });
            }
        }
        
        if (this.currentTime.day > 7) {
            this.currentTime.week += Math.floor(this.currentTime.day / 7);
            this.currentTime.day = ((this.currentTime.day - 1) % 7) + 1;
        }
    }
    
    getTimeString() {
        const hour = this.currentTime.hour.toString().padStart(2, '0');
        const minute = this.currentTime.minute.toString().padStart(2, '0');
        return `${hour}:${minute}`;
    }
    
    getDayString() {
        const dayIndex = (this.currentTime.day - 1) % 7;
        return this.dayNames[dayIndex];
    }
    
    isClassTime() {
        const hour = this.currentTime.hour;
        return (hour >= 8 && hour < 12) || (hour >= 14 && hour < 17);
    }
    
    isLunchTime() {
        return this.currentTime.hour >= 12 && this.currentTime.hour < 14;
    }
    
    isEvening() {
        return this.currentTime.hour >= 18;
    }
    
    saveData() {
        return {
            version: '2.0.0',
            currentTime: { ...this.currentTime },
            timeSpeed: this.timeSpeed
        };
    }
    
    loadData(data) {
        if (!data) return false;
        
        try {
            if (data.currentTime) {
                this.currentTime = { ...this.currentTime, ...data.currentTime };
            }
            if (data.timeSpeed) {
                this.timeSpeed = data.timeSpeed;
            }
            
            console.log('✅ 时间系统数据加载成功');
            return true;
            
        } catch (error) {
            console.error('❌ 加载时间系统数据失败:', error);
            return false;
        }
    }
}

// 事件系统
class EventSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // 事件队列
        this.eventQueue = [];
        this.scheduledEvents = [];
        
        // 随机事件
        this.randomEvents = [
            {
                id: 'quiz_surprise',
                name: '突击测验',
                description: '老师突然宣布要进行一次小测验！',
                probability: 0.1,
                conditions: { isClassTime: true },
                effects: { stress: 10, academic: 5 }
            },
            {
                id: 'friend_help',
                name: '同学帮助',
                description: '同学主动帮你解答了一道难题。',
                probability: 0.15,
                effects: { social: 5, mood: 8 }
            },
            {
                id: 'cafeteria_special',
                name: '食堂特色菜',
                description: '今天食堂有特色菜，心情大好！',
                probability: 0.2,
                conditions: { isLunchTime: true },
                effects: { mood: 10, health: 5 }
            }
        ];
    }
    
    async init() {
        console.log('📅 初始化事件系统');
        return true;
    }
    
    update(deltaTime) {
        // 处理事件队列
        this.processEventQueue();
        
        // 检查计划事件
        this.checkScheduledEvents();
        
        // 触发随机事件
        this.checkRandomEvents();
    }
    
    processEventQueue() {
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            this.executeEvent(event);
        }
    }
    
    executeEvent(event) {
        console.log(`🎭 执行事件: ${event.name}`);
        
        // 应用事件效果
        if (event.effects && this.gameEngine) {
            const player = this.gameEngine.getSystem('player');
            if (player) {
                for (const [attribute, value] of Object.entries(event.effects)) {
                    player.adjustAttribute(attribute, value);
                }
            }
        }
        
        // 显示事件通知
        const ui = this.gameEngine?.getSystem('ui');
        if (ui) {
            ui.showNotification('事件发生', event.description, 'info', 4000);
        }
    }
    
    checkScheduledEvents() {
        const currentTime = this.gameEngine?.getSystem('time')?.currentTime;
        if (!currentTime) return;
        
        this.scheduledEvents = this.scheduledEvents.filter(event => {
            if (this.isTimeMatched(event.triggerTime, currentTime)) {
                this.addEvent(event);
                return false; // 移除已触发的事件
            }
            return true;
        });
    }
    
    checkRandomEvents() {
        const timeSystem = this.gameEngine?.getSystem('time');
        if (!timeSystem) return;
        
        this.randomEvents.forEach(event => {
            if (Math.random() < event.probability * 0.001) { // 降低触发概率
                if (this.checkEventConditions(event, timeSystem)) {
                    this.addEvent(event);
                }
            }
        });
    }
    
    checkEventConditions(event, timeSystem) {
        if (!event.conditions) return true;
        
        const conditions = event.conditions;
        
        if (conditions.isClassTime && !timeSystem.isClassTime()) return false;
        if (conditions.isLunchTime && !timeSystem.isLunchTime()) return false;
        if (conditions.isEvening && !timeSystem.isEvening()) return false;
        
        return true;
    }
    
    isTimeMatched(triggerTime, currentTime) {
        return triggerTime.hour === currentTime.hour &&
               triggerTime.minute === currentTime.minute &&
               triggerTime.day === currentTime.day;
    }
    
    addEvent(event) {
        this.eventQueue.push(event);
    }
    
    scheduleEvent(event, triggerTime) {
        this.scheduledEvents.push({
            ...event,
            triggerTime
        });
    }
    
    saveData() {
        return {
            version: '2.0.0',
            scheduledEvents: this.scheduledEvents
        };
    }
    
    loadData(data) {
        if (!data) return false;
        
        try {
            if (data.scheduledEvents) {
                this.scheduledEvents = [...data.scheduledEvents];
            }
            
            console.log('✅ 事件系统数据加载成功');
            return true;
            
        } catch (error) {
            console.error('❌ 加载事件系统数据失败:', error);
            return false;
        }
    }
}

// 任务系统
class TaskSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // 任务列表
        this.tasks = [];
        this.completedTasks = [];
        
        // 任务模板
        this.taskTemplates = [
            {
                id: 'daily_study',
                name: '每日学习',
                description: '完成今天的作业和复习',
                type: 'daily',
                rewards: { academic: 10, experience: 5 },
                requirements: { studyTime: 60 }
            },
            {
                id: 'exercise_daily',
                name: '体育锻炼',
                description: '进行30分钟的体育活动',
                type: 'daily',
                rewards: { health: 8, mood: 5 },
                requirements: { exerciseTime: 30 }
            },
            {
                id: 'social_interaction',
                name: '社交互动',
                description: '与至少3位同学进行对话',
                type: 'daily',
                rewards: { social: 6, mood: 3 },
                requirements: { interactions: 3 }
            }
        ];
    }
    
    async init() {
        console.log('📋 初始化任务系统');
        
        // 生成初始任务
        this.generateDailyTasks();
        
        return true;
    }
    
    update(deltaTime) {
        // 检查任务完成条件
        this.checkTaskCompletion();
    }
    
    generateDailyTasks() {
        // 清理过期的每日任务
        this.tasks = this.tasks.filter(task => task.type !== 'daily');
        
        // 生成新的每日任务
        this.taskTemplates.forEach(template => {
            if (template.type === 'daily') {
                const task = {
                    ...template,
                    id: `${template.id}_${Date.now()}`,
                    progress: {},
                    completed: false,
                    createdAt: Date.now()
                };
                
                // 初始化进度
                Object.keys(template.requirements).forEach(key => {
                    task.progress[key] = 0;
                });
                
                this.tasks.push(task);
            }
        });
        
        console.log(`📋 生成了 ${this.tasks.length} 个每日任务`);
    }
    
    checkTaskCompletion() {
        this.tasks.forEach(task => {
            if (!task.completed && this.isTaskCompleted(task)) {
                this.completeTask(task);
            }
        });
    }
    
    isTaskCompleted(task) {
        if (!task.requirements) return true;
        
        return Object.entries(task.requirements).every(([key, required]) => {
            return task.progress[key] >= required;
        });
    }
    
    completeTask(task) {
        task.completed = true;
        task.completedAt = Date.now();
        
        // 应用奖励
        if (task.rewards && this.gameEngine) {
            const player = this.gameEngine.getSystem('player');
            if (player) {
                Object.entries(task.rewards).forEach(([attribute, value]) => {
                    player.adjustAttribute(attribute, value);
                });
                
                // 完成目标
                player.completeGoal(task.id);
            }
        }
        
        // 移动到已完成列表
        this.completedTasks.push(task);
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        
        // 通知UI
        if (this.gameEngine) {
            this.gameEngine.broadcastEvent('taskCompleted', { task });
        }
        
        console.log(`✅ 任务完成: ${task.name}`);
    }
    
    updateTaskProgress(taskId, progressType, amount) {
        const task = this.tasks.find(t => t.id === taskId || t.id.startsWith(taskId));
        if (task && !task.completed) {
            task.progress[progressType] = (task.progress[progressType] || 0) + amount;
        }
    }
    
    getActiveTasks() {
        return this.tasks.filter(task => !task.completed);
    }
    
    getCompletedTasks() {
        return this.completedTasks;
    }
    
    saveData() {
        return {
            version: '2.0.0',
            tasks: this.tasks,
            completedTasks: this.completedTasks
        };
    }
    
    loadData(data) {
        if (!data) return false;
        
        try {
            if (data.tasks) {
                this.tasks = [...data.tasks];
            }
            if (data.completedTasks) {
                this.completedTasks = [...data.completedTasks];
            }
            
            console.log('✅ 任务系统数据加载成功');
            return true;
            
        } catch (error) {
            console.error('❌ 加载任务系统数据失败:', error);
            return false;
        }
    }
}

// 关系系统
class RelationshipSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // 关系数据
        this.relationships = {};
        
        // 初始化关系
        this.initializeRelationships();
    }
    
    async init() {
        console.log('👥 初始化关系系统');
        return true;
    }
    
    initializeRelationships() {
        // 所有NPC列表
        const npcs = [
            // 学生
            '张俊熙', '林昊阳', '刘雨晴', '李昕瑶', '郑星然', '周泽宇', '王亦辰', '陈子墨',
            
            // 老师
            '语文林老师', '数学王老师', '英语Miss Chen', '道法赵老师', '历史李老师', 
            '地理张老师', '生物周老师', '体育张教练', '信息吴老师',
            
            // 工作人员
            '保安大叔', '食堂阿姨', '小卖部老板', '教导主任',
            
            // 家人
            '爸爸', '妈妈', '哈基米'
        ];
        
        // 初始化所有NPC的关系数据
        npcs.forEach(npc => {
            // 根据角色类型设置不同的初始值
            let initialFriendship = 50;
            let initialTrust = 50;
            
            // 根据角色类型设置初始值
            if (npc === '教导主任') {
                initialFriendship = 30;
                initialTrust = 40;
            } else if (npc === '保安大叔' || npc === '食堂阿姨') {
                initialFriendship = 40;
            } else if (npc === '小卖部老板') {
                initialFriendship = 60;
                initialTrust = 60;
            } else if (npc === '道法赵老师') {
                initialFriendship = 35;
                initialTrust = 45;
            } else if (npc.includes('爸爸') || npc.includes('妈妈')) {
                initialFriendship = 80;
                initialTrust = 90;
            } else if (npc === '哈基米') {
                initialFriendship = 95;
                initialTrust = 100;
            }
            
            this.relationships[npc] = {
                friendship: initialFriendship,
                trust: initialTrust,
                interactions: 0,
                lastInteraction: null
            };
        });
    }
    
    adjustRelationship(npcName, attribute, amount) {
        if (!this.relationships[npcName]) {
            this.relationships[npcName] = {
                friendship: 50,
                trust: 50,
                interactions: 0,
                lastInteraction: null
            };
        }
        
        const relationship = this.relationships[npcName];
        relationship[attribute] = Math.max(0, Math.min(100, relationship[attribute] + amount));
        relationship.lastInteraction = Date.now();
        
        // 通知变化
        if (this.gameEngine) {
            this.gameEngine.broadcastEvent('relationshipChanged', {
                npc: npcName,
                attribute,
                change: amount,
                newValue: relationship[attribute]
            });
        }
    }
    
    getRelationship(npcName) {
        return this.relationships[npcName] || null;
    }
    
    saveData() {
        return {
            version: '2.0.0',
            relationships: this.relationships
        };
    }
    
    loadData(data) {
        if (!data) return false;
        
        try {
            if (data.relationships) {
                this.relationships = { ...this.relationships, ...data.relationships };
            }
            
            console.log('✅ 关系系统数据加载成功');
            return true;
            
        } catch (error) {
            console.error('❌ 加载关系系统数据失败:', error);
            return false;
        }
    }
}

// 学术系统
class AcademicSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // 学术数据
        this.subjects = {
            mathematics: { grade: 0, assignments: 0, tests: 0 },
            chinese: { grade: 0, assignments: 0, tests: 0 },
            english: { grade: 0, assignments: 0, tests: 0 },
            physics: { grade: 0, assignments: 0, tests: 0 },
            chemistry: { grade: 0, assignments: 0, tests: 0 },
            biology: { grade: 0, assignments: 0, tests: 0 },
            history: { grade: 0, assignments: 0, tests: 0 },
            geography: { grade: 0, assignments: 0, tests: 0 },
            politics: { grade: 0, assignments: 0, tests: 0 }
        };
        
        this.gpa = 0;
        this.totalCredits = 0;
    }
    
    async init() {
        console.log('📚 初始化学术系统');
        return true;
    }
    
    attendClass(subject = 'mathematics') {
        if (this.subjects[subject]) {
            this.subjects[subject].grade += 1;
            this.updateGPA();
            
            // 更新玩家技能
            const player = this.gameEngine?.getSystem('player');
            if (player) {
                player.improveSkill(subject, 2);
            }
        }
    }
    
    completeAssignment(subject, quality = 0.8) {
        if (this.subjects[subject]) {
            this.subjects[subject].assignments += 1;
            this.subjects[subject].grade += quality * 5;
            this.updateGPA();
        }
    }
    
    takeTest(subject, performance = 0.7) {
        if (this.subjects[subject]) {
            this.subjects[subject].tests += 1;
            this.subjects[subject].grade += performance * 10;
            this.updateGPA();
        }
    }
    
    updateGPA() {
        let totalGrade = 0;
        let subjectCount = 0;
        
        Object.values(this.subjects).forEach(subject => {
            if (subject.grade > 0) {
                totalGrade += Math.min(100, subject.grade);
                subjectCount += 1;
            }
        });
        
        this.gpa = subjectCount > 0 ? totalGrade / subjectCount : 0;
    }
    
    getGPA() {
        return Math.round(this.gpa * 100) / 100;
    }
    
    saveData() {
        return {
            version: '2.0.0',
            subjects: this.subjects,
            gpa: this.gpa,
            totalCredits: this.totalCredits
        };
    }
    
    loadData(data) {
        if (!data) return false;
        
        try {
            if (data.subjects) {
                this.subjects = { ...this.subjects, ...data.subjects };
            }
            if (data.gpa !== undefined) {
                this.gpa = data.gpa;
            }
            if (data.totalCredits !== undefined) {
                this.totalCredits = data.totalCredits;
            }
            
            console.log('✅ 学术系统数据加载成功');
            return true;
            
        } catch (error) {
            console.error('❌ 加载学术系统数据失败:', error);
            return false;
        }
    }
}

// 存档系统
class SaveSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.saveSlotName = 'schoolSimulator_mainSave';
    }
    
    async init() {
        console.log('💾 初始化存档系统');
        return true;
    }
    
    save() {
        try {
            const saveData = {
                version: '2.0.0',
                timestamp: Date.now(),
                gameData: {}
            };
            
            // 收集各系统数据
            const systems = ['player', 'time', 'event', 'task', 'relationship', 'academic', 'map', 'ui'];
            systems.forEach(systemName => {
                const system = this.gameEngine.getSystem(systemName);
                if (system && typeof system.saveData === 'function') {
                    saveData.gameData[systemName] = system.saveData();
                }
            });
            
            // 保存到localStorage
            localStorage.setItem(this.saveSlotName, JSON.stringify(saveData));
            
            console.log('💾 游戏保存成功');
            return true;
            
        } catch (error) {
            console.error('❌ 游戏保存失败:', error);
            return false;
        }
    }
    
    load() {
        try {
            const saveData = localStorage.getItem(this.saveSlotName);
            if (!saveData) {
                console.warn('⚠️ 没有找到存档');
                return false;
            }
            
            const data = JSON.parse(saveData);
            
            // 版本检查
            if (data.version !== '2.0.0') {
                console.warn('⚠️ 存档版本不匹配');
            }
            
            // 加载各系统数据
            if (data.gameData) {
                for (const [systemName, systemData] of Object.entries(data.gameData)) {
                    const system = this.gameEngine.getSystem(systemName);
                    if (system && typeof system.loadData === 'function') {
                        system.loadData(systemData);
                    }
                }
            }
            
            console.log('📂 游戏加载成功');
            return true;
            
        } catch (error) {
            console.error('❌ 游戏加载失败:', error);
            return false;
        }
    }
    
    deleteSave() {
        try {
            localStorage.removeItem(this.saveSlotName);
            console.log('🗑️ 存档已删除');
            return true;
            
        } catch (error) {
            console.error('❌ 删除存档失败:', error);
            return false;
        }
    }
    
    hasSave() {
        return localStorage.getItem(this.saveSlotName) !== null;
    }
} 