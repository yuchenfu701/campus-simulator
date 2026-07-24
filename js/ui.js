/**
 * 爱哲安民未来学校校园模拟器 - UI管理系统
 * 管理游戏的用户界面元素
 */

class UIManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // UI状态
        this.state = {
            showHUD: true,
            showMiniMap: true,
            showAttributes: true,
            currentDialog: null,
            notifications: []
        };
        
        // UI元素缓存
        this.elements = {};
        
        // 通知系统
        this.notifications = [];
        this.maxNotifications = 5;
        
        // 对话系统
        this.dialogQueue = [];
        this.currentDialog = null;
        
        // 消息系统
        this.messages = [];
        this.maxMessages = 10;

        // 任务追踪器低频刷新，避免每帧写DOM
        this.questTrackerCache = '';
        this.questTrackerAccum = 0;
    }
    
    // 初始化UI系统
    async init() {
        console.log('🎨 初始化UI管理系统');
        
        // 初始化UI元素
        this.initializeElements();
        
        // 绑定事件监听器
        this.bindEventListeners();
        
        // 创建动态UI元素
        this.createDynamicElements();
        
        return true;
    }
    
    // 初始化UI元素
    initializeElements() {
        // 缓存常用UI元素
        this.elements = {
            // 属性显示
            academicValue: document.getElementById('academic-value'),
            socialValue: document.getElementById('social-value'),
            familyValue: document.getElementById('family-value'),
            healthValue: document.getElementById('health-value'),
            talentValue: document.getElementById('talent-value'),
            
            // 时间显示
            currentTime: document.getElementById('current-time'),
            currentDay: document.getElementById('current-day'),
            
            // 位置显示
            currentLocation: document.getElementById('current-location'),
            
            // 状态面板
            statusPanel: document.querySelector('.status-panel'),
            
            // 模态窗口
            inventoryModal: document.getElementById('inventory-modal'),
            mapModal: document.getElementById('map-modal'),
            settingsModal: document.getElementById('settings-modal'),
            
            // 游戏画布
            gameCanvas: document.getElementById('game-canvas')
        };
    }
    
    // 绑定事件监听器
    bindEventListeners() {
        // 监听游戏引擎事件
        if (this.gameEngine) {
            // 这里可以监听游戏引擎的广播事件
        }
    }
    
    // 创建动态UI元素
    createDynamicElements() {
        // 创建消息容器
        this.createMessageContainer();
        
        // 创建通知容器
        this.createNotificationContainer();
        
        // 创建HUD覆盖层
        this.createHUDOverlay();

        // 创建校园任务追踪器
        this.createQuestTracker();
    }
    
    // 创建消息容器
    createMessageContainer() {
        if (!document.getElementById('message-container')) {
            const container = document.createElement('div');
            container.id = 'message-container';
            container.className = 'message-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                pointer-events: none;
                max-width: 300px;
            `;
            document.body.appendChild(container);
        }
    }
    
    // 创建通知容器
    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 1000;
                pointer-events: none;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
    }
    
    // 创建HUD覆盖层
    createHUDOverlay() {
        if (!document.getElementById('hud-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'hud-overlay';
            overlay.className = 'hud-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 100;
            `;
            document.body.appendChild(overlay);
        }
    }

    createQuestTracker() {
        if (document.getElementById('campus-quest-tracker')) return;
        const tracker = document.createElement('div');
        tracker.id = 'campus-quest-tracker';
        tracker.style.cssText = `
            position: fixed;
            right: 18px;
            top: 96px;
            width: 300px;
            max-width: calc(100vw - 36px);
            background: rgba(8, 24, 40, 0.86);
            color: #eaf8ff;
            border: 1px solid rgba(90, 190, 255, 0.42);
            border-radius: 14px;
            box-shadow: 0 12px 32px rgba(0,0,0,0.22);
            padding: 12px 14px;
            z-index: 760;
            font-family: "Microsoft YaHei", Arial, sans-serif;
            pointer-events: none;
            line-height: 1.5;
        `;
        document.body.appendChild(tracker);
        this.updateQuestTracker();
    }
    
    // 更新UI
    update(deltaTime) {
        this.updateNotifications(deltaTime);
        this.updateMessages(deltaTime);
        this.updateHUD();
        this.questTrackerAccum += deltaTime;
        if (this.questTrackerAccum >= 0.35) {
            this.questTrackerAccum = 0;
            this.updateQuestTracker();
        }
    }

    updateQuestTracker() {
        const tracker = document.getElementById('campus-quest-tracker');
        if (!tracker || !window.CampusQuests) return;
        const state = window.CampusQuests.loadState();
        const lines = Object.entries(window.CampusQuests.quests).map(([questId, quest]) => {
            const p = window.CampusQuests.getQuestProgress(questId, state);
            const pct = p.total ? Math.round(p.completedCount / p.total * 100) : 0;
            const next = p.nextStep ? `下一步：${p.nextStep.label}` : '已完成';
            return `
                <div style="margin-top:8px;">
                    <div style="display:flex;justify-content:space-between;gap:8px;font-weight:700;">
                        <span>${quest.title}</span><span>${p.completedCount}/${p.total}</span>
                    </div>
                    <div style="height:6px;background:rgba(255,255,255,0.14);border-radius:999px;overflow:hidden;margin:5px 0;">
                        <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#38bdf8,#34d399);"></div>
                    </div>
                    <div style="font-size:12px;color:#b9e9ff;">${next}</div>
                </div>
            `;
        }).join('');
        const html = `
            <div style="font-weight:900;color:#7dd3fc;font-size:15px;">🎒 校园探索任务</div>
            <div style="font-size:12px;color:#cdefff;margin-top:2px;">按 E 与区域互动，完成导览和校园生活线。</div>
            ${lines}
        `;
        if (html !== this.questTrackerCache) {
            tracker.innerHTML = html;
            this.questTrackerCache = html;
        }
    }
    
    // 渲染UI
    render(ctx, canvas) {
        if (!this.state.showHUD) return;
        
        // 渲染HUD元素
        this.renderHUD(ctx, canvas);
        
        // 渲染小地图
        if (this.state.showMiniMap) {
            this.renderMiniMap(ctx, canvas);
        }
        
        // 渲染交互提示
        this.renderInteractionHints(ctx, canvas);
        
        // 渲染对话框
        if (this.currentDialog) {
            this.renderDialog(ctx, canvas);
        }
    }
    
    // 渲染HUD
    renderHUD(ctx, canvas) {
        // HUD背景
        const hudHeight = 80;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, hudHeight);
        
        // 分隔线
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, hudHeight);
        ctx.lineTo(canvas.width, hudHeight);
        ctx.stroke();
        
        // 玩家信息
        this.renderPlayerInfo(ctx, 20, 20);
        
        // 时间信息
        this.renderTimeInfo(ctx, canvas.width - 200, 20);
        
        // 位置信息
        this.renderLocationInfo(ctx, canvas.width / 2 - 100, 20);
    }
    
    // 渲染玩家信息
    renderPlayerInfo(ctx, x, y) {
        const player = this.gameEngine?.getSystem('player');
        if (!player) return;
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        // 属性显示
        const attributes = [
            { name: '学业', value: player.attributes.academic, color: '#4CAF50' },
            { name: '社交', value: player.attributes.social, color: '#2196F3' },
            { name: '健康', value: player.attributes.health, color: '#FF5722' },
            { name: '体力', value: player.attributes.energy, color: '#FF9800' }
        ];
        
        attributes.forEach((attr, index) => {
            const barX = x;
            const barY = y + index * 15;
            const barWidth = 80;
            const barHeight = 10;
            
            // 标签
            ctx.fillStyle = 'white';
            ctx.fillText(attr.name, barX, barY + 8);
            
            // 背景条
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(barX + 35, barY, barWidth, barHeight);
            
            // 数值条
            ctx.fillStyle = attr.color;
            const fillWidth = (attr.value / 100) * barWidth;
            ctx.fillRect(barX + 35, barY, fillWidth, barHeight);
            
            // 数值文本
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(Math.round(attr.value), barX + 35 + barWidth / 2, barY + 7);
        });
    }
    
    // 渲染时间信息
    renderTimeInfo(ctx, x, y) {
        const timeSystem = this.gameEngine?.getSystem('time');
        if (!timeSystem) return;
        
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        
        // 时间显示
        const timeString = timeSystem.getTimeString ? timeSystem.getTimeString() : '08:00';
        const dayString = timeSystem.getDayString ? timeSystem.getDayString() : '周一';
        
        ctx.fillText(`⏰ ${timeString}`, x, y + 15);
        ctx.fillText(`📅 ${dayString}`, x, y + 35);
    }
    
    // 渲染位置信息
    renderLocationInfo(ctx, x, y) {
        const player = this.gameEngine?.getSystem('player');
        const mapSystem = this.gameEngine?.getSystem('map');
        
        if (!player || !mapSystem) return;
        
        const currentArea = mapSystem.getCurrentArea(player.x, player.y);
        const locationName = currentArea ? currentArea.name : '校园';
        
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`📍 ${locationName}`, x + 100, y + 25);
    }
    
    // 渲染小地图
    renderMiniMap(ctx, canvas) {
        const mapSize = 120;
        const mapX = canvas.width - mapSize - 10;
        const mapY = 90;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(mapX, mapY, mapSize, mapSize);
        
        // 边框
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 2;
        ctx.strokeRect(mapX, mapY, mapSize, mapSize);
        
        // 地图内容
        const mapSystem = this.gameEngine?.getSystem('map');
        if (mapSystem && typeof mapSystem.renderMiniMap === 'function') {
            // 保存上下文
            ctx.save();
            
            // 设置裁剪区域
            ctx.beginPath();
            ctx.rect(mapX, mapY, mapSize, mapSize);
            ctx.clip();
            
            // 平移上下文到小地图位置
            ctx.translate(mapX, mapY);
            
            // 渲染小地图
            mapSystem.renderMiniMap(ctx, mapSize, mapSize);
            
            // 恢复上下文
            ctx.restore();
        }
        
        // 玩家位置
        const player = this.gameEngine?.getSystem('player');
        if (player && mapSystem) {
            const scale = mapSize / Math.max(mapSystem.width, mapSystem.height);
            const playerX = mapX + player.x * scale;
            const playerY = mapY + player.y * scale;
            
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(playerX, playerY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 渲染交互提示
    renderInteractionHints(ctx, canvas) {
        const player = this.gameEngine?.getSystem('player');
        if (!player || !player.interaction) return;
        
        const { nearbyNPCs, nearbyObjects } = player.interaction;
        
        if (nearbyNPCs.length > 0 || nearbyObjects.length > 0) {
            const hintWidth = 200;
            const hintHeight = 40;
            const hintX = (canvas.width - hintWidth) / 2;
            const hintY = canvas.height - hintHeight - 20;
            
            // 背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(hintX, hintY, hintWidth, hintHeight);
            
            // 边框
            ctx.strokeStyle = '#4A90E2';
            ctx.lineWidth = 2;
            ctx.strokeRect(hintX, hintY, hintWidth, hintHeight);
            
            // 文本
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            
            let hintText = '按 E 键交互';
            if (nearbyNPCs.length > 0) {
                hintText = `与 ${nearbyNPCs[0]} 对话 (E)`;
            } else if (nearbyObjects.length > 0) {
                hintText = `${nearbyObjects[0]} (E)`;
            }
            
            ctx.fillText(hintText, hintX + hintWidth / 2, hintY + hintHeight / 2 + 5);
        }
    }
    
    // 显示通知
    showNotification(title, message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            duration,
            timestamp: Date.now()
        };
        
        this.notifications.push(notification);
        
        // 限制通知数量
        if (this.notifications.length > this.maxNotifications) {
            this.notifications.shift();
        }
        
        // 创建DOM通知
        this.createNotificationElement(notification);
    }
    
    // 创建通知元素
    createNotificationElement(notification) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.id = `notification-${notification.id}`;
        element.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid ${this.getNotificationColor(notification.type)};
            animation: slideInLeft 0.3s ease-out;
            pointer-events: auto;
            cursor: pointer;
        `;
        
        element.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">${notification.title}</div>
            <div style="font-size: 14px;">${notification.message}</div>
        `;
        
        // 点击关闭
        element.addEventListener('click', () => {
            element.remove();
        });
        
        container.appendChild(element);
        
        // 自动移除
        setTimeout(() => {
            if (element.parentNode) {
                element.style.animation = 'slideOutLeft 0.3s ease-in';
                setTimeout(() => element.remove(), 300);
            }
        }, notification.duration);
    }
    
    // 获取通知颜色
    getNotificationColor(type) {
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };
        return colors[type] || colors.info;
    }
    
    // 更新通知
    updateNotifications(deltaTime) {
        this.notifications = this.notifications.filter(notification => {
            notification.duration -= deltaTime;
            return notification.duration > 0;
        });
    }
    
    // 更新消息
    updateMessages(deltaTime) {
        this.messages = this.messages.filter(message => {
            if (message.fadeTime !== undefined) {
                message.fadeTime -= deltaTime;
                return message.fadeTime > 0;
            }
            return true;
        });
    }
    
    // 更新HUD
    updateHUD() {
        const player = this.gameEngine?.getSystem('player');
        if (!player) return;
        
        // 更新属性显示（DOM元素）
        this.updateAttributeElements(player);
        
        // 更新时间显示
        this.updateTimeElements();
        
        // 更新位置显示
        this.updateLocationElements();
    }
    
    // 更新属性元素
    updateAttributeElements(player) {
        const elements = this.elements;
        
        if (elements.academicValue) {
            elements.academicValue.textContent = Math.round(player.attributes.academic);
        }
        if (elements.socialValue) {
            elements.socialValue.textContent = Math.round(player.attributes.social);
        }
        if (elements.familyValue) {
            elements.familyValue.textContent = Math.round(player.attributes.family);
        }
        if (elements.healthValue) {
            elements.healthValue.textContent = Math.round(player.attributes.health);
        }
        if (elements.talentValue) {
            elements.talentValue.textContent = Math.round(player.attributes.talent);
        }
    }
    
    // 更新时间元素
    updateTimeElements() {
        const timeSystem = this.gameEngine?.getSystem('time');
        if (!timeSystem) return;
        
        const elements = this.elements;
        
        if (elements.currentTime && timeSystem.getTimeString) {
            elements.currentTime.textContent = timeSystem.getTimeString();
        }
        if (elements.currentDay && timeSystem.getDayString) {
            elements.currentDay.textContent = timeSystem.getDayString();
        }
    }
    
    // 更新位置元素
    updateLocationElements() {
        const player = this.gameEngine?.getSystem('player');
        const mapSystem = this.gameEngine?.getSystem('map');
        
        if (!player || !mapSystem || !this.elements.currentLocation) return;
        
        const currentArea = mapSystem.getCurrentArea(player.x, player.y);
        const locationName = currentArea ? currentArea.name : '校园';
        
        this.elements.currentLocation.textContent = locationName;
    }
    
    // 显示错误
    showError(message) {
        this.showNotification('错误', message, 'error', 5000);
    }
    
    // 显示成功消息
    showSuccess(message) {
        this.showNotification('成功', message, 'success', 3000);
    }
    
    // 显示警告
    showWarning(message) {
        this.showNotification('警告', message, 'warning', 4000);
    }
    
    // ===== 对话系统方法 =====
    
    // 开始对话
    startDialog(npcName, dialogueContent) {
        console.log('🗣️ 开始对话:', npcName, dialogueContent);
        
        this.currentDialog = {
            npcName: npcName,
            content: dialogueContent,
            currentIndex: 0,
            isPlayerTurn: false
        };
        
        // 暂停游戏其他输入
        if (this.gameEngine) {
            this.gameEngine.inputEnabled = false;
        }
    }
    
    // 结束对话
    endDialog() {
        console.log('🔚 结束对话');
        this.currentDialog = null;
        
        // 恢复游戏输入
        if (this.gameEngine) {
            this.gameEngine.inputEnabled = true;
        }
    }
    
    // 推进对话
    nextDialogue() {
        if (!this.currentDialog) return;
        
        this.currentDialog.currentIndex++;
        
        // 如果对话结束
        if (this.currentDialog.currentIndex >= this.currentDialog.content.length) {
            this.endDialog();
        }
    }
    
    // 渲染对话框
    renderDialog(ctx, canvas) {
        if (!this.currentDialog) return;
        
        const dialog = this.currentDialog;
        const currentLine = dialog.content[dialog.currentIndex];
        
        if (!currentLine) return;
        
        // 对话框尺寸和位置
        const dialogWidth = canvas.width - 100;
        const dialogHeight = 240; // 增加高度以容纳表情
        const dialogX = (canvas.width - dialogWidth) / 2;
        const dialogY = canvas.height - dialogHeight - 50;
        
        // 绘制对话框背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(dialogX, dialogY, dialogWidth, dialogHeight);
        
        // 绘制边框
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 3;
        ctx.strokeRect(dialogX, dialogY, dialogWidth, dialogHeight);
        
        // 绘制说话者名字背景 (增加高度以容纳关系显示)
        const nameHeight = 50;
        ctx.fillStyle = '#4A90E2';
        ctx.fillRect(dialogX, dialogY - nameHeight, 250, nameHeight);
        
        // 绘制说话者名字
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(currentLine.speaker, dialogX + 15, dialogY - nameHeight + 25);
        
        // 显示关系等级
        if (currentLine.speaker !== '我' && this.gameEngine) {
            const relationshipSystem = this.gameEngine.getSystem('relationship');
            if (relationshipSystem) {
                const relationship = relationshipSystem.getRelationship(currentLine.speaker);
                const level = this.getRelationshipLevel(relationship);
                
                ctx.fillStyle = this.getRelationshipColor(level);
                ctx.font = '12px Arial';
                ctx.fillText(`[${level} ${relationship}]`, dialogX + 15, dialogY - nameHeight + 45);
            }
        }
        
        // 绘制角色表情
        if (currentLine.mood) {
            const emotion = this.getEmotionEmoji(currentLine.mood);
            ctx.font = '32px Arial';
            ctx.fillText(emotion, dialogX + dialogWidth - 60, dialogY - nameHeight + 30);
        }
        
        // 绘制动作描述
        if (currentLine.action) {
            const actionText = this.getActionDescription(currentLine.action);
            ctx.fillStyle = '#FFD700';
            ctx.font = 'italic 12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(actionText, dialogX + dialogWidth - 100, dialogY - nameHeight + 25);
        }
        
        // 绘制对话内容
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        
        // 自动换行处理
        const maxLineWidth = dialogWidth - 40;
        const lineHeight = 25;
        const lines = this.wrapText(ctx, currentLine.text, maxLineWidth);
        
        lines.forEach((line, index) => {
            ctx.fillText(line, dialogX + 20, dialogY + 40 + (index * lineHeight));
        });
        
        // 绘制选择选项（如果有）
        if (currentLine.choices) {
            this.renderChoices(ctx, dialogX, dialogY, dialogWidth, currentLine.choices);
        } else {
            // 绘制继续提示
            if (dialog.currentIndex < dialog.content.length - 1) {
                ctx.fillStyle = '#FFD700';
                ctx.font = '14px Arial';
                ctx.textAlign = 'right';
                ctx.fillText('按空格键继续...', dialogX + dialogWidth - 20, dialogY + dialogHeight - 20);
            } else {
                ctx.fillStyle = '#FF6B6B';
                ctx.font = '14px Arial';
                ctx.textAlign = 'right';
                ctx.fillText('按空格键结束对话', dialogX + dialogWidth - 20, dialogY + dialogHeight - 20);
            }
        }
        
        // 播放语音效果
        if (currentLine.soundEffect && !currentLine.soundPlayed) {
            console.log('🔊 播放音效:', currentLine.soundEffect, 'for', currentLine.speaker);
            this.playSoundEffect(currentLine.soundEffect);
            currentLine.soundPlayed = true;
        }
    }
    
    // 渲染选择选项
    renderChoices(ctx, dialogX, dialogY, dialogWidth, choices) {
        const choiceHeight = 40;
        const choiceSpacing = 10;
        const startY = dialogY + 120;
        
        choices.forEach((choice, index) => {
            const choiceY = startY + (index * (choiceHeight + choiceSpacing));
            
            // 选择按钮背景
            ctx.fillStyle = index === this.selectedChoiceIndex ? '#4A90E2' : '#333333';
            ctx.fillRect(dialogX + 20, choiceY, dialogWidth - 40, choiceHeight);
            
            // 选择按钮边框
            ctx.strokeStyle = '#4A90E2';
            ctx.lineWidth = 2;
            ctx.strokeRect(dialogX + 20, choiceY, dialogWidth - 40, choiceHeight);
            
            // 选择文本
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`${index + 1}. ${choice.text}`, dialogX + 30, choiceY + 25);
        });
        
        // 选择提示
        ctx.fillStyle = '#FFD700';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('使用数字键或方向键选择', dialogX + dialogWidth - 20, dialogY + dialogHeight - 20);
    }
    
    // 获取表情符号
    getEmotionEmoji(mood) {
        const emotions = {
            'happy': '😊',
            'sad': '😢',
            'angry': '😠',
            'frustrated': '😤',
            'excited': '😆',
            'worried': '😰',
            'confused': '😕',
            'surprised': '😲',
            'calm': '😌',
            'determined': '😤',
            'suspicious': '🤨',
            'moved': '🥺',
            'processing': '🤔',
            'systematic': '🤖',
            'security_mode': '🔒',
            'helpful': '😇',
            'persuasive': '😏',
            'concerned': '😟',
            'hopeful': '😊',
            'confident': '😎'
        };
        
        return emotions[mood] || '😐';
    }
    
    // 获取动作描述
    getActionDescription(action) {
        const actions = {
            'squeeze_bottle': '(捏瓶子)',
            'look_down': '(垂头)',
            'frown': '(皱眉)',
            'straighten_up': '(挺直腰)',
            'look_around': '(张望)',
            'blow_whistle': '(吹哨)',
            'clench_fist': '(握拳)',
            'blow_whistle_loud': '(响亮吹哨)',
            'adjust_glasses': '(扶眼镜)',
            'push_glasses': '(推眼镜)',
            'type_slowly': '(慢慢打字)',
            'generate_task': '(生成任务)',
            'lock_screen': '(锁屏)',
            'pull_arm': '(拉手臂)',
            'wave_hand': '(挥手)',
            'face_change': '(脸色变了)',
            'nod_firmly': '(坚定点头)'
        };
        
        return actions[action] || '';
    }
    
    // 播放语音效果
    playSoundEffect(soundEffect) {
        try {
            // 创建或重用音频上下文
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // 如果音频上下文被暂停（某些浏览器要求用户手势），尝试恢复
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    this.playSound(soundEffect);
                }).catch(err => {
                    console.log('🔇 音频上下文恢复失败:', err);
                });
                return;
            }
            
            this.playSound(soundEffect);
            
        } catch (error) {
            console.log('🔇 音效播放失败:', error);
            // 降级到简单的系统提示音
            this.playFallbackSound();
        }
    }
    
    // 实际播放音效
    playSound(soundEffect) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 根据角色设置不同的音调和音色
        const soundMap = {
            'teacher_male': { frequency: 150, duration: 0.3, type: 'sawtooth' },
            'teacher_female': { frequency: 250, duration: 0.25, type: 'sine' },
            'student_male': { frequency: 200, duration: 0.2, type: 'triangle' },
            'student_female': { frequency: 300, duration: 0.15, type: 'sine' },
            'notification': { frequency: 440, duration: 0.1, type: 'square' },
            'success': { frequency: 523, duration: 0.3, type: 'sine' },
            'error': { frequency: 100, duration: 0.5, type: 'sawtooth' }
        };
        
        const sound = soundMap[soundEffect] || soundMap['notification'];
        
        oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
        oscillator.type = sound.type;
        
        // 更丰富的音量包络
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sound.duration);
    }
    
    // 降级音效播放
    playFallbackSound() {
        try {
            // 使用简单的beep音
            const beep = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D2uW0lBjaJ0PTUeDEIIF238M6TOQoeV7fq4rBaFgpG");
            beep.volume = 0.1;
            beep.play().catch(() => {}); // 忽略播放失败
        } catch (error) {
            // 如果连这个都失败了，就完全静默
            console.log('🔇 降级音效也失败');
        }
    }
    
    // 显示选择对话框
    showChoiceDialog(title, description, choices, callback) {
        console.log('🎯 显示选择对话框:', title);
        
        this.currentDialog = {
            type: 'choice',
            title: title,
            description: description,
            choices: choices,
            callback: callback,
            selectedIndex: 0
        };
        
        this.selectedChoiceIndex = 0;
        
        // 暂停游戏输入
        if (this.gameEngine) {
            this.gameEngine.inputEnabled = false;
        }
    }
    
    // 显示智能体对话
    showAgentDialogue(dialogueLine, callback) {
        console.log('🤖 显示智能体对话:', dialogueLine.speaker);
        
        // 为智能体对话添加特殊标记
        const agentDialogue = {
            ...dialogueLine,
            isAgent: true,
            soundEffect: this.getAgentSoundEffect(dialogueLine.speaker)
        };
        
        this.startDialog(dialogueLine.speaker, [agentDialogue]);
        this.currentDialog.agentCallback = callback;
    }
    
    // 获取智能体音效
    getAgentSoundEffect(speaker) {
        const soundMap = {
            '体育老师': 'teacher_male',
            '信息技术老师': 'teacher_male', 
            '数学老师': 'teacher_male',
            '语文老师': 'teacher_female',
            '英语老师': 'teacher_female',
            '道德与法治老师': 'teacher_female',
            '刘语晴': 'student_female',
            '李昕瑶': 'student_female',
            '张俊熙': 'student_male',
            '林浩阳': 'student_male',
            '保安': 'teacher_male',
            '教导主任': 'teacher_male'
        };
        
        return soundMap[speaker] || 'notification';
    }
    
    // 获取关系等级名称
    getRelationshipLevel(value) {
        if (value >= 80) return '挚友';
        if (value >= 60) return '好友';
        if (value >= 40) return '朋友';
        if (value >= 20) return '认识';
        if (value >= 0) return '陌生';
        return '敌对';
    }
    
    // 获取关系等级颜色
    getRelationshipColor(level) {
        const colors = {
            '挚友': '#FF69B4',  // 粉色
            '好友': '#32CD32',  // 绿色
            '朋友': '#87CEEB',  // 天蓝色
            '认识': '#FFD700',  // 金色
            '陌生': '#C0C0C0',  // 银色
            '敌对': '#FF4500'   // 红色
        };
        return colors[level] || '#FFFFFF';
    }
    
    // 处理选择输入
    handleChoiceInput(key) {
        if (!this.currentDialog || this.currentDialog.type !== 'choice') return false;
        
        const choices = this.currentDialog.choices;
        
        // 数字键选择
        const number = parseInt(key);
        if (number >= 1 && number <= choices.length) {
            this.selectChoice(number - 1);
            return true;
        }
        
        // 方向键选择
        if (key === 'arrowdown') {
            this.selectedChoiceIndex = (this.selectedChoiceIndex + 1) % choices.length;
            return true;
        } else if (key === 'arrowup') {
            this.selectedChoiceIndex = (this.selectedChoiceIndex - 1 + choices.length) % choices.length;
            return true;
        } else if (key === 'enter' || key === ' ') {
            this.selectChoice(this.selectedChoiceIndex);
            return true;
        }
        
        return false;
    }
    
    // 选择选项
    selectChoice(index) {
        if (!this.currentDialog || this.currentDialog.type !== 'choice') return;
        
        const choice = this.currentDialog.choices[index];
        console.log('✅ 选择了:', choice.text);
        
        // 播放选择音效
        this.playSoundEffect('success');
        
        // 调用回调
        if (this.currentDialog.callback) {
            this.currentDialog.callback(choice);
        }
        
        // 结束对话
        this.endDialog();
    }
    
    // 推进对话
    nextDialogue() {
        if (!this.currentDialog) return;
        
        // 处理智能体对话回调
        if (this.currentDialog.agentCallback) {
            this.currentDialog.agentCallback();
            this.endDialog();
            return;
        }
        
        this.currentDialog.currentIndex++;
        
        // 如果对话结束
        if (this.currentDialog.currentIndex >= this.currentDialog.content.length) {
            this.endDialog();
        }
    }

    // ===== 升级的关系系统集成对话 =====
    
    // 根据关系值获取对话内容
    getRelationshipBasedDialogue(characterId) {
        const relationshipSystem = this.gameEngine?.getSystem('relationship');
        const characterManager = this.gameEngine?.getSystem('characters');
        
        if (!relationshipSystem || !characterManager) {
            return this.getDefaultDialogue(characterId);
        }
        
        const relationship = relationshipSystem.getRelationship(characterId);
        const baseDialogues = characterManager.getAllDialogues(characterId);
        
        if (!baseDialogues || baseDialogues.length === 0) {
            return this.getDefaultDialogue(characterId);
        }
        
        // 根据关系值选择合适的对话
        let selectedDialogue;
        if (relationship >= 70) {
            selectedDialogue = baseDialogues.close || baseDialogues.normal || baseDialogues[0];
        } else if (relationship >= 40) {
            selectedDialogue = baseDialogues.normal || baseDialogues[0];
        } else if (relationship >= 10) {
            selectedDialogue = baseDialogues.distant || baseDialogues.normal || baseDialogues[0];
        } else {
            selectedDialogue = baseDialogues.hostile || baseDialogues.distant || baseDialogues[0];
        }
        
        // 调整语气
        return this.adjustDialogueByRelationship(selectedDialogue, relationship, characterId);
    }
    
    // 根据关系调整对话语气
    adjustDialogueByRelationship(dialogue, relationship, characterId) {
        if (!Array.isArray(dialogue)) return dialogue;
        
        return dialogue.map(line => {
            let adjustedText = line.text;
            let adjustedMood = line.mood || 'neutral';
            
            // 根据关系值调整语气
            if (relationship >= 70) {
                // 亲密关系
                adjustedText = this.addWarmthToText(adjustedText);
                adjustedMood = this.warmMood(adjustedMood);
            } else if (relationship <= 20) {
                // 疏远关系
                adjustedText = this.addColdnessToText(adjustedText);
                adjustedMood = this.coldMood(adjustedMood);
            }
            
            return {
                ...line,
                text: adjustedText,
                mood: adjustedMood,
                soundEffect: this.getAgentSoundEffect(line.speaker)
            };
        });
    }
    
    // 为文本添加温暖语气
    addWarmthToText(text) {
        const warmPrefixes = ['', '嘿，', '哈哈，'];
        const warmSuffixes = ['！', '~', '呢！', '哦！'];
        
        const prefix = warmPrefixes[Math.floor(Math.random() * warmPrefixes.length)];
        const suffix = warmSuffixes[Math.floor(Math.random() * warmSuffixes.length)];
        
        return prefix + text + suffix;
    }
    
    // 为文本添加冷淡语气
    addColdnessToText(text) {
        const coldPrefixes = ['', '嗯...', '呃...'];
        const coldSuffixes = ['...', '。', '吧。'];
        
        const prefix = coldPrefixes[Math.floor(Math.random() * coldPrefixes.length)];
        const suffix = coldSuffixes[Math.floor(Math.random() * coldSuffixes.length)];
        
        return prefix + text + suffix;
    }
    
    // 调整心情为温暖
    warmMood(mood) {
        const warmMoodMap = {
            'neutral': 'happy',
            'calm': 'excited',
            'sad': 'hopeful',
            'angry': 'frustrated'
        };
        
        return warmMoodMap[mood] || mood;
    }
    
    // 调整心情为冷淡
    coldMood(mood) {
        const coldMoodMap = {
            'happy': 'neutral',
            'excited': 'calm',
            'hopeful': 'sad',
            'confident': 'suspicious'
        };
        
        return coldMoodMap[mood] || mood;
    }
    
    // 开始对话事件处理（升级版）
    onStartDialog(data) {
        console.log('📢 处理开始对话事件:', data);
        
        // 检查是否是智能体对话
        const storySystem = this.gameEngine?.getSystem('story');
        if (storySystem && storySystem.startAgentDialogue(data.npc)) {
            return; // 智能体对话接管
        }
        
        // 获取基于关系的对话内容
        const dialogue = this.getRelationshipBasedDialogue(data.npc);
        
        if (dialogue && dialogue.length > 0) {
            this.startDialog(data.npc, dialogue);
        } else {
            // 默认对话
            this.startDialog(data.npc, [
                { 
                    speaker: data.npc, 
                    text: `你好！很高兴见到你。`,
                    mood: 'happy',
                    soundEffect: this.getAgentSoundEffect(data.npc)
                },
                { 
                    speaker: '我', 
                    text: `你好，我也很高兴见到你！`,
                    mood: 'happy'
                }
            ]);
        }
    }
    
    // 属性变化事件
    onAttributeChanged(data) {
        if (Math.abs(data.change) >= 5) {
            const changeText = data.change > 0 ? `+${Math.round(data.change)}` : Math.round(data.change);
            this.showNotification(
                '属性变化',
                `${data.attribute}: ${changeText}`,
                data.change > 0 ? 'success' : 'warning',
                2000
            );
        }
    }
    
    // 区域变化事件
    onAreaChanged(data) {
        this.showNotification(
            '到达新区域',
            data.area.description || `进入了${data.area.name}`,
            'info',
            2000
        );
    }
    
    handleEvent(eventType, data = {}) {
        switch (eventType) {
            case 'startDialog':
                this.onStartDialog(data);
                break;
            case 'attributeChanged':
                this.onAttributeChanged(data);
                break;
            case 'areaChanged':
                this.onAreaChanged(data);
                break;
            case 'interact':
                this.onInteract(data);
                break;
            case 'taskCompleted':
                this.showNotification('任务完成', data.name || data.title || '完成了一个校园任务', 'success', 3500);
                break;
            case 'goalCompleted':
                this.showNotification('目标完成', data.name || '今日目标已完成', 'success', 3500);
                break;
        }
    }

    onInteract(data = {}) {
        const objectName = data.object;
        const mapSystem = this.gameEngine?.getSystem('map');
        const info = mapSystem?.getInteractableInfo ? mapSystem.getInteractableInfo(objectName) : null;

        if (!objectName || !info) {
            this.showNotification('互动失败', objectName ? `暂时还不能使用「${objectName}」` : '附近没有可互动内容', 'warning', 2500);
            return;
        }

        const player = this.gameEngine?.getSystem('player');
        this.applyInteractableEffects(player, info);

        const areaName = data.area?.name ? ` · ${data.area.name}` : '';
        this.showNotification(objectName, `${info.description || '完成了一次校园互动'}${areaName}`, info.type === 'ai' ? 'info' : 'success', 3200);
        this.updateCampusQuestProgress(objectName);

        if (info.type === 'ai') {
            const teacherId = info.aiTeacherId || 'guide';
            const teacher = window.CampusAITeachers?.getTeacher?.(teacherId);
            const teacherName = teacher?.displayName || objectName || 'AI老师';
            const question = `我在${data.area?.name || '校园'}，现在下一步该做什么？`;
            setTimeout(async () => {
                let reply;
                try {
                    reply = await (window.CampusAI?.chat
                        ? window.CampusAI.chat({
                            teacherId,
                            scene: '2d-map',
                            messages: [{ role: 'user', content: question }]
                        })
                        : Promise.resolve(window.CampusAI?.fallbackTeacherReply?.(question, '2d-map', teacherId)));
                } catch (err) {
                    console.warn('2D AI老师请求失败，使用兜底回复', err);
                    reply = window.CampusAI?.fallbackTeacherReply?.(question, '2d-map', teacherId) || '先完成新生导览，再去食堂、操场、教学楼各打卡一次。';
                }
                this.startDialog(teacherName, [
                    { speaker: teacherName, text: reply || teacher?.opening || '先看任务追踪器，完成最近的一步。', mood: 'happy' },
                    { speaker: '我', text: '明白了，我先从最近的任务开始。', mood: 'confident' }
                ]);
            }, 250);
        } else if (info.dialogue && info.dialogue.length) {
            setTimeout(() => this.startDialog(objectName, info.dialogue), 250);
        }
    }

    updateCampusQuestProgress(objectName) {
        if (!window.CampusQuests || !objectName) return;
        const result = window.CampusQuests.completeInteraction(objectName);
        if (!result?.changed) return;
        const progress = result.progress;
        if (result.completedQuest) {
            this.showNotification('任务线完成', `「${result.completedQuest.title}」完成！校园熟悉度提升。`, 'success', 4200);
        } else if (progress) {
            this.showNotification('导览进度', `${progress.quest.title} ${progress.completedCount}/${progress.total}，下一步：${progress.nextStep?.label || '自由探索'}`, 'info', 3200);
        }
    }

    applyInteractableEffects(player, info) {
        if (!player) return;

        const directAttributes = ['academic', 'social', 'family', 'health', 'talent', 'energy', 'mood', 'stress'];
        const effects = { ...(info.effects || {}) };
        directAttributes.forEach(attr => {
            if (typeof info[attr] === 'number') effects[attr] = (effects[attr] || 0) + info[attr];
        });

        Object.entries(effects).forEach(([attr, change]) => {
            if (typeof change !== 'number') return;
            if (typeof player.adjustAttribute === 'function') {
                player.adjustAttribute(attr, change);
            } else if (player.attributes && typeof player.attributes[attr] === 'number') {
                player.attributes[attr] = Math.max(0, Math.min(100, player.attributes[attr] + change));
            }
        });

        if (typeof info.money === 'number' && player.inventory) {
            player.inventory.money = Math.max(0, (player.inventory.money || 0) + info.money);
        }

        if (info.skills && typeof player.improveSkill === 'function') {
            Object.entries(info.skills).forEach(([skill, amount]) => player.improveSkill(skill, amount));
        }

        if (info.item && player.inventory?.items && !player.inventory.items.some(item => item.name === info.item)) {
            player.inventory.items.push({
                name: info.item,
                type: info.type || 'story',
                acquiredAt: Date.now()
            });
        }
    }

    showNotification(title, message, type = 'info', duration = 3000) {
        if (arguments.length <= 2) {
            const legacyMessage = title;
            const legacyType = message || 'info';
            title = legacyType === 'error' ? '错误' : legacyType === 'success' ? '成功' : legacyType === 'warning' ? '警告' : '提示';
            message = legacyMessage;
            type = legacyType;
        }

        const notification = {
            id: Date.now() + Math.random(),
            title: String(title || '提示'),
            message: String(message || ''),
            type,
            duration,
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        if (this.notifications.length > this.maxNotifications) {
            this.notifications.shift();
        }

        if (typeof this.createNotificationElement === 'function') {
            this.createNotificationElement(notification);
        }
    }
    
    // 文本自动换行
    wrapText(ctx, text, maxWidth) {
        const words = text.split('');
        const lines = [];
        let currentLine = '';
        
        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i];
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        return lines;
    }
    
    // 获取默认对话
    getDefaultDialogue(characterId) {
        return [
            { 
                speaker: characterId, 
                text: `你好！很高兴见到你。`,
                mood: 'happy',
                soundEffect: this.getAgentSoundEffect(characterId)
            },
            { 
                speaker: '我', 
                text: `你好，我也很高兴见到你！`,
                mood: 'happy'
            }
        ];
    }
}

// 创建全局UI管理器实例
window.ui = new UIManager();
