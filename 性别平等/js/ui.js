/**
 * UI交互文件
 * 处理所有用户界面的交互和显示更新
 */

/* ========== 全局变量 ========== */
let selectedRoles = [];
let currentSelectingPlayer = 0;
let playerCount = 0;

/* ========== 页面加载完成后初始化 ========== */
document.addEventListener('DOMContentLoaded', function() {
    initializeStartScreen();
    initializeModal();
    initializeLogSidebar();
});

/* ========== 开始界面初始化 ========== */
function initializeStartScreen() {
    const playerButtons = document.querySelectorAll('.player-btn');
    
    playerButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            playerCount = parseInt(this.dataset.players);
            selectedRoles = [];
            currentSelectingPlayer = 0;
            
            // 切换到角色选择界面
            switchScreen('role-selection-screen');
            initializeRoleSelection();
        });
    });
}

/* ========== 角色选择界面初始化 ========== */
function initializeRoleSelection() {
    const rolesGrid = document.querySelector('.roles-grid');
    const selectingPlayerSpan = document.getElementById('selecting-player');
    const startGameBtn = document.getElementById('start-game-btn');
    
    // 清空并重新生成角色卡片
    rolesGrid.innerHTML = '';
    
    ROLES.forEach(role => {
        const roleCard = document.createElement('div');
        roleCard.className = 'role-card';
        roleCard.dataset.roleId = role.id;
        
        roleCard.innerHTML = `
            <div class="role-icon">${role.icon}</div>
            <div class="role-name">${role.name}</div>
            <div class="role-description">${role.description}</div>
            <div class="role-skill" style="font-size: 0.85rem; margin-top: 8px; opacity: 0.8;">
                ${role.skill}
            </div>
        `;
        
        roleCard.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            
            // 记录选择
            selectedRoles[currentSelectingPlayer] = role.id;
            
            // 标记为已选择
            this.classList.add('selected', 'disabled');
            
            // 下一个玩家
            currentSelectingPlayer++;
            
            if (currentSelectingPlayer < playerCount) {
                selectingPlayerSpan.textContent = currentSelectingPlayer + 1;
            } else {
                // 所有玩家都选择完毕
                startGameBtn.style.display = 'block';
            }
        });
        
        rolesGrid.appendChild(roleCard);
    });
    
    // 开始游戏按钮
    startGameBtn.onclick = function() {
        startGame();
    };
}

/* ========== 开始游戏 ========== */
function startGame() {
    // 创建游戏实例
    game = new GameState();
    game.initialize(playerCount, selectedRoles);
    
    // 切换到游戏界面
    switchScreen('game-screen');
    
    // 初始化游戏UI
    initializeGameUI();
    
    // 触发第一个事件
    game.eventPhase();
    
    // 更新游戏显示
    updateGameDisplay();
    showEventCard();
}

/* ========== 初始化游戏UI ========== */
function initializeGameUI() {
    // 初始化版图交互
    initializeBoard();
    
    // 显示所有玩家信息
    updateAllPlayersDisplay();
}

/* ========== 初始化版图交互 ========== */
function initializeBoard() {
    const quadrants = document.querySelectorAll('.quadrant');
    
    quadrants.forEach(quadrant => {
        quadrant.addEventListener('click', function() {
            const targetQuadrant = this.dataset.quadrant;
            
            if (game.phase === 'action' && game.actionsThisTurn < game.maxActionsPerTurn) {
                // 尝试移动或执行象限行动
                showQuadrantActionModal(targetQuadrant);
            }
        });
    });
    
    // 更新玩家位置标记
    updatePlayerMarkers();
    
    // 显示刻板印象标记
    updateStereotypeMarkers();
}

/* ========== 更新玩家位置标记 ========== */
function updatePlayerMarkers() {
    const markersGroup = document.getElementById('player-markers');
    markersGroup.innerHTML = '';
    
    const quadrantPositions = {
        'workplace': { x: 200, y: 155 },
        'family': { x: 245, y: 200 },
        'education': { x: 200, y: 245 },
        'politics': { x: 155, y: 200 }
    };
    
    // 按象限分组
    const playersByQuadrant = {};
    game.players.forEach(player => {
        if (!playersByQuadrant[player.quadrant]) {
            playersByQuadrant[player.quadrant] = [];
        }
        playersByQuadrant[player.quadrant].push(player);
    });
    
    // 为每个象限的玩家创建标记
    Object.keys(playersByQuadrant).forEach(quadrant => {
        const players = playersByQuadrant[quadrant];
        const basePos = quadrantPositions[quadrant];
        
        players.forEach((player, index) => {
            // 计算偏移，避免重叠
            const offset = (index - (players.length - 1) / 2) * 22;
            const isCurrent = player.id === game.getCurrentPlayer().id;
            
            // 创建玩家圆圈
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            marker.setAttribute('cx', basePos.x + offset);
            marker.setAttribute('cy', basePos.y);
            marker.setAttribute('r', isCurrent ? '12' : '10');
            marker.setAttribute('fill', player.role.color);
            marker.setAttribute('stroke', isCurrent ? '#FFD700' : 'white');
            marker.setAttribute('stroke-width', isCurrent ? '3' : '2');
            marker.classList.add('player-marker');
            marker.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
            
            // 添加玩家编号
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', basePos.x + offset);
            text.setAttribute('y', basePos.y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dy', '0.35em');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '11');
            text.setAttribute('font-weight', 'bold');
            text.textContent = player.id;
            text.style.pointerEvents = 'none';
            
            // 添加工具提示
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `${player.name} - ${player.role.name}`;
            marker.appendChild(title);
            
            markersGroup.appendChild(marker);
            markersGroup.appendChild(text);
        });
    });
}

/* ========== 更新刻板印象标记 ========== */
function updateStereotypeMarkers() {
    const markersGroup = document.getElementById('stereotype-markers');
    markersGroup.innerHTML = '';
    
    // 每个象限只显示数量徽章，不显示具体图标
    const stereotypeCount = {
        'workplace': 0,
        'family': 0,
        'education': 0,
        'politics': 0
    };
    
    game.activeStereotypes.forEach(s => {
        if (stereotypeCount[s.quadrant] !== undefined) {
            stereotypeCount[s.quadrant]++;
        }
    });
    
    const quadrantPositions = {
        'workplace': { x: 250, y: 100 },
        'family': { x: 300, y: 250 },
        'education': { x: 150, y: 300 },
        'politics': { x: 100, y: 150 }
    };
    
    Object.keys(stereotypeCount).forEach(quadrant => {
        const count = stereotypeCount[quadrant];
        if (count > 0) {
            const pos = quadrantPositions[quadrant];
            
            // 创建圆形背景
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', '14');
            circle.setAttribute('fill', '#FF3B30');
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '2');
            circle.style.cursor = 'pointer';
            circle.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
            
            // 警告符号
            const warning = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            warning.setAttribute('x', pos.x);
            warning.setAttribute('y', pos.y - 2);
            warning.setAttribute('text-anchor', 'middle');
            warning.setAttribute('dy', '0.3em');
            warning.setAttribute('font-size', '14');
            warning.setAttribute('font-weight', 'bold');
            warning.setAttribute('fill', 'white');
            warning.textContent = '!';
            warning.style.pointerEvents = 'none';
            
            // 数量
            const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            countText.setAttribute('x', pos.x + 10);
            countText.setAttribute('y', pos.y - 10);
            countText.setAttribute('font-size', '10');
            countText.setAttribute('font-weight', 'bold');
            countText.setAttribute('fill', 'white');
            countText.textContent = count;
            countText.style.pointerEvents = 'none';
            
            // 点击显示详情
            circle.addEventListener('click', function(e) {
                e.stopPropagation();
                showQuadrantStereotypes(quadrant);
            });
            
            markersGroup.appendChild(circle);
            markersGroup.appendChild(warning);
            if (count > 1) {
                markersGroup.appendChild(countText);
            }
        }
    });
}

/* ========== 显示象限的所有刻板印象 ========== */
function showQuadrantStereotypes(quadrant) {
    const stereotypes = game.activeStereotypes.filter(s => s.quadrant === quadrant);
    const quadrantNames = {
        'workplace': '职场与企业',
        'family': '家庭与社区',
        'education': '教育与文化',
        'politics': '政治与法律'
    };
    
    let content = `<h2>${quadrantNames[quadrant]} - 刻板印象</h2>`;
    content += '<div style="max-height: 400px; overflow-y: auto;">';
    
    stereotypes.forEach(stereotype => {
        content += `
            <div style="padding: 12px; margin: 8px 0; background: #FFF5F5; border-left: 4px solid #FF3B30; border-radius: 8px;">
                <div style="font-weight: 600; margin-bottom: 4px; color: #FF3B30;">
                    ⚠️ ${stereotype.name}
                </div>
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 8px;">
                    ${stereotype.description}
                </div>
                <div style="font-size: 0.85rem; color: #FF3B30;">
                    <strong>效果：</strong>${stereotype.effect}
                </div>
            </div>
        `;
    });
    
    content += '</div>';
    content += '<button class="primary-btn" onclick="closeModal()" style="margin-top: 16px;">关闭</button>';
    
    showModal(content);
}

/* ========== 显示刻板印象信息 ========== */
function showStereotypeInfo(stereotype) {
    showModal(`
        <h2>${stereotype.name}</h2>
        <p style="color: #FF3B30; margin: 16px 0;">⚠️ ${stereotype.effect}</p>
        <p style="color: #86868B;">${stereotype.description}</p>
        <button class="primary-btn" onclick="closeModal()" style="margin-top: 16px;">知道了</button>
    `);
}

/* ========== 更新游戏显示 ========== */
function updateGameDisplay() {
    // 更新进度条
    updateProgressBar();
    
    // 更新当前阶段
    updatePhaseDisplay();
    
    // 更新回合数
    document.getElementById('round-number').textContent = game.round;
    
    // 更新当前玩家信息
    updateCurrentPlayerDisplay();
    
    // 更新行动按钮
    updateActionButtons();
    
    // 更新手牌显示
    updateHandDisplay();
    
    // 更新版图
    updatePlayerMarkers();
    updateStereotypeMarkers();
    
    // 更新日志
    updateGameLog();
    
    // 检查游戏是否结束
    if (game.isGameOver) {
        setTimeout(() => showEndScreen(), 1000);
    }
}

/* ========== 更新进度条 ========== */
function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressFill.style.width = `${game.socialProgress}%`;
    progressText.textContent = `${game.socialProgress}%`;
}

/* ========== 更新阶段显示 ========== */
function updatePhaseDisplay() {
    const phaseText = document.getElementById('phase-text');
    const phases = {
        'event': '事件阶段',
        'action': '行动阶段',
        'reset': '重置阶段'
    };
    phaseText.textContent = phases[game.phase] || game.phase;
}

/* ========== 更新当前玩家显示 ========== */
function updateCurrentPlayerDisplay() {
    const player = game.getCurrentPlayer();
    const infoDiv = document.getElementById('current-player-info');
    
    infoDiv.querySelector('.player-name').textContent = player.name;
    infoDiv.querySelector('.player-role').textContent = `${player.role.icon} ${player.role.name}`;
    
    document.getElementById('influence').textContent = player.influence;
    document.getElementById('money').textContent = player.money;
    document.getElementById('support').textContent = player.support;
    
    const quadrantNames = {
        'workplace': '职场与企业',
        'family': '家庭与社区',
        'education': '教育与文化',
        'politics': '政治与法律'
    };
    document.getElementById('player-quadrant').textContent = quadrantNames[player.quadrant];
}

/* ========== 更新所有玩家显示 ========== */
function updateAllPlayersDisplay() {
    const listDiv = document.getElementById('all-players-list');
    listDiv.innerHTML = '';
    
    game.players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        if (player.id === game.getCurrentPlayer().id) {
            playerItem.classList.add('active');
        }
        
        playerItem.innerHTML = `
            <div>
                <div class="player-item-name">${player.role.icon} ${player.name}</div>
                <div style="font-size: 0.85rem; opacity: 0.8;">
                    💪${player.influence} 💰${player.money} 🤝${player.support}
                </div>
            </div>
            <div class="player-item-score">
                得分: ${player.score}
            </div>
        `;
        
        listDiv.appendChild(playerItem);
    });
}

/* ========== 更新行动按钮 ========== */
function updateActionButtons() {
    const buttonsDiv = document.getElementById('action-buttons');
    buttonsDiv.innerHTML = '';
    
    const player = game.getCurrentPlayer();
    const actionsLeft = game.maxActionsPerTurn - game.actionsThisTurn;
    
    if (game.phase === 'event') {
        // 事件阶段的按钮
        if (game.currentEvent) {
            if (game.currentEvent.solveCost) {
                const btn = createActionButton('尝试解决事件', () => {
                    if (game.solveEvent(player)) {
                        game.startActionPhase();
                        updateGameDisplay();
                    } else {
                        showToast('资源不足，无法解决事件');
                    }
                });
                buttonsDiv.appendChild(btn);
            }
            
            const skipBtn = createActionButton('跳过事件', () => {
                game.skipEvent();
                game.startActionPhase();
                updateGameDisplay();
            });
            buttonsDiv.appendChild(skipBtn);
        } else {
            // 没有事件时显示提示
            buttonsDiv.innerHTML = '<p style="color: #86868B; text-align: center; padding: 20px;">正在加载事件...</p>';
        }
    } else if (game.phase === 'action') {
        // 显示剩余行动数
        const actionsInfo = document.createElement('div');
        actionsInfo.style.cssText = 'padding: 12px; background: #F5F5F7; border-radius: 8px; margin-bottom: 8px; text-align: center; font-weight: 600;';
        actionsInfo.textContent = `剩余行动: ${actionsLeft}/2`;
        buttonsDiv.appendChild(actionsInfo);
        
        if (actionsLeft > 0) {
            // 象限行动
            const quadrantBtn = createActionButton(
                `在当前象限行动`,
                () => executeCurrentQuadrantAction()
            );
            buttonsDiv.appendChild(quadrantBtn);
            
            // 启动项目
            if (game.projectDeck.length > 0) {
                const projectBtn = createActionButton(
                    '启动新项目',
                    () => showProjectSelectionModal()
                );
                buttonsDiv.appendChild(projectBtn);
            }
            
            // 推进现有项目
            if (game.activeProjects.length > 0) {
                const contributeBtn = createActionButton(
                    '推进进行中的项目',
                    () => showActiveProjectsModal()
                );
                buttonsDiv.appendChild(contributeBtn);
            }
            
            // 移除刻板印象
            const stereotype = game.activeStereotypes.find(s => s.quadrant === player.quadrant);
            if (stereotype) {
                const removeBtn = createActionButton(
                    '破除当前象限的刻板印象',
                    () => attemptRemoveStereotype()
                );
                buttonsDiv.appendChild(removeBtn);
            }
        }
        
        // 结束回合按钮
        const endTurnBtn = createActionButton('结束回合', () => {
            game.endTurn();
            updateGameDisplay();
            
            // 如果回到事件阶段，显示新事件
            if (game.phase === 'event') {
                showEventCard();
            }
        }, 'secondary');
        buttonsDiv.appendChild(endTurnBtn);
    }
}

/* ========== 创建行动按钮 ========== */
function createActionButton(text, onClick, type = 'primary') {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.textContent = text;
    btn.onclick = onClick;
    return btn;
}

/* ========== 执行当前象限行动 ========== */
function executeCurrentQuadrantAction() {
    const player = game.getCurrentPlayer();
    if (game.executeQuadrantAction(player.quadrant)) {
        updateGameDisplay();
        showToast('行动成功！');
    } else {
        showToast('行动失败：资源不足');
    }
}

/* ========== 尝试移除刻板印象 ========== */
function attemptRemoveStereotype() {
    const player = game.getCurrentPlayer();
    const cost = { influence: 2, support: 1 };
    
    // 检查角色技能（教育工作者消耗-1）
    if (player.role.id === 'educator') {
        cost.influence = 1;
    }
    
    if (!player.canAfford(cost)) {
        showToast('资源不足：需要2影响力和1支持');
        return;
    }
    
    player.spendResources(cost);
    
    if (game.removeStereotype(player.quadrant)) {
        game.actionsThisTurn++;
        updateGameDisplay();
        showToast('成功破除刻板印象！');
    }
}

/* ========== 显示象限行动模态框 ========== */
function showQuadrantActionModal(quadrant) {
    const player = game.getCurrentPlayer();
    const quadrantNames = {
        'workplace': '职场与企业',
        'family': '家庭与社区',
        'education': '教育与文化',
        'politics': '政治与法律'
    };
    
    const actions = {
        'workplace': '消耗1影响力，获得2资金',
        'family': '消耗1资金，恢复2影响力',
        'education': '消耗1影响力，抽取1张行动卡',
        'politics': '消耗1影响力，获得2支持'
    };
    
    let content = `<h2>${quadrantNames[quadrant]}</h2>`;
    
    if (player.quadrant === quadrant) {
        content += `
            <p>你已经在这个象限了</p>
            <p style="margin: 16px 0; padding: 12px; background: #F5F5F7; border-radius: 8px;">
                <strong>可执行行动：</strong><br>${actions[quadrant]}
            </p>
            <button class="primary-btn" onclick="executeCurrentQuadrantAction(); closeModal();">
                执行行动
            </button>
        `;
    } else {
        content += `
            <p>你想移动到这个象限吗？</p>
            <p style="margin: 16px 0; color: #86868B;">
                到达后可执行：${actions[quadrant]}
            </p>
            <button class="primary-btn" onclick="moveToQuadrant('${quadrant}');">
                移动到此象限
            </button>
        `;
    }
    
    content += `<button class="action-btn" onclick="closeModal()" style="margin-top: 8px;">取消</button>`;
    
    showModal(content);
}

/* ========== 移动到象限 ========== */
function moveToQuadrant(quadrant) {
    if (game.movePlayer(quadrant)) {
        updateGameDisplay();
        closeModal();
        showToast('移动成功！');
    } else {
        showToast('无法移动到该象限（不相邻）');
    }
}

/* ========== 显示项目选择模态框 ========== */
function showProjectSelectionModal() {
    let content = '<h2>选择要启动的项目</h2>';
    content += '<div style="max-height: 400px; overflow-y: auto;">';
    
    game.projectDeck.forEach((project, index) => {
        const costStr = Object.entries(project.initiationCost)
            .map(([key, value]) => {
                const icons = { influence: '💪', money: '💰', support: '🤝' };
                return `${icons[key]}${value}`;
            }).join(' ');
        
        content += `
            <div style="padding: 12px; margin: 8px 0; background: #F5F5F7; border-radius: 8px; cursor: pointer;"
                 onclick="startProject(${index});">
                <div style="font-weight: 600; margin-bottom: 4px;">${project.name}</div>
                <div style="font-size: 0.9rem; color: #86868B; margin-bottom: 8px;">
                    ${project.description}
                </div>
                <div style="font-size: 0.85rem;">
                    <span>启动成本: ${costStr}</span> | 
                    <span>需要进度: ${project.progressNeeded}</span>
                </div>
                <div style="font-size: 0.85rem; color: #30D158; margin-top: 4px;">
                    完成奖励: +${project.reward.progress}%进度
                </div>
            </div>
        `;
    });
    
    content += '</div>';
    content += '<button class="action-btn" onclick="closeModal()" style="margin-top: 16px;">取消</button>';
    
    showModal(content);
}

/* ========== 启动项目 ========== */
function startProject(index) {
    const player = game.getCurrentPlayer();
    const project = game.projectDeck[index];
    
    if (game.startProject(player, project.id)) {
        updateGameDisplay();
        closeModal();
        showToast(`成功启动项目：${project.name}`);
    } else {
        showToast('资源不足，无法启动项目');
    }
}

/* ========== 显示进行中的项目模态框 ========== */
function showActiveProjectsModal() {
    const player = game.getCurrentPlayer();
    
    let content = '<h2>进行中的项目</h2>';
    content += '<div style="max-height: 400px; overflow-y: auto;">';
    
    game.activeProjects.forEach((project, index) => {
        const progressPercent = Math.round((project.currentProgress / project.progressNeeded) * 100);
        const canContribute = player.quadrant === project.quadrant;
        
        content += `
            <div style="padding: 12px; margin: 8px 0; background: #F5F5F7; border-radius: 8px; 
                        ${!canContribute ? 'opacity: 0.5;' : 'cursor: pointer;'}"
                 ${canContribute ? `onclick="showContributeModal(${index});"` : ''}>
                <div style="font-weight: 600; margin-bottom: 4px;">
                    ${project.name}
                    ${!canContribute ? ' 🔒' : ''}
                </div>
                <div style="font-size: 0.85rem; margin: 8px 0;">
                    <div style="background: #D2D2D7; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${progressPercent}%; height: 100%; background: #30D158;"></div>
                    </div>
                    <div style="text-align: center; margin-top: 4px;">
                        ${project.currentProgress}/${project.progressNeeded}
                    </div>
                </div>
                ${!canContribute ? 
                    `<div style="font-size: 0.85rem; color: #FF3B30;">需要在${game.getQuadrantName(project.quadrant)}才能贡献</div>` : 
                    '<div style="font-size: 0.85rem; color: #30D158;">点击贡献资源</div>'
                }
            </div>
        `;
    });
    
    content += '</div>';
    content += '<button class="action-btn" onclick="closeModal()" style="margin-top: 16px;">关闭</button>';
    
    showModal(content);
}

/* ========== 显示贡献模态框 ========== */
function showContributeModal(projectIndex) {
    const project = game.activeProjects[projectIndex];
    const player = game.getCurrentPlayer();
    
    let content = `
        <h2>为项目做贡献</h2>
        <h3 style="color: #5E5CE6; margin: 16px 0;">${project.name}</h3>
        <p style="color: #86868B; margin-bottom: 16px;">选择要贡献的资源（每点资源=1点进度）</p>
        
        <div style="margin: 16px 0;">
            <label style="display: block; margin: 8px 0;">
                💪 影响力: 
                <input type="number" id="contribute-influence" min="0" max="${player.influence}" value="0" 
                       style="width: 60px; padding: 4px; margin-left: 8px;">
                <span style="color: #86868B;"> (拥有: ${player.influence})</span>
            </label>
            <label style="display: block; margin: 8px 0;">
                💰 资金: 
                <input type="number" id="contribute-money" min="0" max="${player.money}" value="0"
                       style="width: 60px; padding: 4px; margin-left: 8px;">
                <span style="color: #86868B;"> (拥有: ${player.money})</span>
            </label>
            <label style="display: block; margin: 8px 0;">
                🤝 支持: 
                <input type="number" id="contribute-support" min="0" max="${player.support}" value="0"
                       style="width: 60px; padding: 4px; margin-left: 8px;">
                <span style="color: #86868B;"> (拥有: ${player.support})</span>
            </label>
        </div>
        
        <button class="primary-btn" onclick="confirmContribution(${projectIndex})">确认贡献</button>
        <button class="action-btn" onclick="closeModal()" style="margin-top: 8px;">取消</button>
    `;
    
    showModal(content);
}

/* ========== 确认贡献 ========== */
function confirmContribution(projectIndex) {
    const influence = parseInt(document.getElementById('contribute-influence').value) || 0;
    const money = parseInt(document.getElementById('contribute-money').value) || 0;
    const support = parseInt(document.getElementById('contribute-support').value) || 0;
    
    if (influence + money + support === 0) {
        showToast('请至少贡献1点资源');
        return;
    }
    
    const contribution = {};
    if (influence > 0) contribution.influence = influence;
    if (money > 0) contribution.money = money;
    if (support > 0) contribution.support = support;
    
    if (game.contributeToProject(game.getCurrentPlayer(), projectIndex, contribution)) {
        updateGameDisplay();
        closeModal();
        showToast('贡献成功！');
    } else {
        showToast('贡献失败');
    }
}

/* ========== 更新手牌显示 ========== */
function updateHandDisplay() {
    const handDiv = document.getElementById('hand-cards');
    handDiv.innerHTML = '';
    
    const player = game.getCurrentPlayer();
    
    if (player.hand.length === 0) {
        handDiv.innerHTML = '<p style="color: #86868B; text-align: center; padding: 20px;">暂无手牌</p>';
        return;
    }
    
    player.hand.forEach((card, index) => {
        const cardDiv = createCardElement(card, index);
        handDiv.appendChild(cardDiv);
    });
}

/* ========== 创建卡牌元素 ========== */
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    
    const costStr = card.cost ? Object.entries(card.cost)
        .map(([key, value]) => {
            const icons = { influence: '💪', money: '💰', support: '🤝' };
            return `${icons[key]}${value}`;
        }).join(' ') : '无消耗';
    
    cardDiv.innerHTML = `
        <div class="card-header">
            <span class="card-type">${card.type === 'action' ? '行动' : '事件'}</span>
        </div>
        <div class="card-name">${card.name}</div>
        <div class="card-description">${card.description}</div>
        <div class="card-cost">消耗: ${costStr}</div>
    `;
    
    cardDiv.onclick = () => {
        if (game.phase === 'action' && game.actionsThisTurn < game.maxActionsPerTurn) {
            showCardDetailModal(card, index);
        }
    };
    
    return cardDiv;
}

/* ========== 显示卡牌详情模态框 ========== */
function showCardDetailModal(card, cardIndex) {
    const player = game.getCurrentPlayer();
    
    const costStr = card.cost ? Object.entries(card.cost)
        .map(([key, value]) => {
            const icons = { influence: '💪', money: '💰', support: '🤝' };
            const names = { influence: '影响力', money: '资金', support: '支持' };
            return `${icons[key]} ${names[key]}: ${value}`;
        }).join('<br>') : '无消耗';
    
    const canAfford = player.canAfford(card.cost);
    const quadrantOK = card.quadrant === 'any' || card.quadrant === player.quadrant;
    
    let content = `
        <h2>${card.name}</h2>
        <div style="background: #F5F5F7; padding: 12px; border-radius: 8px; margin: 16px 0;">
            ${card.description}
        </div>
        <div style="margin: 16px 0;">
            <strong>消耗：</strong><br>
            ${costStr}
        </div>
        ${card.flavorText ? `<p style="font-style: italic; color: #86868B; margin: 16px 0;">"${card.flavorText}"</p>` : ''}
    `;
    
    if (!canAfford) {
        content += '<p style="color: #FF3B30; margin-top: 16px;">❌ 资源不足</p>';
    } else if (!quadrantOK) {
        content += `<p style="color: #FF3B30; margin-top: 16px;">❌ 需要在${game.getQuadrantName(card.quadrant)}使用</p>`;
    } else {
        content += `
            <button class="primary-btn" onclick="playCard(${cardIndex});" style="margin-top: 16px;">
                打出此卡
            </button>
        `;
    }
    
    content += '<button class="action-btn" onclick="closeModal()" style="margin-top: 8px;">取消</button>';
    
    showModal(content);
}

/* ========== 打出卡牌 ========== */
function playCard(cardIndex) {
    if (game.playActionCard(game.getCurrentPlayer(), cardIndex)) {
        updateGameDisplay();
        closeModal();
        showToast('成功打出卡牌！');
    } else {
        showToast('无法打出此卡牌');
    }
}

/* ========== 显示事件卡 ========== */
function showEventCard() {
    const eventDisplay = document.getElementById('event-display');
    
    if (!game.currentEvent) {
        eventDisplay.innerHTML = '<p style="color: #86868B; text-align: center; padding: 20px;">等待事件...</p>';
        return;
    }
    
    const event = game.currentEvent;
    
    const categoryColors = {
        'positive': '#30D158',
        'negative': '#FF3B30'
    };
    
    const categoryNames = {
        'positive': '正面事件',
        'negative': '挑战事件'
    };
    
    eventDisplay.innerHTML = `
        <div class="card" style="min-width: 100%; border-color: ${categoryColors[event.category]};">
            <div class="card-header">
                <span class="card-type" style="background: ${categoryColors[event.category]};">
                    ${categoryNames[event.category]}
                </span>
            </div>
            <div class="card-name">${event.name}</div>
            <div class="card-description">${event.description}</div>
            <div style="margin: 8px 0; padding: 8px; background: #F5F5F7; border-radius: 4px; font-size: 0.9rem;">
                <strong>效果：</strong> ${event.effect}
            </div>
            ${event.solveCost ? `
                <div class="card-cost">
                    解决成本: ${Object.entries(event.solveCost)
                        .map(([k, v]) => {
                            const icons = { influence: '💪', money: '💰', support: '🤝' };
                            return `${icons[k]}${v}`;
                        }).join(' ')}
                </div>
            ` : ''}
            ${event.flavorText ? `<p style="font-style: italic; color: #86868B; margin-top: 8px; font-size: 0.85rem;">"${event.flavorText}"</p>` : ''}
        </div>
    `;
}

/* ========== 更新游戏日志 ========== */
function updateGameLog() {
    const logContent = document.getElementById('log-content');
    
    // 检查是否在底部
    const isAtBottom = logContent.scrollHeight - logContent.scrollTop <= logContent.clientHeight + 50;
    
    logContent.innerHTML = '';
    
    // 显示所有日志（不限制数量）
    const allLogs = game.gameLog.slice().reverse();
    
    allLogs.forEach(log => {
        const entry = document.createElement('div');
        entry.className = `log-entry ${log.type || 'normal'}`;
        entry.innerHTML = `
            <div style="font-size: 0.75rem; color: #86868B; margin-bottom: 4px; font-weight: 500;">${log.time}</div>
            <div style="line-height: 1.5;">${log.message}</div>
        `;
        logContent.appendChild(entry);
    });
    
    // 如果之前在底部，自动滚动到最新
    if (isAtBottom || allLogs.length === 1) {
        setTimeout(() => {
            logContent.scrollTop = 0;
        }, 50);
    }
}

/* ========== 显示结束界面 ========== */
function showEndScreen() {
    switchScreen('end-screen');
    
    const endTitle = document.getElementById('end-title');
    const endMessage = document.getElementById('end-message');
    const finalScores = document.getElementById('final-scores');
    
    if (game.socialProgress >= 100) {
        endTitle.textContent = '🎉 胜利！';
        endMessage.textContent = '恭喜！你们成功建立了一个平等的社会！';
    } else {
        endTitle.textContent = '😔 游戏结束';
        endMessage.textContent = '改革陷入停滞...但我们不会放弃！';
    }
    
    // 显示所有玩家得分
    finalScores.innerHTML = '';
    
    const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
    
    sortedPlayers.forEach((player, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        if (index === 0) {
            scoreItem.classList.add('winner');
        }
        
        scoreItem.innerHTML = `
            <div>
                <div style="font-size: 1.2rem; font-weight: 600;">
                    ${index === 0 ? '🏆 ' : ''}${player.name}
                </div>
                <div style="font-size: 0.9rem; opacity: 0.8;">
                    ${player.role.icon} ${player.role.name}
                </div>
            </div>
            <div style="font-size: 1.5rem; font-weight: 700;">
                ${player.score}分
            </div>
        `;
        
        finalScores.appendChild(scoreItem);
    });
    
    // 重新开始按钮
    document.getElementById('restart-btn').onclick = () => {
        location.reload();
    };
}

/* ========== 模态框相关 ========== */
function initializeModal() {
    const modal = document.getElementById('modal');
    const closeBtn = modal.querySelector('.modal-close');
    
    closeBtn.onclick = closeModal;
    
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}

function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

/* ========== Toast提示 ========== */
function showToast(message) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 1rem;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

/* ========== 屏幕切换 ========== */
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

/* ========== 游戏日志侧边栏 ========== */
function initializeLogSidebar() {
    const toggleBtn = document.getElementById('log-toggle-btn');
    const closeBtn = document.getElementById('log-close-btn');
    const sidebar = document.getElementById('game-log-sidebar');
    const overlay = document.getElementById('log-overlay');
    
    // 打开日志
    function openLogSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        // 滚动到最新日志
        const logContent = document.getElementById('log-content');
        setTimeout(() => {
            logContent.scrollTop = logContent.scrollHeight;
        }, 100);
    }
    
    // 关闭日志
    function closeLogSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    // 绑定事件
    if (toggleBtn) {
        toggleBtn.addEventListener('click', openLogSidebar);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLogSidebar);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeLogSidebar);
    }
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeLogSidebar();
        }
    });
}

