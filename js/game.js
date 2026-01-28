/**
 * 爱哲安民未来学校校园生活模拟器 - 主程序
 * 初始化和管理整个游戏系统
 */

class SchoolSimulator {
    constructor() {
        this.engine = null;
        this.isInitialized = false;
        this.isRunning = false;
        
        // 版本信息
        this.version = '2.0.0';
        this.buildDate = new Date().toISOString();
        
        console.log(`🎮 爱哲安民未来学校校园生活模拟器 v${this.version}`);
        console.log(`📅 构建时间: ${this.buildDate}`);
    }
    
    // 初始化游戏
    async init() {
        try {
            console.log('🚀 开始初始化校园模拟器...');
            
            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // 初始化游戏引擎
            await this.initGameEngine();
            
            // 绑定UI事件
            this.bindUIEvents();
            
            // 设置错误处理
            this.setupErrorHandling();
            
            // 显示加载完成信息
            this.showWelcomeMessage();
            
            this.isInitialized = true;
            console.log('✅ 校园模拟器初始化完成！');
            
            return true;
            
        } catch (error) {
            console.error('❌ 校园模拟器初始化失败:', error);
            this.showError('游戏初始化失败，请刷新页面重试', error);
            return false;
        }
    }
    
    // 初始化游戏引擎
    async initGameEngine() {
        console.log('🔧 正在初始化游戏引擎...');
        
        this.engine = new GameEngine();
        
        if (!this.engine) {
            throw new Error('游戏引擎创建失败');
        }
        
        // 初始化引擎
        const success = await this.engine.init();
        if (!success) {
            throw new Error('游戏引擎初始化失败');
        }
        
        // 启动游戏循环
        this.engine.start();
        
        console.log('✅ 游戏引擎初始化完成');
    }
    
    // 绑定UI事件
    bindUIEvents() {
        console.log('🔗 绑定UI事件...');
        
        // 控制按钮事件
        this.bindControlButtons();
        
        // 模态窗口事件
        this.bindModalEvents();
        
        // 键盘快捷键
        this.bindKeyboardShortcuts();
        
        // 窗口事件
        this.bindWindowEvents();
        
        console.log('✅ UI事件绑定完成');
    }
    
    // 绑定控制按钮
    bindControlButtons() {
        // 背包按钮
        const inventoryBtn = document.getElementById('inventory-btn');
        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => this.toggleInventory());
        }
        
        // 地图按钮
        const mapBtn = document.getElementById('map-btn');
        if (mapBtn) {
            mapBtn.addEventListener('click', () => this.toggleMap());
        }
        
        // 保存按钮
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveGame());
        }
        
        // 加载按钮
        const loadBtn = document.getElementById('load-btn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.loadGame());
        }
        
        // 设置按钮
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.toggleSettings());
        }
        
        // 调试按钮
        const debugBtn = document.getElementById('debug-btn');
        if (debugBtn) {
            debugBtn.addEventListener('click', () => this.toggleDebug());
        }
    }
    
    // 绑定模态窗口事件
    bindModalEvents() {
        // 关闭按钮
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });
        
        // 点击外部关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }
    
    // 绑定键盘快捷键
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 只在游戏运行时处理快捷键
            if (!this.isRunning || !this.engine) return;
            
            // 检查是否在输入框中
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.key.toLowerCase()) {
                case 'i':
                    e.preventDefault();
                    this.toggleInventory();
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleMap();
                    break;
                case 'escape':
                    e.preventDefault();
                    this.handleEscape();
                    break;
                case 'f1':
                    e.preventDefault();
                    this.showHelp();
                    break;
                case 'f5':
                    e.preventDefault();
                    this.saveGame();
                    break;
                case 'f9':
                    e.preventDefault();
                    this.loadGame();
                    break;
                case 'f12':
                    e.preventDefault();
                    this.toggleDebug();
                    break;
            }
        });
    }
    
    // 绑定窗口事件
    bindWindowEvents() {
        // 窗口失去焦点时暂停游戏
        window.addEventListener('blur', () => {
            if (this.isRunning && this.engine) {
                this.pauseGame();
            }
        });
        
        // 窗口获得焦点时恢复游戏
        window.addEventListener('focus', () => {
            if (this.engine && this.engine.gameState === 'paused') {
                this.resumeGame();
            }
        });
        
        // 页面卸载时保存游戏
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
    }
    
    // 开始游戏
    start() {
        if (!this.isInitialized) {
            console.error('❌ 无法开始游戏：未初始化');
            return false;
        }
        
        if (this.isRunning) {
            console.warn('⚠️ 游戏已在运行中');
            return false;
        }
        
        this.isRunning = true;
        
        if (this.engine) {
            this.engine.changeGameState('playing');
        }
        
        console.log('🎮 游戏开始！');
        return true;
    }
    
    // 暂停游戏
    pauseGame() {
        if (this.engine) {
            this.engine.changeGameState('paused');
        }
        console.log('⏸️ 游戏已暂停');
    }
    
    // 恢复游戏
    resumeGame() {
        if (this.engine) {
            this.engine.changeGameState('playing');
        }
        console.log('▶️ 游戏已恢复');
    }
    
    // 停止游戏
    stop() {
        this.isRunning = false;
        
        if (this.engine) {
            this.engine.stop();
        }
        
        console.log('⏹️ 游戏已停止');
    }
    
    // 切换背包
    toggleInventory() {
        const modal = document.getElementById('inventory-modal');
        if (modal) {
            this.toggleModal('inventory-modal');
            this.updateInventoryDisplay();
        }
    }
    
    // 切换地图
    toggleMap() {
        const modal = document.getElementById('map-modal');
        if (modal) {
            this.toggleModal('map-modal');
            this.updateMapDisplay();
        }
    }
    
    // 切换设置
    toggleSettings() {
        this.toggleModal('settings-modal');
    }
    
    // 切换调试模式
    toggleDebug() {
        if (this.engine) {
            this.engine.toggleDebug();
        }
    }
    
    // 处理ESC键
    handleEscape() {
        // 检查是否有打开的模态窗口
        const openModal = document.querySelector('.modal:not(.hidden)');
        if (openModal) {
            this.hideModal(openModal.id);
            return;
        }
        
        // 切换游戏菜单
        this.toggleModal('game-menu-modal');
    }
    
    // 显示帮助
    showHelp() {
        this.toggleModal('help-modal');
    }
    
    // 切换模态窗口
    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        if (modal.classList.contains('hidden')) {
            this.showModal(modalId);
        } else {
            this.hideModal(modalId);
        }
    }
    
    // 显示模态窗口
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('hidden');
        
        // 暂停游戏（如果不是设置或帮助窗口）
        if (!['settings-modal', 'help-modal'].includes(modalId) && this.engine) {
            this.engine.changeGameState('paused');
        }
    }
    
    // 隐藏模态窗口
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.add('hidden');
        
        // 恢复游戏（如果没有其他模态窗口打开）
        const openModals = document.querySelectorAll('.modal:not(.hidden)');
        if (openModals.length === 0 && this.engine && this.isRunning) {
            this.engine.changeGameState('playing');
        }
    }
    
    // 更新背包显示
    updateInventoryDisplay() {
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList || !this.engine) return;
        
        const player = this.engine.getSystem('player');
        if (!player) return;
        
        inventoryList.innerHTML = '';
        
        // 显示金钱
        const moneyElement = document.createElement('div');
        moneyElement.className = 'inventory-money';
        moneyElement.innerHTML = `💰 金钱: ${player.inventory.money}元`;
        inventoryList.appendChild(moneyElement);
        
        // 显示物品
        if (player.inventory.items.length === 0) {
            const emptyElement = document.createElement('div');
            emptyElement.className = 'inventory-empty';
            emptyElement.textContent = '背包空空如也...';
            inventoryList.appendChild(emptyElement);
            return;
        }
        
        player.inventory.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.innerHTML = `
                <div class="item-icon">${item.icon || '📦'}</div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-description">${item.description || ''}</div>
                </div>
                <button class="use-item-btn" data-item-id="${item.id}">使用</button>
            `;
            inventoryList.appendChild(itemElement);
        });
        
        // 绑定使用物品事件
        inventoryList.querySelectorAll('.use-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                this.useItem(itemId);
            });
        });
    }
    
    // 更新地图显示
    updateMapDisplay() {
        const mapCanvas = document.getElementById('map-canvas');
        if (!mapCanvas || !this.engine) return;
        
        const ctx = mapCanvas.getContext('2d');
        const mapSystem = this.engine.getSystem('map');
        const player = this.engine.getSystem('player');
        
        if (!mapSystem || !player) return;
        
        // 设置画布大小
        mapCanvas.width = 400;
        mapCanvas.height = 300;
        
        // 清空画布
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
        
        // 绘制地图（简化版本）
        if (typeof mapSystem.renderMiniMap === 'function') {
            mapSystem.renderMiniMap(ctx, mapCanvas.width, mapCanvas.height);
        }
        
        // 绘制玩家位置
        const scale = mapCanvas.width / this.engine.world.width;
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(
            player.x * scale,
            player.y * scale,
            4, 0, Math.PI * 2
        );
        ctx.fill();
    }
    
    // 使用物品
    useItem(itemId) {
        const player = this.engine?.getSystem('player');
        if (!player) return;
        
        const success = player.useItem(itemId);
        if (success) {
            this.updateInventoryDisplay();
            this.showMessage('物品使用成功！');
        } else {
            this.showMessage('无法使用该物品');
        }
    }
    
    // 保存游戏
    saveGame() {
        try {
            if (!this.engine) {
                throw new Error('游戏引擎未初始化');
            }
            
            const saveSystem = this.engine.getSystem('save');
            if (saveSystem && typeof saveSystem.save === 'function') {
                const success = saveSystem.save();
                if (success) {
                    this.showMessage('游戏保存成功！');
                    console.log('💾 游戏保存成功');
                } else {
                    throw new Error('保存系统调用失败');
                }
            } else {
                // 备用保存方案
                this.manualSave();
            }
            
        } catch (error) {
            console.error('❌ 保存游戏失败:', error);
            this.showError('保存失败，请重试', error);
        }
    }
    
    // 手动保存（备用方案）
    manualSave() {
        const saveData = {
            version: this.version,
            timestamp: Date.now(),
            gameData: {}
        };
        
        // 收集各系统数据
        const systems = ['player', 'time', 'academic', 'relationship'];
        systems.forEach(systemName => {
            const system = this.engine.getSystem(systemName);
            if (system && typeof system.saveData === 'function') {
                saveData.gameData[systemName] = system.saveData();
            }
        });
        
        localStorage.setItem('schoolSimulator_save', JSON.stringify(saveData));
        this.showMessage('游戏保存成功！');
        console.log('💾 手动保存完成');
    }
    
    // 加载游戏
    loadGame() {
        try {
            const saveSystem = this.engine?.getSystem('save');
            if (saveSystem && typeof saveSystem.load === 'function') {
                const success = saveSystem.load();
                if (success) {
                    this.showMessage('游戏加载成功！');
                    console.log('📂 游戏加载成功');
                } else {
                    throw new Error('加载系统调用失败');
                }
            } else {
                // 备用加载方案
                this.manualLoad();
            }
            
        } catch (error) {
            console.error('❌ 加载游戏失败:', error);
            this.showError('加载失败，可能没有存档或存档已损坏', error);
        }
    }
    
    // 手动加载（备用方案）
    manualLoad() {
        const saveData = localStorage.getItem('schoolSimulator_save');
        if (!saveData) {
            throw new Error('没有找到存档');
        }
        
        const data = JSON.parse(saveData);
        
        // 版本检查
        if (data.version !== this.version) {
            console.warn('⚠️ 存档版本不匹配，可能存在兼容性问题');
        }
        
        // 加载各系统数据
        if (data.gameData) {
            for (const [systemName, systemData] of Object.entries(data.gameData)) {
                const system = this.engine.getSystem(systemName);
                if (system && typeof system.loadData === 'function') {
                    system.loadData(systemData);
                }
            }
        }
        
        this.showMessage('游戏加载成功！');
        console.log('📂 手动加载完成');
    }
    
    // 设置错误处理
    setupErrorHandling() {
        // 全局错误处理
        window.addEventListener('error', (e) => {
            console.error('💥 全局错误:', e.error);
            this.showError('游戏运行出错', e.error);
        });
        
        // Promise错误处理
        window.addEventListener('unhandledrejection', (e) => {
            console.error('💥 未处理的Promise错误:', e.reason);
            this.showError('游戏运行出错', e.reason);
        });
    }
    
    // 显示欢迎消息
    showWelcomeMessage() {
        const messages = [
            '🎓 欢迎来到爱哲安民未来学校！',
            '📚 在这里开始你的校园生活吧！',
            '🎮 使用WASD键移动，E键交互',
            '💡 按F1查看完整帮助'
        ];
        
        messages.forEach((message, index) => {
            setTimeout(() => {
                this.showMessage(message);
            }, index * 2000);
        });
    }
    
    // 显示消息
    showMessage(message) {
        console.log('📢', message);
        
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        
        // 添加到页面
        const container = document.getElementById('message-container') || document.body;
        container.appendChild(messageElement);
        
        // 自动移除
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }
    
    // 显示错误
    showError(message, error = null) {
        console.error('💥', message, error);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'game-error';
        errorElement.innerHTML = `
            <div class="error-title">❌ ${message}</div>
            ${error ? `<div class="error-details">${error.message || error}</div>` : ''}
        `;
        
        const container = document.getElementById('message-container') || document.body;
        container.appendChild(errorElement);
        
        // 手动关闭
        errorElement.addEventListener('click', () => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        });
        
        // 自动关闭
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 10000);
    }
    
    // 获取游戏状态
    getGameState() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            isRunning: this.isRunning,
            engine: this.engine ? {
                gameState: this.engine.gameState,
                systems: Object.keys(this.engine.systems)
            } : null
        };
    }
}

// 全局游戏实例
window.schoolSimulator = null;

// 导出游戏实例到全局
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 初始化校园模拟器...');
    window.simulator = new SchoolSimulator();
    await window.simulator.init();
    window.simulator.start();
    
    // 打印调试信息，确认simulator可被访问
    console.log('✅ 校园模拟器已就绪，全局访问: window.simulator');
    
    // 确保canvas获得焦点
    setTimeout(() => {
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.focus();
            console.log('🎯 自动聚焦到游戏画布');
        }
    }, 2000);
}); 