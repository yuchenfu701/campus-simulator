/**
 * 玩家角色系统 - 爱哲安民未来学校校园模拟器
 * 管理玩家的属性、状态、技能和成长
 */

class Player {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // 基础属性（新地图入口位置 - V3布局）
        this.x = 590;
        this.y = 1050; // 在入口处开始
        this.width = 24;
        this.height = 24;
        this.speed = 4;
        this.direction = 'down';
        
        // 核心属性（0-100）
        this.attributes = {
            academic: 50,    // 学业能力
            social: 50,      // 人际交往
            family: 50,      // 家庭关系
            health: 80,      // 身体健康
            talent: 30,      // 特长才艺
            energy: 100,     // 体力值
            mood: 70,        // 心情
            stress: 20       // 压力值
        };
        
        // 技能系统
        this.skills = {
            mathematics: 0,     // 数学
            chinese: 0,         // 语文
            english: 0,         // 英语
            physics: 0,         // 物理
            chemistry: 0,       // 化学
            biology: 0,         // 生物
            history: 0,         // 历史
            geography: 0,       // 地理
            politics: 0,        // 政治
            sports: 0,          // 体育
            art: 0,             // 艺术
            music: 0,           // 音乐
            leadership: 0,      // 领导力
            communication: 0    // 沟通能力
        };
        
        // 状态效果
        this.statusEffects = {
            tired: 0,           // 疲劳
            sick: 0,            // 生病
            motivated: 0,       // 激励
            focused: 0,         // 专注
            confident: 0,       // 自信
            stressed: 0         // 压力
        };
        
        // 玩家统计
        this.stats = {
            totalStudyTime: 0,
            classesAttended: 0,
            testsCompleted: 0,
            friendshipsMade: 0,
            achievementsUnlocked: 0,
            daysPlayed: 0,
            totalPlayTime: 0
        };
        
        // 背包系统
        this.inventory = {
            items: [],
            capacity: 20,
            money: 100
        };
        
        // 成就系统
        this.achievements = [];
        
        // 外观系统
        this.appearance = {
            hairColor: '#8B4513',
            skinColor: '#FDBCB4',
            clothingColor: '#4169E1',
            accessory: null
        };
        
        // 动画系统
        this.animation = {
            frame: 0,
            frameTime: 0,
            frameDelay: 200,
            isMoving: false,
            lastDirection: 'down'
        };
        
        // 每日目标
        this.dailyGoals = [];
        
        // 周计划
        this.weeklyPlan = [];
        
        // 移动状态
        this.movement = {
            isMoving: false,
            lastMoveTime: 0,
            velocity: { x: 0, y: 0 }
        };
        
        // 交互状态
        this.interaction = {
            nearbyNPCs: [],
            nearbyObjects: [],
            currentInteraction: null
        };
        
        // 游戏进度
        this.progress = {
            currentYear: 1,         // 当前年级 (1-3)
            currentSemester: 1,     // 当前学期 (1=上学期, 2=下学期)
            currentSeason: 'summer', // 当前季节 ('summer', 'autumn', 'winter', 'spring')
            currentEvent: 'start',   // 当前事件ID
            totalEvents: 0,         // 已完成事件数
            unlockedChoices: []     // 已解锁的选择
        };
        
        // 人际关系 (-10 到 +10)
        this.relationships = {
            // 同学
            '张俊熙': 0,    // 4号，学习差，纪律差
            '林昊阳': 0,    // 7号，学习一般，老师在时老实
            '刘雨晴': 0,    // 12号，学习一般，很调皮幽默
            '李昕瑶': 0,    // 18号，大学霸
            '郑星然': 0,    // 21号，学习好，六边形战士
            '周泽宇': 0,    // 22号，体育好
            '王亦辰': 0,    // 27号，体育好，周泽宇好友
            '陈子墨': 0,    // 30号，多才多艺
            
            // 老师
            '语文林老师': 0,     // 语文老师，有点小幽默
            '数学王老师': 0,     // 数学老师，严厉
            '英语Miss Chen': 0,  // 英语老师，温柔
            '道法赵老师': -2,    // 道法老师，脾气不好
            '历史李老师': 0,     // 历史老师，脾气好
            '地理张老师': 0,     // 地理老师，好说话
            '生物周老师': 0,     // 生物老师，温柔好说话
            '体育张教练': 0,     // 体育老师，温柔
            '信息吴老师': 0,     // 信息老师，脾气好
            
            // 工作人员
            '保安大叔': -1,      // 保安，不让出校门
            '食堂阿姨': -1,      // 食堂阿姨，不耐烦手抖
            '小卖部老板': 3,     // 小卖部老板，和蔼可亲
            '教导主任': -3,      // 教导主任，严厉
            
            // 家人
            '爸爸': 8,           // 爸爸，和蔼可亲
            '妈妈': 8,           // 妈妈，细心
            '哈基米': 10         // 猫咪，满分友好
        };
        
        // 已完成的事件和选择历史
        this.eventHistory = [];
        this.achievements = [];
    }
    
    // 初始化方法
    async init() {
        console.log('👤 初始化玩家系统');
        
        // 设置初始位置在安全区域
        this.setPosition(400, 500);
        
        // 生成初始日常目标
        this.generateDailyGoals();
        
        return true;
    }
    
    // 更新玩家状态
    update(deltaTime) {
        // 更新动画
        this.updateAnimation(deltaTime);
        
        // 处理移动
        this.updateMovement(deltaTime);
        
        // 更新状态效果
        this.updateStatusEffects(deltaTime);
        
        // 更新交互检测
        this.updateInteractions();
        
        // 更新统计
        this.updateStats(deltaTime);
    }
    
    // 更新动画
    updateAnimation(deltaTime) {
        this.animation.frameTime += deltaTime;
        
        if (this.animation.frameTime >= this.animation.frameDelay) {
            this.animation.frameTime = 0;
            
            if (this.movement.isMoving) {
                this.animation.frame = (this.animation.frame + 1) % 4;
            } else {
                this.animation.frame = 0;
            }
        }
    }
    
    // 更新移动
    updateMovement(deltaTime) {
        if (!this.gameEngine || !this.gameEngine.input) {
            console.log('⚠️ 游戏引擎或输入系统未初始化');
            return;
        }
        
        const keys = this.gameEngine.input.keys;
        let moved = false;
        let newX = this.x;
        let newY = this.y;
        
        // 处理键盘输入
        if (keys['w'] || keys['arrowup']) {
            newY -= this.speed;
            this.direction = 'up';
            moved = true;
        }
        if (keys['s'] || keys['arrowdown']) {
            newY += this.speed;
            this.direction = 'down';
            moved = true;
        }
        if (keys['a'] || keys['arrowleft']) {
            newX -= this.speed;
            this.direction = 'left';
            moved = true;
        }
        if (keys['d'] || keys['arrowright']) {
            newX += this.speed;
            this.direction = 'right';
            moved = true;
        }
        
        // 检查碰撞
        const canMove = this.canMoveTo(newX, newY);

        if (canMove) {
            this.x = newX;
            this.y = newY;

            if (moved) {
                this.movement.isMoving = true;
                this.movement.lastMoveTime = Date.now();

                // 消耗体力
                this.adjustAttribute('energy', -0.05);

                // 保存最后移动方向
                this.animation.lastDirection = this.direction;
            }
        }
        
        // 检查是否停止移动
        if (!moved && this.movement.isMoving) {
            if (Date.now() - this.movement.lastMoveTime > 100) {
                this.movement.isMoving = false;
            }
        }
    }
    
    // 检查是否可以移动到指定位置
    canMoveTo(x, y) {
        // 世界边界检查
        if (x < 0 || y < 0 || x > this.gameEngine.world.width || y > this.gameEngine.world.height) {
            return false;
        }
        
        // 暂时放宽碰撞检测，允许在建筑物边缘移动
        const mapSystem = this.gameEngine.getSystem('map');
        if (mapSystem && typeof mapSystem.checkCollision === 'function') {
            const collision = mapSystem.checkCollision(x, y, this.width, this.height);
            if (collision) {
                // TODO: 碰撞检测暂时放行，后续优化
                return true;
            }
        }
        
        return true;
    }
    
    // 更新状态效果
    updateStatusEffects(deltaTime) {
        const timeScale = deltaTime / 1000; // 转换为秒
        
        // 自然恢复/衰减
        this.adjustAttribute('energy', -0.5 * timeScale); // 体力自然消耗
        
        // 状态效果衰减
        for (const effect in this.statusEffects) {
            if (this.statusEffects[effect] > 0) {
                this.statusEffects[effect] = Math.max(0, this.statusEffects[effect] - timeScale);
            }
        }
        
        // 根据状态效果调整属性
        if (this.statusEffects.tired > 0) {
            this.speed = Math.max(1, this.speed * 0.8);
        }
        
        if (this.statusEffects.motivated > 0) {
            // 学习效率提升
        }
    }
    
    // 更新交互检测
    updateInteractions() {
        this.interaction.nearbyNPCs = this.findNearbyNPCs();
        this.interaction.nearbyObjects = this.findNearbyObjects();
    }
    
    // 查找附近的NPC
    findNearbyNPCs() {
        const npcs = [];
        const mapSystem = this.gameEngine.getSystem('map');
        
        if (mapSystem && typeof mapSystem.getNPCsInArea === 'function') {
            const currentArea = mapSystem.getCurrentArea(this.x, this.y);
            if (currentArea) {
                return mapSystem.getNPCsInArea(currentArea.id);
            } else {
                const nearbyArea = this.findNearbyArea(mapSystem);
                if (nearbyArea) {
                    return mapSystem.getNPCsInArea(nearbyArea.id);
                }
            }
        }
        
        return npcs;
    }
    
    // 新增：查找附近的区域
    findNearbyArea(mapSystem, radius = 100) {
        let nearestArea = null;
        let minDistance = radius;
        
        for (const area of Object.values(mapSystem.areas)) {
            // 计算玩家到区域中心的距离
            const centerX = area.x + area.width / 2;
            const centerY = area.y + area.height / 2;
            const distance = Math.sqrt(
                Math.pow(this.x - centerX, 2) + 
                Math.pow(this.y - centerY, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestArea = area;
            }
        }
        
        return nearestArea;
    }
    
    // 查找附近的可交互对象
    findNearbyObjects() {
        const objects = [];
        const mapSystem = this.gameEngine.getSystem('map');
        
        if (mapSystem && typeof mapSystem.getInteractablesInArea === 'function') {
            const currentArea = mapSystem.getCurrentArea(this.x, this.y);
            if (currentArea) {
                return mapSystem.getInteractablesInArea(currentArea.id);
            } else {
                const nearbyArea = this.findNearbyArea(mapSystem);
                if (nearbyArea) {
                    return mapSystem.getInteractablesInArea(nearbyArea.id);
                }
            }
        }
        
        return objects;
    }
    
    // 更新统计数据
    updateStats(deltaTime) {
        this.stats.totalPlayTime += deltaTime;
    }
    
    // 渲染玩家
    render(ctx) {
        // 保存上下文
        ctx.save();
        
        // 绘制阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.ellipse(this.x, this.y + this.height - 2, this.width / 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制玩家主体
        this.renderBody(ctx);
        
        // 绘制状态指示器
        this.renderStatusIndicators(ctx);
        
        // 绘制交互提示
        this.renderInteractionHints(ctx);
        
        // 恢复上下文
        ctx.restore();
    }
    
    // 渲染玩家身体
    renderBody(ctx) {
        const frameOffset = this.animation.frame * 2;
        
        // 根据方向调整绘制
        let spriteX = this.x - this.width / 2;
        let spriteY = this.y - this.height / 2;
        
        // 移动动画偏移
        if (this.movement.isMoving) {
            const bobOffset = Math.sin(Date.now() * 0.01) * 1;
            spriteY += bobOffset;
        }
        
        // 绘制身体（简化的像素艺术风格）
        ctx.fillStyle = this.appearance.clothingColor;
        ctx.fillRect(spriteX + 6, spriteY + 8, 12, 16);
        
        // 绘制头部
        ctx.fillStyle = this.appearance.skinColor;
        ctx.fillRect(spriteX + 8, spriteY, 8, 8);
        
        // 绘制头发
        ctx.fillStyle = this.appearance.hairColor;
        ctx.fillRect(spriteX + 7, spriteY - 1, 10, 4);
        
        // 绘制手臂
        ctx.fillStyle = this.appearance.skinColor;
        ctx.fillRect(spriteX + 2, spriteY + 10, 4, 8);
        ctx.fillRect(spriteX + 18, spriteY + 10, 4, 8);
        
        // 绘制腿部
        ctx.fillStyle = '#2F4F4F'; // 裤子颜色
        ctx.fillRect(spriteX + 7, spriteY + 20, 4, 8);
        ctx.fillRect(spriteX + 13, spriteY + 20, 4, 8);
        
        // 绘制脚
        ctx.fillStyle = '#654321'; // 鞋子颜色
        ctx.fillRect(spriteX + 6, spriteY + 26, 6, 4);
        ctx.fillRect(spriteX + 12, spriteY + 26, 6, 4);
        
        // 绘制眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(spriteX + 9, spriteY + 2, 1, 1);
        ctx.fillRect(spriteX + 12, spriteY + 2, 1, 1);
        
        // 根据方向绘制朝向指示
        this.renderDirectionIndicator(ctx, spriteX + this.width / 2, spriteY + this.height / 2);
    }
    
    // 绘制方向指示器
    renderDirectionIndicator(ctx, centerX, centerY) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        
        switch (this.direction) {
            case 'up':
                ctx.moveTo(centerX, centerY - 15);
                ctx.lineTo(centerX - 3, centerY - 10);
                ctx.lineTo(centerX + 3, centerY - 10);
                break;
            case 'down':
                ctx.moveTo(centerX, centerY + 15);
                ctx.lineTo(centerX - 3, centerY + 10);
                ctx.lineTo(centerX + 3, centerY + 10);
                break;
            case 'left':
                ctx.moveTo(centerX - 15, centerY);
                ctx.lineTo(centerX - 10, centerY - 3);
                ctx.lineTo(centerX - 10, centerY + 3);
                break;
            case 'right':
                ctx.moveTo(centerX + 15, centerY);
                ctx.lineTo(centerX + 10, centerY - 3);
                ctx.lineTo(centerX + 10, centerY + 3);
                break;
        }
        
        ctx.closePath();
        ctx.fill();
    }
    
    // 渲染状态指示器
    renderStatusIndicators(ctx) {
        const barWidth = 30;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height - 15;
        
        // 体力条
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = this.attributes.energy > 30 ? '#4CAF50' : '#F44336';
        const energyWidth = (this.attributes.energy / 100) * barWidth;
        ctx.fillRect(barX, barY, energyWidth, barHeight);
        
        // 心情指示器
        if (this.attributes.mood > 70) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText('😊', this.x + 15, this.y - 20);
        } else if (this.attributes.mood < 30) {
            ctx.fillStyle = '#888';
            ctx.fillText('😞', this.x + 15, this.y - 20);
        }
    }
    
    // 渲染交互提示
    renderInteractionHints(ctx) {
        if (this.interaction.nearbyNPCs.length > 0 || this.interaction.nearbyObjects.length > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(this.x - 30, this.y + this.height + 5, 60, 20);
            
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('按 E 交互', this.x, this.y + this.height + 17);
        }
    }
    
    // 属性调整方法
    adjustAttribute(attribute, amount) {
        if (this.attributes.hasOwnProperty(attribute)) {
            const oldValue = this.attributes[attribute];
            this.attributes[attribute] = Math.max(0, Math.min(100, this.attributes[attribute] + amount));
            
            // 触发属性变化事件
            if (this.gameEngine && oldValue !== this.attributes[attribute]) {
                this.gameEngine.broadcastEvent('attributeChanged', {
                    attribute,
                    oldValue,
                    newValue: this.attributes[attribute],
                    change: amount
                });
            }
            
            return true;
        }
        return false;
    }
    
    // 技能提升
    improveSkill(skill, amount) {
        if (this.skills.hasOwnProperty(skill)) {
            this.skills[skill] = Math.min(100, this.skills[skill] + amount);
            
            // 触发技能提升事件
            if (this.gameEngine) {
                this.gameEngine.broadcastEvent('skillImproved', {
                    skill,
                    level: this.skills[skill],
                    improvement: amount
                });
            }
            
            return true;
        }
        return false;
    }
    
    // 添加状态效果
    addStatusEffect(effect, duration) {
        if (this.statusEffects.hasOwnProperty(effect)) {
            this.statusEffects[effect] = Math.max(this.statusEffects[effect], duration);
            
            if (this.gameEngine) {
                this.gameEngine.broadcastEvent('statusEffectAdded', {
                    effect,
                    duration
                });
            }
            
            return true;
        }
        return false;
    }
    
    // 设置位置
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        
        if (this.gameEngine) {
            this.gameEngine.broadcastEvent('playerMoved', {
                x: this.x,
                y: this.y
            });
        }
    }
    
    // 处理事件
    handleEvent(eventType, data) {
        switch (eventType) {
            case 'keydown':
                this.handleKeyDown(data);
                break;
            case 'interaction':
                this.handleInteraction();
                break;
        }
    }
    
    // 处理按键
    handleKeyDown(data) {
        console.log('🎮 玩家按键处理:', data.key);
        
        switch (data.key) {
            case 'e':
            case ' ':
                console.log('🔑 检测到E键或空格键 - 尝试交互');
                this.handleInteraction();
                break;
        }
    }
    
    // 处理交互
    handleInteraction() {
        console.log('👆 开始交互处理:', {
            nearbyNPCs: this.interaction.nearbyNPCs,
            nearbyObjects: this.interaction.nearbyObjects
        });
        
        // 强制更新一次交互检测
        this.updateInteractions();
        
        console.log('👆 更新后的交互状态:', {
            nearbyNPCs: this.interaction.nearbyNPCs,
            nearbyObjects: this.interaction.nearbyObjects
        });
        
        // 首先检查是否在支持office系统的建筑区域
        const currentArea = this.getCurrentArea();
        console.log('🏫 当前区域:', currentArea);
        
        // 支持office系统的建筑列表（新地图）
        const supportedBuildings = [
            // 新地图区域
            'g8', 'g9', 'biology_lab', 'cafeteria', 'art_classroom',  // G8=教学楼A, G9=教学楼B, 生物教室, 食堂, 艺术教室
            // 旧地图兼容
            'teaching_a', 'teaching_b', 'lab_building', 
            'art_building', 'library', 'dormitory', 'playground', 'entrance'
        ];
        
        // 首先检查当前区域是否有specialPage定义
        if (currentArea && currentArea.specialPage) {
            console.log(`🏫 在${currentArea.name}内，跳转到专属页面: ${currentArea.specialPage}`);
            window.location.href = currentArea.specialPage;
            return;
        }
        
        if (currentArea && supportedBuildings.includes(currentArea.id)) {
            console.log(`🏫 在${this.getBuildingName(currentArea)}内，显示建筑内部系统`);
            this.showEducationSystem();
            return;
        }
        
        if (this.interaction.nearbyNPCs.length > 0) {
            const npc = this.interaction.nearbyNPCs[0];
            console.log('👋 与NPC交互:', npc);
            if (this.gameEngine) {
                // 显示一个交互提示
                document.getElementById('interaction-hint').textContent = `正在与${npc}交流...`;
                document.getElementById('interaction-hint').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('interaction-hint').classList.add('hidden');
                }, 2000);
                
                this.gameEngine.broadcastEvent('startDialog', { npc });
            }
        } else if (this.interaction.nearbyObjects.length > 0) {
            const object = this.interaction.nearbyObjects[0];
            console.log('🔍 与对象交互:', object);
            if (this.gameEngine) {
                // 显示一个交互提示
                document.getElementById('interaction-hint').textContent = `正在使用${object}...`;
                document.getElementById('interaction-hint').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('interaction-hint').classList.add('hidden');
                }, 2000);
                
                this.gameEngine.broadcastEvent('interact', { object });
            }
        } else {
            console.log('❌ 附近没有可交互的NPC或物体');
            // 显示一个无法交互的提示
            document.getElementById('interaction-hint').textContent = `附近没有可交互对象`;
            document.getElementById('interaction-hint').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('interaction-hint').classList.add('hidden');
            }, 2000);
        }
    }
    
    // 获取当前所在区域
    getCurrentArea() {
        const mapSystem = this.gameEngine.getSystem('map');
        if (!mapSystem) return null;
        
        for (const areaId in mapSystem.areas) {
            const area = mapSystem.areas[areaId];
            if (this.x >= area.x && this.x <= area.x + area.width &&
                this.y >= area.y && this.y <= area.y + area.height) {
                return area;
            }
        }
        return null;
    }
    
    // 显示建筑内部系统
    showEducationSystem() {
        console.log('🏫 显示建筑内部系统');
        
        // 获取当前区域
        const currentArea = this.getCurrentArea();
        
        // 显示提示
        const buildingName = this.getBuildingName(currentArea);
        document.getElementById('interaction-hint').textContent = `正在进入${buildingName}...`;
        document.getElementById('interaction-hint').classList.remove('hidden');
        
        // 延迟显示，增加沉浸感
        setTimeout(() => {
            document.getElementById('interaction-hint').classList.add('hidden');
            
            // 显示全屏网页
            const webContainer = document.getElementById('fullscreen-web-container');
            const iframe = document.getElementById('fullscreen-iframe');
            
            if (webContainer && iframe) {
                // 播放进入音效
                const ui = this.gameEngine.getSystem('ui');
                if (ui) {
                    ui.playSoundEffect('success');
                }
                
                // 根据当前区域设置不同的iframe源文件
                const officePage = this.getOfficePageForArea(currentArea);
                iframe.src = officePage;
                console.log(`🏫 进入${buildingName}，加载页面: ${officePage}`);
                
                // 显示容器（CSS动画会自动生效）
                webContainer.classList.remove('hidden');
                
                // 禁用游戏输入
                if (this.gameEngine) {
                    this.gameEngine.inputEnabled = false;
                }
                
                // 添加加载状态
                iframe.addEventListener('load', function() {
                    console.log(`✅ ${buildingName}系统加载完成`);
                }, { once: true });
                
                console.log(`✅ ${buildingName}系统已显示`);
            } else {
                console.error('❌ 找不到网页容器元素');
            }
        }, 500);
    }
    
    // 获取建筑名称
    getBuildingName(area) {
        if (!area) return '建筑';
        
        const buildingNames = {
            'teaching_a': '教学楼A',
            'teaching_b': '教学楼B',
            'lab_building': '实验楼',
            'art_building': '艺术楼',
            'library': '图书馆',
            'cafeteria': '食堂',
            'dormitory': '宿舍楼',
            'playground': '操场',
            'entrance': '校园入口',
            'shop': '小卖部'
        };
        
        return buildingNames[area.id] || area.name || '建筑';
    }
    
    // 根据区域获取对应的office页面
    getOfficePageForArea(area) {
        if (!area) return './office.html';
        
        // 如果区域本身定义了specialPage，优先使用
        if (area.specialPage) {
            return area.specialPage;
        }
        
        const officePages = {
            // 新地图布局 - G8和G9承接原教学楼功能
            'g8': './office.html',                  // G8 = 原教学楼A (复印室AI+语文老师AI)
            'g9': './office-b.html',                // G9 = 原教学楼B (信息老师AI)
            'biology_lab': './office-lab.html',     // 生物教室 (生物老师)
            'cafeteria': './office-cafeteria.html', // 食堂 (食堂阿姨)
            'art_classroom': './office-art.html',   // 艺术教室 (艺术楼办公室)
            
            // 旧地图兼容（如果还有用到）
            'teaching_a': './office.html',          // 教学楼A
            'teaching_b': './office-b.html',        // 教学楼B (信息老师)
            'teaching_c': './office-b2.html',       // 教学楼C (数学+道法老师)
            'lab_building': './office-lab.html',    // 实验楼
            'art_building': './office-art.html',        // 艺术楼
            'library': './office-library.html',         // 图书馆
            'dormitory': './office-dormitory.html',     // 宿舍楼
            'playground': './office-playground.html',   // 操场
            'entrance': './office-entrance.html',       // 校园入口 (保安大叔)
            'shop': './office.html'                     // 小卖部 (暂用默认)
        };
        
        return officePages[area.id] || './office.html';
    }
    
    // 生成日常目标
    generateDailyGoals() {
        this.dailyGoals = [
            { id: 'attend_classes', description: '参加所有课程', completed: false, reward: { academic: 10 } },
            { id: 'exercise', description: '进行体育锻炼', completed: false, reward: { health: 5, mood: 5 } },
            { id: 'socialize', description: '与同学交流', completed: false, reward: { social: 8 } },
            { id: 'study', description: '完成作业和复习', completed: false, reward: { academic: 5, stress: -3 } }
        ];
    }
    
    // 完成目标
    completeGoal(goalId) {
        const goal = this.dailyGoals.find(g => g.id === goalId && !g.completed);
        if (goal) {
            goal.completed = true;
            
            // 给予奖励
            for (const [attribute, amount] of Object.entries(goal.reward)) {
                this.adjustAttribute(attribute, amount);
            }
            
            if (this.gameEngine) {
                this.gameEngine.broadcastEvent('goalCompleted', { goal });
            }
            
            return true;
        }
        return false;
    }
    
    // 获取当前状态摘要
    getStatusSummary() {
        return {
            position: { x: this.x, y: this.y },
            attributes: { ...this.attributes },
            skills: { ...this.skills },
            statusEffects: { ...this.statusEffects },
            stats: { ...this.stats },
            inventory: { ...this.inventory },
            achievements: [...this.achievements],
            dailyGoals: this.dailyGoals.map(g => ({ ...g }))
        };
    }
    
    // 保存玩家数据
    saveData() {
        return {
            version: '2.0.0',
            timestamp: Date.now(),
            player: this.getStatusSummary()
        };
    }
    
    // 加载玩家数据
    loadData(data) {
        if (!data || !data.player) return false;
        
        try {
            const playerData = data.player;
            
            this.x = playerData.position.x || this.x;
            this.y = playerData.position.y || this.y;
            this.attributes = { ...this.attributes, ...playerData.attributes };
            this.skills = { ...this.skills, ...playerData.skills };
            this.statusEffects = { ...this.statusEffects, ...playerData.statusEffects };
            this.stats = { ...this.stats, ...playerData.stats };
            this.inventory = { ...this.inventory, ...playerData.inventory };
            this.achievements = [...(playerData.achievements || [])];
            this.dailyGoals = [...(playerData.dailyGoals || [])];
            
            console.log('✅ 玩家数据加载成功');
            return true;
            
        } catch (error) {
            console.error('❌ 加载玩家数据失败:', error);
            return false;
        }
    }
    
    /**
     * 设置玩家性别
     * @param {string} gender - 'male' 或 'female'
     */
    setGender(gender) {
        this.gender = gender;
        this.updateUI();
    }
    
    /**
     * 修改属性值
     * @param {string} statName - 属性名称
     * @param {number} change - 变化值 (可以为负数)
     */
    changeStat(statName, change) {
        if (this.stats.hasOwnProperty(statName)) {
            const oldValue = this.stats[statName];
            this.stats[statName] = Math.max(0, Math.min(100, this.stats[statName] + change));
            
            // 如果有实际变化，显示动画效果
            if (this.stats[statName] !== oldValue) {
                this.showStatChange(statName, this.stats[statName] - oldValue);
            }
            
            this.updateUI();
        }
    }
    
    /**
     * 修改人际关系
     * @param {string} character - 角色名称
     * @param {number} change - 变化值
     */
    changeRelationship(character, change) {
        if (this.relationships.hasOwnProperty(character)) {
            this.relationships[character] = Math.max(-10, Math.min(10, this.relationships[character] + change));
            this.updateUI();
        }
    }
    
    /**
     * 显示属性变化动画
     * @param {string} statName - 属性名称
     * @param {number} change - 变化值
     */
    showStatChange(statName, change) {
        const statElement = document.getElementById(`${this.getStatId(statName)}-value`);
        if (statElement) {
            // 移除之前的动画类
            statElement.classList.remove('stat-increase', 'stat-decrease');
            
            // 添加相应的动画类
            if (change > 0) {
                statElement.classList.add('stat-increase');
                statElement.setAttribute('data-change', `+${change}`);
            } else if (change < 0) {
                statElement.classList.add('stat-decrease');
                statElement.setAttribute('data-change', `${change}`);
            }
            
            // 在动画结束后移除类
            setTimeout(() => {
                statElement.classList.remove('stat-increase', 'stat-decrease');
                statElement.removeAttribute('data-change');
            }, 600);
        }
    }
    
    /**
     * 获取属性对应的元素ID
     * @param {string} statName - 属性名称
     * @returns {string} 元素ID
     */
    getStatId(statName) {
        const idMap = {
            academic: 'academic',
            social: 'social',
            family: 'family',
            health: 'health',
            talent: 'talent'
        };
        return idMap[statName] || statName;
    }
    
    /**
     * 推进游戏时间
     */
    advanceTime() {
        this.progress.totalEvents++;
        
        // 这里可以添加时间推进的逻辑
        // 比如每隔一定数量的事件就推进学期
        
        this.updateUI();
    }
    
    /**
     * 记录事件历史
     * @param {string} eventId - 事件ID
     * @param {string} choice - 选择内容
     * @param {Object} effects - 选择效果
     */
    recordEvent(eventId, choice, effects) {
        this.eventHistory.push({
            eventId,
            choice,
            effects,
            timestamp: new Date().toISOString(),
            gameTime: { ...this.progress }
        });
    }
    
    /**
     * 检查是否达成成就
     * @param {string} achievementId - 成就ID
     */
    checkAchievement(achievementId) {
        if (!this.achievements.includes(achievementId)) {
            this.achievements.push(achievementId);
            this.showAchievementNotification(achievementId);
        }
    }
    
    /**
     * 显示成就通知
     * @param {string} achievementId - 成就ID
     */
    showAchievementNotification(achievementId) {
        // 这里可以显示成就获得的通知
        console.log(`获得成就: ${achievementId}`);
    }
    
    /**
     * 更新UI显示
     */
    updateUI() {
        // 更新属性值显示
        Object.keys(this.stats).forEach(statName => {
            const element = document.getElementById(`${this.getStatId(statName)}-value`);
            if (element) {
                element.textContent = this.stats[statName];
            }
        });
        
        // 更新时间显示
        this.updateTimeDisplay();
    }
    
    /**
     * 更新时间显示
     */
    updateTimeDisplay() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const yearText = `初${this.progress.currentYear}`;
            const semesterText = this.progress.currentSemester === 1 ? '上学期' : '下学期';
            const seasonText = this.getSeasonText(this.progress.currentSeason);
            dateElement.textContent = `${yearText}${semesterText} · ${seasonText}`;
        }
    }
    
    /**
     * 获取季节中文名称
     * @param {string} season - 季节英文名
     * @returns {string} 季节中文名
     */
    getSeasonText(season) {
        const seasonMap = {
            'summer': '夏天',
            'autumn': '秋天', 
            'winter': '冬天',
            'spring': '春天'
        };
        return seasonMap[season] || season;
    }
    
    /**
     * 保存游戏
     * @param {string} slotName - 存档槽名称
     */
    saveGame(slotName = 'auto') {
        const saveData = {
            playerData: {
                name: this.name,
                gender: this.gender,
                stats: { ...this.stats },
                progress: { ...this.progress },
                relationships: { ...this.relationships },
                eventHistory: [...this.eventHistory],
                achievements: [...this.achievements]
            },
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        try {
            localStorage.setItem(`schoolLife_save_${slotName}`, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('保存游戏失败:', error);
            return false;
        }

    }
    
    /**
     * 加载游戏
     * @param {string} slotName - 存档槽名称
     */
    loadGame(slotName = 'auto') {
        try {
            const saveData = localStorage.getItem(`schoolLife_save_${slotName}`);
            if (saveData) {
                const data = JSON.parse(saveData);
                const playerData = data.playerData;
                
                // 恢复玩家数据
                this.name = playerData.name || '';
                this.gender = playerData.gender || '';
                this.stats = { ...this.stats, ...playerData.stats };
                this.progress = { ...this.progress, ...playerData.progress };
                this.relationships = { ...this.relationships, ...playerData.relationships };
                this.eventHistory = playerData.eventHistory || [];
                this.achievements = playerData.achievements || [];
                
                this.updateUI();
                return true;
            }
            return false;
        } catch (error) {
            console.error('加载游戏失败:', error);
            return false;
        }
    }
    
    /**
     * 获取所有存档
     */
    getAllSaves() {
        const saves = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('schoolLife_save_')) {
                const slotName = key.replace('schoolLife_save_', '');
                try {
                    const saveData = JSON.parse(localStorage.getItem(key));
                    saves[slotName] = {
                        timestamp: saveData.timestamp,
                        progress: saveData.playerData.progress,
                        stats: saveData.playerData.stats
                    };
                } catch (error) {
                    console.error(`读取存档 ${slotName} 失败:`, error);
                }
            }
        }
        return saves;
    }
    
    /**
     * 删除存档
     * @param {string} slotName - 存档槽名称
     */
    deleteSave(slotName) {
        try {
            localStorage.removeItem(`schoolLife_save_${slotName}`);
            return true;
        } catch (error) {
            console.error('删除存档失败:', error);
            return false;
        }
    }
    
    /**
     * 重置游戏
     */
    resetGame() {
        // 重置所有数据到初始状态
        this.name = '';
        this.gender = '';
        
        this.stats = {
            academic: 50,
            social: 50,
            family: 50,
            health: 50,
            talent: 50
        };
        
        this.progress = {
            currentYear: 1,
            currentSemester: 1,
            currentSeason: 'summer',
            currentEvent: 'start',
            totalEvents: 0,
            unlockedChoices: []
        };
        
        this.relationships = {
            '张俊熙': 0, '林昊阳': 0, '刘雨晴': 0, '李昕瑶': 0, '郑星然': 0, '周泽宇': 0, '王亦辰': 0, '陈子墨': 0,
            '语文林老师': 0, '数学王老师': 0, '英语Miss Chen': 0, '道法赵老师': -2, '历史李老师': 0, '地理张老师': 0, '生物周老师': 0, '体育张教练': 0, '信息吴老师': 0,
            '保安大叔': -1, '食堂阿姨': -1, '小卖部老板': 3, '教导主任': -3,
            '爸爸': 8, '妈妈': 8, '哈基米': 10
        };
        
        this.eventHistory = [];
        this.achievements = [];
        
        this.updateUI();
    }
}

// Player 由 GameEngine 在 initSystems() 中实例化，此处不重复创建
window.Player = Player;