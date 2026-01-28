/**
 * 游戏核心逻辑文件
 * 管理游戏状态、玩家、回合系统、规则判定等
 */

/* ========== 游戏状态类 ========== */
class GameState {
    constructor() {
        this.players = [];              // 玩家数组
        this.currentPlayerIndex = 0;    // 当前玩家索引
        this.round = 1;                 // 当前回合数
        this.phase = 'event';           // 当前阶段：event, action, reset
        this.socialProgress = 10;       // 社会平等进度（0-100）
        this.quadrantProgress = {       // 各象限本地进度
            workplace: 10,
            family: 10,
            education: 10,
            politics: 10
        };
        this.eventDeck = [];            // 事件卡牌堆
        this.actionDeck = [];           // 行动卡牌堆
        this.projectDeck = [];          // 项目卡牌堆
        this.activeProjects = [];       // 进行中的项目
        this.activeStereotypes = [];    // 活跃的刻板印象
        this.activeMilestones = [];     // 已达成的里程碑
        this.completedProjects = [];    // 已完成的项目
        this.currentEvent = null;       // 当前事件
        this.eventTurnsActive = 0;      // 当前事件持续回合数
        this.gameLog = [];              // 游戏日志
        this.actionsThisTurn = 0;       // 本回合已执行的行动数
        this.maxActionsPerTurn = 2;    // 每回合最多行动数
        this.isGameOver = false;        // 游戏是否结束
        this.winner = null;             // 获胜者
        this.globalModifiers = [];      // 全局修正效果
    }

    /* 初始化游戏 */
    initialize(playerCount, selectedRoles) {
        // 创建玩家
        for (let i = 0; i < playerCount; i++) {
            const role = ROLES.find(r => r.id === selectedRoles[i]);
            this.players.push(new Player(i + 1, `玩家${i + 1}`, role));
        }

        // 初始化卡牌堆
        this.eventDeck = this.shuffleArray([...EVENT_CARDS]);
        this.actionDeck = this.shuffleArray([...ACTION_CARDS]);
        this.projectDeck = [...PROJECT_CARDS];

        // 为每个玩家发初始手牌
        this.players.forEach(player => {
            for (let i = 0; i < 3; i++) {
                player.drawCard(this.actionDeck);
            }
        });

        // 在版图上放置初始刻板印象
        this.initializeStereotypes();

        this.log('游戏开始！社会平等进度：10%');
    }

    /* 初始化刻板印象标记 */
    initializeStereotypes() {
        const stereotypes = [...STEREOTYPE_CARDS];
        this.activeStereotypes = stereotypes.map(s => ({
            ...s,
            quadrant: s.quadrant
        }));
    }

    /* 洗牌算法 */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /* 获取当前玩家 */
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    /* 下一个玩家 */
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.actionsThisTurn = 0;
    }

    /* 事件阶段 */
    eventPhase() {
        this.phase = 'event';
        
        // 检查上一个事件是否未解决
        if (this.currentEvent) {
            this.eventTurnsActive++;
            
            // 检查是否触发失败条件
            if (this.currentEvent.failTurns && this.eventTurnsActive >= this.currentEvent.failTurns) {
                this.log(`⚠️ 事件【${this.currentEvent.name}】长期未解决，触发负面后果！`);
                this.applyEventFailEffect(this.currentEvent);
                this.currentEvent = null;
                this.eventTurnsActive = 0;
            }
        }
        
        // 如果没有当前事件，抽取新事件
        if (!this.currentEvent) {
            if (this.eventDeck.length === 0) {
                this.eventDeck = this.shuffleArray([...EVENT_CARDS]);
            }
            
            this.currentEvent = this.eventDeck.pop();
            this.eventTurnsActive = 0;
            this.log(`📋 事件发生：${this.currentEvent.name}`);
            
            // 应用事件效果
            this.applyEventEffect(this.currentEvent);
        }
        
        return this.currentEvent;
    }

    /* 应用事件效果 */
    applyEventEffect(event) {
        this.log(`效果：${event.effect}`);
        
        // 处理事件对象限进度的影响
        if (event.quadrant && event.quadrant !== 'all') {
            const effectMatch = event.effect.match(/本地进度([+-])(\d+)%/);
            if (effectMatch) {
                const change = parseInt(effectMatch[2]) * (effectMatch[1] === '+' ? 1 : -1);
                if (change > 0) {
                    this.addProgress(change / 4, event.quadrant); // 除以4是因为象限最大25%
                } else {
                    this.reduceProgress(Math.abs(change) / 4, event.quadrant);
                }
            }
        }
    }
    
    /* 应用事件失败效果 */
    applyEventFailEffect(event) {
        if (event.failEffect) {
            if (event.failEffect.progressLoss) {
                this.reduceProgress(event.failEffect.progressLoss);
                this.log(`社会平等进度倒退 -${event.failEffect.progressLoss}%`);
            }
        }
    }

    /* 解决事件 */
    solveEvent(player) {
        if (!this.currentEvent) return false;
        
        const cost = this.currentEvent.solveCost;
        if (!cost) {
            // 某些正面事件没有解决成本
            this.log(`${player.name}接受了事件的正面效果`);
            this.applyEventReward(this.currentEvent, player);
            this.currentEvent = null;
            return true;
        }
        
        // 检查玩家是否有足够资源
        if (!player.canAfford(cost)) {
            this.log(`${player.name}资源不足，无法解决此事件`);
            return false;
        }
        
        // 扣除资源
        player.spendResources(cost);
        
        // 给予奖励
        this.applyEventReward(this.currentEvent, player);
        
        this.log(`${player.name}成功解决了事件：${this.currentEvent.name}`);
        this.currentEvent = null;
        
        return true;
    }

    /* 应用事件奖励 */
    applyEventReward(event, player) {
        if (!event.solveReward) return;
        
        const reward = event.solveReward;
        
        if (reward.progress) {
            this.addProgress(reward.progress);
        }
        if (reward.influence) {
            player.influence += reward.influence;
        }
        if (reward.money) {
            player.money += reward.money;
        }
        if (reward.support) {
            player.support += reward.support;
        }
        
        // 增加玩家个人分数
        if (reward.progress) {
            player.score += reward.progress;
        }
    }

    /* 跳过事件 */
    skipEvent() {
        this.log('所有玩家选择暂时不解决此事件');
        // 事件效果保留到下回合
    }

    /* 行动阶段 */
    startActionPhase() {
        this.phase = 'action';
        this.actionsThisTurn = 0;
        this.log(`${this.getCurrentPlayer().name}的行动阶段开始`);
    }

    /* 执行移动行动 */
    movePlayer(targetQuadrant) {
        const player = this.getCurrentPlayer();
        const oldQuadrant = player.quadrant;
        
        // 检查是否是相邻象限
        const adjacentQuadrants = {
            'workplace': ['politics', 'family'],
            'family': ['workplace', 'education'],
            'education': ['family', 'politics'],
            'politics': ['education', 'workplace']
        };
        
        if (!adjacentQuadrants[oldQuadrant].includes(targetQuadrant)) {
            this.log(`无法移动：${targetQuadrant}不与当前位置相邻`);
            return false;
        }
        
        player.quadrant = targetQuadrant;
        this.actionsThisTurn++;
        this.log(`${player.name}从${this.getQuadrantName(oldQuadrant)}移动到${this.getQuadrantName(targetQuadrant)}`);
        
        return true;
    }

    /* 获取象限中文名 */
    getQuadrantName(quadrant) {
        const names = {
            'workplace': '职场与企业',
            'family': '家庭与社区',
            'education': '教育与文化',
            'politics': '政治与法律'
        };
        return names[quadrant] || quadrant;
    }

    /* 执行象限行动 */
    executeQuadrantAction(quadrant) {
        const player = this.getCurrentPlayer();
        
        if (player.quadrant !== quadrant) {
            this.log('你不在此象限，无法执行该行动');
            return false;
        }
        
        // 检查刻板印象带来的额外消耗
        const stereotype = this.activeStereotypes.find(s => s.quadrant === quadrant);
        let extraCost = stereotype ? 1 : 0;
        
        // 根据象限执行不同行动
        switch (quadrant) {
            case 'workplace':
                // 赚取资金
                if (player.influence >= (1 + extraCost)) {
                    player.influence -= (1 + extraCost);
                    player.money += 2;
                    this.log(`${player.name}在职场工作，获得2资金`);
                    this.actionsThisTurn++;
                    return true;
                }
                break;
                
            case 'family':
                // 恢复影响力或移除刻板印象
                if (player.money >= (1 + extraCost)) {
                    player.money -= (1 + extraCost);
                    player.influence += 2;
                    this.log(`${player.name}在社区休整，恢复2影响力`);
                    this.actionsThisTurn++;
                    return true;
                }
                break;
                
            case 'education':
                // 抽取行动卡
                if (player.influence >= (1 + extraCost)) {
                    player.influence -= (1 + extraCost);
                    player.drawCard(this.actionDeck);
                    this.log(`${player.name}学习新知识，抽取1张行动卡`);
                    this.actionsThisTurn++;
                    return true;
                }
                break;
                
            case 'politics':
                // 赚取支持
                if (player.influence >= (1 + extraCost)) {
                    player.influence -= (1 + extraCost);
                    player.support += 2;
                    this.log(`${player.name}进行政治游说，获得2支持`);
                    this.actionsThisTurn++;
                    return true;
                }
                break;
        }
        
        this.log('资源不足，无法执行此行动');
        return false;
    }

    /* 打出行动卡 */
    playActionCard(player, cardIndex) {
        if (cardIndex >= player.hand.length) {
            return false;
        }
        
        const card = player.hand[cardIndex];
        
        // 检查资源是否足够
        if (!player.canAfford(card.cost)) {
            this.log(`${player.name}资源不足，无法打出${card.name}`);
            return false;
        }
        
        // 检查象限限制
        if (card.quadrant !== 'any' && card.quadrant !== player.quadrant) {
            this.log(`${card.name}只能在${this.getQuadrantName(card.quadrant)}使用`);
            return false;
        }
        
        // 扣除资源
        player.spendResources(card.cost);
        
        // 应用效果
        this.applyCardEffect(card, player);
        
        // 从手牌移除
        player.hand.splice(cardIndex, 1);
        
        this.actionsThisTurn++;
        this.log(`${player.name}打出了${card.name}`);
        
        return true;
    }

    /* 应用行动卡效果 */
    applyCardEffect(card, player) {
        if (!card.effect) return;
        
        if (typeof card.effect === 'object') {
            if (card.effect.progress) {
                this.addProgress(card.effect.progress);
                player.score += card.effect.progress;
            }
            if (card.effect.influence) {
                player.influence += card.effect.influence;
            }
            if (card.effect.money) {
                player.money += card.effect.money;
            }
            if (card.effect.support) {
                player.support += card.effect.support;
            }
        } else if (card.effect === 'remove_stereotype') {
            // 移除刻板印象
            this.removeStereotype(player.quadrant);
        }
    }

    /* 移除刻板印象 */
    removeStereotype(quadrant) {
        const index = this.activeStereotypes.findIndex(s => s.quadrant === quadrant);
        if (index !== -1) {
            const removed = this.activeStereotypes.splice(index, 1)[0];
            this.log(`移除了刻板印象：${removed.name}`);
            this.addProgress(2);
            return true;
        }
        return false;
    }

    /* 启动项目 */
    startProject(player, projectId) {
        const project = this.projectDeck.find(p => p.id === projectId);
        if (!project) return false;
        
        if (!player.canAfford(project.initiationCost)) {
            this.log(`${player.name}资源不足，无法启动项目`);
            return false;
        }
        
        player.spendResources(project.initiationCost);
        
        const activeProject = {
            ...project,
            currentProgress: 0,
            contributedResources: {
                influence: 0,
                money: 0,
                support: 0
            },
            contributors: {}  // 改为对象，记录每个玩家的贡献
        };
        
        // 记录启动者的贡献
        activeProject.contributors[player.id] = {
            influence: project.initiationCost.influence || 0,
            money: project.initiationCost.money || 0,
            support: project.initiationCost.support || 0
        };
        
        // 计算初始进度
        activeProject.currentProgress = Object.values(project.initiationCost).reduce((sum, val) => sum + val, 0);
        activeProject.contributedResources = {...project.initiationCost};
        
        this.activeProjects.push(activeProject);
        this.log(`✨ ${player.name}启动了项目：${project.name}`);
        this.actionsThisTurn++;
        
        return true;
    }

    /* 推进项目 */
    contributeToProject(player, projectIndex, contribution) {
        if (projectIndex >= this.activeProjects.length) return false;
        
        const project = this.activeProjects[projectIndex];
        
        // 检查玩家是否在正确的象限
        if (player.quadrant !== project.quadrant) {
            this.log(`必须在${this.getQuadrantName(project.quadrant)}才能推进此项目`);
            return false;
        }
        
        if (!player.canAfford(contribution)) {
            this.log('资源不足');
            return false;
        }
        
        player.spendResources(contribution);
        
        // 计算贡献值
        const contributionValue = (contribution.influence || 0) + 
                                   (contribution.money || 0) + 
                                   (contribution.support || 0);
        
        project.currentProgress += contributionValue;
        
        // 更新贡献资源记录
        for (let resource in contribution) {
            project.contributedResources[resource] = (project.contributedResources[resource] || 0) + contribution[resource];
        }
        
        // 记录玩家贡献
        if (!project.contributors[player.id]) {
            project.contributors[player.id] = {
                influence: 0,
                money: 0,
                support: 0
            };
        }
        
        for (let resource in contribution) {
            project.contributors[player.id][resource] += contribution[resource];
        }
        
        this.log(`💰 ${player.name}为项目【${project.name}】贡献了${contributionValue}点进度`);
        this.log(`   项目进度：${project.currentProgress}/${project.progressNeeded}`);
        
        // 检查项目是否完成
        if (project.currentProgress >= project.progressNeeded) {
            this.completeProject(projectIndex);
        }
        
        this.actionsThisTurn++;
        return true;
    }

    /* 完成项目 */
    completeProject(projectIndex) {
        const project = this.activeProjects[projectIndex];
        
        this.log(`🎉🎉🎉 项目完成：${project.name}！`);
        
        // 计算贡献者数量
        const contributorIds = Object.keys(project.contributors);
        const contributorCount = contributorIds.length;
        
        // 给予所有贡献者奖励
        contributorIds.forEach(playerId => {
            const player = this.players.find(p => p.id === playerId);
            if (player && project.reward) {
                // 贡献者平分奖励
                if (project.reward.influence) {
                    player.influence += Math.ceil(project.reward.influence / contributorCount);
                }
                if (project.reward.money) {
                    player.money += Math.ceil(project.reward.money / contributorCount);
                }
                if (project.reward.support) {
                    player.support += Math.ceil(project.reward.support / contributorCount);
                }
                
                // 个人分数按贡献比例分配
                const playerContribution = Object.values(project.contributors[playerId]).reduce((sum, val) => sum + val, 0);
                const totalContribution = project.currentProgress;
                const contributionRatio = playerContribution / totalContribution;
                const playerScore = Math.round((project.reward.progress || 0) * contributionRatio);
                player.score += playerScore;
                
                // 检查被动技能（法令颁布）
                const skillResult = player.checkPassiveSkill({
                    action: 'project_complete',
                    quadrant: project.quadrant
                });
                if (skillResult) {
                    if (skillResult.influence) player.influence += skillResult.influence;
                    if (skillResult.support) player.support += skillResult.support;
                    this.log(`   ⚡ ${player.name}的被动技能【${player.role.passiveSkill.name}】触发！`);
                }
            }
        });
        
        // 增加对应象限的进度
        if (project.reward && project.reward.progress) {
            this.addProgress(project.reward.progress / 4, project.quadrant);
        }
        
        // 添加永久效果
        if (project.completionBonus) {
            this.log(`   ✨ 永久效果：${project.completionBonus}`);
            this.globalModifiers.push({
                source: project.id,
                description: project.completionBonus,
                quadrant: project.quadrant
            });
        }
        
        // 移动到已完成列表
        this.completedProjects.push(project);
        this.activeProjects.splice(projectIndex, 1);
    }

    /* 增加社会进度 */
    addProgress(amount, quadrant = null) {
        const oldProgress = this.socialProgress;
        
        // 如果指定了象限，同时更新象限进度
        if (quadrant) {
            this.quadrantProgress[quadrant] = Math.min(25, this.quadrantProgress[quadrant] + amount);
            this.log(`${this.getQuadrantName(quadrant)}进度 +${amount}%`);
        }
        
        // 计算总进度（四个象限平均值）
        this.updateGlobalProgress();
        
        this.log(`社会平等进度 ${oldProgress}% → ${this.socialProgress}%`);
        
        // 检查里程碑
        this.checkMilestones();
        
        // 检查胜利条件
        if (this.socialProgress >= 100) {
            this.endGame(true);
        }
    }
    
    /* 更新全局进度（基于象限平均值） */
    updateGlobalProgress() {
        const total = Object.values(this.quadrantProgress).reduce((sum, val) => sum + val, 0);
        this.socialProgress = Math.round((total / 4) * 4); // 每个象限25%，总共100%
    }
    
    /* 减少社会进度 */
    reduceProgress(amount, quadrant = null) {
        if (quadrant) {
            this.quadrantProgress[quadrant] = Math.max(0, this.quadrantProgress[quadrant] - amount);
            this.log(`${this.getQuadrantName(quadrant)}进度 -${amount}%`);
        } else {
            // 平均减少所有象限
            Object.keys(this.quadrantProgress).forEach(q => {
                this.quadrantProgress[q] = Math.max(0, this.quadrantProgress[q] - amount / 4);
            });
        }
        
        this.updateGlobalProgress();
        
        // 检查失败条件
        if (this.socialProgress <= 0) {
            this.endGame(false);
        }
    }

    /* 检查里程碑 */
    checkMilestones() {
        MILESTONE_CARDS.forEach(milestone => {
            if (this.activeMilestones.find(m => m.id === milestone.id)) {
                return; // 已经达成
            }
            
            // 简单的检查逻辑（可以扩展）
            const triggerProgress = parseInt(milestone.trigger.match(/\d+/)[0]);
            if (this.socialProgress >= triggerProgress) {
                this.activeMilestones.push(milestone);
                this.log(`🏆 达成里程碑：${milestone.name}！`);
            }
        });
    }

    /* 结束回合 */
    endTurn() {
        const player = this.getCurrentPlayer();
        this.log(`${player.name}结束了回合`);
        
        this.nextPlayer();
        
        // 如果回到了第一个玩家，进入重置阶段
        if (this.currentPlayerIndex === 0) {
            this.resetPhase();
        } else {
            this.startActionPhase();
        }
    }

    /* 重置阶段 */
    resetPhase() {
        this.phase = 'reset';
        this.log('--- 重置阶段 ---');
        
        // 所有玩家的处理
        this.players.forEach(player => {
            // 补充手牌
            while (player.hand.length < player.handLimit && this.actionDeck.length > 0) {
                player.drawCard(this.actionDeck);
            }
            
            // 减少技能冷却
            player.reduceCooldown();
            
            // 应用下回合额外行动
            if (player.bonusActionsNextTurn > 0) {
                this.log(`✨ ${player.name}下回合将获得额外行动！`);
            }
            
            // 重置行动消耗减少
            player.actionCostReduction = 0;
        });
        
        // 检查游戏结束条件
        if (this.eventDeck.length === 0 && this.actionDeck.length === 0) {
            if (this.socialProgress < 100) {
                this.log('⏰ 卡牌用尽，游戏结束！');
                this.endGame(false);
                return;
            }
        }
        
        // 开始新回合
        this.round++;
        this.log(`===== 第 ${this.round} 回合开始 =====`);
        this.eventPhase();
    }

    /* 结束游戏 */
    endGame(victory) {
        this.isGameOver = true;
        
        if (victory) {
            this.log('🎉🎉🎉 胜利！你们成功建立了一个平等的社会！');
            
            // 计算平等先锋
            let maxScore = 0;
            let winner = null;
            
            this.players.forEach(player => {
                if (player.score > maxScore) {
                    maxScore = player.score;
                    winner = player;
                }
            });
            
            this.winner = winner;
            this.log(`🏆 平等先锋：${winner.name}（${winner.score}分）`);
        } else {
            this.log('😔 失败...社会改革陷入停滞。');
        }
    }

    /* 记录日志 */
    log(message, type = 'normal') {
        const timestamp = new Date().toLocaleTimeString();
        
        // 根据消息内容自动判断类型
        if (type === 'normal') {
            if (message.includes('🎉') || message.includes('✨') || message.includes('完成') || message.includes('成功')) {
                type = 'success';
            } else if (message.includes('⚠️') || message.includes('失败') || message.includes('倒退') || message.includes('危机')) {
                type = 'warning';
            } else if (message.includes('事件') || message.includes('📋')) {
                type = 'event';
            }
        }
        
        this.gameLog.push({
            time: timestamp,
            message: message,
            type: type
        });
        
        // 保持日志长度在100条以内
        if (this.gameLog.length > 100) {
            this.gameLog.shift();
        }
    }
}

/* ========== 玩家类 ========== */
class Player {
    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.influence = role.initialResources.influence;
        this.money = role.initialResources.money;
        this.support = role.initialResources.support;
        this.hand = [];
        this.handLimit = role.id === 'community_organizer' ? 6 : 5; // 社区组织者手牌+1
        this.quadrant = 'workplace'; // 初始位置
        this.score = 0; // 个人影响力点数
        this.skillCooldown = 0; // 主动技能当前冷却
        this.bonusActionsNextTurn = 0; // 下回合额外行动数
        this.actionCostReduction = 0; // 本回合行动消耗减少
    }
    
    /* 使用主动技能 */
    useActiveSkill(target = null) {
        const skill = this.role.activeSkill;
        
        // 检查冷却
        if (this.skillCooldown > 0) {
            return { success: false, message: `技能冷却中，还需${this.skillCooldown}回合` };
        }
        
        // 检查资源
        if (!this.canAfford(skill.cost)) {
            return { success: false, message: '资源不足' };
        }
        
        // 支付消耗
        this.spendResources(skill.cost);
        
        // 设置冷却
        this.skillCooldown = skill.cooldown;
        
        return { success: true, skill: skill, target: target };
    }
    
    /* 减少冷却 */
    reduceCooldown() {
        if (this.skillCooldown > 0) {
            this.skillCooldown--;
        }
    }
    
    /* 检查被动技能触发 */
    checkPassiveSkill(context) {
        const skill = this.role.passiveSkill;
        const skillName = skill.name;
        
        // 根据不同技能和上下文判断是否触发
        if (skillName === '启迪心智' && context.action === 'education' && Math.random() > 0.5) {
            return { drawCard: 1 };
        }
        
        if (skillName === '商业投资' && context.action === 'workplace_gather_funding') {
            return { extraMoney: 1 };
        }
        
        if (skillName === '法令颁布' && context.action === 'project_complete' && context.quadrant === 'politics') {
            return { influence: 1, support: 1 };
        }
        
        if (skillName === '草根网络' && context.action === 'remove_stereotype' && context.quadrant === 'family') {
            return { extraProgress: 1 };
        }
        
        return null;
    }

    /* 抽卡 */
    drawCard(deck) {
        if (deck.length === 0) {
            return null;
        }
        
        const card = deck.pop();
        this.hand.push(card);
        return card;
    }

    /* 检查是否能支付成本 */
    canAfford(cost) {
        if (!cost) return true;
        
        return (cost.influence === undefined || this.influence >= cost.influence) &&
               (cost.money === undefined || this.money >= cost.money) &&
               (cost.support === undefined || this.support >= cost.support);
    }

    /* 支付资源 */
    spendResources(cost) {
        if (!cost) return;
        
        if (cost.influence) this.influence -= cost.influence;
        if (cost.money) this.money -= cost.money;
        if (cost.support) this.support -= cost.support;
    }
}

/* ========== 全局游戏实例 ========== */
let game = null;

