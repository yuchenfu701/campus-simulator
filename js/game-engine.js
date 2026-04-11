/**
 * 爱哲安民未来学校校园生活模拟器 - 核心游戏引擎
 * 稳定的2D俯视角校园模拟器
 */

class GameEngine {
    constructor() {
        this.isInitialized = false;
        this.isRunning = false;
        
        // 画布和渲染
        this.canvas = null;
        this.ctx = null;
        
        // 游戏状态
        this.gameState = 'loading'; // loading, playing, paused, dialog, menu
        this.lastTime = 0;
        
        // 游戏世界（扩大以匹配新地图）
        this.world = {
            width: 2400,
            height: 1400
        };
        
        // 相机系统
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1.0,
            following: null
        };
        
        // 输入系统
        this.input = {
            keys: {},
            mouse: { x: 0, y: 0, pressed: false },
            touch: { active: false, startX: 0, startY: 0 }
        };
        
        // 输入控制
        this.inputEnabled = true;
        
        // 游戏系统引用
        this.systems = {};
        
        // 游戏数据
        this.gameData = {
            version: '2.0.0',
            saveSlot: 'default',
            settings: {
                difficulty: 'normal',
                autoSave: true,
                soundEnabled: true,
                language: 'zh-CN'
            }
        };
        
        // 调试模式
        this.debug = false;
    }
    
    // 初始化游戏引擎
    async init() {
        try {
            console.log('🎮 正在初始化游戏引擎...');
            
            // 初始化画布
            await this.initCanvas();
            
            // 初始化输入系统
            this.initInput();
            
            // 初始化游戏系统
            await this.initSystems();
            
            // 设置初始状态
            this.gameState = 'playing';
            this.isInitialized = true;
            
            console.log('✅ 游戏引擎初始化完成');
            return true;
            
        } catch (error) {
            console.error('❌ 游戏引擎初始化失败:', error);
            this.showError('游戏初始化失败，请刷新页面重试');
            return false;
        }
    }
    
    // 初始化画布
    async initCanvas() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            throw new Error('找不到游戏画布元素');
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('无法获取2D渲染上下文');
        }
        
        // 设置画布大小
        this.resizeCanvas();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 画布样式设置
        this.ctx.imageSmoothingEnabled = false; // 像素艺术风格
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // 确保画布可以获得焦点
        this.canvas.focus();
    }
    
    // 调整画布大小
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // 更新相机视图
        this.updateCameraView();
    }
    
    // 初始化输入系统
    initInput() {
        // 键盘事件 - 绑定到画布
        this.canvas.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.canvas.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // 也绑定到整个文档作为备用
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        
        // 防止上下文菜单
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    // 初始化游戏系统
    async initSystems() {
        console.log('🔧 正在初始化游戏系统...');
        
        // 按依赖顺序初始化系统
        const systemsToInit = [
            { name: 'time', class: TimeSystem },
            { name: 'characters', class: CharacterManager },
            { name: 'story', class: StorySystem },
            { name: 'player', class: Player },
            { name: 'map', class: SchoolMap },
            { name: 'ui', class: UIManager },
            { name: 'event', class: EventSystem },
            { name: 'task', class: TaskSystem },
            { name: 'relationship', class: RelationshipSystem },
            { name: 'academic', class: AcademicSystem },
            { name: 'save', class: SaveSystem }
        ];
        
        for (const systemConfig of systemsToInit) {
            try {
                if (typeof systemConfig.class === 'undefined') {
                    console.warn(`⚠️ 系统 ${systemConfig.name} 的类未定义，跳过初始化`);
                    continue;
                }
                
                console.log(`  -> 初始化 ${systemConfig.name} 系统`);
                this.systems[systemConfig.name] = new systemConfig.class(this);
                
                // 如果系统有初始化方法，调用它
                if (typeof this.systems[systemConfig.name].init === 'function') {
                    await this.systems[systemConfig.name].init();
                }
                
            } catch (error) {
                console.error(`❌ 初始化 ${systemConfig.name} 系统失败:`, error);
            }
        }
        
        // 设置相机跟随玩家
        if (this.systems.player) {
            this.camera.following = this.systems.player;
        }
    }
    
    // 开始游戏循环
    start() {
        if (!this.isInitialized) {
            console.error('❌ 无法启动游戏：引擎未初始化');
            return;
        }
        
        if (this.isRunning) {
            console.warn('⚠️ 游戏已在运行中');
            return;
        }
        
        this.isRunning = true;
        this.lastTime = performance.now();
        
        console.log('🚀 游戏开始运行');
        this.gameLoop();
    }
    
    // 停止游戏循环
    stop() {
        this.isRunning = false;
        console.log('⏹️ 游戏已停止');
    }
    
    // 主游戏循环
    gameLoop(currentTime = performance.now()) {
        if (!this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        try {
            // 更新游戏
            this.update(deltaTime);
            
            // 渲染游戏
            this.render();
            
        } catch (error) {
            console.error('❌ 游戏循环错误:', error);
            this.showError('游戏运行出错，请检查控制台');
        }
        
        // 继续循环
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    // 更新游戏逻辑
    update(deltaTime) {
        if (this.gameState !== 'playing') {
            console.log('⚠️ 游戏状态不是playing:', this.gameState);
            return;
        }
        
        // 更新所有系统
        for (const [name, system] of Object.entries(this.systems)) {
            if (system && typeof system.update === 'function') {
                try {
                    system.update(deltaTime);
                } catch (error) {
                    console.error(`❌ 更新 ${name} 系统失败:`, error);
                }
            }
        }
        
        // 更新相机
        this.updateCamera(deltaTime);
    }
    
    // 渲染游戏画面
    render() {
        // 清空画布
        this.ctx.fillStyle = '#87CEEB'; // 天空蓝背景
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 保存画布状态
        this.ctx.save();
        
        // 应用相机变换
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        
        // 渲染游戏世界
        this.renderWorld();
        
        // 恢复画布状态
        this.ctx.restore();
        
        // 渲染UI层
        this.renderUI();
        
        // 调试信息
        if (this.debug) {
            this.renderDebugInfo();
        }
    }
    
    // 渲染游戏世界
    renderWorld() {
        // 渲染地图
        if (this.systems.map && typeof this.systems.map.render === 'function') {
            this.systems.map.render(this.ctx, this.camera);
        }
        
        // 渲染玩家
        if (this.systems.player && typeof this.systems.player.render === 'function') {
            this.systems.player.render(this.ctx);
        }
        
        // 渲染其他游戏对象
        for (const system of Object.values(this.systems)) {
            if (system && typeof system.renderWorld === 'function') {
                system.renderWorld(this.ctx, this.camera);
            }
        }
    }
    
    // 渲染UI层
    renderUI() {
        if (this.systems.ui && typeof this.systems.ui.render === 'function') {
            this.systems.ui.render(this.ctx, this.canvas);
        }
    }
    
    // 更新相机
    updateCamera(deltaTime) {
        if (!this.camera.following) return;
        
        const target = this.camera.following;
        const targetX = target.x - this.canvas.width / 2;
        const targetY = target.y - this.canvas.height / 2;
        
        // 平滑跟随
        const lerpFactor = 0.1;
        this.camera.x += (targetX - this.camera.x) * lerpFactor;
        this.camera.y += (targetY - this.camera.y) * lerpFactor;
        
        // 限制相机边界
        this.camera.x = Math.max(0, Math.min(this.world.width - this.canvas.width, this.camera.x));
        this.camera.y = Math.max(0, Math.min(this.world.height - this.canvas.height, this.camera.y));
    }
    
    // 更新相机视图
    updateCameraView() {
        // 在画布大小改变时调整相机
        if (this.camera.following) {
            const target = this.camera.following;
            this.camera.x = target.x - this.canvas.width / 2;
            this.camera.y = target.y - this.canvas.height / 2;
        }
    }
    
    // 输入事件处理
    handleKeyDown(e) {
        this.input.keys[e.key.toLowerCase()] = true;
        
        // 调试信息
        console.log('🎮 按键按下:', e.key.toLowerCase(), '游戏状态:', this.gameState, '输入启用:', this.inputEnabled);
        
        // 阻止默认行为
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'e'].includes(e.key)) {
            e.preventDefault();
        }
        
        // 检查输入是否被禁用（对话模式下）
        if (!this.inputEnabled) {
            // 对话模式下只允许空格键和ESC键
            if (e.key === ' ' || e.key === 'Escape') {
                this.broadcastEvent('keydown', { key: e.key.toLowerCase(), event: e });
            }
            return;
        }
        
        // E键特殊处理
        if (e.key.toLowerCase() === 'e' && this.gameState === 'playing') {
            console.log('🔑 E键交互 - 直接通知玩家系统');
            const player = this.getSystem('player');
            if (player && typeof player.handleInteraction === 'function') {
                player.handleInteraction();
            }
        }
        
        // 传递给系统处理
        this.broadcastEvent('keydown', { key: e.key.toLowerCase(), event: e });
    }
    
    handleKeyUp(e) {
        this.input.keys[e.key.toLowerCase()] = false;
        this.broadcastEvent('keyup', { key: e.key.toLowerCase(), event: e });
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.input.mouse.x = e.clientX - rect.left;
        this.input.mouse.y = e.clientY - rect.top;
        this.input.mouse.pressed = true;
        this._mouseDownAt = { t: Date.now(), cx: e.clientX, cy: e.clientY };
        
        this.broadcastEvent('mousedown', this.input.mouse);
    }
    
    handleMouseUp(e) {
        this.input.mouse.pressed = false;
        if (typeof window.CampusSettings !== 'undefined' && window.CampusSettings.isMobileMode() && this._mouseDownAt) {
            const dt = Date.now() - this._mouseDownAt.t;
            const dx = e.clientX - this._mouseDownAt.cx;
            const dy = e.clientY - this._mouseDownAt.cy;
            if (dt < 600 && Math.hypot(dx, dy) < 18 && this.gameState === 'playing' && this.inputEnabled) {
                const player = this.getSystem('player');
                if (player && typeof player.handleInteraction === 'function') {
                    player.handleInteraction();
                }
            }
        }
        this._mouseDownAt = null;
        this.broadcastEvent('mouseup', this.input.mouse);
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.input.mouse.x = e.clientX - rect.left;
        this.input.mouse.y = e.clientY - rect.top;
        
        this.broadcastEvent('mousemove', this.input.mouse);
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        
        this.input.touch.active = true;
        this.input.touch.startX = touch.clientX - rect.left;
        this.input.touch.startY = touch.clientY - rect.top;
        this.input.touch.startTime = Date.now();
        this.input.touch.isSwipe = false;
        
        this.broadcastEvent('touchstart', this.input.touch);
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        const mobile = typeof window.CampusSettings !== 'undefined' && window.CampusSettings.isMobileMode();
        if (mobile && this.input.touch.active) {
            const dt = Date.now() - (this.input.touch.startTime || 0);
            if (!this.input.touch.isSwipe && dt < 750 && this.gameState === 'playing' && this.inputEnabled) {
                const player = this.getSystem('player');
                if (player && typeof player.handleInteraction === 'function') {
                    player.handleInteraction();
                }
            }
        }
        this.input.touch.active = false;
        this.input.keys = {};
        this.broadcastEvent('touchend', this.input.touch);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.input.touch.active) return;
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;
        
        const deltaX = currentX - this.input.touch.startX;
        const deltaY = currentY - this.input.touch.startY;
        const dist = Math.hypot(deltaX, deltaY);
        
        const mobile = typeof window.CampusSettings !== 'undefined' && window.CampusSettings.isMobileMode();
        if (mobile && dist > 20) {
            this.input.touch.isSwipe = true;
        }
        if (mobile && !this.input.touch.isSwipe) {
            return;
        }
        
        // 模拟方向键
        this.input.keys = {};
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            this.input.keys[deltaX > 30 ? 'd' : deltaX < -30 ? 'a' : ''] = true;
        } else {
            this.input.keys[deltaY > 30 ? 's' : deltaY < -30 ? 'w' : ''] = true;
        }
        
        this.broadcastEvent('touchmove', { deltaX, deltaY, touch: this.input.touch });
    }
    
    // 广播事件给所有系统
    broadcastEvent(eventType, data) {
        for (const system of Object.values(this.systems)) {
            if (system && typeof system.handleEvent === 'function') {
                try {
                    system.handleEvent(eventType, data);
                } catch (error) {
                    console.error(`❌ 系统处理事件 ${eventType} 失败:`, error);
                }
            }
        }
    }
    
    // 获取系统
    getSystem(name) {
        return this.systems[name] || null;
    }
    
    // 改变游戏状态
    changeGameState(newState) {
        const oldState = this.gameState;
        this.gameState = newState;
        
        console.log(`🔄 游戏状态改变: ${oldState} -> ${newState}`);
        this.broadcastEvent('statechange', { oldState, newState });
    }
    
    // 显示错误信息
    showError(message) {
        console.error('💥', message);
        
        // 在UI中显示错误
        if (this.systems.ui && typeof this.systems.ui.showError === 'function') {
            this.systems.ui.showError(message);
        } else {
            alert(message); // 备用方案
        }
    }
    
    // 渲染调试信息
    renderDebugInfo() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 300, 150);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${Math.round(1000 / (performance.now() - this.lastTime))}`, 20, 30);
        this.ctx.fillText(`State: ${this.gameState}`, 20, 50);
        this.ctx.fillText(`Camera: (${Math.round(this.camera.x)}, ${Math.round(this.camera.y)})`, 20, 70);
        
        if (this.systems.player) {
            this.ctx.fillText(`Player: (${Math.round(this.systems.player.x)}, ${Math.round(this.systems.player.y)})`, 20, 90);
        }
        
        this.ctx.fillText(`Systems: ${Object.keys(this.systems).length}`, 20, 110);
        this.ctx.fillText(`Keys: [${Object.keys(this.input.keys).filter(k => this.input.keys[k]).join(', ')}]`, 20, 130);
    }
    
    // 切换调试模式
    toggleDebug() {
        this.debug = !this.debug;
        console.log(`🐛 调试模式: ${this.debug ? '开启' : '关闭'}`);
    }
} 