// ========== KARDS完整游戏系统 ==========

// 游戏状态
let gameState = {
    turn: 1,
    currentPlayer: 1, // 1 = 玩家, 2 = AI
    player1: {
        hq: 20,
        maxHq: 20,
        k: 3,
        maxK: 3,
        hand: [],
        supportLine: [], // 支援阵线（最多4个单位）
        frontline: [], // 前线单位（最多5个单位）
        deck: 40,
        hasMoved: [], // 本回合已移动的单位ID
        hasAttacked: [], // 本回合已攻击的单位ID
        hasUsedAction: [] // 本回合已行动的单位ID（步兵只能移动或攻击）
    },
    player2: {
        hq: 20,
        maxHq: 20,
        k: 3,
        maxK: 3,
        hand: [],
        supportLine: [],
        frontline: [],
        deck: 40,
        hasMoved: [],
        hasAttacked: [],
        hasUsedAction: []
    },
    frontlineControl: 0, // 0=无控制, 1=玩家控制, 2=AI控制
    selectedUnit: null, // 选中的单位（用于移动/攻击）
    actionMode: null // 'move' 或 'attack'
};

// ========== 卡牌模板（根据用户提供的图片） ==========
const cardTemplates = [
    // 法国卡牌
    { id: 1, name: '巴黎断头台卫队', cost: 3, moveCost: 1, attack: 3, health: 2, type: 'infantry', nation: 'FR', keywords: ['blitz'], description: '消灭敌方单位后,自身获得+1/+1的永久增益。', image: '新建文件夹/微信图片_20260104130538_1061_25.png', rarity: 'special' },
    { id: 2, name: '拉法耶特侯爵', cost: 5, moveCost: 1, attack: 3, health: 4, type: 'infantry', nation: 'FR', keywords: ['guard'], description: '每当你使用一张法国单位牌时，随机使一个敌方单位本回合攻击力-1', image: '新建文件夹/微信图片_20260104130539_1062_25.png', rarity: 'elite' },
    { id: 3, name: '断头台', cost: 2, type: 'order', nation: 'FR', keywords: [], description: '使一个敌方单位本回合攻击力变为0,若该单位已受伤,则将其摧毁。', image: '新建文件夹/微信图片_20260104130540_1063_25.png', rarity: 'special' },
    { id: 4, name: '法国革命·瓦米扬之战', cost: 4, type: 'order', nation: 'FR', keywords: [], description: '对敌方造成3点伤害,若本回合你已部署过法国单位,则额外造成2点伤害', image: '新建文件夹/微信图片_20260104130541_1064_25.png', rarity: 'special' },
    { id: 5, name: '雅各宾狂热步兵', cost: 3, moveCost: 1, attack: 3, health: 1, type: 'infantry', nation: 'FR', keywords: ['fight', 'impact'], description: '本回合该单位每造成一次伤害，自身恢复1点生命值。', image: '新建文件夹/微信图片_20260104130542_1065_25.png', rarity: 'special' },
    { id: 6, name: '革命龙骑兵中队', cost: 4, moveCost: 2, attack: 3, health: 2, type: 'infantry', nation: 'FR', keywords: ['blitz', 'impact'], description: '部署回合可移动并攻击;首次攻击不受反击伤害;移动越过友军单位后,本回合攻击力+1', image: '新建文件夹/微信图片_20260104130543_1066_25.png', rarity: 'limited' },
    { id: 7, name: '法国人', cost: 2, moveCost: 1, attack: 2, health: 1, type: 'infantry', nation: 'FR', keywords: [], description: '每当你使用一张法国单位牌时，随机使一个敌方单位本回合攻击力-1。', image: '新建文件夹/微信图片_20260104130544_1067_25.png', rarity: 'special' },
    { id: 8, name: '拿破仑·波拿巴', cost: 8, moveCost: 1, attack: 4, health: 5, type: 'infantry', nation: 'FR', keywords: ['guard', 'counter'], description: '每回合为所有友方单位提升1点防御, 自身离场则该效果失效。', image: '新建文件夹/微信图片_20260104130545_1068_25.png', rarity: 'elite' },
    { id: 9, name: '雾月政变', cost: 3, type: 'order', nation: 'FR', keywords: [], description: '选择场上1个友方法国单位，使其本回合获得+2/+2和闪击；抽取1张牌。', image: '新建文件夹/微信图片_20260104130546_1069_25.png', rarity: 'special' },
    { id: 10, name: '三级会议召开', cost: 1, type: 'order', nation: 'FR', keywords: [], description: '查看敌方手牌顶部2张牌并放回,你本回合下一张法国单位牌费用减少1点;', image: '新建文件夹/微信图片_20260104130547_1070_25.png', rarity: 'special' },
    { id: 11, name: '无套裤汉义军', cost: 2, moveCost: 1, attack: 2, health: 2, type: 'infantry', nation: 'FR', keywords: ['guard'], description: '已方总部耐久低于10时,该单位攻击+1、防御+1', image: '新建文件夹/微信图片_20260104130548_1071_25.png', rarity: 'limited' },
    { id: 12, name: '革命散兵斥候', cost: 2, moveCost: 2, attack: 1, health: 2, type: 'infantry', nation: 'FR', keywords: ['smoke'], description: '未行动前无法被单位攻击。攻击敌方后排单位后,抽1张费用≤2的步兵单位卡', image: '新建文件夹/微信图片_20260104130549_1072_25.png', rarity: 'limited' },
    { id: 13, name: '共和野战炮兵', cost: 5, moveCost: 1, attack: 5, health: 2, type: 'artillery', nation: 'FR', keywords: ['armor'], description: '远程、重甲1。可攻击敌方后排单位；受到的伤害减少1点。当攻击并摧毁敌方单位时，敌方所有前线单位本回合攻击力-1。', image: '新建文件夹/微信图片_20260104130550_1073_25.png', rarity: 'elite' },
    { id: 14, name: '启蒙沙龙', cost: 2, type: 'order', nation: 'FR', keywords: [], description: '补充1点永久指挥点,抽2张费用≤3的法国单位牌。', image: '新建文件夹/微信图片_20260104130551_1074_25.png', rarity: 'special' },
    { id: 15, name: '国革命军龙骑兵', cost: 4, moveCost: 2, attack: 4, health: 3, type: 'infantry', nation: 'FR', keywords: ['blitz', 'death'], description: '被摧毁时，从卡组召唤1张费用≤2的法国步兵单位至支援阵线。', image: '新建文件夹/微信图片_20260104130552_1075_25.png', rarity: 'limited' },
    { id: 16, name: '巴黎革命民众', cost: 2, moveCost: 1, attack: 1, health: 2, type: 'infantry', nation: 'FR', keywords: ['mobilize', 'impact'], description: '部署时,对敌方1个前线单位造成1点伤害; 动员:友方法国单位≥3则本回合+1攻。', image: '新建文件夹/微信图片_20260104130553_1076_25.png', rarity: 'common' },
    { id: 17, name: '莱茵阵线守备兵', cost: 4, moveCost: 1, attack: 2, health: 3, type: 'infantry', nation: 'FR', keywords: ['armor', 'counter'], description: '受伤害-1;被攻击时先造成伤害。消灭敌方单位后,使1个相邻友军步兵获得重甲1 (持续1回合)', image: '新建文件夹/微信图片_20260104130556_1077_25.png', rarity: 'limited' },
    { id: 18, name: '街头演说', cost: 1, type: 'order', nation: 'FR', keywords: [], description: '抽1张法国单位牌,本回合该单位部署费用-1', image: '新建文件夹/微信图片_20260104130557_1078_25.png', rarity: 'special' },
    { id: 19, name: '革命浪潮动员', cost: 2, type: 'order', nation: 'FR', keywords: [], description: '从卡组中召唤1张费用≤2的法国步兵单位至支援阵线，该单位本回合获得"闪击"。', image: '新建文件夹/微信图片_20260104130558_1079_25.png', rarity: 'special' },
    { id: 20, name: '巴士底狱攻坚队', cost: 3, moveCost: 1, attack: 3, health: 3, type: 'infantry', nation: 'FR', keywords: ['blitz'], description: '部署回合可攻击;攻击时对敌方防御最高单位额外造成1点伤害。', image: '新建文件夹/微信图片_20260104130559_1080_25.png', rarity: 'special' },
    { id: 21, name: '凡尔赛妇女游行队伍', cost: 2, moveCost: 1, attack: 1, health: 2, type: 'infantry', nation: 'FR', keywords: ['blitz'], description: '部署回合可移动;移动后对敌方总部造成1点伤害。', image: '新建文件夹/微信图片_20260104130600_1082_25.png', rarity: 'limited' },
    
    // 美国卡牌
    { id: 22, name: '罗德岛黑人士兵连', cost: 3, moveCost: 1, attack: 3, health: 2, type: 'infantry', nation: 'US', keywords: ['deploy'], description: '部署时可选择撤退场上的一张单位牌。', image: '新建文件夹/微信图片_20260104130601_1083_25.png', rarity: 'limited' },
    { id: 23, name: '大陆军野战炮兵连', cost: 5, moveCost: 2, attack: 5, health: 4, type: 'artillery', nation: 'US', keywords: ['smoke'], description: '被其攻击的敌方单位失去守护效果', image: '新建文件夹/微信图片_20260104132426_1085_25.png', rarity: 'elite' },
    { id: 24, name: '莱克星顿枪声', cost: 2, type: 'order', nation: 'US', keywords: [], description: '召唤2个费用1点、攻/防1/1的"殖民地民兵"至支援阵线，该单位本回合获得闪击', image: '新建文件夹/微信图片_20260104132427_1086_25.png', rarity: 'special' },
    { id: 25, name: '大陆军列兵', cost: 2, moveCost: 1, attack: 2, health: 1, type: 'infantry', nation: 'US', keywords: [], description: '已方场上有美国英雄单位时,攻击+1', image: '新建文件夹/微信图片_20260104132428_1087_25.png', rarity: 'common' },
    { id: 26, name: '大陆军掷弹兵', cost: 4, moveCost: 2, attack: 4, health: 3, type: 'infantry', nation: 'US', keywords: ['impact'], description: '攻击时无视敌方单位的守护效果', image: '新建文件夹/微信图片_20260104132429_1088_25.png', rarity: 'limited' },
    { id: 27, name: '波士顿倾茶事件', cost: 1, type: 'order', nation: 'US', keywords: [], description: '弃置敌方2张费用≤2的手牌,已方获得1点临时指挥点', image: '新建文件夹/微信图片_20260104132430_1089_25.png', rarity: 'special' },
    { id: 28, name: '约克镇大陆军', cost: 3, moveCost: 1, attack: 3, health: 2, type: 'infantry', nation: 'US', keywords: ['blitz', 'guard'], description: '闪击、守护,登场回合可攻击;相邻友方单位受到的远程伤害减少1,摧毁敌方单位后,为己方总部恢复2点耐久', image: '新建文件夹/微信图片_20260104211823_432_47.png', rarity: 'elite' },
    { id: 29, name: '大陆军重骑兵卫队', cost: 5, moveCost: 1, attack: 4, health: 4, type: 'infantry', nation: 'US', keywords: ['armor'], description: '重甲、受到的伤害始终-1;攻击时对目标相邻敌方单位造成1点伤害;友方骑兵单位攻击时,可额外+1攻击力', image: '新建文件夹/微信图片_20260104211823_433_47.png', rarity: 'elite' },
    { id: 30, name: '大陆军要塞炮兵', cost: 5, moveCost: 2, attack: 4, health: 2, type: 'artillery', nation: 'US', keywords: ['armor'], description: '远程（可攻击敌方后排单位）；重甲（受到的伤害始终-1）；部署在己方半场的其他单位，攻击力+1。', image: '新建文件夹/微信图片_20260104211823_434_47.png', rarity: 'elite' },
    { id: 31, name: '来克星顿民兵', cost: 2, moveCost: 1, attack: 2, health: 1, type: 'infantry', nation: 'US', keywords: ['blitz', 'deploy'], description: '部署时抽1张步兵卡;本回合可行动。', image: '新建文件夹/微信图片_20260104211823_435_47.png', rarity: 'common' },
    { id: 32, name: '殖民地来复枪兵', cost: 2, moveCost: 1, attack: 2, health: 3, type: 'infantry', nation: 'US', keywords: ['fight'], description: '已方场上有乔治·华盛顿时,攻击+2', image: '新建文件夹/微信图片_20260104211823_436_47.png', rarity: 'limited' },
    { id: 33, name: '独立宣言', cost: 5, type: 'order', nation: 'US', keywords: [], description: '所有友方美国单位本回合攻击+1、免疫压制, 抽1张牌', image: '新建文件夹/微信图片_20260104211823_437_47.png', rarity: 'elite' },
    { id: 34, name: '大陆军精锐步枪手', cost: 3, moveCost: 1, attack: 3, health: 2, type: 'infantry', nation: 'US', keywords: ['fight', 'blitz'], description: '本回合可攻击2次 (第二次攻击力-1); 部署回合可行动。消灭敌方单位后, 为己方随机1个步兵单位+1攻击力。', image: '新建文件夹/微信图片_20260104211823_438_47.png', rarity: 'special' },
];

// ========== 初始化游戏 ==========
function initGame() {
    // 检查cardTemplates是否已加载
    if (!cardTemplates || cardTemplates.length === 0) {
        console.error('initGame: cardTemplates is empty or undefined');
        showMessage('卡牌数据未加载，请刷新页面重试');
        return;
    }
    
    console.log('initGame: cardTemplates length =', cardTemplates.length);
    
    // 创建战线槽位
    createLineSlots('slots-top-support', 4);
    createLineSlots('slots-frontline', 5);
    createLineSlots('slots-bottom-support', 4);
    
    // 创建总部卡牌
    createHQCard(1); // 玩家总部
    createHQCard(2); // AI总部
    
    // 检查手牌容器是否存在
    const cardsContainer = document.getElementById('cards-container');
    if (!cardsContainer) {
        console.error('initGame: cards-container element not found');
        showMessage('手牌容器未找到，请刷新页面重试');
        return;
    }
    
    // 创建初始手牌
    console.log('initGame: Starting to create hand cards...');
    let cardsCreated = 0;
    for (let i = 0; i < 5; i++) {
        const card = getRandomCard();
        if (card) {
            console.log('initGame: Got card', i + 1, ':', card.name);
            const instanceId = Date.now() + i;
            const cardInstance = { 
                ...card, 
                instanceId: instanceId, 
                currentHealth: card.health || 0 
            };
            gameState.player1.hand.push(cardInstance);
            const cardElement = createCardElement(cardInstance, instanceId, 'hand');
            if (cardElement) {
                cardsCreated++;
                console.log('initGame: Successfully created card element for', card.name);
            } else {
                console.error('initGame: Failed to create card element for', card.name);
            }
        } else {
            console.error('initGame: getRandomCard returned null for card', i + 1);
        }
    }
    
    console.log('initGame: Created', cardsCreated, 'card elements out of', gameState.player1.hand.length, 'cards in hand');
    
    // 验证卡牌是否真的被添加到DOM
    const container = document.getElementById('cards-container');
    if (container) {
        const cardElements = container.querySelectorAll('.card');
        console.log('initGame: Found', cardElements.length, 'card elements in DOM');
        if (cardElements.length === 0) {
            console.error('initGame: WARNING - No card elements found in DOM after creation!');
        }
    }
    
    // AI初始手牌
    for (let i = 0; i < 5; i++) {
        const card = getRandomCard();
        if (card) {
            gameState.player2.hand.push({ ...card, instanceId: Date.now() + 1000 + i, currentHealth: card.health });
        }
    }
    
    updateUI();
    updateFrontlineControl();
}

// ========== 创建战线槽位 ==========
function createLineSlots(containerId, maxSlots) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < maxSlots; i++) {
        const slot = document.createElement('div');
        slot.className = 'line-slot';
        slot.dataset.slotIndex = i;
        container.appendChild(slot);
    }
}

// ========== 创建总部卡牌 ==========
function createHQCard(player) {
    const hqSlotId = player === 1 ? 'hq-card-bottom' : 'hq-card-top';
    const hqSlot = document.getElementById(hqSlotId);
    if (!hqSlot) return;
    
    const hqCard = document.createElement('div');
    hqCard.className = 'card hq-card';
    hqCard.dataset.player = player;
    hqCard.dataset.type = 'hq';
    hqCard.dataset.instanceId = `hq-${player}`;
    
    const currentHQ = player === 1 ? gameState.player1.hq : gameState.player2.hq;
    
    hqCard.innerHTML = `
        <div class="card-image-wrapper">
            <div class="hq-card-background">
                <div class="hq-label">${player === 1 ? '玩家' : '对手'}总部</div>
                <div class="hq-health-display">${currentHQ}</div>
            </div>
            <div class="card-health-overlay">${currentHQ}</div>
        </div>
    `;
    
    hqSlot.classList.add('occupied');
    hqSlot.appendChild(hqCard);
    
    // 总部卡牌可以被攻击，但不能移动和攻击
    // 攻击通过highlightAttackTargets函数处理
    console.log('createHQCard: Created HQ card for player', player);
}

// ========== 获取随机卡牌 ==========
function getRandomCard() {
    if (cardTemplates.length === 0) return null;
    return { ...cardTemplates[Math.floor(Math.random() * cardTemplates.length)] };
}

// ========== 创建卡牌元素 ========== 
function createCardElement(card, instanceId, location = 'hand') {
    if (!card) {
        console.error('createCardElement: card is null or undefined');
        return null;
    }
    
    // 验证卡牌数据
    if (!card.id || !card.name || !card.type) {
        console.error('createCardElement: Invalid card data:', card);
        return null;
    }
    
    try {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        if (location !== 'hand') {
            cardElement.classList.add('in-battlefield');
        }
        cardElement.dataset.instanceId = instanceId;
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.location = location;
        cardElement.dataset.type = card.type || '';
        cardElement.dataset.nation = card.nation || '';
        
        const currentHealth = card.currentHealth !== undefined ? card.currentHealth : (card.health || 0);
        const attackValue = card.attack !== undefined ? card.attack : 0;
        const cardType = card.type || '';
        const isOrderOrLocation = cardType === 'order' || cardType === 'location';
        
        // 直接使用卡牌图片，只在血量变化时显示血量数字
        cardElement.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${card.image || ''}" alt="${card.name || 'Card'}" />
                ${!isOrderOrLocation ? `
                    <div class="card-health-overlay">${currentHealth}</div>
                ` : ''}
            </div>
            ${location === 'hand' ? `
                <div class="card-tooltip">
                    <div class="card-tooltip-name">${card.name}</div>
                    <div class="card-tooltip-description">${card.description || '无特殊效果'}</div>
                    ${!isOrderOrLocation ? `
                        <div class="card-tooltip-stats">攻击: ${attackValue} | 生命: ${currentHealth}</div>
                    ` : ''}
                </div>
            ` : ''}
        `;
        
        // 在设置innerHTML之后，绑定事件（因为innerHTML会清除之前的事件监听器）
        if (location === 'hand') {
            // 指令牌和地点牌不可拖拽，只能点击使用
            if (isOrderOrLocation) {
                cardElement.draggable = false;
                cardElement.style.cursor = 'pointer';
                // 确保点击事件可以触发
                cardElement.style.pointerEvents = 'auto';
                // 添加视觉提示：指令牌边框高亮
                cardElement.classList.add('order-card');
                
                // 使用 mousedown 事件，更可靠
                cardElement.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('Order card mousedown:', card.name);
                });
                
                // 使用 click 事件
                cardElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('Order card clicked:', card.name, 'currentPlayer:', gameState?.currentPlayer);
                    if (gameState && gameState.currentPlayer === 1) {
                        playCardToSupport(cardElement);
                    } else {
                        showMessage('不是你的回合！');
                    }
                }, true); // 使用捕获阶段，确保事件能触发
                
                console.log('createCardElement: Bound click event for order/location card:', card.name);
            } else {
                // 单位卡可以拖拽
                cardElement.draggable = true;
                cardElement.style.cursor = 'grab';
                cardElement.style.pointerEvents = 'auto';
                cardElement.addEventListener('dragstart', handleDragStart);
                cardElement.addEventListener('dragend', handleDragEnd);
                console.log('createCardElement: Bound drag events for unit card:', card.name, 'type:', cardType);
            }
        }
        
        if (location === 'hand') {
            const container = document.getElementById('cards-container');
            if (container) {
                container.appendChild(cardElement);
                console.log('createCardElement: Added card', card.name, 'to hand');
            } else {
                console.error('createCardElement: cards-container element not found');
            }
        }
        
        return cardElement;
    } catch (error) {
        console.error('createCardElement: Error creating card element:', error, card);
        return null;
    }
}

// ========== 获取类型图标 ==========
function getTypeIcon(type) {
    const icons = {
        'infantry': '⚔️',
        'tank': '🚗',
        'artillery': '💣',
        'fighter': '✈️',
        'bomber': '💥',
        'order': '📜',
        'location': '📍'
    };
    return icons[type] || '⚔️';
}

// ========== 获取国家旗帜 ==========
function getNationFlag(nation) {
    const flags = {
        'GER': '🇩🇪',
        'USSR': '🇷🇺',
        'US': '🇺🇸',
        'UK': '🇬🇧',
        'JAP': '🇯🇵',
        'FR': '🇫🇷'
    };
    return flags[nation] || '';
}

// ========== 获取关键词显示 ==========
function getKeywordsDisplay(keywords) {
    if (!keywords || !Array.isArray(keywords)) return '';
    const display = {
        'blitz': '⚡',
        'deploy': '📋',
        'guard': '🛡️',
        'counter': '⚔️',
        'armor': '🛡️',
        'death': '💀',
        'smoke': '💨',
        'mobilize': '📈',
        'fight': '⚔️⚔️',
        'impact': '💥'
    };
    return keywords.map(k => display[k] || k[0].toUpperCase()).join(' ');
}

// ========== 获取关键词提示 ==========
function getKeywordsTooltip(keywords) {
    if (!keywords || !Array.isArray(keywords)) return '';
    const tooltips = {
        'blitz': '闪击：可立即移动或攻击',
        'deploy': '部署：放置时触发效果',
        'guard': '守护：保护相邻友军',
        'counter': '伏击：首次受攻击时先反击',
        'armor': '重甲：减少受到的伤害',
        'death': '亡计：被消灭时触发效果',
        'smoke': '烟幕：不能被选为目标',
        'mobilize': '动员：回合开始时+1/+1',
        'fight': '奋战：一回合可攻击两次',
        'impact': '冲击：攻击时造成额外效果'
    };
    return keywords.map(k => tooltips[k] || k).join('；');
}

// ========== 拖拽处理 ==========
function handleDragStart(e) {
    const card = e.target.closest('.card');
    if (!card) {
        console.warn('handleDragStart: No card element found');
        return;
    }
    
    const cardId = parseInt(card.dataset.cardId);
    if (isNaN(cardId)) {
        console.error('handleDragStart: Invalid cardId:', card.dataset.cardId);
        e.preventDefault();
        return;
    }
    
    const cardData = cardTemplates.find(c => c.id === cardId);
    if (!cardData) {
        console.error('handleDragStart: Card data not found for id:', cardId);
        e.preventDefault();
        return;
    }
    
    // 检查是否是指令牌或地点牌（不应该拖拽）
    if (cardData.type === 'order' || cardData.type === 'location') {
        console.warn('handleDragStart: Attempted to drag order/location card:', cardData.name);
        e.preventDefault();
        return;
    }
    
    if (cardData.cost > gameState.player1.k) {
        e.preventDefault();
        showMessage(`指挥点不足！需要 ${cardData.cost}K，当前只有 ${gameState.player1.k}K`);
        return;
    }
    
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('instanceId', card.dataset.instanceId);
    console.log('handleDragStart: Started dragging card:', cardData.name);
}

function handleDragEnd(e) {
    const card = e.target.closest('.card');
    if (card) {
        card.classList.remove('dragging');
    }
}

// ========== 设置拖拽区域 ==========
function setupDropZones() {
    // 玩家支援阵线
    const bottomSupport = document.getElementById('support-line-bottom');
    if (bottomSupport) {
        bottomSupport.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        bottomSupport.addEventListener('drop', (e) => {
            e.preventDefault();
            console.log('drop event triggered on support-line-bottom');
            if (gameState.currentPlayer !== 1) {
                console.log('drop: Not player turn, currentPlayer:', gameState.currentPlayer);
                return;
            }
            const cardElement = document.querySelector('.card.dragging');
            if (cardElement) {
                console.log('drop: Found dragging card:', cardElement.dataset.cardId);
                playCardToSupport(cardElement);
            } else {
                console.warn('drop: No dragging card found!');
            }
        });
    }
    
    // 前线不允许直接出牌，只能通过移动到达
    const frontline = document.getElementById('frontline');
    if (frontline) {
        frontline.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none'; // 禁止拖拽到前线
        });
        
        frontline.addEventListener('drop', (e) => {
            e.preventDefault();
            // 禁止直接出牌到前线，必须先从支援阵线移动
            showMessage('不能直接出牌到前线！请先出到支援阵线，然后移动到前线。');
        });
    }
}

// ========== 出牌到支援阵线 ==========
function playCardToSupport(cardElement) {
    console.log('playCardToSupport: Called with cardElement:', cardElement);
    
    const cardId = parseInt(cardElement.dataset.cardId);
    if (isNaN(cardId)) {
        console.error('playCardToSupport: Invalid cardId:', cardElement.dataset.cardId);
        showMessage('卡牌数据错误！');
        return;
    }
    
    const cardData = cardTemplates.find(c => c.id === cardId);
    if (!cardData) {
        console.error('playCardToSupport: Card data not found for id:', cardId);
        showMessage('卡牌数据未找到！');
        return;
    }
    
    console.log('playCardToSupport: Playing card:', cardData.name, 'type:', cardData.type, 'cost:', cardData.cost);
    
    if (cardData.cost > gameState.player1.k) {
        showMessage(`指挥点不足！需要 ${cardData.cost}K，当前只有 ${gameState.player1.k}K`);
        return;
    }
    
    // 指令卡和地点卡使用后立即生效并移除，不部署到战场
    if (cardData.type === 'order' || cardData.type === 'location') {
        console.log('playCardToSupport: Playing order/location card:', cardData.name);
        
        // 消耗指挥点
        gameState.player1.k -= cardData.cost;
        
        // 从手牌移除
        const instanceId = cardElement.dataset.instanceId;
        const handIndex = gameState.player1.hand.findIndex(c => String(c.instanceId) === String(instanceId));
        if (handIndex !== -1) {
            gameState.player1.hand.splice(handIndex, 1);
            console.log('playCardToSupport: Removed card from hand, index:', handIndex);
        } else {
            console.warn('playCardToSupport: Card not found in hand:', instanceId);
        }
        
        // 移除卡牌元素
        if (cardElement && cardElement.parentNode) {
            cardElement.remove();
            console.log('playCardToSupport: Removed card element from DOM');
        }
        
        // 触发效果（这里可以添加具体的指令卡效果逻辑）
        showMessage(`使用 ${cardData.name}：${cardData.description}`);
        
        // 抽牌
        drawCard(1);
        updateUI();
        return;
    }
    
    // 检查支援阵线是否已满
    if (gameState.player1.supportLine.length >= 4) {
        showMessage('支援阵线已满（最多4个单位）！');
        return;
    }
    
    // 消耗指挥点
    gameState.player1.k -= cardData.cost;
    
    // 从手牌移除
    const instanceId = cardElement.dataset.instanceId;
    const handIndex = gameState.player1.hand.findIndex(c => String(c.instanceId) === String(instanceId));
    if (handIndex === -1) {
        console.error('playCardToSupport: Card not found in hand:', instanceId);
        showMessage('卡牌未在手牌中找到！');
        return;
    }
    
    const cardInstance = {
        ...cardData,
        instanceId: instanceId,
        currentHealth: cardData.health || 0,
        location: 'support',
        canMove: true,
        canAttack: false,
        hasMovedThisTurn: false,
        hasAttackedThisTurn: false
    };
    
    gameState.player1.hand.splice(handIndex, 1);
    gameState.player1.supportLine.push(cardInstance);
    
    // 移动到支援阵线
    cardElement.classList.remove('dragging');
    cardElement.dataset.location = 'support';
    cardElement.draggable = false;
    
    // 添加点击事件
    cardElement.addEventListener('click', () => handleUnitClick(cardElement, cardInstance));
    
    // 查找空的slot
    const slot = document.querySelector('#slots-bottom-support .line-slot:not(.occupied)');
    if (!slot) {
        console.error('playCardToSupport: No available slot found!');
        console.log('playCardToSupport: All slots:', document.querySelectorAll('#slots-bottom-support .line-slot'));
        console.log('playCardToSupport: Occupied slots:', document.querySelectorAll('#slots-bottom-support .line-slot.occupied'));
        showMessage('支援阵线槽位已满！');
        // 回滚操作
        gameState.player1.hand.push(cardInstance);
        gameState.player1.supportLine.pop();
        gameState.player1.k += cardData.cost;
        return;
    }
    
    console.log('playCardToSupport: Found slot, placing card:', cardData.name);
    slot.classList.add('occupied');
    slot.appendChild(cardElement);
    
    // 触发部署效果
    triggerDeploy(cardInstance, 1);
    
    // 抽牌
    drawCard(1);
    
    updateUI();
    console.log('playCardToSupport: Successfully placed card:', cardData.name);
}

// ========== 出牌到前线（已禁用）==========
// 所有单位必须先出到支援阵线，然后通过移动才能到达前线
function playCardToFrontline(cardElement) {
    showMessage('不能直接出牌到前线！请先出到支援阵线，然后移动到前线（消耗1K）。');
}

// ========== 单位点击处理 ==========
function handleUnitClick(cardElement, unit) {
    if (gameState.currentPlayer !== 1) return;
    
    // 如果已经选中，取消选中
    if (gameState.selectedUnit === unit.instanceId) {
        gameState.selectedUnit = null;
        gameState.actionMode = null;
        cardElement.classList.remove('selected');
        clearActionHighlights();
        return;
    }
    
    // 清除之前的选择
    document.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
    
    // 选中当前单位
    gameState.selectedUnit = unit.instanceId;
    cardElement.classList.add('selected');
    
    // 根据单位类型和位置决定可执行的操作
    if (unit.location === 'support') {
        // 支援阵线的单位可以移动到前线
        const moveCost = unit.moveCost !== undefined ? unit.moveCost : 1;
        if (unit.canMove && !unit.hasMovedThisTurn && gameState.player1.k >= moveCost) {
            gameState.actionMode = 'move';
            showMessage(`点击前线空位移动单位（消耗${moveCost}K）`);
            highlightMoveTargets();
        } else {
            showMessage(`该单位无法移动（已移动或指挥点不足，需要${moveCost}K）`);
        }
    } else if (unit.location === 'frontline') {
        // 前线的单位可以攻击或撤回支援阵线
        if (unit.canAttack && !unit.hasAttackedThisTurn) {
            // 检查是否是步兵（只能移动或攻击）
            if (unit.type === 'infantry' && unit.hasMovedThisTurn) {
                showMessage('步兵本回合已移动，无法攻击！');
                return;
            }
            
            gameState.actionMode = 'attack';
            showMessage('选择攻击目标（或点击支援阵线撤回单位）');
            highlightAttackTargets(unit);
            // 同时高亮支援阵线，允许撤回
            highlightRetreatTargets();
        } else {
            // 尝试移动或撤回
            if ((unit.type === 'tank' || !unit.hasAttackedThisTurn) && !unit.hasMovedThisTurn && gameState.player1.k >= 1) {
                gameState.actionMode = 'move';
                showMessage('点击前线空位移动单位，或点击支援阵线撤回单位（消耗1K）');
                highlightMoveTargets();
                highlightRetreatTargets();
            } else {
                // 即使不能攻击，也可以撤回
                const moveCost = unit.moveCost !== undefined ? unit.moveCost : 1;
                if (!unit.hasMovedThisTurn && gameState.player1.k >= moveCost) {
                    gameState.actionMode = 'retreat';
                    showMessage('点击支援阵线撤回单位（消耗1K）');
                    highlightRetreatTargets();
                } else {
                    showMessage('该单位无法行动');
                }
            }
        }
    }
}

// ========== 高亮移动目标 ==========
function highlightMoveTargets() {
    const frontlineSlots = document.querySelectorAll('#slots-frontline .line-slot:not(.occupied)');
    frontlineSlots.forEach(slot => {
        slot.classList.add('move-target');
        slot.addEventListener('click', handleMoveToSlot, { once: true });
    });
}

// ========== 高亮撤回目标（支援阵线） ==========
function highlightRetreatTargets() {
    const supportSlots = document.querySelectorAll('#slots-bottom-support .line-slot:not(.occupied)');
    supportSlots.forEach(slot => {
        slot.classList.add('retreat-target');
        slot.addEventListener('click', handleRetreatToSupport, { once: true });
    });
}

// ========== 高亮攻击目标 ==========
function highlightAttackTargets(unit) {
    // 清除之前的高亮
    document.querySelectorAll('.attack-target').forEach(el => el.classList.remove('attack-target'));
    
    // 炮兵可以从支援阵线攻击任意目标（不受前线控制限制）
    if (unit.type === 'artillery') {
        // 可以攻击敌方前线单位
        gameState.player2.frontline.forEach(enemy => {
            const element = document.querySelector(`[data-instance-id="${enemy.instanceId}"]`);
            if (element && !isGuarded(enemy, 2)) {
                element.classList.add('attack-target');
                element.addEventListener('click', () => performAttack(unit, enemy), { once: true });
            }
        });
        
        // 可以攻击敌方支援阵线单位
        gameState.player2.supportLine.forEach(enemy => {
            const element = document.querySelector(`[data-instance-id="${enemy.instanceId}"]`);
            if (element && !isGuarded(enemy, 2)) {
                element.classList.add('attack-target');
                element.addEventListener('click', () => performAttack(unit, enemy), { once: true });
            }
        });
        
        // 可以攻击敌方总部
        const hqElement = document.querySelector('.player-top');
        if (hqElement) {
            hqElement.classList.add('attack-target');
            hqElement.addEventListener('click', () => performAttack(unit, null), { once: true });
        }
    } else if (unit.type === 'fighter' || unit.type === 'bomber') {
        // 空军可以攻击任意目标（不受前线控制限制）
        highlightAllTargets(unit);
    } else {
        // 地面单位（步兵、坦克）
        // 核心规则：地面单位始终可以攻击前线上的敌方单位（无论谁控制前线）
        // 这样才能通过攻击前线单位来夺回前线控制权！
        gameState.player2.frontline.forEach(enemy => {
            const element = document.querySelector(`[data-instance-id="${enemy.instanceId}"]`);
            if (element && !isGuarded(enemy, 2)) {
                element.classList.add('attack-target');
                element.addEventListener('click', () => performAttack(unit, enemy), { once: true });
            }
        });
        
        // 只有控制了前线，地面单位才能攻击敌方支援阵线和总部
        if (gameState.frontlineControl === 1) {
            // 可以攻击敌方支援阵线
            gameState.player2.supportLine.forEach(enemy => {
                const element = document.querySelector(`[data-instance-id="${enemy.instanceId}"]`);
                if (element && !isGuarded(enemy, 2)) {
                    element.classList.add('attack-target');
                    element.addEventListener('click', () => performAttack(unit, enemy), { once: true });
                }
            });
            
            // 可以攻击敌方总部
            const hqElement = document.querySelector('#hq-card-top .hq-card');
            if (hqElement) {
                hqElement.classList.add('attack-target');
                hqElement.addEventListener('click', () => {
                    performAttack(unit, null);
                }, { once: true });
            }
        } else if (gameState.frontlineControl === 0) {
            // 无人控制前线时，提示玩家
            showMessage('无人控制前线，无法攻击敌方支援阵线和总部！先攻击前线单位夺回控制权！');
        } else {
            // AI控制前线时，提示玩家
            showMessage('AI控制前线，无法攻击敌方支援阵线和总部！先攻击前线单位夺回控制权！');
        }
    }
}

// ========== 高亮所有目标 ==========
function highlightAllTargets(unit) {
    // 攻击敌方前线
    gameState.player2.frontline.forEach(enemy => {
        const element = document.querySelector(`[data-instance-id="${enemy.instanceId}"]`);
        if (element && !isGuarded(enemy, 2)) {
            element.classList.add('attack-target');
            element.addEventListener('click', () => performAttack(unit, enemy), { once: true });
        }
    });
    
    // 攻击敌方支援阵线
    gameState.player2.supportLine.forEach(enemy => {
        const element = document.querySelector(`[data-instance-id="${enemy.instanceId}"]`);
        if (element && !isGuarded(enemy, 2)) {
            element.classList.add('attack-target');
            element.addEventListener('click', () => performAttack(unit, enemy), { once: true });
        }
    });
    
    // 攻击总部
    const hqElement = document.querySelector('#hq-card-top .hq-card');
    if (hqElement) {
        hqElement.classList.add('attack-target');
        hqElement.addEventListener('click', () => {
            performAttack(unit, null);
        }, { once: true });
    }
}

// ========== 检查是否被守护 ==========
function isGuarded(unit, enemyPlayer) {
    // 检查相邻是否有守护单位
    // 守护单位必须在同一战线，且位置相邻（索引相差1以内）
    const battlefield = enemyPlayer === 1 ? gameState.player1 : gameState.player2;
    
    // 获取目标单位的位置
    let targetLine, targetIndex;
    if (unit.location === 'support') {
        const player = enemyPlayer === 1 ? gameState.player1 : gameState.player2;
        targetLine = player.supportLine;
        targetIndex = targetLine.indexOf(unit);
    } else {
        const player = enemyPlayer === 1 ? gameState.player1 : gameState.player2;
        targetLine = player.frontline;
        targetIndex = targetLine.indexOf(unit);
    }
    
    if (targetIndex === -1) return false;
    
    // 检查同一战线上的相邻单位是否有守护
    return targetLine.some((u, index) => 
        u.keywords && u.keywords.includes('guard') && 
        u.instanceId !== unit.instanceId &&
        Math.abs(index - targetIndex) <= 1 // 相邻位置
    );
}

// ========== 获取单位位置 ==========
function getUnitPosition(unit) {
    if (unit.location === 'support') {
        const player = gameState.player1.supportLine.includes(unit) ? 1 : 2;
        const line = player === 1 ? gameState.player1.supportLine : gameState.player2.supportLine;
        return line.indexOf(unit);
    } else {
        const player = gameState.player1.frontline.includes(unit) ? 1 : 2;
        const line = player === 1 ? gameState.player1.frontline : gameState.player2.frontline;
        return line.indexOf(unit);
    }
}

// ========== 处理移动到槽位 ==========
function handleMoveToSlot(e) {
    if ((gameState.actionMode !== 'move' && gameState.actionMode !== 'attack') || !gameState.selectedUnit) return;
    
    const slot = e.target.closest('.line-slot');
    if (!slot || slot.classList.contains('occupied')) return;
    
    // 检查是否是前线槽位
    const isFrontlineSlot = slot.closest('#slots-frontline');
    if (!isFrontlineSlot) return;
    
    const unit = findUnitById(gameState.selectedUnit, 1);
    if (!unit) return;
    
    moveToFrontline(unit, slot);
}

// ========== 处理撤回支援阵线 ==========
function handleRetreatToSupport(e) {
    if ((gameState.actionMode !== 'move' && gameState.actionMode !== 'attack' && gameState.actionMode !== 'retreat') || !gameState.selectedUnit) return;
    
    const slot = e.target.closest('.line-slot');
    if (!slot || slot.classList.contains('occupied')) return;
    
    // 检查是否是支援阵线槽位
    const isSupportSlot = slot.closest('#slots-bottom-support');
    if (!isSupportSlot) return;
    
    const unit = findUnitById(gameState.selectedUnit, 1);
    if (!unit) return;
    
    moveToSupport(unit, slot);
}

// ========== 移动到前线 ==========
function moveToFrontline(unit, targetSlot) {
    const moveCost = unit.moveCost !== undefined ? unit.moveCost : 1;
    if (gameState.player1.k < moveCost) {
        showMessage(`指挥点不足！移动需要${moveCost}K`);
        return;
    }
    
    // 检查前线总单位数量（前线最多5个单位，包括双方）
    // 实时检查DOM中的实际单位数量，确保状态同步
    const frontlineSlots = document.querySelectorAll('#slots-frontline .line-slot.occupied');
    const actualFrontlineUnits = frontlineSlots.length;
    
    if (actualFrontlineUnits >= 5) {
        showMessage('前线已满（最多5个单位）！');
        return;
    }
    
    // 消耗指挥点
    gameState.player1.k -= moveCost;
    
    // 从支援阵线移除
    const supportIndex = gameState.player1.supportLine.findIndex(u => u.instanceId === unit.instanceId);
    if (supportIndex === -1) return;
    
    gameState.player1.supportLine.splice(supportIndex, 1);
    
    // 添加到前线
    unit.location = 'frontline';
    unit.canMove = false;
    unit.canAttack = true;
    unit.hasMovedThisTurn = true;
    gameState.player1.frontline.push(unit);
    
    // 更新UI
    const cardElement = document.querySelector(`[data-instance-id="${unit.instanceId}"]`);
    if (cardElement) {
        // 从原位置移除
        const oldSlot = cardElement.closest('.line-slot');
        if (oldSlot) {
            oldSlot.classList.remove('occupied');
            oldSlot.innerHTML = '';
        }
        
        targetSlot.classList.add('occupied');
        targetSlot.appendChild(cardElement);
    }
    
    // 清除选择
    gameState.selectedUnit = null;
    gameState.actionMode = null;
    clearActionHighlights();
    
    updateFrontlineControl();
    updateUI();
    showMessage(`${unit.name} 移动到前线`);
}

// ========== 撤回支援阵线 ==========
function moveToSupport(unit, targetSlot) {
    const moveCost = unit.moveCost !== undefined ? unit.moveCost : 1;
    if (gameState.player1.k < moveCost) {
        showMessage(`指挥点不足！撤回需要${moveCost}K`);
        return;
    }
    
    if (gameState.player1.supportLine.length >= 4) {
        showMessage('支援阵线已满（最多4个单位）！');
        return;
    }
    
    // 消耗指挥点
    gameState.player1.k -= moveCost;
    
    // 从前线移除
    const frontlineIndex = gameState.player1.frontline.findIndex(u => u.instanceId === unit.instanceId);
    if (frontlineIndex === -1) return;
    
    gameState.player1.frontline.splice(frontlineIndex, 1);
    
    // 添加到支援阵线
    unit.location = 'support';
    unit.canMove = true;
    unit.canAttack = false;
    unit.hasMovedThisTurn = true;
    unit.hasAttackedThisTurn = false; // 撤回后重置攻击状态
    gameState.player1.supportLine.push(unit);
    
    // 更新UI
    const cardElement = document.querySelector(`[data-instance-id="${unit.instanceId}"]`);
    if (cardElement) {
        // 从原位置移除
        const oldSlot = cardElement.closest('.line-slot');
        if (oldSlot) {
            oldSlot.classList.remove('occupied');
            oldSlot.innerHTML = '';
        }
        
        targetSlot.classList.add('occupied');
        targetSlot.appendChild(cardElement);
    }
    
    // 清除选择
    gameState.selectedUnit = null;
    gameState.actionMode = null;
    clearActionHighlights();
    
    updateFrontlineControl();
    updateUI();
    showMessage(`${unit.name} 撤回支援阵线`);
}

// ========== 执行攻击 ==========
function performAttack(attacker, target) {
    if (!attacker) return;
    
    const attackerElement = document.querySelector(`[data-instance-id="${attacker.instanceId}"]`);
    if (!attackerElement) return;
    
    // 消耗指挥点
    if (gameState.currentPlayer === 1 && gameState.player1.k < 1) {
        showMessage('指挥点不足！攻击需要1K');
        return;
    }
    
    if (gameState.currentPlayer === 1) {
        gameState.player1.k -= 1;
    }
    
    if (target) {
        // 攻击单位
        attackUnit(attacker, target);
    } else {
        // 攻击总部
        attackHQ(attacker, 2);
    }
    
    // 标记为已攻击
    attacker.hasAttackedThisTurn = true;
    attacker.canAttack = false;
    
    // 如果是步兵，标记为已行动
    if (attacker.type === 'infantry') {
        attacker.hasMovedThisTurn = true; // 防止再次移动
    }
    
    // 清除选择
    gameState.selectedUnit = null;
    gameState.actionMode = null;
    clearActionHighlights();
    
    updateUI();
}

// ========== 攻击单位 ==========
function attackUnit(attacker, target) {
    const attackerElement = document.querySelector(`[data-instance-id="${attacker.instanceId}"]`);
    const targetElement = document.querySelector(`[data-instance-id="${target.instanceId}"]`);
    
    if (!attackerElement || !targetElement) return;
    
    // 确保currentHealth已初始化
    if (attacker.currentHealth === undefined || attacker.currentHealth === null) {
        attacker.currentHealth = attacker.health || 0;
    }
    if (target.currentHealth === undefined || target.currentHealth === null) {
        target.currentHealth = target.health || 0;
    }
    
    // 检查守护规则：如果一个单位相邻有具有"守护"的友军，则只有轰炸机和炮兵可以攻击它
    if (isGuarded(target, 2) && attacker.type !== 'artillery' && attacker.type !== 'bomber') {
        showMessage('该单位被守护，只有炮兵和轰炸机可以攻击！');
        return;
    }
    
    // 检查攻击范围限制（地面单位攻击支援阵线需要控制前线）
    if (target.location === 'support' && attacker.type !== 'artillery' && attacker.type !== 'fighter' && attacker.type !== 'bomber') {
        if (gameState.frontlineControl !== 1) {
            showMessage('需要控制前线才能攻击敌方支援阵线！');
            return;
        }
    }
    
    // 播放攻击动画
    audioManager.play('attack');
    
    // 计算伤害
    let damage = attacker.attack;
    
    // 检查重甲
    if (target.keywords && target.keywords.includes('armor')) {
        damage = Math.max(1, damage - 1);
    }
    
    // 检查伏击（在攻击前先反击）
    if (target.keywords && target.keywords.includes('counter') && !target.hasCountered) {
        let counterDamage = target.attack || 0;
        if (attacker.keywords && attacker.keywords.includes('armor')) {
            counterDamage = Math.max(1, counterDamage - 1);
        }
        attacker.currentHealth = Math.max(0, attacker.currentHealth - counterDamage);
        target.hasCountered = true;
        showMessage(`${target.name} 伏击反击造成 ${counterDamage} 点伤害！`);
        
        // 更新显示
        updateCardElement(attackerElement, attacker);
        
        // 检查攻击者是否死亡
        if (attacker.currentHealth <= 0) {
            triggerDeath(attacker, 1);
            removeUnit(attacker, 1);
            updateFrontlineControl();
            updateUI();
            return;
        }
    }
    
    // 造成伤害
    target.currentHealth = Math.max(0, target.currentHealth - damage);
    showMessage(`${attacker.name} 对 ${target.name} 造成 ${damage} 点伤害！`);
    
    // 更新卡牌显示（在反击前先更新目标）
    updateCardElement(targetElement, target);
    
    // 检查目标是否死亡（在反击前检查）
    if (target.currentHealth <= 0) {
        triggerDeath(target, 2);
        removeUnit(target, 2);
        updateFrontlineControl();
        updateUI();
        
        // 如果目标已死，检查攻击者是否也死亡（可能因为之前的伏击）
        if (attacker.currentHealth <= 0) {
            triggerDeath(attacker, 1);
            removeUnit(attacker, 1);
            updateFrontlineControl();
            updateUI();
        } else {
            updateCardElement(attackerElement, attacker);
        }
        return;
    }
    
    // 反击（地面单位攻击地面单位，且不是炮兵/空军，且目标未处于压制状态）
    const isGroundVsGround = attacker.type !== 'artillery' && attacker.type !== 'fighter' && attacker.type !== 'bomber' &&
                             target.type !== 'artillery' && target.type !== 'fighter' && target.type !== 'bomber';
    
    if (isGroundVsGround && (!target.keywords || !target.keywords.includes('suppressed')) && target.currentHealth > 0) {
        let counterDamage = target.attack || 0;
        if (attacker.keywords && attacker.keywords.includes('armor')) {
            counterDamage = Math.max(1, counterDamage - 1);
        }
        
        attacker.currentHealth = Math.max(0, attacker.currentHealth - counterDamage);
        showMessage(`${target.name} 反击造成 ${counterDamage} 点伤害！`);
    }
    
    // 更新卡牌显示
    updateCardElement(attackerElement, attacker);
    updateCardElement(targetElement, target);
    
    // 检查攻击者是否死亡
    if (attacker.currentHealth <= 0) {
        triggerDeath(attacker, 1);
        removeUnit(attacker, 1);
    }
    
    updateFrontlineControl();
    updateUI();
}

// ========== 检查是否可以攻击总部 ==========
function checkCanAttackHQ(unit, targetPlayer) {
    // 空军可以攻击任意目标
    if (unit.type === 'fighter' || unit.type === 'bomber') {
        return true;
    }
    
    // 地面单位需要控制前线才能攻击总部
    if (gameState.frontlineControl === (targetPlayer === 1 ? 2 : 1)) {
        return true;
    }
    
    return false;
}

// ========== 攻击总部 ==========
function attackHQ(attacker, targetPlayer) {
    const target = targetPlayer === 1 ? gameState.player1 : gameState.player2;
    const attackerElement = document.querySelector(`[data-instance-id="${attacker.instanceId}"]`);
    
    if (!attackerElement) return;
    
    // 检查是否可以攻击总部
    if (!checkCanAttackHQ(attacker, targetPlayer)) {
        showMessage('需要控制前线才能攻击敌方总部！');
        return;
    }
    
    // 播放攻击动画
    if (typeof audioManager !== 'undefined' && audioManager.play) {
        audioManager.play('attack');
    }
    
    // 造成伤害
    target.hq -= attacker.attack;
    if (target.hq < 0) target.hq = 0;
    
    showMessage(`${attacker.name} 对敌方总部造成 ${attacker.attack} 点伤害！`);
    
    // 更新总部卡牌显示
    updateHQCard(targetPlayer);
    
    // 检查胜利
    if (target.hq <= 0) {
        endGame(targetPlayer === 2);
        return;
    }
    
    updateUI();
}

// ========== 更新总部卡牌显示 ==========
function updateHQCard(player) {
    const hqCardId = player === 1 ? 'hq-card-bottom' : 'hq-card-top';
    const hqCard = document.querySelector(`#${hqCardId} .hq-card`);
    if (!hqCard) return;
    
    const currentHQ = player === 1 ? gameState.player1.hq : gameState.player2.hq;
    const healthOverlay = hqCard.querySelector('.card-health-overlay');
    const hqHealthDisplay = hqCard.querySelector('.hq-health-display');
    
    if (healthOverlay) {
        healthOverlay.textContent = currentHQ;
    }
    if (hqHealthDisplay) {
        hqHealthDisplay.textContent = currentHQ;
    }
    
    // 如果血量低于初始值，改变颜色提示
    const maxHQ = player === 1 ? gameState.player1.maxHq : gameState.player2.maxHq;
    if (currentHQ < maxHQ) {
        hqCard.classList.add('damaged');
    } else {
        hqCard.classList.remove('damaged');
    }
}

// ========== 触发死亡效果 ==========
function triggerDeath(unit, player) {
    if (unit.keywords && unit.keywords.includes('death')) {
        const enemyPlayer = player === 1 ? 2 : 1;
        const enemy = enemyPlayer === 1 ? gameState.player1 : gameState.player2;
        enemy.hq -= 2;
        showMessage(`${unit.name} 亡计效果：对敌方总部造成2点伤害！`);
        
        if (enemy.hq <= 0) {
            endGame(enemyPlayer === 2);
        }
    }
}

// ========== 移除单位 ==========
function removeUnit(unit, player) {
    if (!unit) return;
    
    const playerState = player === 1 ? gameState.player1 : gameState.player2;
    
    // 从对应战线移除
    if (unit.location === 'support') {
        const index = playerState.supportLine.findIndex(u => u.instanceId === unit.instanceId);
        if (index !== -1) {
            playerState.supportLine.splice(index, 1);
        }
    } else if (unit.location === 'frontline') {
        const index = playerState.frontline.findIndex(u => u.instanceId === unit.instanceId);
        if (index !== -1) {
            playerState.frontline.splice(index, 1);
        }
    }
    
    // 移除DOM元素
    const element = document.querySelector(`[data-instance-id="${unit.instanceId}"]`);
    if (element) {
        const slot = element.closest('.line-slot');
        if (slot) {
            slot.classList.remove('occupied');
            slot.innerHTML = '';
        }
        element.remove();
    }
    
    // 清除可能残留的"前线已满"消息
    document.querySelectorAll('.game-message').forEach(el => {
        if (el.textContent.includes('前线已满')) {
            el.remove();
        }
    });
    
    // 更新前线控制
    updateFrontlineControl();
}

// ========== 触发部署效果 ==========
function triggerDeploy(unit, player) {
    if (unit.keywords && unit.keywords.includes('deploy')) {
        // 部署效果的具体实现将根据卡牌数据来定义
        showMessage(`${unit.name} 触发部署效果！`);
        
        // 更新卡牌显示
        const element = document.querySelector(`[data-instance-id="${unit.instanceId}"]`);
        if (element) {
            updateCardElement(element, unit);
        }
    }
}

// ========== 清除行动高亮 ==========
function clearActionHighlights() {
    document.querySelectorAll('.move-target').forEach(el => {
        el.classList.remove('move-target');
    });
    document.querySelectorAll('.retreat-target').forEach(el => {
        el.classList.remove('retreat-target');
    });
    document.querySelectorAll('.attack-target').forEach(el => {
        el.classList.remove('attack-target');
    });
    document.querySelectorAll('.card.selected').forEach(el => {
        el.classList.remove('selected');
    });
}

// ========== 查找单位 ==========
function findUnitById(instanceId, player) {
    const playerState = player === 1 ? gameState.player1 : gameState.player2;
    const allUnits = [...playerState.supportLine, ...playerState.frontline];
    return allUnits.find(u => String(u.instanceId) === String(instanceId));
}

// ========== 更新卡牌元素 ==========
function updateCardElement(element, card) {
    if (!element || !card) return;
    
    // 确保currentHealth已初始化
    if (card.currentHealth === undefined || card.currentHealth === null) {
        card.currentHealth = card.health || 0;
    }
    
    // 只更新血量数字覆盖层，不改变图片
    const healthEl = element.querySelector('.card-health-overlay');
    if (healthEl && card.type !== 'order' && card.type !== 'location') {
        const displayHealth = card.currentHealth !== undefined ? Math.max(0, card.currentHealth) : (card.health || 0);
        healthEl.textContent = displayHealth;
        
        // 如果血量低于初始值，改变颜色提示
        if (card.currentHealth < card.health) {
            healthEl.style.background = 'rgba(244, 67, 54, 0.8)';
        } else {
            healthEl.style.background = 'rgba(0, 0, 0, 0.7)';
        }
    }
    
    // 如果死亡，添加视觉提示
    if (card.currentHealth !== undefined && card.currentHealth <= 0) {
        element.style.opacity = '0.5';
        element.style.filter = 'grayscale(100%)';
    } else {
        element.style.opacity = '1';
        element.style.filter = 'none';
    }
}

// ========== 抽牌 ==========
function drawCard(player = 1) {
    if (player === 1) {
        if (gameState.player1.deck > 0 && gameState.player1.hand.length < 9) {
            const card = getRandomCard();
            if (card) {
                const instanceId = Date.now() + Math.random();
                gameState.player1.hand.push({ ...card, instanceId, currentHealth: card.health });
                createCardElement(card, instanceId, 'hand');
                gameState.player1.deck--;
            }
        }
    } else {
        if (gameState.player2.deck > 0 && gameState.player2.hand.length < 9) {
            const card = getRandomCard();
            if (card) {
                const instanceId = Date.now() + Math.random() + 10000;
                gameState.player2.hand.push({ ...card, instanceId, currentHealth: card.health });
                gameState.player2.deck--;
            }
        }
    }
    updateUI();
}

// ========== 更新前线控制 ==========
function updateFrontlineControl() {
    const player1Units = gameState.player1.frontline.length;
    const player2Units = gameState.player2.frontline.length;
    
    if (player1Units > player2Units) {
        gameState.frontlineControl = 1; // 玩家控制
    } else if (player2Units > player1Units) {
        gameState.frontlineControl = 2; // AI控制
    } else {
        gameState.frontlineControl = 0; // 无控制
    }
    
    const controlStatus = document.getElementById('control-status');
    if (controlStatus) {
        const statusText = {
            0: '无',
            1: '你',
            2: 'AI'
        };
        controlStatus.textContent = statusText[gameState.frontlineControl];
        controlStatus.className = gameState.frontlineControl === 1 ? 'player-control' : 
                                  gameState.frontlineControl === 2 ? 'ai-control' : '';
    }
}

// ========== 结束回合 ==========
function endTurn() {
    if (gameState.currentPlayer !== 1) return;
    
    // 重置单位行动状态
    gameState.player1.hasMoved = [];
    gameState.player1.hasAttacked = [];
    gameState.player1.hasUsedAction = [];
    
    // 重置单位状态
    gameState.player1.supportLine.forEach(unit => {
        unit.hasMovedThisTurn = false;
        unit.hasAttackedThisTurn = false;
        unit.canMove = true;
        unit.canAttack = false;
    });
    
    gameState.player1.frontline.forEach(unit => {
        unit.hasMovedThisTurn = false;
        unit.hasAttackedThisTurn = false;
        unit.canMove = false;
        unit.canAttack = true;
    });
    
    // 切换到AI回合
    gameState.currentPlayer = 2;
    gameState.turn++;
    
    // 增加指挥点上限
    gameState.player1.maxK = Math.min(gameState.player1.maxK + 1, 12);
    gameState.player2.maxK = Math.min(gameState.player2.maxK + 1, 12);
    
    // AI恢复指挥点
    gameState.player2.k = gameState.player2.maxK;
    
    updateUI();
    
    // AI回合
    setTimeout(() => {
        aiTurn();
    }, 1000);
}

// ========== AI回合 ==========
function aiTurn() {
    // AI抽牌
    if (gameState.player2.deck > 0) {
        drawCard(2);
    }
    
    // AI出牌逻辑
    setTimeout(() => {
        aiPlayCards();
    }, 500);
}

// ========== AI出牌 ==========
function aiPlayCards() {
    const playableCards = gameState.player2.hand.filter(card => card.cost <= gameState.player2.k);
    
    if (playableCards.length > 0) {
        const cardToPlay = playableCards[0];
        const isOrderCard = (cardToPlay.type === 'order' || cardToPlay.type === 'location');
        const supportLineNotFull = gameState.player2.supportLine.length < 4;
        
        // 指令牌可以直接使用，单位牌需要检查支援阵线是否已满
        if (isOrderCard || supportLineNotFull) {
            aiPlayCard(cardToPlay);
            
            setTimeout(() => {
                const stillHasPlayableCards = gameState.player2.hand.filter(card => card.cost <= gameState.player2.k).length > 0;
                const stillHasSpace = gameState.player2.supportLine.length < 4;
                
                if (gameState.player2.k > 0 && stillHasPlayableCards && stillHasSpace) {
                    aiPlayCards();
                } else {
                    aiMoveAndAttack();
                }
            }, 600);
        } else {
            // 支援阵线已满，无法出单位牌，直接移动和攻击
            aiMoveAndAttack();
        }
    } else {
        aiMoveAndAttack();
    }
}

// ========== AI出牌 ==========
function aiPlayCard(cardData) {
    // 指令卡和地点卡使用后立即生效并移除，不部署到战场
    if (cardData.type === 'order' || cardData.type === 'location') {
        // 消耗指挥点
        if (cardData.cost > gameState.player2.k) {
            return; // 指挥点不足，跳过
        }
        
        gameState.player2.k -= cardData.cost;
        
        // 从手牌移除
        const handIndex = gameState.player2.hand.findIndex(c => c.id === cardData.id);
        if (handIndex !== -1) {
            gameState.player2.hand.splice(handIndex, 1);
        }
        
        // 触发效果（这里可以添加具体的指令卡效果逻辑）
        console.log(`AI使用 ${cardData.name}：${cardData.description}`);
        
        // 抽牌
        drawCard(2);
        updateUI();
        return;
    }
    
    // 单位卡才部署到战场
    if (gameState.player2.supportLine.length >= 4) {
        return; // 支援阵线已满
    }
    
    const instanceId = Date.now() + Math.random() + 20000;
    const cardInstance = {
        ...cardData,
        instanceId: instanceId,
        currentHealth: cardData.health || 0,
        location: 'support',
        canMove: true,
        canAttack: false,
        hasMovedThisTurn: false,
        hasAttackedThisTurn: false
    };
    
    // 从手牌移除
    const handIndex = gameState.player2.hand.findIndex(c => c.id === cardData.id);
    if (handIndex !== -1) {
        gameState.player2.hand.splice(handIndex, 1);
    }
    
    // 添加到支援阵线
    gameState.player2.supportLine.push(cardInstance);
    gameState.player2.k -= cardData.cost;
    
    // 创建卡牌元素
    const cardElement = createCardElement(cardData, instanceId, 'support');
    cardElement.classList.add('in-battlefield');
    cardElement.style.opacity = '0.7';
    
    const slot = document.querySelector('#slots-top-support .line-slot:not(.occupied)');
    if (slot) {
        slot.classList.add('occupied');
        slot.appendChild(cardElement);
    }
    
    triggerDeploy(cardInstance, 2);
    updateUI();
}

// ========== AI移动和攻击 ==========
function aiMoveAndAttack() {
    // AI移动单位到前线
    gameState.player2.supportLine.forEach((unit, index) => {
        // 检查指挥点和前线状态（使用DOM实时检查总单位数）
        const frontlineSlots = document.querySelectorAll('#slots-frontline .line-slot.occupied');
        const actualFrontlineUnits = frontlineSlots.length;
        
        const moveCost = unit.moveCost !== undefined ? unit.moveCost : 1;
        if (unit.canMove && !unit.hasMovedThisTurn && gameState.player2.k >= moveCost && actualFrontlineUnits < 5) {
            setTimeout(() => {
                // 再次检查，因为可能有多个单位同时尝试移动
                const currentFrontlineSlots = document.querySelectorAll('#slots-frontline .line-slot.occupied');
                const currentMoveCost = unit.moveCost !== undefined ? unit.moveCost : 1;
                if (gameState.player2.k >= currentMoveCost && currentFrontlineSlots.length < 5) {
                    aiMoveToFrontline(unit);
                }
            }, 300 * (index + 1));
        }
    });
    
    // AI攻击
    setTimeout(() => {
        if (gameState.frontlineControl === 2 || gameState.player2.frontline.length > 0) {
            gameState.player2.frontline.forEach((unit, index) => {
                if (unit.canAttack && !unit.hasAttackedThisTurn) {
                    setTimeout(() => {
                        // 优先攻击总部
                        if (gameState.frontlineControl === 2) {
                            attackHQ(unit, 1);
                        } else {
                            // 攻击玩家单位
                            const targets = gameState.player1.frontline.length > 0 ? 
                                gameState.player1.frontline : gameState.player1.supportLine;
                            if (targets.length > 0) {
                                attackUnit(unit, targets[0]);
                            }
                        }
                        unit.hasAttackedThisTurn = true;
                        unit.canAttack = false;
                    }, 500 * (index + 1));
                }
            });
        }
        
        setTimeout(() => {
            endAITurn();
        }, 2000);
    }, 1500);
}

// ========== AI移动到前线 ==========
function aiMoveToFrontline(unit) {
    const supportIndex = gameState.player2.supportLine.findIndex(u => u.instanceId === unit.instanceId);
    if (supportIndex === -1) return;
    
    // 检查指挥点（使用单位的移动费用）
    const moveCost = unit.moveCost !== undefined ? unit.moveCost : 1;
    if (gameState.player2.k < moveCost) {
        return;
    }
    
    // 检查前线总单位数量（前线最多5个单位，包括双方）
    // 实时检查DOM中的实际单位数量，确保状态同步
    const frontlineSlots = document.querySelectorAll('#slots-frontline .line-slot.occupied');
    const actualFrontlineUnits = frontlineSlots.length;
    
    if (actualFrontlineUnits >= 5) {
        // 前线已满，无法移动
        return;
    }
    
    // 确保有空槽位
    const emptySlots = document.querySelectorAll('#slots-frontline .line-slot:not(.occupied)');
    if (emptySlots.length === 0) {
        return;
    }
    
    gameState.player2.k -= moveCost;
    gameState.player2.supportLine.splice(supportIndex, 1);
    unit.location = 'frontline';
    unit.canMove = false;
    unit.canAttack = true;
    unit.hasMovedThisTurn = true;
    gameState.player2.frontline.push(unit);
    
    const cardElement = document.querySelector(`[data-instance-id="${unit.instanceId}"]`);
    if (cardElement) {
        const slot = document.querySelector('#slots-frontline .line-slot:not(.occupied)');
        if (slot) {
            const oldSlot = cardElement.closest('.line-slot');
            if (oldSlot) {
                oldSlot.classList.remove('occupied');
                oldSlot.innerHTML = '';
            }
            slot.classList.add('occupied');
            slot.appendChild(cardElement);
        }
    }
    
    updateFrontlineControl();
    updateUI();
}

// ========== 结束AI回合 ==========
function endAITurn() {
    gameState.currentPlayer = 1;
    gameState.player1.k = gameState.player1.maxK;
    
    // 重置单位状态
    gameState.player1.supportLine.forEach(unit => {
        unit.hasMovedThisTurn = false;
        unit.hasAttackedThisTurn = false;
        unit.canMove = true;
        unit.canAttack = false;
    });
    
    gameState.player1.frontline.forEach(unit => {
        unit.hasMovedThisTurn = false;
        unit.hasAttackedThisTurn = false;
        unit.canMove = false;
        unit.canAttack = true;
    });
    
    updateUI();
    showMessage('你的回合！');
}

// ========== 结束游戏 ==========
function endGame(playerWon) {
    setTimeout(() => {
        if (confirm(playerWon ? '🎉 恭喜你获胜！' : '💀 你失败了！\n\n是否重新开始？')) {
            location.reload();
        }
    }, 1000);
}

// ========== 显示消息 ==========
function showMessage(text) {
    // 清除之前的消息
    document.querySelectorAll('.game-message').forEach(el => el.remove());
    
    const messageEl = document.createElement('div');
    messageEl.className = 'game-message';
    messageEl.textContent = text;
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(45, 40, 35, 0.95);
        color: #d4af37;
        padding: 20px 40px;
        border-radius: 10px;
        border: 2px solid #d4af37;
        font-size: 18px;
        font-weight: 600;
        z-index: 2000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: messageFade 2s ease-out forwards;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.remove();
    }, 2000);
}

// ========== 音效系统 ==========
const audioManager = {
    enabled: true,
    play(name) {
        // 简化音效
    }
};

// ========== 更新UI ==========
function updateUI() {
    // 更新玩家1资源（左下角）
    const resourceBottomCurrent = document.getElementById('resource-bottom-current');
    const resourceBottomMax = document.getElementById('resource-bottom-max');
    if (resourceBottomCurrent) {
        resourceBottomCurrent.textContent = gameState.player1.k;
    }
    if (resourceBottomMax) {
        resourceBottomMax.textContent = gameState.player1.maxK;
    }
    
    // 更新玩家1总部
    const hqBottom = document.getElementById('hq-bottom');
    if (hqBottom) {
        hqBottom.textContent = gameState.player1.hq;
    }
    // 更新玩家1总部卡牌
    updateHQCard(1);
    
    // 更新玩家2资源（左上角）
    const resourceTopCurrent = document.getElementById('resource-top-current');
    const resourceTopMax = document.getElementById('resource-top-max');
    if (resourceTopCurrent) {
        const kValue = Math.max(0, gameState.player2.k); // 确保不会显示负数
        resourceTopCurrent.textContent = kValue;
    }
    if (resourceTopMax) {
        resourceTopMax.textContent = gameState.player2.maxK;
    }
    
    // 更新玩家2总部
    const hqTop = document.getElementById('hq-top');
    if (hqTop) {
        hqTop.textContent = gameState.player2.hq;
    }
    // 更新玩家2总部卡牌
    updateHQCard(2);
    
    // 更新回合显示
    const turnText = document.getElementById('turn-text');
    const turnStatus = document.getElementById('turn-status');
    if (turnText) {
        turnText.textContent = `回合 ${gameState.turn}`;
    }
    if (turnStatus) {
        turnStatus.textContent = gameState.currentPlayer === 1 ? '你的回合' : 'AI回合';
    }
    
    // 更新当前出牌阵营指示器（右上角）
    const currentPlayerIndicator = document.getElementById('current-player-indicator');
    if (currentPlayerIndicator) {
        currentPlayerIndicator.textContent = gameState.currentPlayer === 1 ? '玩家' : '对手';
    }
    
    // 更新牌库
    const deckCount = document.getElementById('deck-count');
    if (deckCount) {
        deckCount.textContent = gameState.player1.deck;
    }
}

// ========== 页面加载完成后初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Page loaded');
    
    // 只在游戏页面（game.html）初始化游戏
    // 检查是否存在游戏页面特有的元素
    const gameContainer = document.getElementById('game-container');
    const endTurnBtn = document.getElementById('end-turn-btn');
    const cardsContainer = document.getElementById('cards-container');
    
    console.log('DOMContentLoaded: gameContainer =', !!gameContainer);
    console.log('DOMContentLoaded: endTurnBtn =', !!endTurnBtn);
    console.log('DOMContentLoaded: cardsContainer =', !!cardsContainer);
    console.log('DOMContentLoaded: cardTemplates length =', typeof cardTemplates !== 'undefined' ? cardTemplates.length : 'undefined');
    
    if (gameContainer && endTurnBtn) {
        // 这是游戏页面，执行游戏初始化
        console.log('DOMContentLoaded: Initializing game...');
        
        // 确保cards-container存在后再初始化
        if (cardsContainer) {
            initGame();
            setupDropZones();
            endTurnBtn.addEventListener('click', endTurn);
        } else {
            console.error('DOMContentLoaded: cards-container not found, retrying in 100ms...');
            setTimeout(() => {
                const retryContainer = document.getElementById('cards-container');
                if (retryContainer) {
                    console.log('DOMContentLoaded: Retry successful, initializing game...');
                    initGame();
                    setupDropZones();
                    endTurnBtn.addEventListener('click', endTurn);
                } else {
                    console.error('DOMContentLoaded: cards-container still not found after retry');
                    if (typeof showMessage !== 'undefined') {
                        showMessage('手牌容器未找到，请刷新页面');
                    }
                }
            }, 100);
        }
    } else {
        console.log('DOMContentLoaded: Not a game page, skipping initialization');
    }
    // 如果是主菜单页面，不执行任何游戏初始化代码
});


