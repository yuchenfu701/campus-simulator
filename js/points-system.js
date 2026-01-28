/**
 * 校园积分系统 - 核心模块
 * 管理学生积分、奖励兑换、虚拟形象等功能
 */

class PointsSystem {
    constructor() {
        this.currentUser = null;
        this.pointsData = this.loadPointsData();
        
        console.log('🎮 积分系统初始化');
    }
    
    // ==================== 数据存储与加载 ====================
    
    /**
     * 加载积分数据
     */
    loadPointsData() {
        const saved = localStorage.getItem('campus_points_system');
        let data;
        
        if (saved) {
            data = JSON.parse(saved);
        } else {
            // 初始化默认数据
            data = {
            // 学生数据
            students: {
                'student_001': {
                    id: 'student_001',
                    name: '玩家',
                    class: '初一(1)班',
                    points: 100, // 初始积分
                    totalEarned: 100,
                    avatar: {
                        hair: 'default',
                        clothes: 'uniform',
                        glasses: 'none',
                        hat: 'none',
                        background: 'classroom'
                    },
                    inventory: [], // 已拥有的物品
                    equipped: {}, // 已装备的物品
                    achievements: [], // 成就
                    pointsHistory: [
                        {
                            date: new Date().toISOString(),
                            amount: 100,
                            reason: '新手礼包',
                            type: 'earn',
                            teacher: '系统'
                        }
                    ],
                    exchangeHistory: []
                }
            },
            
            // 积分规则配置
            pointsRules: {
                '听写全对': 10,
                '作业优秀': 5,
                '课堂发言': 2,
                '帮助同学': 3,
                '考试进步': 20,
                '完美出勤': 5,
                '课堂纪律优秀': 3,
                '作业整洁': 2,
                '积极参与活动': 8,
                '拾金不昧': 10
            },
            
            // 奖励物品库
            rewardItems: [
                // 虚拟物品 - 发型（作为基础形象，会替换默认头像）
                { id: 'hair_short', name: '清爽短发', type: 'hair', price: 40, category: 'virtual', image: '👦', stock: -1, description: '清爽利落的短发造型' },
                { id: 'hair_long', name: '飘逸长发', type: 'hair', price: 40, category: 'virtual', image: '👨', stock: -1, description: '柔顺飘逸的长发' },
                { id: 'hair_ponytail', name: '活力马尾', type: 'hair', price: 60, category: 'virtual', image: '👧', stock: -1, description: '充满活力的马尾辫' },
                { id: 'hair_curly', name: '时尚卷发', type: 'hair', price: 60, category: 'virtual', image: '🧑‍🦱', stock: -1, description: '时尚个性的卷发' },
                { id: 'hair_rainbow', name: '🌈彩虹发色', type: 'hair', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '炫彩夺目的彩虹发色' },
                { id: 'hair_glow', name: '✨发光发型', type: 'hair', price: 200, category: 'virtual', image: '✨', stock: -1, description: '自带光效的炫酷发型' },
                
                // 虚拟物品 - 眼镜（作为装饰，叠加在头像上）
                { id: 'glasses_sun', name: '酷炫墨镜', type: 'glasses', price: 50, category: 'virtual', image: '🕶️', stock: -1, description: '超级酷的墨镜' },
                { id: 'glasses_round', name: '圆框眼镜', type: 'glasses', price: 30, category: 'virtual', image: '👓', stock: -1, description: '知识分子的标配' },
                { id: 'glasses_gold', name: '💎黄金眼镜', type: 'glasses', price: 200, category: 'virtual', image: '💎', stock: -1, description: '奢华黄金眼镜，彰显尊贵' },
                { id: 'glasses_rainbow', name: '🌈彩虹眼镜', type: 'glasses', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '炫彩彩虹渐变眼镜' },
                
                // 虚拟物品 - 帽子（作为装饰，叠加在头像上）
                { id: 'hat_cap', name: '运动帽', type: 'hat', price: 36, category: 'virtual', image: '🧢', stock: -1, description: '时尚运动帽' },
                { id: 'hat_wizard', name: '学霸帽', type: 'hat', price: 100, category: 'virtual', image: '🎓', stock: -1, description: '象征智慧的学霸帽' },
                { id: 'hat_crown', name: '尊贵皇冠', type: 'hat', price: 200, category: 'virtual', image: '👑', stock: -1, description: '尊贵的皇冠' },
                { id: 'hat_diamond', name: '💎钻石王冠', type: 'hat', price: 200, category: 'virtual', image: '💎', stock: -1, description: '镶嵌钻石的奢华王冠' },
                { id: 'hat_angel', name: '👼天使光环', type: 'hat', price: 200, category: 'virtual', image: '👼', stock: -1, description: '神圣的天使光环' },
                { id: 'hat_star', name: '⭐星空帽', type: 'hat', price: 200, category: 'virtual', image: '⭐', stock: -1, description: '闪烁星空的魔法帽' },
                
                // 虚拟物品 - 称号
                { id: 'title_star', name: '⭐学习之星', type: 'title', price: 200, category: 'virtual', image: '⭐', stock: -1, description: '闪耀的学习之星称号' },
                { id: 'title_king', name: '👑听写大王', type: 'title', price: 200, category: 'virtual', image: '👑', stock: -1, description: '听写永远不会错' },
                { id: 'title_legend', name: '🌟传奇学霸', type: 'title', price: 200, category: 'virtual', image: '🌟', stock: -1, description: '传说中的学霸称号' },
                { id: 'title_god', name: '⚡学神', type: 'title', price: 200, category: 'virtual', image: '⚡', stock: -1, description: '超越学霸的存在' },
                { id: 'title_rainbow', name: '🌈彩虹传说', type: 'title', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '最稀有的彩虹传说称号' },
                
                // 虚拟物品 - 背景
                { id: 'bg_library', name: '图书馆背景', type: 'background', price: 80, category: 'virtual', image: '📚', stock: -1, description: '书香满溢的图书馆' },
                { id: 'bg_space', name: '太空背景', type: 'background', price: 120, category: 'virtual', image: '🌌', stock: -1, description: '浩瀚宇宙背景' },
                { id: 'bg_rainbow', name: '🌈彩虹天空', type: 'background', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '梦幻彩虹天空背景' },
                { id: 'bg_diamond', name: '💎钻石宫殿', type: 'background', price: 200, category: 'virtual', image: '💎', stock: -1, description: '奢华钻石宫殿背景' },
                { id: 'bg_galaxy', name: '🌠银河系', type: 'background', price: 200, category: 'virtual', image: '🌠', stock: -1, description: '壮观的银河系背景' },
                { id: 'bg_golden', name: '✨黄金殿堂', type: 'background', price: 200, category: 'virtual', image: '✨', stock: -1, description: '金碧辉煌的黄金殿堂' },
                
                // 虚拟物品 - 特效
                { id: 'effect_sparkle', name: '✨星光特效', type: 'effect', price: 200, category: 'virtual', image: '✨', stock: -1, description: '环绕的星光特效' },
                { id: 'effect_rainbow', name: '🌈彩虹特效', type: 'effect', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '绚烂的彩虹光效' },
                { id: 'effect_fire', name: '🔥火焰特效', type: 'effect', price: 200, category: 'virtual', image: '🔥', stock: -1, description: '燃烧的火焰特效' },
                { id: 'effect_diamond', name: '💎钻石雨', type: 'effect', price: 200, category: 'virtual', image: '💎', stock: -1, description: '下落的钻石雨特效' },
                
                // 实物奖励
                { id: 'snack_chips', name: '薯片一包', type: 'snack', price: 60, category: 'real', image: '🍟', stock: 10, description: '美味的薯片' },
                { id: 'snack_candy', name: '糖果礼盒', type: 'snack', price: 100, category: 'real', image: '🍬', stock: 8, description: '甜蜜的糖果' },
                { id: 'snack_premium', name: '🍰高级蛋糕', type: 'snack', price: 200, category: 'real', image: '🍰', stock: 5, description: '精致的高级蛋糕' },
                { id: 'snack_gift', name: '🎁豪华零食大礼包', type: 'snack', price: 200, category: 'real', image: '🎁', stock: 3, description: '超值豪华零食大礼包' },
                
                { id: 'stationery_pen', name: '精美笔记本', type: 'stationery', price: 80, category: 'real', image: '📓', stock: 15, description: '精美的笔记本' },
                { id: 'stationery_pencil', name: '自动铅笔套装', type: 'stationery', price: 70, category: 'real', image: '✏️', stock: 12, description: '高级自动铅笔' },
                { id: 'stationery_premium', name: '💎钻石笔', type: 'stationery', price: 200, category: 'real', image: '💎', stock: 5, description: '奢华钻石装饰的笔' },
                { id: 'stationery_gold', name: '✨黄金文具套装', type: 'stationery', price: 200, category: 'real', image: '✨', stock: 3, description: '24K黄金文具套装' },
                
                { id: 'toy_figure', name: '迷你手办', type: 'toy', price: 160, category: 'real', image: '🎁', stock: 5, description: '可爱的迷你手办' },
                { id: 'toy_premium', name: '🌟限量手办', type: 'toy', price: 200, category: 'real', image: '🌟', stock: 2, description: '限量版精美手办' },
                { id: 'toy_gold', name: '💎黄金手办', type: 'toy', price: 200, category: 'real', image: '💎', stock: 1, description: '纯金打造的收藏级手办' },
                
                // 新增豪华商品
                { id: 'luxury_watch', name: '⌚智能手表', type: 'luxury', price: 200, category: 'real', image: '⌚', stock: 2, description: '最新款智能手表' },
                { id: 'luxury_tablet', name: '📱平板电脑', type: 'luxury', price: 200, category: 'real', image: '📱', stock: 1, description: '高性能平板电脑' },
                { id: 'luxury_headphone', name: '🎧顶级耳机', type: 'luxury', price: 200, category: 'real', image: '🎧', stock: 3, description: '专业级降噪耳机' },
                { id: 'luxury_bike', name: '🚲山地自行车', type: 'luxury', price: 200, category: 'real', image: '🚲', stock: 1, description: '专业级山地自行车' },
                { id: 'luxury_game', name: '🎮游戏主机', type: 'luxury', price: 200, category: 'real', image: '🎮', stock: 1, description: '最新款游戏主机' },
                
                // 新增20种商品
                // 虚拟物品 - 发型扩展
                { id: 'hair_spike', name: '🔥刺猬头', type: 'hair', price: 50, category: 'virtual', image: '🔥', stock: -1, description: '酷炫的刺猬头发型' },
                { id: 'hair_wave', name: '🌊波浪卷', type: 'hair', price: 60, category: 'virtual', image: '🌊', stock: -1, description: '优雅的波浪卷发' },
                { id: 'hair_bob', name: '💇波波头', type: 'hair', price: 45, category: 'virtual', image: '💇', stock: -1, description: '经典的波波头造型' },
                
                // 虚拟物品 - 眼镜扩展
                { id: 'glasses_cat', name: '😸猫眼眼镜', type: 'glasses', price: 80, category: 'virtual', image: '😸', stock: -1, description: '可爱的猫眼造型眼镜' },
                { id: 'glasses_3d', name: '🎬3D眼镜', type: 'glasses', price: 60, category: 'virtual', image: '🎬', stock: -1, description: '科技感十足的3D眼镜' },
                { id: 'glasses_heart', name: '💕爱心眼镜', type: 'glasses', price: 100, category: 'virtual', image: '💕', stock: -1, description: '浪漫的爱心造型眼镜' },
                
                // 虚拟物品 - 帽子扩展
                { id: 'hat_beanie', name: '🎩毛线帽', type: 'hat', price: 40, category: 'virtual', image: '🎩', stock: -1, description: '温暖的毛线帽' },
                { id: 'hat_helmet', name: '⛑️安全帽', type: 'hat', price: 50, category: 'virtual', image: '⛑️', stock: -1, description: '安全第一的安全帽' },
                { id: 'hat_party', name: '🎉派对帽', type: 'hat', price: 55, category: 'virtual', image: '🎉', stock: -1, description: '欢乐的派对帽' },
                
                // 虚拟物品 - 称号扩展
                { id: 'title_hero', name: '🦸超级英雄', type: 'title', price: 200, category: 'virtual', image: '🦸', stock: -1, description: '超级英雄称号' },
                { id: 'title_ninja', name: '🥷忍者', type: 'title', price: 180, category: 'virtual', image: '🥷', stock: -1, description: '神秘的忍者称号' },
                { id: 'title_wizard', name: '🧙魔法师', type: 'title', price: 200, category: 'virtual', image: '🧙', stock: -1, description: '强大的魔法师称号' },
                
                // 虚拟物品 - 背景扩展
                { id: 'bg_beach', name: '🏖️海滩', type: 'background', price: 100, category: 'virtual', image: '🏖️', stock: -1, description: '阳光海滩背景' },
                { id: 'bg_forest', name: '🌲森林', type: 'background', price: 90, category: 'virtual', image: '🌲', stock: -1, description: '神秘森林背景' },
                { id: 'bg_city', name: '🌆城市夜景', type: 'background', price: 120, category: 'virtual', image: '🌆', stock: -1, description: '繁华城市夜景' },
                
                // 虚拟物品 - 特效扩展
                { id: 'effect_snow', name: '❄️雪花', type: 'effect', price: 100, category: 'virtual', image: '❄️', stock: -1, description: '飘落的雪花特效' },
                { id: 'effect_stars', name: '⭐星星', type: 'effect', price: 90, category: 'virtual', image: '⭐', stock: -1, description: '闪烁的星星特效' },
                { id: 'effect_butterfly', name: '🦋蝴蝶', type: 'effect', price: 110, category: 'virtual', image: '🦋', stock: -1, description: '飞舞的蝴蝶特效' },
                
                // 实物奖励扩展
                { id: 'snack_chocolate', name: '🍫巧克力', type: 'snack', price: 50, category: 'real', image: '🍫', stock: 6, description: '香浓的巧克力' },
                { id: 'stationery_ruler', name: '📏尺子套装', type: 'stationery', price: 30, category: 'real', image: '📏', stock: 10, description: '精美的尺子套装' }
            ],
            
            // 任务配置
            dailyTasks: [
                { id: 'login', name: '每日登录', points: 5, description: '每天登录系统获得积分' },
                { id: 'homework', name: '完成作业', points: 10, description: '按时完成当天作业' },
                { id: 'reading', name: '阅读30分钟', points: 8, description: '课外阅读30分钟' }
            ],
            
            // 成就配置
            achievements: [
                { id: 'points_100', name: '积分新手', icon: '🌟', description: '累计获得100积分', requirement: 100 },
                { id: 'points_500', name: '积分达人', icon: '⭐', description: '累计获得500积分', requirement: 500 },
                { id: 'points_1000', name: '积分大师', icon: '💎', description: '累计获得1000积分', requirement: 1000 },
                { id: 'exchange_first', name: '首次兑换', icon: '🎁', description: '完成第一次兑换', requirement: 1 },
                { id: 'exchange_10', name: '兑换达人', icon: '🛍️', description: '累计兑换10次', requirement: 10 }
            ],
            
            // 排行榜数据
            leaderboard: []
        };
        }
        
        // 无论数据是从localStorage加载还是新创建的，都使用代码中的最新商品列表
        // 这样可以确保新添加的商品总是可用，而不受localStorage中旧数据的影响
        const latestRewardItems = [
            // 虚拟物品 - 发型（作为基础形象，会替换默认头像）
            { id: 'hair_short', name: '清爽短发', type: 'hair', price: 40, category: 'virtual', image: '👦', stock: -1, description: '清爽利落的短发造型' },
            { id: 'hair_long', name: '飘逸长发', type: 'hair', price: 40, category: 'virtual', image: '👨', stock: -1, description: '柔顺飘逸的长发' },
            { id: 'hair_ponytail', name: '活力马尾', type: 'hair', price: 60, category: 'virtual', image: '👧', stock: -1, description: '充满活力的马尾辫' },
            { id: 'hair_curly', name: '时尚卷发', type: 'hair', price: 60, category: 'virtual', image: '🧑‍🦱', stock: -1, description: '时尚个性的卷发' },
            { id: 'hair_rainbow', name: '🌈彩虹发色', type: 'hair', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '炫彩夺目的彩虹发色' },
            { id: 'hair_glow', name: '✨发光发型', type: 'hair', price: 200, category: 'virtual', image: '✨', stock: -1, description: '自带光效的炫酷发型' },
            { id: 'hair_spike', name: '🔥刺猬头', type: 'hair', price: 50, category: 'virtual', image: '🔥', stock: -1, description: '酷炫的刺猬头发型' },
            { id: 'hair_wave', name: '🌊波浪卷', type: 'hair', price: 60, category: 'virtual', image: '🌊', stock: -1, description: '优雅的波浪卷发' },
            { id: 'hair_bob', name: '💇波波头', type: 'hair', price: 45, category: 'virtual', image: '💇', stock: -1, description: '经典的波波头造型' },
            
            // 虚拟物品 - 眼镜（作为装饰，叠加在头像上）
            { id: 'glasses_sun', name: '酷炫墨镜', type: 'glasses', price: 50, category: 'virtual', image: '🕶️', stock: -1, description: '超级酷的墨镜' },
            { id: 'glasses_round', name: '圆框眼镜', type: 'glasses', price: 30, category: 'virtual', image: '👓', stock: -1, description: '知识分子的标配' },
            { id: 'glasses_gold', name: '💎黄金眼镜', type: 'glasses', price: 200, category: 'virtual', image: '💎', stock: -1, description: '奢华黄金眼镜，彰显尊贵' },
            { id: 'glasses_rainbow', name: '🌈彩虹眼镜', type: 'glasses', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '炫彩彩虹渐变眼镜' },
            { id: 'glasses_cat', name: '😸猫眼眼镜', type: 'glasses', price: 80, category: 'virtual', image: '😸', stock: -1, description: '可爱的猫眼造型眼镜' },
            { id: 'glasses_3d', name: '🎬3D眼镜', type: 'glasses', price: 60, category: 'virtual', image: '🎬', stock: -1, description: '科技感十足的3D眼镜' },
            { id: 'glasses_heart', name: '💕爱心眼镜', type: 'glasses', price: 100, category: 'virtual', image: '💕', stock: -1, description: '浪漫的爱心造型眼镜' },
            
            // 虚拟物品 - 帽子（作为装饰，叠加在头像上）
            { id: 'hat_cap', name: '运动帽', type: 'hat', price: 36, category: 'virtual', image: '🧢', stock: -1, description: '时尚运动帽' },
            { id: 'hat_wizard', name: '学霸帽', type: 'hat', price: 100, category: 'virtual', image: '🎓', stock: -1, description: '象征智慧的学霸帽' },
            { id: 'hat_crown', name: '尊贵皇冠', type: 'hat', price: 200, category: 'virtual', image: '👑', stock: -1, description: '尊贵的皇冠' },
            { id: 'hat_diamond', name: '💎钻石王冠', type: 'hat', price: 200, category: 'virtual', image: '💎', stock: -1, description: '镶嵌钻石的奢华王冠' },
            { id: 'hat_angel', name: '👼天使光环', type: 'hat', price: 200, category: 'virtual', image: '👼', stock: -1, description: '神圣的天使光环' },
            { id: 'hat_star', name: '⭐星空帽', type: 'hat', price: 200, category: 'virtual', image: '⭐', stock: -1, description: '闪烁星空的魔法帽' },
            { id: 'hat_beanie', name: '🎩毛线帽', type: 'hat', price: 40, category: 'virtual', image: '🎩', stock: -1, description: '温暖的毛线帽' },
            { id: 'hat_helmet', name: '⛑️安全帽', type: 'hat', price: 50, category: 'virtual', image: '⛑️', stock: -1, description: '安全第一的安全帽' },
            { id: 'hat_party', name: '🎉派对帽', type: 'hat', price: 55, category: 'virtual', image: '🎉', stock: -1, description: '欢乐的派对帽' },
            
            // 虚拟物品 - 称号
            { id: 'title_star', name: '⭐学习之星', type: 'title', price: 200, category: 'virtual', image: '⭐', stock: -1, description: '闪耀的学习之星称号' },
            { id: 'title_king', name: '👑听写大王', type: 'title', price: 200, category: 'virtual', image: '👑', stock: -1, description: '听写永远不会错' },
            { id: 'title_legend', name: '🌟传奇学霸', type: 'title', price: 200, category: 'virtual', image: '🌟', stock: -1, description: '传说中的学霸称号' },
            { id: 'title_god', name: '⚡学神', type: 'title', price: 200, category: 'virtual', image: '⚡', stock: -1, description: '超越学霸的存在' },
            { id: 'title_rainbow', name: '🌈彩虹传说', type: 'title', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '最稀有的彩虹传说称号' },
            { id: 'title_hero', name: '🦸超级英雄', type: 'title', price: 200, category: 'virtual', image: '🦸', stock: -1, description: '超级英雄称号' },
            { id: 'title_ninja', name: '🥷忍者', type: 'title', price: 180, category: 'virtual', image: '🥷', stock: -1, description: '神秘的忍者称号' },
            { id: 'title_wizard', name: '🧙魔法师', type: 'title', price: 200, category: 'virtual', image: '🧙', stock: -1, description: '强大的魔法师称号' },
            
            // 虚拟物品 - 背景
            { id: 'bg_library', name: '图书馆背景', type: 'background', price: 80, category: 'virtual', image: '📚', stock: -1, description: '书香满溢的图书馆' },
            { id: 'bg_space', name: '太空背景', type: 'background', price: 120, category: 'virtual', image: '🌌', stock: -1, description: '浩瀚宇宙背景' },
            { id: 'bg_rainbow', name: '🌈彩虹天空', type: 'background', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '梦幻彩虹天空背景' },
            { id: 'bg_diamond', name: '💎钻石宫殿', type: 'background', price: 200, category: 'virtual', image: '💎', stock: -1, description: '奢华钻石宫殿背景' },
            { id: 'bg_galaxy', name: '🌠银河系', type: 'background', price: 200, category: 'virtual', image: '🌠', stock: -1, description: '壮观的银河系背景' },
            { id: 'bg_golden', name: '✨黄金殿堂', type: 'background', price: 200, category: 'virtual', image: '✨', stock: -1, description: '金碧辉煌的黄金殿堂' },
            { id: 'bg_beach', name: '🏖️海滩', type: 'background', price: 100, category: 'virtual', image: '🏖️', stock: -1, description: '阳光海滩背景' },
            { id: 'bg_forest', name: '🌲森林', type: 'background', price: 90, category: 'virtual', image: '🌲', stock: -1, description: '神秘森林背景' },
            { id: 'bg_city', name: '🌆城市夜景', type: 'background', price: 120, category: 'virtual', image: '🌆', stock: -1, description: '繁华城市夜景' },
            
            // 虚拟物品 - 特效
            { id: 'effect_sparkle', name: '✨星光特效', type: 'effect', price: 200, category: 'virtual', image: '✨', stock: -1, description: '环绕的星光特效' },
            { id: 'effect_rainbow', name: '🌈彩虹特效', type: 'effect', price: 200, category: 'virtual', image: '🌈', stock: -1, description: '绚烂的彩虹光效' },
            { id: 'effect_fire', name: '🔥火焰特效', type: 'effect', price: 200, category: 'virtual', image: '🔥', stock: -1, description: '燃烧的火焰特效' },
            { id: 'effect_diamond', name: '💎钻石雨', type: 'effect', price: 200, category: 'virtual', image: '💎', stock: -1, description: '下落的钻石雨特效' },
            { id: 'effect_snow', name: '❄️雪花', type: 'effect', price: 100, category: 'virtual', image: '❄️', stock: -1, description: '飘落的雪花特效' },
            { id: 'effect_stars', name: '⭐星星', type: 'effect', price: 90, category: 'virtual', image: '⭐', stock: -1, description: '闪烁的星星特效' },
            { id: 'effect_butterfly', name: '🦋蝴蝶', type: 'effect', price: 110, category: 'virtual', image: '🦋', stock: -1, description: '飞舞的蝴蝶特效' },
            
            // 实物奖励
            { id: 'snack_chips', name: '薯片一包', type: 'snack', price: 60, category: 'real', image: '🍟', stock: 10, description: '美味的薯片' },
            { id: 'snack_candy', name: '糖果礼盒', type: 'snack', price: 100, category: 'real', image: '🍬', stock: 8, description: '甜蜜的糖果' },
            { id: 'snack_premium', name: '🍰高级蛋糕', type: 'snack', price: 200, category: 'real', image: '🍰', stock: 5, description: '精致的高级蛋糕' },
            { id: 'snack_gift', name: '🎁豪华零食大礼包', type: 'snack', price: 200, category: 'real', image: '🎁', stock: 3, description: '超值豪华零食大礼包' },
            { id: 'snack_chocolate', name: '🍫巧克力', type: 'snack', price: 50, category: 'real', image: '🍫', stock: 6, description: '香浓的巧克力' },
            
            { id: 'stationery_pen', name: '精美笔记本', type: 'stationery', price: 80, category: 'real', image: '📓', stock: 15, description: '精美的笔记本' },
            { id: 'stationery_pencil', name: '自动铅笔套装', type: 'stationery', price: 70, category: 'real', image: '✏️', stock: 12, description: '高级自动铅笔' },
            { id: 'stationery_premium', name: '💎钻石笔', type: 'stationery', price: 200, category: 'real', image: '💎', stock: 5, description: '奢华钻石装饰的笔' },
            { id: 'stationery_gold', name: '✨黄金文具套装', type: 'stationery', price: 200, category: 'real', image: '✨', stock: 3, description: '24K黄金文具套装' },
            { id: 'stationery_ruler', name: '📏尺子套装', type: 'stationery', price: 30, category: 'real', image: '📏', stock: 10, description: '精美的尺子套装' },
            
            { id: 'toy_figure', name: '迷你手办', type: 'toy', price: 160, category: 'real', image: '🎁', stock: 5, description: '可爱的迷你手办' },
            { id: 'toy_premium', name: '🌟限量手办', type: 'toy', price: 200, category: 'real', image: '🌟', stock: 2, description: '限量版精美手办' },
            { id: 'toy_gold', name: '💎黄金手办', type: 'toy', price: 200, category: 'real', image: '💎', stock: 1, description: '纯金打造的收藏级手办' },
            
            // 新增豪华商品
            { id: 'luxury_watch', name: '⌚智能手表', type: 'luxury', price: 200, category: 'real', image: '⌚', stock: 2, description: '最新款智能手表' },
            { id: 'luxury_tablet', name: '📱平板电脑', type: 'luxury', price: 200, category: 'real', image: '📱', stock: 1, description: '高性能平板电脑' },
            { id: 'luxury_headphone', name: '🎧顶级耳机', type: 'luxury', price: 200, category: 'real', image: '🎧', stock: 3, description: '专业级降噪耳机' },
            { id: 'luxury_bike', name: '🚲山地自行车', type: 'luxury', price: 200, category: 'real', image: '🚲', stock: 1, description: '专业级山地自行车' },
            { id: 'luxury_game', name: '🎮游戏主机', type: 'luxury', price: 200, category: 'real', image: '🎮', stock: 1, description: '最新款游戏主机' }
        ];
        
        // 更新商品列表为最新版本（保留库存状态）
        if (data.rewardItems) {
            // 对于实物商品，保留原有的库存状态
            latestRewardItems.forEach(latestItem => {
                if (latestItem.category === 'real') {
                    const existingItem = data.rewardItems.find(item => item.id === latestItem.id);
                    if (existingItem && existingItem.stock !== undefined) {
                        latestItem.stock = existingItem.stock;
                    }
                }
            });
        }
        
        // 使用最新的商品列表
        data.rewardItems = latestRewardItems;
        
        return data;
    }
    
    /**
     * 保存积分数据
     */
    savePointsData() {
        localStorage.setItem('campus_points_system', JSON.stringify(this.pointsData));
        console.log('💾 积分数据已保存');
    }
    
    // ==================== 用户管理 ====================
    
    /**
     * 设置当前用户
     */
    setCurrentUser(studentId) {
        if (this.pointsData.students[studentId]) {
            this.currentUser = studentId;
            console.log(`👤 当前用户: ${this.pointsData.students[studentId].name}`);
            return true;
        }
        return false;
    }
    
    /**
     * 获取当前用户数据
     */
    getCurrentStudent(studentId = null) {
        const targetUserId = studentId || this.currentUser;
        if (!targetUserId) return null;
        
        const student = this.pointsData.students[targetUserId];
        if (student && !student.completedTasks) {
            // 初始化已完成任务列表
            student.completedTasks = {};
        }
        return student;
    }
    
    // ==================== 积分管理 ====================
    
    /**
     * 获取学生当前积分
     */
    getPoints(studentId = this.currentUser) {
        const student = this.pointsData.students[studentId];
        return student ? student.points : 0;
    }
    
    /**
     * 增加积分
     */
    addPoints(studentId, amount, reason, teacher = '系统') {
        const student = this.pointsData.students[studentId];
        if (!student) return false;
        
        // 确保 pointsHistory 数组存在
        if (!student.pointsHistory) {
            student.pointsHistory = [];
            console.log('⚠️ 初始化 pointsHistory 数组');
        }
        
        student.points += amount;
        student.totalEarned += amount;
        
        // 记录积分历史
        student.pointsHistory.push({
            date: new Date().toISOString(),
            amount: amount,
            reason: reason,
            type: 'earn',
            teacher: teacher
        });
        
        this.savePointsData();
        this.checkAchievements(studentId);
        this.updateLeaderboard();
        
        console.log(`✅ ${student.name} 获得 ${amount} 积分 (原因: ${reason})`);
        return true;
    }
    
    /**
     * 扣除积分
     */
    deductPoints(studentId, amount, reason) {
        const student = this.pointsData.students[studentId];
        if (!student || student.points < amount) return false;
        
        // 确保 pointsHistory 数组存在
        if (!student.pointsHistory) {
            student.pointsHistory = [];
            console.log('⚠️ 初始化 pointsHistory 数组');
        }
        
        student.points -= amount;
        
        // 记录积分历史
        student.pointsHistory.push({
            date: new Date().toISOString(),
            amount: -amount,
            reason: reason,
            type: 'spend'
        });
        
        this.savePointsData();
        
        console.log(`💸 ${student.name} 消费 ${amount} 积分 (原因: ${reason})`);
        return true;
    }
    
    /**
     * 获取积分历史
     */
    getPointsHistory(studentId = this.currentUser, limit = 20) {
        const student = this.pointsData.students[studentId];
        if (!student) return [];
        
        return student.pointsHistory.slice(-limit).reverse();
    }
    
    // ==================== 奖励兑换 ====================
    
    /**
     * 获取所有奖励物品
     */
    getRewardItems(category = 'all') {
        if (category === 'all') {
            return this.pointsData.rewardItems;
        }
        return this.pointsData.rewardItems.filter(item => item.category === category);
    }
    
    /**
     * 兑换奖励
     */
    exchangeReward(studentId, itemId) {
        const student = this.pointsData.students[studentId];
        const item = this.pointsData.rewardItems.find(i => i.id === itemId);
        
        if (!student || !item) {
            return { success: false, message: '学生或物品不存在' };
        }
        
        // 确保必要的数组存在
        if (!student.inventory) {
            student.inventory = [];
            console.log('⚠️ 初始化 inventory 数组');
        }
        if (!student.exchangeHistory) {
            student.exchangeHistory = [];
            console.log('⚠️ 初始化 exchangeHistory 数组');
        }
        
        // 检查积分是否足够
        if (student.points < item.price) {
            return { success: false, message: '积分不足' };
        }
        
        // 检查库存（实物商品）
        if (item.category === 'real' && item.stock <= 0) {
            return { success: false, message: '库存不足' };
        }
        
        // 扣除积分
        this.deductPoints(studentId, item.price, `兑换: ${item.name}`);
        
        // 减少库存
        if (item.category === 'real' && item.stock > 0) {
            item.stock--;
        }
        
        // 添加到背包
        student.inventory.push({
            itemId: item.id,
            name: item.name,
            type: item.type,
            category: item.category,
            exchangeDate: new Date().toISOString(),
            status: item.category === 'real' ? 'pending' : 'received'
        });
        
        // 记录兑换历史
        student.exchangeHistory.push({
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            date: new Date().toISOString(),
            status: item.category === 'real' ? 'pending' : 'completed'
        });
        
        this.savePointsData();
        this.checkAchievements(studentId);
        
        console.log(`🎁 ${student.name} 兑换了 ${item.name}`);
        
        return { 
            success: true, 
            message: item.category === 'real' ? '兑换成功，请找老师领取' : '兑换成功',
            item: item
        };
    }
    
    /**
     * 装备虚拟物品
     */
    equipItem(studentId, itemId) {
        const student = this.pointsData.students[studentId];
        const item = this.pointsData.rewardItems.find(i => i.id === itemId);
        
        if (!student || !item) return false;
        
        // 检查是否拥有该物品
        const hasItem = student.inventory.some(i => i.itemId === itemId);
        if (!hasItem) return false;
        
        // 装备物品
        if (item.type === 'hair') {
            student.avatar.hair = itemId;
        } else if (item.type === 'glasses') {
            student.avatar.glasses = itemId;
        } else if (item.type === 'hat') {
            student.avatar.hat = itemId;
        } else if (item.type === 'background') {
            student.avatar.background = itemId;
        }
        
        student.equipped[item.type] = itemId;
        
        this.savePointsData();
        console.log(`👔 ${student.name} 装备了 ${item.name}`);
        return true;
    }
    
    // ==================== 排行榜 ====================
    
    /**
     * 更新排行榜
     */
    updateLeaderboard() {
        const students = Object.values(this.pointsData.students);
        this.pointsData.leaderboard = students
            .sort((a, b) => b.totalEarned - a.totalEarned)
            .slice(0, 50)
            .map((student, index) => ({
                rank: index + 1,
                name: student.name,
                class: student.class,
                totalPoints: student.totalEarned,
                currentPoints: student.points
            }));
    }
    
    /**
     * 获取排行榜
     */
    getLeaderboard(limit = 10) {
        return this.pointsData.leaderboard.slice(0, limit);
    }
    
    // ==================== 成就系统 ====================
    
    /**
     * 检查成就
     */
    checkAchievements(studentId) {
        const student = this.pointsData.students[studentId];
        if (!student) return;
        
        // 确保 achievements 数组存在
        if (!student.achievements) {
            student.achievements = [];
            console.log('⚠️ 初始化 achievements 数组');
        }
        
        // 确保 exchangeHistory 数组存在（检查成就时需要）
        if (!student.exchangeHistory) {
            student.exchangeHistory = [];
        }
        
        this.pointsData.achievements.forEach(achievement => {
            // 如果已获得该成就，跳过
            if (student.achievements.includes(achievement.id)) return;
            
            let unlocked = false;
            
            // 检查不同类型的成就
            if (achievement.id.startsWith('points_')) {
                unlocked = student.totalEarned >= achievement.requirement;
            } else if (achievement.id.startsWith('exchange_')) {
                unlocked = student.exchangeHistory.length >= achievement.requirement;
            }
            
            // 解锁成就
            if (unlocked) {
                student.achievements.push(achievement.id);
                console.log(`🏆 ${student.name} 解锁成就: ${achievement.name}`);
                
                // 成就奖励
                this.addPoints(studentId, 10, `成就奖励: ${achievement.name}`, '系统');
            }
        });
    }
    
    /**
     * 获取学生成就
     */
    getAchievements(studentId = this.currentUser) {
        const student = this.pointsData.students[studentId];
        if (!student) return [];
        
        // 确保 achievements 数组存在
        if (!student.achievements) {
            student.achievements = [];
        }
        
        return this.pointsData.achievements.map(achievement => ({
            ...achievement,
            unlocked: student.achievements.includes(achievement.id)
        }));
    }
    
    // ==================== 任务系统 ====================
    
    /**
     * 完成每日任务
     */
    completeDailyTask(studentId, taskId) {
        const task = this.pointsData.dailyTasks.find(t => t.id === taskId);
        if (!task) return false;
        
        // 检查任务是否已完成
        const student = this.getCurrentStudent(studentId);
        if (!student) return false;
        
        // 初始化已完成任务列表
        if (!student.completedTasks) {
            student.completedTasks = {};
        }
        
        // 检查今天是否已完成
        const today = new Date().toDateString();
        if (student.completedTasks[taskId] === today) {
            console.log('⚠️ 该任务今天已完成');
            return false;
        }
        
        // 标记任务为已完成（记录日期）
        student.completedTasks[taskId] = today;
        
        // 发放积分
        this.addPoints(studentId, task.points, `完成任务: ${task.name}`, '系统');
        
        // 保存数据
        this.savePointsData();
        
        console.log(`✅ 任务完成: ${task.name}，获得 ${task.points} 积分`);
        return true;
    }
    
    /**
     * 检查任务是否已完成
     */
    isTaskCompleted(studentId, taskId) {
        const student = this.getCurrentStudent(studentId);
        if (!student || !student.completedTasks) return false;
        
        const today = new Date().toDateString();
        return student.completedTasks[taskId] === today;
    }
    
    /**
     * 获取每日任务列表（带完成状态）
     */
    getDailyTasks(studentId = this.currentUser) {
        if (!studentId) return [];
        
        return this.pointsData.dailyTasks.map(task => {
            const completed = this.isTaskCompleted(studentId, task.id);
            return {
                ...task,
                completed: completed
            };
        });
    }
}

// 导出为全局变量
window.PointsSystem = PointsSystem;

