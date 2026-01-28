// 精美像素艺术精灵类
class PixelSprite {
    static createPokemonSprite(type) {
        const sprites = {
            pikachu: {
                pattern: [
                    '        ████████        ',
                    '       ██████████       ',
                    '      ████████████      ',
                    '     ██████████████     ',
                    '    ████████████████    ',
                    '   ██████████████████   ',
                    '  ████████████████████  ',
                    ' ██████████████████████ ',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    ' ██████████████████████ ',
                    '  ████████████████████  ',
                    '   ██████████████████   ',
                    '    ████████████████    ',
                    '     ██████████████     ',
                    '      ████████████      ',
                    '       ██████████       ',
                    '        ████████        '
                ],
                colors: [
                    '        ████████        ',
                    '       ██YYYYYY██       ',
                    '      ██YYYYYYYY██      ',
                    '     ██YYYYYYYYYY██     ',
                    '    ██YYYYYYYYYY██    ',
                    '   ██YYYYYYYYYY██   ',
                    '  ██YYYYYYYYYY██  ',
                    ' ██YYYYYYYYYY██ ',
                    '██YYYYBBYYYY██',
                    '██YYYYBBYYYY██',
                    '██YYBWWBYYY██',
                    '██YYBRRBYY██',
                    '██YYBBBBYY██',
                    ' ██YYYYYYYY██ ',
                    '  ██YYYYYY██  ',
                    '   ██YYYY██   ',
                    '    ██YY██    ',
                    '     ████     ',
                    '      ██      ',
                    '       ██       ',
                    '        ████        '
                ],
                colorMap: {
                    'Y': '#ffdd44',  // 黄色
                    'B': '#2c2c2c',  // 黑色
                    'W': '#ffffff',  // 白色
                    'R': '#ff6b6b',  // 红色腮红
                    '█': '#2c2c2c'   // 轮廓
                }
            },
            charmander: {
                pattern: [
                    '        ████████        ',
                    '       ██████████       ',
                    '      ████████████      ',
                    '     ██████████████     ',
                    '    ████████████████    ',
                    '   ██████████████████   ',
                    '  ████████████████████  ',
                    ' ██████████████████████ ',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    ' ██████████████████████ ',
                    '  ████████████████████  ',
                    '   ██████████████████   ',
                    '    ████████████████    ',
                    '     ██████████████     ',
                    '      ████████████      ',
                    '       ██████████       ',
                    '        ████████        '
                ],
                colors: [
                    '        ████████        ',
                    '       ██OOOOOO██       ',
                    '      ██OOOOOOOO██      ',
                    '     ██OOOOOOOOOO██     ',
                    '    ██OOOOOOOOOO██    ',
                    '   ██OOOOOOOOOO██   ',
                    '  ██OOOOOOOOOO██  ',
                    ' ██OOOOOOOOOO██ ',
                    '██OOOOBBOOOO██',
                    '██OOOOBBOOOO██',
                    '██OOBWWBOOO██',
                    '██OOBRRBOOO██',
                    '██OOBBBBOOO██',
                    ' ██OOOOOOOOO██ ',
                    '  ██YYYYYYY██  ',
                    '   ██YYYYY██   ',
                    '    ██YYY██    ',
                    '     ██Y██     ',
                    '      ███      ',
                    '       ██       ',
                    '        ████        '
                ],
                colorMap: {
                    'O': '#ff6b35',  // 橙色
                    'Y': '#ffdd44',  // 黄色肚子
                    'B': '#2c2c2c',  // 黑色
                    'W': '#ffffff',  // 白色
                    'R': '#ff6b6b',  // 红色
                    '█': '#2c2c2c'   // 轮廓
                }
            },
            squirtle: {
                pattern: [
                    '        ████████        ',
                    '       ██████████       ',
                    '      ████████████      ',
                    '     ██████████████     ',
                    '    ████████████████    ',
                    '   ██████████████████   ',
                    '  ████████████████████  ',
                    ' ██████████████████████ ',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    ' ██████████████████████ ',
                    '  ████████████████████  ',
                    '   ██████████████████   ',
                    '    ████████████████    ',
                    '     ██████████████     ',
                    '      ████████████      ',
                    '       ██████████       ',
                    '        ████████        '
                ],
                colors: [
                    '        ████████        ',
                    '       ██BBBBBB██       ',
                    '      ██BBBBBBBB██      ',
                    '     ██BBBBBBBBBB██     ',
                    '    ██BBBBBBBBBB██    ',
                    '   ██BBBBBBBBBB██   ',
                    '  ██WWWWWWWWWW██  ',
                    ' ██WWWWWWWWWW██ ',
                    '██WWWWWWWWWW██',
                    '██WWBBWWBBWW██',
                    '██WWRRWWRRWW██',
                    '██WWWWWWWWWW██',
                    '██WWWWWWWWWW██',
                    ' ██WWWWWWWWWW██ ',
                    '  ██BBBBBBBB██  ',
                    '   ██BBBBBB██   ',
                    '    ██BBBB██    ',
                    '     ██BB██     ',
                    '      ████      ',
                    '       ██       ',
                    '        ████        '
                ],
                colorMap: {
                    'B': '#4a90e2',  // 蓝色
                    'W': '#ffffff',  // 白色
                    'R': '#ff6b6b',  // 红色
                    '█': '#2c2c2c'   // 轮廓
                }
            },
            bulbasaur: {
                pattern: [
                    '        ████████        ',
                    '       ██████████       ',
                    '      ████████████      ',
                    '     ██████████████     ',
                    '    ████████████████    ',
                    '   ██████████████████   ',
                    '  ████████████████████  ',
                    ' ██████████████████████ ',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    ' ██████████████████████ ',
                    '  ████████████████████  ',
                    '   ██████████████████   ',
                    '    ████████████████    ',
                    '     ██████████████     ',
                    '      ████████████      ',
                    '       ██████████       ',
                    '        ████████        '
                ],
                colors: [
                    '        ████████        ',
                    '       ██GGGGGG██       ',
                    '      ██GGGGGGGG██      ',
                    '     ██GGGGGGGGGG██     ',
                    '    ██GGGGGGGGGG██    ',
                    '   ██DDDDDDDDDD██   ',
                    '  ██DDDDDDDDDD██  ',
                    ' ██DDDDDDDDDD██ ',
                    '██DDDDDDDDDD██',
                    '██DDBBDDBBDD██',
                    '██DDRRDDRRDD██',
                    '██DDDDDDDDDD██',
                    '██GGGGGGGGGG██',
                    ' ██GGGGGGGGGG██ ',
                    '  ██GGGGGGGG██  ',
                    '   ██GGGGGG██   ',
                    '    ██GGGG██    ',
                    '     ██GG██     ',
                    '      ████      ',
                    '       ██       ',
                    '        ████        '
                ],
                colorMap: {
                    'G': '#7ed321',  // 绿色
                    'D': '#4a5d23',  // 深绿色
                    'B': '#2c2c2c',  // 黑色
                    'R': '#ff6b6b',  // 红色
                    '█': '#2c2c2c'   // 轮廓
                }
            },
            mew: {
                pattern: [
                    '        ████████        ',
                    '       ██████████       ',
                    '      ████████████      ',
                    '     ██████████████     ',
                    '    ████████████████    ',
                    '   ██████████████████   ',
                    '  ████████████████████  ',
                    ' ██████████████████████ ',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    ' ██████████████████████ ',
                    '  ████████████████████  ',
                    '   ██████████████████   ',
                    '    ████████████████    ',
                    '     ██████████████     ',
                    '      ████████████      ',
                    '       ██████████       ',
                    '        ████████        '
                ],
                colors: [
                    '        ████████        ',
                    '       ██PPPPPP██       ',
                    '      ██PPPPPPPP██      ',
                    '     ██PPPPPPPPPP██     ',
                    '    ██PPPPPPPPPP██    ',
                    '   ██PPPPPPPPPP██   ',
                    '  ██PPPPPPPPPP██  ',
                    ' ██PPPPPPPPPP██ ',
                    '██PPPPBBPPPP██',
                    '██PPPPBBPPPP██',
                    '██PPBWWBWWBP██',
                    '██PPBLLBLLBP██',
                    '██PPBBBBBBPP██',
                    ' ██PPPPPPPPPP██ ',
                    '  ██PPPPPPPP██  ',
                    '   ██PPPPPP██   ',
                    '    ██PPPP██    ',
                    '     ██PP██     ',
                    '      ████      ',
                    '       ██       ',
                    '        ████        '
                ],
                colorMap: {
                    'P': '#ff1493',  // 粉红色
                    'B': '#2c2c2c',  // 黑色
                    'W': '#ffffff',  // 白色
                    'L': '#87ceeb',  // 蓝色
                    '█': '#2c2c2c'   // 轮廓
                }
            },
            mewtwo: {
                pattern: [
                    '        ████████        ',
                    '       ██████████       ',
                    '      ████████████      ',
                    '     ██████████████     ',
                    '    ████████████████    ',
                    '   ██████████████████   ',
                    '  ████████████████████  ',
                    ' ██████████████████████ ',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    '████████████████████████',
                    ' ██████████████████████ ',
                    '  ████████████████████  ',
                    '   ██████████████████   ',
                    '    ████████████████    ',
                    '     ██████████████     ',
                    '      ████████████      ',
                    '       ██████████       ',
                    '        ████████        '
                ],
                colors: [
                    '        ████████        ',
                    '       ██VVVVVV██       ',
                    '      ██VVVVVVVV██      ',
                    '     ██VVVVVVVVVV██     ',
                    '    ██VVVVVVVVVV██    ',
                    '   ██VVVVVVVVVV██   ',
                    '  ██VVVVVVVVVV██  ',
                    ' ██VVVVVVVVVV██ ',
                    '██VVVVPPVVVV██',
                    '██VVVVPPVVVV██',
                    '██VVPPWWPPVV██',
                    '██VVPPRRPPVV██',
                    '██VVPPPPPPVV██',
                    ' ██VVVVVVVVVV██ ',
                    '  ██VVVVVVVV██  ',
                    '   ██VVVVVV██   ',
                    '    ██VVVV██    ',
                    '     ██VV██     ',
                    '      ████      ',
                    '       ██       ',
                    '        ████        '
                ],
                colorMap: {
                    'V': '#9932cc',  // 紫色
                    'P': '#dda0dd',  // 浅紫色
                    'B': '#2c2c2c',  // 黑色
                    'W': '#ffffff',  // 白色
                    'R': '#ff6b6b',  // 红色
                    '█': '#2c2c2c'   // 轮廓
                }
            },
            enemy: {
                pattern: [
                    '    ████████    ',
                    '   ██████████   ',
                    '  ████████████  ',
                    ' ██████████████ ',
                    '████████████████',
                    '████████████████',
                    '████████████████',
                    '████████████████',
                    '████████████████',
                    '████████████████',
                    ' ██████████████ ',
                    '  ████████████  ',
                    '   ██████████   ',
                    '    ████████    ',
                    '     ██████     ',
                    '      ████      '
                ],
                colors: [
                    '    ████████    ',
                    '   ██RRRRRR██   ',
                    '  ██RRRRRRRR██  ',
                    ' ██RRRRRRRRRR██ ',
                    '██RRRRRRRRRRRR██',
                    '██RRBBRRRRBBR██',
                    '██RRBBRRRRBBR██',
                    '██RRRRRRRRRRRR██',
                    '██RRWWWWWWWWR██',
                    '██RRRRRRRRRRRR██',
                    ' ██RRRRRRRRRR██ ',
                    '  ██RRRRRRRR██  ',
                    '   ██RRRRRR██   ',
                    '    ██RRRR██    ',
                    '     ██RR██     ',
                    '      ████      '
                ],
                colorMap: {
                    'R': '#8b0000',  // 深红色
                    'B': '#2c2c2c',  // 黑色
                    'W': '#ffffff',  // 白色
                    '█': '#2c2c2c'   // 轮廓
                }
            }
        };
        
        return sprites[type] || sprites.pikachu;
    }
    
    static drawSprite(ctx, spriteData, x, y, scale = 1) {
        const pixelSize = 1 * scale;
        const colors = spriteData.colors || spriteData.colorMap;
        
        colors.forEach((row, rowIndex) => {
            for (let col = 0; col < row.length; col++) {
                const char = row[col];
                if (char !== ' ' && spriteData.colorMap[char]) {
                    ctx.fillStyle = spriteData.colorMap[char];
                    ctx.fillRect(
                        x + col * pixelSize,
                        y + rowIndex * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        });
    }
    
    static createTrainerSprite() {
        return {
            colors: [
                '    ████████    ',
                '   ██HHHHHH██   ',
                '  ██HHHHHHHH██  ',
                ' ██HHHHHHHHHH██ ',
                ' ██HHHHHHHHHH██ ',
                ' ██HHHHHHHHHH██ ',
                '  ██SSSSSSSS██  ',
                '  ██SSSSSSSS██  ',
                '  ██SSSSSSSS██  ',
                '  ██SSSSSSSS██  ',
                '  ██SSSSSSSS██  ',
                '   ██LL██LL██   ',
                '   ██LL██LL██   ',
                '  ██LLLLLLLL██  ',
                ' ██LLLLLLLLLL██ ',
                '██LLLLLLLLLLLL██'
            ],
            colorMap: {
                'H': '#f1c40f',  // 头发
                'S': '#e74c3c',  // 衣服
                'L': '#2c3e50',  // 腿部
                '█': '#2c2c2c'   // 轮廓
            }
        };
    }
    
    static drawTrainerSprite(ctx, x, y, scale = 1) {
        const trainerData = this.createTrainerSprite();
        this.drawSprite(ctx, trainerData, x, y, scale);
    }
}

// 游戏主类
class PokemonGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'start';
        this.currentLevel = 1;
        this.score = 0;
        this.pokemonCount = 0;
        this.lives = 3;
        
        // 游戏对象
        this.player = null;
        this.platforms = [];
        this.pokemons = [];
        this.npcs = [];
        this.particles = [];
        this.enemies = [];
        this.projectiles = [];
        this.items = [];
        
        // 游戏机制
        this.keys = {};
        this.dialogSystem = new DialogSystem();
        this.camera = { x: 0, y: 0 };
        this.levelWidth = 2400; // 扩大关卡宽度
        this.levelHeight = 800;
        
        // 计时器
        this.enemySpawnTimer = 0;
        this.powerUpTimer = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initLevel();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Enter' && this.gameState === 'dialog') {
                this.dialogSystem.nextDialog();
            }
            if (e.code === 'Escape') {
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('dialogNext').addEventListener('click', () => {
            this.dialogSystem.nextDialog();
        });
    }
    
    startGame() {
        document.getElementById('startScreen').style.display = 'none';
        this.gameState = 'playing';
        this.showDialog([
            "欢迎来到精美的像素宝可梦世界！",
            "每个宝可梦都经过精心设计，色彩丰富、细节精美！",
            "看那些可爱的皮卡丘、小火龙和杰尼龟...",
            "它们都在等待着你的收集！",
            "使用方向键/WASD移动，空格键跳跃，Z键发射精灵球！",
            "收集所有精美的宝可梦，成为真正的大师！✨"
        ]);
    }
    
    initLevel() {
        // 创建玩家
        this.player = new PixelPlayer(100, 400);
        
        // 创建更复杂的关卡设计
        this.createLevelPlatforms();
        this.createPokemons();
        this.createNPCs();
        this.createEnemies();
        this.createItems();
    }
    
    createLevelPlatforms() {
        this.platforms = [
            // 地面
            new PixelPlatform(0, 550, this.levelWidth, 50, '#654321', 'ground'),
            
            // 第一区域 - 新手区
            new PixelPlatform(200, 450, 200, 20, '#8b4513', 'wood'),
            new PixelPlatform(300, 350, 150, 20, '#8b4513', 'wood'),
            new PixelPlatform(500, 280, 100, 20, '#8b4513', 'wood'),
            
            // 第二区域 - 挑战区
            new PixelPlatform(700, 400, 150, 20, '#696969', 'stone'),
            new PixelPlatform(900, 300, 100, 20, '#696969', 'stone'),
            new PixelPlatform(1100, 200, 150, 20, '#696969', 'stone'),
            new PixelPlatform(1300, 350, 100, 20, '#696969', 'stone'),
            
            // 第三区域 - 高级区
            new PixelPlatform(1500, 450, 200, 20, '#4169e1', 'crystal'),
            new PixelPlatform(1750, 350, 150, 20, '#4169e1', 'crystal'),
            new PixelPlatform(1950, 250, 100, 20, '#4169e1', 'crystal'),
            new PixelPlatform(2150, 150, 150, 20, '#4169e1', 'crystal'),
            
            // 秘密区域
            new PixelPlatform(1200, 100, 100, 20, '#ffd700', 'gold'),
            new PixelPlatform(1800, 50, 100, 20, '#ffd700', 'gold'),
            
            // 移动平台
            new MovingPlatform(600, 200, 100, 20, '#ff69b4', 'magic'),
            new MovingPlatform(1400, 100, 100, 20, '#ff69b4', 'magic'),
        ];
    }
    
    createPokemons() {
        this.pokemons = [
            // 普通宝可梦
            new PixelPokemon(230, 380, 'pikachu', 10),
            new PixelPokemon(430, 280, 'charmander', 15),
            new PixelPokemon(630, 140, 'squirtle', 20),
            new PixelPokemon(930, 230, 'bulbasaur', 25),
            
            // 稀有宝可梦
            new PixelPokemon(1180, 30, 'mew', 50),
            new PixelPokemon(1530, 380, 'mewtwo', 100),
            new PixelPokemon(1930, 180, 'pikachu', 75),
            new PixelPokemon(2180, 80, 'charmander', 80),
            
            // 隐藏宝可梦 - 特别稀有
            new PixelPokemon(1780, -10, 'mew', 200),
        ];
    }
    
    createNPCs() {
        this.npcs = [
            new PixelNPC(500, 500, 'professor', '#2c3e50', [
                "我是大木博士！看看这些精美的宝可梦！",
                "每一个都是像素艺术的杰作，细节丰富！",
                "皮卡丘的黄色，小火龙的橙色...多么美丽！",
                "小心那些红色的敌人，它们会攻击你！",
                "收集这些精美的宝可梦来增强你的力量！✨"
            ]),
            new PixelNPC(1100, 500, 'trainer', '#e74c3c', [
                "我是小智！这些宝可梦实在太精美了！",
                "每一个像素都经过精心设计！",
                "前面的敌人越来越强，要小心！",
                "记住，按Z键可以发射精灵球攻击！",
                "让我们一起收集所有精美的宝可梦吧！🎮"
            ]),
            new PixelNPC(1700, 500, 'sage', '#9b59b6', [
                "我是神秘的贤者...",
                "这些精美的像素宝可梦蕴含着强大的力量...",
                "它们的色彩和细节都是完美的艺术品...",
                "收集所有的宝可梦，挑战最终的boss！",
                "但是...小心，黑暗即将降临...🌟"
            ])
        ];
    }
    
    createEnemies() {
        this.enemies = [
            // 普通敌人
            new PixelEnemy(800, 500, 'grunt', '#8b0000', 30, 1),
            new PixelEnemy(1200, 450, 'grunt', '#8b0000', 30, 1),
            new PixelEnemy(1600, 420, 'soldier', '#dc143c', 50, 2),
            new PixelEnemy(2000, 220, 'soldier', '#dc143c', 50, 2),
            
            // 精英敌人
            new PixelEnemy(1400, 320, 'elite', '#4b0082', 80, 3),
            new PixelEnemy(2100, 120, 'boss', '#191970', 150, 4),
        ];
    }
    
    createItems() {
        this.items = [
            new PowerUp(400, 250, 'health', '#ff6b6b'),
            new PowerUp(800, 200, 'speed', '#4ecdc4'),
            new PowerUp(1300, 50, 'power', '#ffe66d'),
            new PowerUp(1900, 150, 'shield', '#a8e6cf'),
        ];
    }
    
    showDialog(messages) {
        this.gameState = 'dialog';
        this.dialogSystem.showDialog(messages);
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    restartGame() {
        this.gameState = 'playing';
        this.currentLevel = 1;
        this.score = 0;
        this.pokemonCount = 0;
        this.lives = 3;
        this.initLevel();
        this.updateUI();
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // 更新玩家
        this.player.update(this.keys, this.platforms);
        
        // 更新敌人
        this.enemies.forEach((enemy, index) => {
            enemy.update(this.player, this.platforms);
            
            // 敌人攻击玩家
            if (this.checkCollision(this.player, enemy) && !this.player.invulnerable) {
                this.player.takeDamage(enemy.damage);
                this.createParticles(this.player.x, this.player.y, '#ff0000');
                
                if (this.player.health <= 0) {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver();
                    } else {
                        this.player.respawn();
                    }
                }
            }
            
            // 移除死亡的敌人
            if (enemy.health <= 0) {
                this.score += enemy.points;
                this.createParticles(enemy.x, enemy.y, '#00ff00');
                this.enemies.splice(index, 1);
            }
        });
        
        // 更新移动平台
        this.platforms.forEach(platform => {
            if (platform.update) {
                platform.update();
            }
        });
        
        // 更新投射物
        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            
            // 投射物击中敌人
            this.enemies.forEach(enemy => {
                if (this.checkCollision(projectile, enemy)) {
                    enemy.takeDamage(projectile.damage);
                    this.createParticles(projectile.x, projectile.y, '#ffff00');
                    this.projectiles.splice(index, 1);
                }
            });
            
            // 移除超出屏幕的投射物
            if (projectile.x < 0 || projectile.x > this.levelWidth) {
                this.projectiles.splice(index, 1);
            }
        });
        
        // 更新粒子效果
        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        // 玩家射击
        if (this.keys['KeyZ'] && this.player.canShoot) {
            this.projectiles.push(new Projectile(
                this.player.x + this.player.width/2,
                this.player.y + this.player.height/2,
                this.player.facing === 'right' ? 8 : -8,
                0,
                20
            ));
            this.player.canShoot = false;
            this.player.shootCooldown = 15;
        }
        
        // 碰撞检测 - 宝可梦收集
        this.pokemons.forEach((pokemon, index) => {
            if (this.checkCollision(this.player, pokemon)) {
                this.collectPokemon(pokemon);
                this.pokemons.splice(index, 1);
                this.createParticles(pokemon.x, pokemon.y, '#ffdd44');
            }
        });
        
        // 碰撞检测 - 道具收集
        this.items.forEach((item, index) => {
            if (this.checkCollision(this.player, item)) {
                this.collectItem(item);
                this.items.splice(index, 1);
                this.createParticles(item.x, item.y, item.color);
            }
        });
        
        // 碰撞检测 - NPC对话
        this.npcs.forEach(npc => {
            if (this.checkCollision(this.player, npc) && this.keys['Enter']) {
                this.showDialog(npc.messages);
            }
        });
        
        // 动态生成敌人
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer > 600) { // 10秒生成一个敌人
            this.spawnRandomEnemy();
            this.enemySpawnTimer = 0;
        }
        
        // 更新摄像机
        this.updateCamera();
        
        // 检查胜利条件
        if (this.pokemons.length === 0 && this.enemies.length === 0) {
            this.showDialog([
                "🎉 恭喜！你收集了所有精美的宝可梦！",
                "每一个都是像素艺术的杰作！",
                "皮卡丘、小火龙、杰尼龟...它们都被你征服了！",
                "你不仅击败了所有敌人，还成为了真正的宝可梦大师！",
                "这个像素世界因你的勇敢而重获新生！✨🏆"
            ]);
        }
    }
    
    spawnRandomEnemy() {
        const types = ['grunt', 'soldier', 'elite'];
        const type = types[Math.floor(Math.random() * types.length)];
        const x = Math.random() * (this.levelWidth - 100);
        const y = 500;
        
        let health, points;
        switch(type) {
            case 'grunt': health = 30; points = 1; break;
            case 'soldier': health = 50; points = 2; break;
            case 'elite': health = 80; points = 3; break;
        }
        
        this.enemies.push(new PixelEnemy(x, y, type, '#8b0000', health, points));
    }
    
    collectPokemon(pokemon) {
        this.pokemonCount++;
        this.score += pokemon.points;
        this.player.power += 5; // 增加玩家力量
        this.updateUI();
        console.log(`收集了精美的${pokemon.type}！获得${pokemon.points}分！⭐`);
    }
    
    collectItem(item) {
        switch(item.type) {
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + 30);
                break;
            case 'speed':
                this.player.speed = Math.min(8, this.player.speed + 1);
                break;
            case 'power':
                this.player.power += 10;
                break;
            case 'shield':
                this.player.shield = true;
                this.player.shieldTime = 300;
                break;
        }
        this.updateUI();
    }
    
    gameOver() {
        this.showDialog([
            "游戏结束！",
            "你的冒险就此结束...",
            "但是不要放弃！",
            "重新开始，成为真正的宝可梦大师！"
        ]);
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    updateCamera() {
        this.camera.x = this.player.x - this.canvas.width / 2;
        this.camera.y = this.player.y - this.canvas.height / 2;
        
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.levelWidth - this.canvas.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.levelHeight - this.canvas.height));
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // 绘制背景
        this.drawPixelBackground();
        
        // 绘制平台
        this.platforms.forEach(platform => platform.draw(this.ctx));
        
        // 绘制宝可梦
        this.pokemons.forEach(pokemon => pokemon.draw(this.ctx));
        
        // 绘制道具
        this.items.forEach(item => item.draw(this.ctx));
        
        // 绘制NPC
        this.npcs.forEach(npc => npc.draw(this.ctx));
        
        // 绘制敌人
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // 绘制投射物
        this.projectiles.forEach(projectile => projectile.draw(this.ctx));
        
        // 绘制玩家
        this.player.draw(this.ctx);
        
        // 绘制粒子效果
        this.particles.forEach(particle => particle.draw(this.ctx));
        
        this.ctx.restore();
        
        // 绘制UI
        this.drawUI();
    }
    
    drawPixelBackground() {
        // 绘制像素风背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.levelHeight);
        gradient.addColorStop(0, '#191970');
        gradient.addColorStop(0.5, '#483d8b');
        gradient.addColorStop(1, '#2f4f4f');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.levelWidth, this.levelHeight);
        
        // 绘制星星
        this.drawPixelStars();
    }
    
    drawPixelStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137) % this.levelWidth;
            const y = (i * 73) % 200;
            this.ctx.fillRect(x, y, 2, 2);
        }
    }
    
    drawUI() {
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2);
        }
        
        // 绘制血条
        this.drawHealthBar();
        
        // 绘制分数
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`分数: ${this.score}`, 10, 30);
        this.ctx.fillText(`生命: ${this.lives}`, 10, 50);
        this.ctx.fillText(`力量: ${this.player.power}`, 10, 70);
    }
    
    drawHealthBar() {
        const barWidth = 200;
        const barHeight = 20;
        const x = this.canvas.width - barWidth - 10;
        const y = 10;
        
        // 背景
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(x, y, barWidth, barHeight);
        
        // 血条
        const healthPercent = this.player.health / this.player.maxHealth;
        this.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
        this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
        
        // 边框
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.strokeRect(x, y, barWidth, barHeight);
    }
    
    updateUI() {
        document.getElementById('playerHealth').textContent = this.player.health;
        document.getElementById('pokemonCount').textContent = this.pokemonCount;
        document.getElementById('currentLevel').textContent = this.currentLevel;
        document.getElementById('playerLives').textContent = this.lives;
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 像素玩家类
class PixelPlayer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 48;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 4;
        this.jumpPower = -14;
        this.onGround = false;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.facing = 'right';
        this.power = 10;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.canShoot = true;
        this.shootCooldown = 0;
        this.shield = false;
        this.shieldTime = 0;
        this.animationFrame = 0;
        this.isMoving = false;
    }
    
    update(keys, platforms) {
        this.isMoving = false;
        
        // 水平移动
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.velocityX = -this.speed;
            this.facing = 'left';
            this.isMoving = true;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            this.velocityX = this.speed;
            this.facing = 'right';
            this.isMoving = true;
        } else {
            this.velocityX *= 0.8; // 摩擦力
        }
        
        // 跳跃
        if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && this.onGround) {
            this.velocityY = this.jumpPower;
            this.onGround = false;
        }
        
        // 应用重力
        this.velocityY += 0.6;
        
        // 更新位置
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 平台碰撞检测
        this.onGround = false;
        platforms.forEach(platform => {
            if (this.checkCollision(platform)) {
                if (this.velocityY > 0) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                }
            }
        });
        
        // 边界检测
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > 2400) this.x = 2400 - this.width;
        if (this.y > 800) {
            this.takeDamage(20);
            this.y = 100;
        }
        
        // 更新无敌时间
        if (this.invulnerable) {
            this.invulnerabilityTime--;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // 更新射击冷却
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        } else {
            this.canShoot = true;
        }
        
        // 更新护盾
        if (this.shield) {
            this.shieldTime--;
            if (this.shieldTime <= 0) {
                this.shield = false;
            }
        }
        
        // 更新动画帧
        this.animationFrame++;
    }
    
    takeDamage(damage) {
        if (this.invulnerable || this.shield) return;
        
        this.health -= damage;
        this.invulnerable = true;
        this.invulnerabilityTime = 60;
        
        if (this.health <= 0) {
            this.health = 0;
        }
    }
    
    respawn() {
        this.x = 100;
        this.y = 400;
        this.health = this.maxHealth;
        this.velocityX = 0;
        this.velocityY = 0;
        this.invulnerable = true;
        this.invulnerabilityTime = 120;
    }
    
    checkCollision(platform) {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y < platform.y + platform.height &&
               this.y + this.height > platform.y;
    }
    
    draw(ctx) {
        ctx.save();
        
        // 无敌闪烁效果
        if (this.invulnerable && Math.floor(this.animationFrame / 5) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // 护盾效果
        if (this.shield) {
            ctx.save();
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.strokeRect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);
            ctx.restore();
        }
        
        // 绘制像素角色
        PixelSprite.drawTrainerSprite(ctx, this.x, this.y, 1.5);
        
        // 绘制方向指示器
        if (this.isMoving) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.facing === 'right' ? '→' : '←', this.x + this.width/2, this.y - 10);
        }
        
        // 绘制力量等级指示器
        if (this.power > 20) {
            ctx.save();
            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 5;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('★', this.x + this.width/2, this.y - 5);
            ctx.restore();
        }
        
        ctx.restore();
    }
}

// 像素平台类
class PixelPlatform {
    constructor(x, y, width, height, color, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
    }
    
    draw(ctx) {
        // 绘制平台纹理
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 添加像素纹理
        this.drawPixelTexture(ctx);
        
        // 边框
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    drawPixelTexture(ctx) {
        const pixelSize = 4;
        for (let x = this.x; x < this.x + this.width; x += pixelSize) {
            for (let y = this.y; y < this.y + this.height; y += pixelSize) {
                if (Math.random() > 0.7) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                }
            }
        }
    }
}

// 移动平台类
class MovingPlatform extends PixelPlatform {
    constructor(x, y, width, height, color, type) {
        super(x, y, width, height, color, type);
        this.startX = x;
        this.moveDistance = 200;
        this.speed = 1;
        this.direction = 1;
    }
    
    update() {
        this.x += this.speed * this.direction;
        
        if (this.x > this.startX + this.moveDistance || this.x < this.startX) {
            this.direction *= -1;
        }
    }
}

// 像素宝可梦类
class PixelPokemon {
    constructor(x, y, type, points) {
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 48;
        this.type = type;
        this.points = points;
        this.bobOffset = 0;
        this.animationFrame = 0;
        this.sparkleTimer = 0;
    }
    
    draw(ctx) {
        this.bobOffset += 0.08;
        this.animationFrame++;
        this.sparkleTimer++;
        const bobY = this.y + Math.sin(this.bobOffset) * 2;
        
        // 绘制多层光环效果
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#ffdd44';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, bobY + this.height/2, this.width/2 + 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, bobY + this.height/2, this.width/2 + 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // 绘制精美的宝可梦精灵
        const spriteData = PixelSprite.createPokemonSprite(this.type);
        PixelSprite.drawSprite(ctx, spriteData, this.x + 4, bobY + 4, 1.5);
        
        // 绘制闪烁效果
        if (this.sparkleTimer % 120 < 60) {
            this.drawSparkles(ctx, this.x + this.width/2, bobY + this.height/2);
        }
        
        // 绘制名字标签
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x + this.width/2 - 30, bobY - 15, 60, 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type.toUpperCase(), this.x + this.width/2, bobY - 6);
        ctx.restore();
        
        // 绘制分数标签
        ctx.save();
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.fillRect(this.x + this.width/2 - 15, bobY + this.height + 5, 30, 12);
        ctx.fillStyle = '#2c2c2c';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`+${this.points}`, this.x + this.width/2, bobY + this.height + 14);
        ctx.restore();
    }
    
    drawSparkles(ctx, centerX, centerY) {
        ctx.save();
        ctx.fillStyle = '#ffff00';
        
        // 绘制4个小闪烁点
        for (let i = 0; i < 4; i++) {
            const angle = (this.sparkleTimer * 0.1) + (i * Math.PI / 2);
            const radius = 25 + Math.sin(this.sparkleTimer * 0.05) * 5;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制十字闪烁
            ctx.fillRect(x - 4, y - 1, 8, 2);
            ctx.fillRect(x - 1, y - 4, 2, 8);
        }
        
        ctx.restore();
    }
}

// 像素敌人类
class PixelEnemy {
    constructor(x, y, type, color, health, damage) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.type = type;
        this.color = color;
        this.maxHealth = health;
        this.health = health;
        this.damage = damage;
        this.points = damage * 10;
        this.speed = 1 + damage * 0.5;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.attackCooldown = 0;
        this.animationFrame = 0;
    }
    
    update(player, platforms) {
        this.animationFrame++;
        
        // 简单的AI行为
        const distanceToPlayer = Math.abs(this.x - player.x);
        
        if (distanceToPlayer < 200) {
            // 靠近玩家
            this.direction = this.x < player.x ? 1 : -1;
        } else {
            // 随机移动
            if (Math.random() < 0.01) {
                this.direction *= -1;
            }
        }
        
        // 移动
        this.x += this.speed * this.direction;
        
        // 边界检测
        if (this.x < 0 || this.x > 2400 - this.width) {
            this.direction *= -1;
        }
        
        // 平台碰撞检测
        let onGround = false;
        platforms.forEach(platform => {
            if (this.checkCollision(platform)) {
                this.y = platform.y - this.height;
                onGround = true;
            }
        });
        
        // 简单的重力
        if (!onGround) {
            this.y += 2;
        }
        
        // 攻击冷却
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
        }
    }
    
    checkCollision(platform) {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y < platform.y + platform.height &&
               this.y + this.height > platform.y;
    }
    
    draw(ctx) {
        // 绘制敌人
        const spriteData = PixelSprite.createPokemonSprite('enemy');
        PixelSprite.drawSprite(ctx, spriteData, this.x, this.y, 1);
        
        // 绘制血条
        const barWidth = this.width;
        const barHeight = 4;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.x, this.y - 8, barWidth, barHeight);
        
        ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : '#F44336';
        ctx.fillRect(this.x, this.y - 8, barWidth * healthPercent, barHeight);
        
        // 绘制类型标识
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type, this.x + this.width/2, this.y - 12);
    }
}

// 像素NPC类
class PixelNPC {
    constructor(x, y, type, color, messages) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.type = type;
        this.color = color;
        this.messages = messages;
        this.animationFrame = 0;
    }
    
    draw(ctx) {
        this.animationFrame++;
        
        // 绘制光环效果
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#4a90e2';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2 + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // 绘制NPC
        PixelSprite.drawTrainerSprite(ctx, this.x, this.y, 1.5);
        
        // 绘制交互提示
        if (Math.floor(this.animationFrame / 30) % 2) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(this.x + this.width/2 - 40, this.y - 25, 80, 15);
            ctx.fillStyle = '#2c2c2c';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('按Enter对话', this.x + this.width/2, this.y - 13);
            ctx.restore();
        }
        
        // 绘制名字标签
        ctx.save();
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.fillRect(this.x + this.width/2 - 30, this.y + this.height + 5, 60, 15);
        ctx.fillStyle = '#2c2c2c';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type.toUpperCase(), this.x + this.width/2, this.y + this.height + 16);
        ctx.restore();
    }
}

// 投射物类
class Projectile {
    constructor(x, y, velocityX, velocityY, damage) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.damage = damage;
        this.width = 8;
        this.height = 8;
        this.life = 120;
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.life--;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 发光效果
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 道具类
class PowerUp {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.color = color;
        this.bobOffset = 0;
        this.animationFrame = 0;
    }
    
    draw(ctx) {
        this.bobOffset += 0.1;
        this.animationFrame++;
        const bobY = this.y + Math.sin(this.bobOffset) * 3;
        
        // 绘制光环
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, bobY + this.height/2, this.width, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // 绘制道具
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, bobY, this.width, this.height);
        
        // 绘制符号
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        let symbol = '';
        switch(this.type) {
            case 'health': symbol = '+'; break;
            case 'speed': symbol = '»'; break;
            case 'power': symbol = '★'; break;
            case 'shield': symbol = '◆'; break;
        }
        ctx.fillText(symbol, this.x + this.width/2, bobY + this.height/2 + 5);
    }
}

// 粒子效果类
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * 8;
        this.velocityY = (Math.random() - 0.5) * 8;
        this.color = color;
        this.life = 40;
        this.maxLife = 40;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += 0.1;
        this.life--;
        this.size *= 0.98;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 对话系统类
class DialogSystem {
    constructor() {
        this.currentMessages = [];
        this.currentIndex = 0;
        this.isActive = false;
    }
    
    showDialog(messages) {
        this.currentMessages = messages;
        this.currentIndex = 0;
        this.isActive = true;
        this.displayCurrentMessage();
        document.getElementById('dialogBox').classList.remove('hidden');
    }
    
    displayCurrentMessage() {
        if (this.currentIndex < this.currentMessages.length) {
            document.getElementById('dialogText').textContent = this.currentMessages[this.currentIndex];
        }
    }
    
    nextDialog() {
        this.currentIndex++;
        if (this.currentIndex >= this.currentMessages.length) {
            this.closeDialog();
        } else {
            this.displayCurrentMessage();
        }
    }
    
    closeDialog() {
        this.isActive = false;
        document.getElementById('dialogBox').classList.add('hidden');
        game.gameState = 'playing';
    }
}

// 启动游戏
let game;
window.addEventListener('load', () => {
    game = new PokemonGame();
}); 