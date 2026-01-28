// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = 800;
canvas.height = 600;

// 游戏状态
let gameState = 'start'; // start, playing, gameOver, levelComplete
let score = 0;
let keys = {};
let currentLevel = 1;
let lives = 3;
let highScore = localStorage.getItem('highScore') || 0;
let musicEnabled = true;
let sfxEnabled = true;

// 游戏难度参数（随关卡递增）
let gameSpeed = 1;
let enemyCount = 2;
let enemySpeed = 1;

// 火柴人类
class StickMan {
    constructor() {
        this.x = 100;
        this.y = 300;
        this.width = 30;
        this.height = 50;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpPower = -15;
        this.gravity = 0.8;
        this.onGround = false;
        this.facing = 1; // 1 = 右, -1 = 左
        this.invincible = false;
        this.invincibleTime = 0;
    }
    
    // 更新位置
    update() {
        // 更新无敌状态
        if (this.invincible) {
            this.invincibleTime--;
            if (this.invincibleTime <= 0) {
                this.invincible = false;
            }
        }
        
        // 水平移动
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            this.velocityX = -this.speed;
            this.facing = -1;
        } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            this.velocityX = this.speed;
            this.facing = 1;
        } else {
            this.velocityX *= 0.8; // 摩擦力
        }
        
        // 跳跃
        if ((keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W']) && this.onGround) {
            this.velocityY = this.jumpPower;
            this.onGround = false;
            playSound('jump');
        }
        
        // 应用重力
        this.velocityY += this.gravity;
        
        // 更新位置
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 边界检测
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
        
        // 地面碰撞
        if (this.y + this.height > canvas.height - 50) {
            this.y = canvas.height - 50 - this.height;
            this.velocityY = 0;
            this.onGround = true;
        }
        
        // 平台碰撞检测
        platforms.forEach(platform => {
            if (this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height > platform.y &&
                this.y + this.height < platform.y + 20 &&
                this.velocityY > 0) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.onGround = true;
            }
        });
    }
    
    // 受伤
    hit() {
        if (this.invincible) return;
        
        lives--;
        playSound('hit');
        updateLives();
        
        if (lives <= 0) {
            gameOver();
        } else {
            this.invincible = true;
            this.invincibleTime = 120; // 2秒无敌
        }
    }
    
    // 绘制火柴人
    draw() {
        // 无敌状态闪烁
        if (this.invincible && Math.floor(this.invincibleTime / 5) % 2 === 0) {
            return;
        }
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y);
        
        // 如果面向左边，翻转
        if (this.facing === -1) {
            ctx.scale(-1, 1);
        }
        
        // 无敌状态发光效果
        if (this.invincible) {
            ctx.strokeStyle = '#FFD700';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#FFD700';
        } else {
            ctx.strokeStyle = '#2c3e50';
        }
        
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // 头部（圆形）
        ctx.beginPath();
        ctx.arc(0, 10, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // 身体（直线）
        ctx.beginPath();
        ctx.moveTo(0, 18);
        ctx.lineTo(0, 35);
        ctx.stroke();
        
        // 手臂
        const armAngle = Math.sin(Date.now() / 100) * 0.3;
        ctx.beginPath();
        ctx.moveTo(0, 22);
        ctx.lineTo(-8 - armAngle * 5, 30);
        ctx.moveTo(0, 22);
        ctx.lineTo(8 + armAngle * 5, 30);
        ctx.stroke();
        
        // 腿部
        const legAngle = Math.sin(Date.now() / 80) * 0.4;
        ctx.beginPath();
        ctx.moveTo(0, 35);
        ctx.lineTo(-6 - legAngle * 5, 45);
        ctx.moveTo(0, 35);
        ctx.lineTo(6 + legAngle * 5, 45);
        ctx.stroke();
        
        ctx.restore();
    }
}

// 平台类
class Platform {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
    }
    
    draw() {
        // 平台主体
        ctx.fillStyle = '#34495e';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 平台顶部高光
        ctx.fillStyle = '#5a6c7d';
        ctx.fillRect(this.x, this.y, this.width, 3);
        
        // 平台阴影
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(this.x, this.y + this.height, this.width, 2);
    }
}

// 星星类
class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 15;
        this.rotation = 0;
        this.collected = false;
    }
    
    update() {
        this.rotation += 0.1;
    }
    
    draw() {
        if (this.collected) return;
        
        ctx.save();
        ctx.translate(this.x + this.size, this.y + this.size);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        
        // 绘制五角星
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 碰撞检测
    checkCollision(player) {
        if (this.collected) return false;
        
        const distance = Math.sqrt(
            Math.pow(player.x + player.width / 2 - (this.x + this.size), 2) +
            Math.pow(player.y + player.height / 2 - (this.y + this.size), 2)
        );
        
        return distance < this.size + 15;
    }
}

// 敌人类（巡逻的火柴人）
class Enemy {
    constructor(x, y, patrolStart, patrolEnd) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 50;
        this.patrolStart = patrolStart;
        this.patrolEnd = patrolEnd;
        this.speed = 0.8 * enemySpeed; // 降低速度，更容易躲避
        this.direction = 1;
        this.facing = 1;
    }
    
    update() {
        // 巡逻移动
        this.x += this.speed * this.direction * gameSpeed;
        this.facing = this.direction;
        
        // 到达巡逻边界则转向
        if (this.x <= this.patrolStart) {
            this.direction = 1;
        } else if (this.x >= this.patrolEnd) {
            this.direction = -1;
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y);
        
        if (this.facing === -1) {
            ctx.scale(-1, 1);
        }
        
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // 头部
        ctx.beginPath();
        ctx.arc(0, 10, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // 眼睛（显示邪恶）
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(-3, 8, 2, 2);
        ctx.fillRect(1, 8, 2, 2);
        
        // 身体
        ctx.beginPath();
        ctx.moveTo(0, 18);
        ctx.lineTo(0, 35);
        ctx.stroke();
        
        // 手臂
        const armAngle = Math.sin(Date.now() / 80) * 0.4;
        ctx.beginPath();
        ctx.moveTo(0, 22);
        ctx.lineTo(-8 - armAngle * 5, 30);
        ctx.moveTo(0, 22);
        ctx.lineTo(8 + armAngle * 5, 30);
        ctx.stroke();
        
        // 腿部
        const legAngle = Math.sin(Date.now() / 60) * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 35);
        ctx.lineTo(-6 - legAngle * 5, 45);
        ctx.moveTo(0, 35);
        ctx.lineTo(6 + legAngle * 5, 45);
        ctx.stroke();
        
        ctx.restore();
    }
    
    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}

// 陷阱类（尖刺）
class Trap {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
    }
    
    draw() {
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(this.x, this.y, this.width, 5);
        
        // 绘制尖刺
        ctx.fillStyle = '#c0392b';
        for (let i = 0; i < this.width; i += 15) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y + 5);
            ctx.lineTo(this.x + i + 7.5, this.y - 10);
            ctx.lineTo(this.x + i + 15, this.y + 5);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y + player.height > this.y - 10 &&
               player.y + player.height < this.y + 10;
    }
}

// 创建游戏对象
const player = new StickMan();
let platforms = [];
let stars = [];
let enemies = [];
let traps = [];

// 关卡配置
const levels = [
    // 第一关 - 新手入门
    {
        platforms: [
            {x: 180, y: 450, width: 200},  // 加宽平台
            {x: 380, y: 350, width: 200},
            {x: 580, y: 250, width: 200},
            {x: 80, y: 180, width: 180},
            {x: 480, y: 130, width: 180},
        ],
        stars: [
            {x: 250, y: 420},   // 在平台上安全位置
            {x: 450, y: 320},
            {x: 650, y: 220},
            {x: 140, y: 150},
            {x: 540, y: 100},
        ],
        enemies: [
            {x: 400, y: 300, start: 400, end: 560},  // 扩大巡逻范围，速度已降低
        ],
        traps: [
            {x: 420, y: canvas.height - 50, width: 60},  // 只在地面，远离起点
        ]
    },
    // 第二关 - 进阶挑战
    {
        platforms: [
            {x: 120, y: 450, width: 180},
            {x: 330, y: 380, width: 160},
            {x: 530, y: 310, width: 180},  // 移除陷阱，加宽平台
            {x: 220, y: 220, width: 160},
            {x: 420, y: 140, width: 200},
            {x: 630, y: 220, width: 150},
        ],
        stars: [
            {x: 180, y: 420},   // 平台中央安全位置
            {x: 380, y: 350},
            {x: 600, y: 280},   // 调整位置，远离边缘
            {x: 270, y: 190},
            {x: 500, y: 110},
            {x: 680, y: 190},
        ],
        enemies: [
            {x: 340, y: 330, start: 340, end: 470},
            {x: 430, y: 90, start: 430, end: 600},
        ],
        traps: [
            {x: 320, y: canvas.height - 50, width: 60},  // 只在地面
        ]
    },
    // 第三关 - 高手挑战
    {
        platforms: [
            {x: 80, y: 480, width: 160},
            {x: 240, y: 420, width: 140},
            {x: 380, y: 360, width: 140},  // 移除陷阱
            {x: 540, y: 300, width: 140},
            {x: 680, y: 240, width: 140},  // 移除陷阱
            {x: 330, y: 190, width: 180},
            {x: 130, y: 130, width: 200},
        ],
        stars: [
            {x: 130, y: 450},
            {x: 280, y: 390},
            {x: 430, y: 330},
            {x: 590, y: 270},
            {x: 730, y: 210},
            {x: 400, y: 160},
            {x: 200, y: 100},
        ],
        enemies: [
            {x: 250, y: 370, start: 250, end: 360},
            {x: 390, y: 310, start: 390, end: 500},
            {x: 340, y: 140, start: 340, end: 490},
        ],
        traps: [
            {x: 460, y: canvas.height - 50, width: 75},  // 只在地面，不在平台上
        ]
    },
];

// 加载关卡
function loadLevel(levelNum) {
    const levelData = levels[levelNum - 1];
    if (!levelData) return false;
    
    // 重置数组
    platforms = [];
    stars = [];
    enemies = [];
    traps = [];
    
    // 创建平台
    levelData.platforms.forEach(p => {
        platforms.push(new Platform(p.x, p.y, p.width));
    });
    
    // 创建星星
    levelData.stars.forEach(s => {
        stars.push(new Star(s.x, s.y));
    });
    
    // 创建敌人
    levelData.enemies.forEach(e => {
        enemies.push(new Enemy(e.x, e.y, e.start, e.end));
    });
    
    // 创建陷阱
    levelData.traps.forEach(t => {
        traps.push(new Trap(t.x, t.y, t.width));
    });
    
    return true;
}

// 音效系统
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (!sfxEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'jump':
            oscillator.frequency.value = 400;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'collect':
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'hit':
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 100;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'levelComplete':
            oscillator.frequency.value = 600;
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
    }
}

// 键盘事件监听
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // 开始游戏
    if (e.key === ' ' && gameState === 'start') {
        gameState = 'playing';
        currentLevel = 1;
        loadLevel(currentLevel);
        document.getElementById('startScreen').classList.add('hidden');
        updateHighScore();
    }
    
    // 重新开始游戏
    if (e.key === ' ' && gameState === 'gameOver') {
        resetGame();
    }
    
    // 下一关
    if (e.key === ' ' && gameState === 'levelComplete') {
        nextLevel();
    }
    
    // 静音切换
    if (e.key === 'm' || e.key === 'M') {
        sfxEnabled = !sfxEnabled;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 重置游戏
function resetGame() {
    score = 0;
    lives = 3;
    currentLevel = 1;
    gameSpeed = 1;
    enemySpeed = 1;
    gameState = 'playing';
    
    // 重置玩家
    player.x = 100;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    player.invincible = false;
    player.invincibleTime = 0;
    
    // 加载第一关
    loadLevel(currentLevel);
    
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    updateScore();
    updateLives();
    updateLevel();
}

// 下一关
function nextLevel() {
    currentLevel++;
    
    // 增加难度
    gameSpeed *= 1.1;
    enemySpeed *= 1.15;
    
    if (loadLevel(currentLevel)) {
        // 重置玩家位置
        player.x = 100;
        player.y = 300;
        player.velocityX = 0;
        player.velocityY = 0;
        player.invincible = false;
        player.invincibleTime = 0;
        
        gameState = 'playing';
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        updateLevel();
    } else {
        // 没有更多关卡，游戏胜利
        score += 200; // 通关奖励
        updateScore();
        saveHighScore();
        gameState = 'gameOver';
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        document.getElementById('finalScore').textContent = score;
        document.getElementById('gameOverTitle').textContent = '恭喜通关！';
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
}

// 游戏结束
function gameOver() {
    gameState = 'gameOver';
    saveHighScore();
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverTitle').textContent = '游戏结束';
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// 关卡完成
function levelComplete() {
    gameState = 'levelComplete';
    score += 50; // 完成关卡奖励
    updateScore();
    playSound('levelComplete');
    document.getElementById('currentLevelDisplay').textContent = currentLevel;
    document.getElementById('levelCompleteScreen').classList.remove('hidden');
}

// 更新分数显示
function updateScore() {
    document.getElementById('score').textContent = score;
}

// 更新生命值显示
function updateLives() {
    document.getElementById('lives').textContent = lives;
}

// 更新关卡显示
function updateLevel() {
    document.getElementById('level').textContent = currentLevel;
}

// 更新最高分显示
function updateHighScore() {
    document.getElementById('highScore').textContent = highScore;
}

// 保存最高分
function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        updateHighScore();
    }
}

// 绘制地面
function drawGround() {
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // 地面纹理
    ctx.fillStyle = '#2ecc71';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, canvas.height - 50, 10, 3);
    }
}

// 绘制背景
function drawBackground() {
    // 云朵
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    drawCloud(100, 80, 60);
    drawCloud(300, 60, 50);
    drawCloud(600, 100, 70);
    drawCloud(750, 50, 55);
}

// 绘制云朵
function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.arc(x + size * 0.5, y, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x + size, y, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
}

// 游戏主循环
function gameLoop() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'playing') {
        // 更新游戏对象
        player.update();
        
        // 更新并检测星星碰撞
        stars.forEach(star => {
            star.update();
            if (star.checkCollision(player)) {
                star.collected = true;
                score += 10;
                updateScore();
                playSound('collect');
            }
        });
        
        // 更新并检测敌人碰撞
        enemies.forEach(enemy => {
            enemy.update();
            if (enemy.checkCollision(player)) {
                player.hit();
            }
        });
        
        // 检测陷阱碰撞
        traps.forEach(trap => {
            if (trap.checkCollision(player)) {
                player.hit();
            }
        });
        
        // 检查是否收集完所有星星
        if (stars.every(star => star.collected)) {
            levelComplete();
        }
    }
    
    // 绘制游戏元素
    drawBackground();
    drawGround();
    
    platforms.forEach(platform => platform.draw());
    traps.forEach(trap => trap.draw());
    stars.forEach(star => star.draw());
    enemies.forEach(enemy => enemy.draw());
    player.draw();
    
    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 启动游戏
updateHighScore();
gameLoop();



