/**
 * 爱哲安民未来学校校园地图系统
 * 管理校园布局、区域、NPC和交互对象
 */

class SchoolMap {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // 地图尺寸（横向大地图）
        this.width = 2400;
        this.height = 1400;
        
        // 校园区域
        this.areas = {};
        
        // NPC管理
        this.npcs = {};
        
        // 交互对象
        this.interactables = {};
        
        // 碰撞检测数据
        this.collisionMap = [];
        
        // 地图资源
        this.textures = {};

        // 预生成草地纹理点（避免每帧 Math.random() 导致闪烁）
        this.grassDots = [];

        // 初始化地图
        this.initializeMap();
        this._initGrassDots();
    }

    // 预生成全图草地点位
    _initGrassDots() {
        for (let x = 0; x < this.width; x += 30) {
            for (let y = 0; y < this.height; y += 30) {
                if (Math.random() < 0.4) {
                    this.grassDots.push({
                        x: x + Math.random() * 15,
                        y: y + Math.random() * 15
                    });
                }
            }
        }
    }
    
    // 初始化方法
    async init() {
        console.log('🗺️ 初始化校园地图系统');
        
        // 生成碰撞地图
        this.generateCollisionMap();
        
        // 初始化NPCs
        this.initializeNPCs();
        
        // 初始化交互对象
        this.initializeInteractables();
        
        return true;
    }
    
    // 初始化地图布局（横向大地图，严格按照平面图）
    initializeMap() {
        // === 左侧教室区域（放大2倍）===
        
        // 顶部第一排
        this.areas['studio'] = {
            id: 'studio',
            name: '创造力实验室',
            x: 80, y: 80, width: 180, height: 120,
            background: '#FFE4E1',
            description: '创造力实验室，创新思维的摇篮',
            npcs: ['陈子墨'],
            interactions: []
        };
        
        this.areas['male_toilet'] = {
            id: 'male_toilet',
            name: '男厕所',
            x: 280, y: 80, width: 120, height: 120,
            background: '#B0C4DE',
            description: '男生卫生间',
            npcs: [],
            interactions: []
        };
        
        this.areas['broadcast'] = {
            id: 'broadcast',
            name: '女厕所',
            x: 420, y: 80, width: 150, height: 130,
            background: '#FFB6C1',
            description: '女生卫生间',
            npcs: [],
            interactions: []
        };
        
        // 体育器材室
        this.areas['sports_equipment'] = {
            id: 'sports_equipment',
            name: '体育器材室',
            x: 850, y: 40, width: 120, height: 80,
            background: '#4A6FA5',
            description: '体育器材存放室',
            npcs: [],
            interactions: []
        };
        
        // 广播室
        this.areas['broadcast_room'] = {
            id: 'broadcast_room',
            name: '广播室',
            x: 990, y: 40, width: 120, height: 80,
            background: '#DDA0DD',
            description: '学校广播站',
            npcs: [],
            interactions: []
        };
        
        // 主席台
        this.areas['stage_platform'] = {
            id: 'stage_platform',
            name: '主席台',
            x: 1130, y: 40, width: 140, height: 80,
            background: '#FFFFFF',
            description: '主席台',
            npcs: [],
            interactions: []
        };
        
        // 第一排教室（G1区域）
        this.areas['g1_2'] = {
            id: 'g1_2',
            name: 'G1-2',
            x: 80, y: 220, width: 140, height: 110,
            background: '#E6E6FA',
            description: 'G1-2教室',
            npcs: [],
            interactions: []
        };
        
        this.areas['art_classroom'] = {
            id: 'art_classroom',
            name: '艺术教室',
            x: 240, y: 220, width: 140, height: 110,
            background: '#FFE4E1',
            description: '艺术教室',
            npcs: ['语文林老师'],
            interactions: [],
            specialPage: './office-art.html'  // 点击E键时跳转到艺术楼办公室页面
        };
        
        this.areas['g1_1'] = {
            id: 'g1_1',
            name: 'G1-1',
            x: 400, y: 220, width: 140, height: 110,
            background: '#E6E6FA',
            description: 'G1-1教室',
            npcs: [],
            interactions: []
        };
        
        // 第二排教室（G2-G3）
        this.areas['g3'] = {
            id: 'g3',
            name: 'G3',
            x: 80, y: 350, width: 140, height: 100,
            background: '#F0E68C',
            description: 'G3教室',
            npcs: [],
            interactions: [] // 暂无实际功能
        };
        
        this.areas['g2_2'] = {
            id: 'g2_2',
            name: 'G2-2',
            x: 240, y: 350, width: 110, height: 100,
            background: '#FFE4B5',
            description: '初二2班教室',
            npcs: [],
            interactions: [] // 暂无实际功能
        };
        
        this.areas['g2_1'] = {
            id: 'g2_1',
            name: 'G2-1',
            x: 370, y: 350, width: 170, height: 100,
            background: '#FFE4B5',
            description: '初二1班教室',
            npcs: ['数学王老师'],
            interactions: [] // 暂无实际功能
        };
        
        // 第三排（G4-G6）
        this.areas['g5'] = {
            id: 'g5',
            name: 'G5',
            x: 80, y: 470, width: 100, height: 110,
            background: '#E6E6FA',
            description: 'G5教室',
            npcs: [],
            interactions: [] // 暂无实际功能
        };
        
        this.areas['g4'] = {
            id: 'g4',
            name: 'G4',
            x: 200, y: 470, width: 130, height: 110,
            background: '#DDA0DD',
            description: 'G4教室',
            npcs: [],
            interactions: [] // 暂无实际功能
        };
        
        this.areas['g3_2'] = {
            id: 'g3_2',
            name: 'G3-2',
            x: 350, y: 470, width: 190, height: 110,
            background: '#FFE4E1',
            description: '初三2班教室',
            npcs: [],
            interactions: [] // 暂无实际功能
        };
        
        // 第四排（G6-G7+生物教室+功能室）
        this.areas['biology_lab'] = {
            id: 'biology_lab',
            name: '生物教室',
            x: 80, y: 600, width: 100, height: 100,
            background: '#20B2AA',
            description: '生物实验室（按E键进入）',
            npcs: ['生物周老师'],
            interactions: [],
            specialPage: './office-lab.html'
        };
        
        this.areas['g7'] = {
            id: 'g7',
            name: 'G7',
            x: 200, y: 600, width: 100, height: 100,
            background: '#F0E68C',
            description: 'G7教室',
            npcs: [],
            interactions: []
        };
        
        this.areas['copy_room'] = {
            id: 'copy_room',
            name: '复印室',
            x: 320, y: 600, width: 80, height: 60,
            background: '#FFB6C1',
            description: '文印室',
            npcs: [],
            interactions: []
        };
        
        this.areas['storage'] = {
            id: 'storage',
            name: '数据储存',
            x: 420, y: 600, width: 80, height: 60,
            background: '#B0C4DE',
            description: '数据储存室',
            npcs: [],
            interactions: []
        };
        
        this.areas['g6'] = {
            id: 'g6',
            name: 'G6',
            x: 520, y: 600, width: 140, height: 100,
            background: '#FFA07A',
            description: 'G6教室',
            npcs: [],
            interactions: []
        };
        
        // 第五排（食堂-教师办公室-G8）
        this.areas['cafeteria'] = {
            id: 'cafeteria',
            name: '食堂',
            x: 80, y: 720, width: 140, height: 130,
            background: '#FFE4B5',
            description: '学校食堂（按E键进入）',
            npcs: ['食堂阿姨', '刘雨晴'],
            interactions: [],
            specialPage: './office-cafeteria.html' // 食堂页面
        };
        
        this.areas['teachers_office'] = {
            id: 'teachers_office',
            name: '教师办公室',
            x: 240, y: 720, width: 140, height: 130,
            background: '#B8E6F9',
            description: '教师办公室（按E键进入）',
            npcs: ['英语李响老师'],
            interactions: [],
            specialPage: './office-teachers.html' // 教师办公室页面
        };
        
        this.areas['g8'] = {
            id: 'g8',
            name: 'G8 （教学楼A）',
            x: 400, y: 720, width: 130, height: 130,
            background: '#EC87C0',
            description: 'G8教室 - 复印室AI+语文老师AI（按E键进入）',
            npcs: ['复印室老师'],
            interactions: [],
            specialPage: './office.html'
        };
        
        // 第六排（G9-爱哲书房-爱哲会客厅）
        this.areas['g9'] = {
            id: 'g9',
            name: 'G9 （教学楼B）',
            x: 80, y: 870, width: 120, height: 120,
            background: '#FFE4B5',
            description: 'G9教室 - 信息老师AI（按E键进入）',
            npcs: ['信息吴老师'],
            interactions: [],
            specialPage: './office-b.html'
        };
        
        this.areas['aizhe_library'] = {
            id: 'aizhe_library',
            name: '爱哲书房',
            x: 220, y: 870, width: 130, height: 120,
            background: '#F5DEB3',
            description: '爱哲书房 - 阅读与思考的空间',
            npcs: [],
            interactions: []
        };
        
        this.areas['aizhe_lounge'] = {
            id: 'aizhe_lounge',
            name: '爱哲会客厅',
            x: 370, y: 870, width: 140, height: 120,
            background: '#E6E6FA',
            description: '爱哲会客厅 - 交流与讨论的场所',
            npcs: [],
            interactions: []
        };
        
        // 第七排（大门-保卫室区域）
        this.areas['entrance'] = {
            id: 'entrance',
            name: '入口',
            x: 530, y: 1010, width: 120, height: 80,
            background: '#5D9CEC',
            description: '教学楼主入口',
            npcs: [],
            interactions: []
        };
        
        this.areas['security'] = {
            id: 'security',
            name: '保卫室',
            x: 530, y: 1110, width: 120, height: 80,
            background: '#5D9CEC',
            description: '保卫室',
            npcs: ['保安大叔'],
            interactions: []
        };
        
        this.areas['clinic'] = {
            id: 'clinic',
            name: '医务室',
            x: 530, y: 1210, width: 120, height: 60,
            background: '#FFB6C1',
            description: '医务室 - 身体不适可以来这里',
            npcs: [],
            interactions: []
        };
        
        // 左侧底部区域（学生议事会-音乐教室-爱哲书院）
        this.areas['student_council'] = {
            id: 'student_council',
            name: '学生议事会',
            x: 80, y: 1010, width: 120, height: 100,
            background: '#DDA0DD',
            description: '学生议事会 - 学生自治组织',
            npcs: [],
            interactions: []
        };
        
        this.areas['music_room'] = {
            id: 'music_room',
            name: '音乐教室',
            x: 80, y: 1130, width: 120, height: 100,
            background: '#FFE4E1',
            description: '音乐教室 - 音乐课和练习的地方',
            npcs: [],
            interactions: []
        };
        
        this.areas['aizhe_academy'] = {
            id: 'aizhe_academy',
            name: '爱哲书院',
            x: 80, y: 1250, width: 140, height: 100,
            background: '#F0E68C',
            description: '爱哲书院 - 深度学习与研讨',
            npcs: [],
            interactions: []
        };
        
        // 中间区域（羽毛球场-多功能厅）
        this.areas['badminton_court'] = {
            id: 'badminton_court',
            name: '羽毛球场',
            x: 220, y: 1010, width: 130, height: 100,
            background: '#90EE90',
            description: '室内羽毛球场',
            npcs: [],
            interactions: []
        };
        
        this.areas['multifunc'] = {
            id: 'multifunc',
            name: '多功能厅',
            x: 220, y: 1130, width: 200, height: 100,
            background: '#DDA0DD',
            description: '多功能厅',
            npcs: [],
            interactions: []
        };
        
        this.areas['activity_room'] = {
            id: 'activity_room',
            name: '活动教室',
            x: 240, y: 1250, width: 180, height: 100,
            background: '#98FB98',
            description: '多功能活动教室',
            npcs: [],
            interactions: []
        };
        
        // === 右侧大操场区域 ===
        
        // 大操场（椭圆形足球场，调整后的位置）
        this.areas['playground'] = {
            id: 'playground',
            name: '操场',
            x: 800, y: 250, width: 900, height: 450,
            background: '#97D077',
            description: '大操场，椭圆形足球场+跑道',
            npcs: ['张俊熙', '周泽宇', '王亦辰'],
            interactions: []
        };
        
        // 操场右上角沙地
        this.areas['sandbox_new'] = {
            id: 'sandbox_new',
            name: '沙地',
            x: 1620, y: 80, width: 150, height: 150,
            background: '#F4C89A',
            description: '沙地活动区',
            npcs: [],
            interactions: []
        };
    }
    
    // 生成碰撞地图
    generateCollisionMap() {
        // 初始化碰撞地图（简化为网格）
        const gridWidth = Math.ceil(this.width / 32);
        const gridHeight = Math.ceil(this.height / 32);
        
        this.collisionMap = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
        
        // 设置建筑物为碰撞区域
        Object.values(this.areas).forEach(area => {
            const startX = Math.floor(area.x / 32);
            const startY = Math.floor(area.y / 32);
            const endX = Math.min(gridWidth - 1, Math.floor((area.x + area.width) / 32));
            const endY = Math.min(gridHeight - 1, Math.floor((area.y + area.height) / 32));
            
            // 建筑物边缘为碰撞
            for (let y = startY; y <= endY; y++) {
                for (let x = startX; x <= endX; x++) {
                    if (x === startX || x === endX || y === startY || y === endY) {
                        this.collisionMap[y][x] = 1; // 墙壁
                    }
                }
            }
        });
        
        // 设置地图边界
        for (let x = 0; x < gridWidth; x++) {
            this.collisionMap[0][x] = 1;
            this.collisionMap[gridHeight - 1][x] = 1;
        }
        for (let y = 0; y < gridHeight; y++) {
            this.collisionMap[y][0] = 1;
            this.collisionMap[y][gridWidth - 1] = 1;
        }
    }
    
    // 初始化NPCs
    initializeNPCs() {
        this.npcs = {
            // 工作人员
            '保安大叔': {
                name: '保安大叔',
                area: 'entrance',
                type: 'staff',
                personality: '拿着保安的名义，就算你拿着出门条也不会让你出校门',
                dialogue: ['同学，校门不能随便出入！', '出门条？不行，现在不能出去！', '校规校纪要遵守，不要想着溜出去。']
            },
            '食堂阿姨': {
                name: '食堂阿姨',
                area: 'cafeteria',
                type: 'staff',
                personality: '不耐烦，经典手抖',
                dialogue: ['要吃什么？快点说！', '下一个！', '打饭不要磨蹭，后面还有好多人排队呢！']
            },
            '小卖部老板': {
                name: '小卖部老板',
                area: 'shop',
                type: 'staff',
                personality: '和蔼可亲，很照顾学生们',
                dialogue: ['孩子，想买什么？', '课间十分钟快点买，别迟到了。', '这个新来的零食很受欢迎，要尝尝吗？']
            },
            '教导主任': {
                name: '教导主任',
                area: 'teaching_a',
                type: 'staff',
                personality: '严厉，能出现在你想象不到的位置，时时刻刻监视着坏学生，一被发现严厉处罚',
                dialogue: ['同学！你在干什么？', '上课时间不要在走廊游荡！', '违反校规就要受到处分，这是规矩！']
            },
            
            // 家庭成员
            '爸爸': {
                name: '爸爸',
                area: 'dormitory',
                type: 'family',
                personality: '和蔼可亲，做事讲道理',
                dialogue: ['孩子，学习怎么样？', '有什么困难可以和我说。', '记得劳逸结合，不要太累了。']
            },
            '妈妈': {
                name: '妈妈',
                area: 'dormitory',
                type: 'family',
                personality: '细心，生气时会大喊大叫',
                dialogue: ['作业写完了吗？', '房间收拾干净了没有？', '这次考试怎么才考这么点分！']
            },
            '哈基米': {
                name: '哈基米',
                area: 'dormitory',
                type: 'pet',
                personality: '懒',
                dialogue: ['喵~', '咕噜咕噜~', '喵呜~']
            },
            
            // 老师
            '语文林老师': {
                name: '林老师（语文）',
                area: 'teaching_a',
                type: 'teacher',
                subject: '语文',
                personality: '脾气还行，有点小幽默，和同学关系好',
                dialogue: ['同学们，今天我们来学习一篇新课文。', '这个典故很有意思，大家都听好了。', '写作要有真情实感，不要套模板。']
            },
            '数学王老师': {
                name: '王老师（数学）',
                area: 'teaching_a',
                type: 'teacher',
                subject: '数学',
                personality: '严厉，会让违反课堂纪律的同学站到教室后面',
                dialogue: ['注意听讲！这道题很重要。', '张俊熙！又在走神？去后面站着！', '数学需要严谨的思维，不能马虎。']
            },
            '英语Miss Chen': {
                name: 'Miss Chen（英语）',
                area: 'teaching_a',
                type: 'teacher',
                subject: '英语',
                personality: '比较温柔，不喜欢学生在课堂上小声说话',
                dialogue: ['Please pay attention.', '大家跟我一起读。', '后排的同学，不要说话了好吗？']
            },
            '英语李响老师': {
                name: '李响（英语）',
                area: 'teachers_office',
                type: 'teacher',
                subject: '英语',
                personality: '年轻有活力的英语老师，善于用互动方式教学',
                dialogue: ['Hi! 有什么可以帮你的吗？', 'English is fun when you practice it!', '不要害怕犯错，学语言就是要多说多练。']
            },
            '道法赵老师': {
                name: '赵老师（道法）',
                area: 'teaching_a',
                type: 'teacher',
                subject: '道德与法治',
                personality: '脾气不好，不耐烦，讲着道德与法治自己却没有道德',
                dialogue: ['你们必须遵守道德规范！', '怎么回事？我刚讲过的你就忘了？', '这一代学生真是越来越不行了！']
            },
            '历史李老师': {
                name: '李老师（历史）',
                area: 'teaching_a',
                type: 'teacher',
                subject: '历史',
                personality: '脾气好，鼓励同学上课积极发言',
                dialogue: ['谁能回答这个问题？不要害怕答错。', '很好！思路非常清晰！', '历史是一面镜子，能告诉我们很多东西。']
            },
            '地理张老师': {
                name: '张老师（地理）',
                area: 'teaching_b',
                type: 'teacher',
                subject: '地理',
                personality: '好说话，忍无可忍时会给全班做一节课的思想教育',
                dialogue: ['今天我们学习地形图。', '同学们，地理知识在日常生活中很重要。', '我今天必须跟大家谈谈学习态度问题！']
            },
            '生物周老师': {
                name: '周老师（生物）',
                area: 'lab_building',
                type: 'teacher',
                subject: '生物',
                personality: '温柔，脾气好，好说话，教学质量高，就是不让同学在下面开小差',
                dialogue: ['生物学是研究生命的科学。', '请认真做好实验记录。', '我看见有同学在走神了，请专心听讲。']
            },
            '体育张教练': {
                name: '张教练（体育）',
                area: 'playground',
                type: 'teacher',
                subject: '体育',
                personality: '温柔，脾气好，不太好说话，跟同学相处的不错',
                dialogue: ['先跑两圈热身。', '不要偷懒，体育锻炼很重要！', '周泽宇，带着大家做准备活动。']
            },
            '信息吴老师': {
                name: '吴老师（信息）',
                area: 'lab_building',
                type: 'teacher',
                subject: '信息技术',
                personality: '脾气好，讲话语速慢但条理清晰，一般不会发火',
                dialogue: ['今天我们来学习如何使用Office软件。', '请跟着我的步骤一步一步来。', '计算机是工具，重要的是思维方式。']
            },
            
            // 学生
            '张俊熙': {
                name: '张俊熙（4号）',
                area: 'playground',
                type: 'student',
                personality: '学习差，纪律差，脾气大，学校里有名的坏学生，教导主任的眼中钉',
                dialogue: ['别烦我！', '上课真无聊，不如逃课去网吧。', '我才不怕教导主任呢！']
            },
            '林昊阳': {
                name: '林昊阳（7号）',
                area: 'teaching_a',
                type: 'student',
                personality: '学习一般，老师在的时候很老实，不在的时候会放飞自我',
                dialogue: ['老师来了，快坐好！', '现在没人管，可以放松一下了。', '作业借我抄一下吧，兄弟。']
            },
            '刘雨晴': {
                name: '刘雨晴（12号）',
                area: 'cafeteria',
                type: 'student',
                personality: '学习一般，很调皮，很幽默，和男生女生都比较合得来',
                dialogue: ['哈哈，今天又有好玩的事情发生了！', '这道题我有不同的解法。', '下课一起去踢毽子吧！']
            },
            '李昕瑶': {
                name: '李昕瑶（18号）',
                area: 'library',
                type: 'student',
                personality: '大学霸，学习很好，有耐心，作业永远高质量完成，做事不拖拉效率高',
                dialogue: ['我已经预习到下学期了。', '这道题可以用三种方法解决。', '需要我帮你讲解一下吗？']
            },
            '郑星然': {
                name: '郑星然（21号）',
                area: 'teaching_b',
                type: 'student',
                personality: '学习好，仅次于李昕瑶，体育也好，六边形战士',
                dialogue: ['学习和运动都要兼顾。', '这次物理竞赛我一定要拿奖。', '周末约打篮球吗？']
            },
            '周泽宇': {
                name: '周泽宇（22号）',
                area: 'playground',
                type: 'student',
                personality: '体育很好，所有体育活动都擅长，学习中等偏上',
                dialogue: ['体育课太棒了！', '下节课有测验，我得复习一下。', '校运会我要参加三个项目！']
            },
            '王亦辰': {
                name: '王亦辰（27号）',
                area: 'playground',
                type: 'student',
                personality: '体育很好，周泽宇的好朋友，学习不如周泽宇',
                dialogue: ['周泽宇，放学打球去！', '这道题不会，待会儿问周泽宇。', '体育特长生应该能加分吧？']
            },
            '陈子墨': {
                name: '陈子墨（30号）',
                area: 'art_building',
                type: 'student',
                personality: '多才多艺，擅长画画和书法',
                dialogue: ['我在准备美术比赛的作品。', '这幅画还需要调整一下色彩。', '书法是修身养性的好方法。']
            }
        };
    }
    
    // 初始化交互对象
    initializeInteractables() {
        this.interactables = {
            // 基础课程活动
            '上课': { 
                type: 'action', 
                energy: -10, 
                academic: 5,
                description: '认真听讲，积极思考，提高学术能力'
            },
            '自习': { 
                type: 'action', 
                energy: -5, 
                academic: 3,
                description: '安静学习，巩固知识点'
            },
            '语文课': {
                type: 'action',
                energy: -8,
                academic: 4,
                skills: { chinese: 2 },
                description: '林老师的语文课生动有趣，学习古今文学经典'
            },
            '数学课': {
                type: 'action',
                energy: -12,
                academic: 6,
                skills: { mathematics: 3 },
                description: '王老师的数学课要认真听讲，否则会被罚站'
            },
            '英语课': {
                type: 'action',
                energy: -8,
                academic: 5,
                skills: { english: 3 },
                description: 'Miss Chen的英语课要保持安静，多练习口语'
            },
            '道法课': {
                type: 'action',
                energy: -5,
                academic: 3,
                skills: { politics: 2 },
                description: '赵老师的课上不要惹他生气，表现出认真的态度'
            },
            '历史课': {
                type: 'action',
                energy: -7,
                academic: 4,
                skills: { history: 2 },
                description: '李老师鼓励发言，课堂氛围轻松活跃'
            },
            '地理课': {
                type: 'action',
                energy: -6,
                academic: 4,
                skills: { geography: 2 },
                description: '张老师的课要认真听，不然可能会有思想教育'
            },
            '生物课': {
                type: 'action',
                energy: -8,
                academic: 5,
                skills: { biology: 3 },
                description: '周老师的生物课教学质量高，但不允许开小差'
            },
            '信息课': {
                type: 'action',
                energy: -5,
                academic: 3,
                skills: { computer: 3 },
                description: '吴老师讲解清晰，跟着步骤学习计算机技能'
            },
            
            // 体育活动
            '体育课': {
                type: 'action',
                energy: -15,
                health: 6,
                mood: 4,
                skills: { sports: 2 },
                description: '张教练的体育课锻炼身体，提高体能'
            },
            '跑步': { 
                type: 'action', 
                energy: -15, 
                health: 5, 
                mood: 5,
                description: '晨跑或课间跑步，增强体质'
            },
            '踢球': { 
                type: 'action', 
                energy: -20, 
                health: 8, 
                social: 3,
                description: '和周泽宇、王亦辰一起踢足球'
            },
            '篮球': { 
                type: 'action', 
                energy: -18, 
                health: 6, 
                social: 4,
                description: '和同学们在操场打篮球'
            },
            '做操': {
                type: 'action',
                energy: -8,
                health: 3,
                mood: -2,
                description: '早操或课间操，强制性的集体活动'
            },
            
            // 餐饮活动
            '吃早餐': { 
                type: 'action', 
                energy: 20, 
                health: 5, 
                money: -5,
                description: '一日之计在于晨，不要忘记吃早餐'
            },
            '吃午餐': { 
                type: 'action', 
                energy: 25, 
                health: 8, 
                money: -8,
                description: '和同学一起在食堂吃午餐，要小心食堂阿姨的手抖'
            },
            '吃晚餐': { 
                type: 'action', 
                energy: 20, 
                health: 6, 
                money: -6,
                description: '晚餐后可以适当休息一下再学习'
            },
            
            // 图书馆活动
            '借书': { 
                type: 'action', 
                academic: 2,
                description: '借阅感兴趣的书籍，可以请教李昕瑶推荐好书'
            },
            '还书': {
                type: 'action',
                mood: 1,
                description: '按时归还图书，避免产生逾期费用'
            },
            '查资料': {
                type: 'action',
                energy: -5,
                academic: 4,
                description: '查找学习资料，完成作业或课题研究'
            },
            
            // 购物活动
            '买零食': { 
                type: 'action', 
                mood: 5, 
                money: -3,
                energy: 5,
                description: '在小卖部买一些零食，小卖部老板很和蔼'
            },
            '买文具': { 
                type: 'action', 
                money: -10,
                description: '购买学习用品，补充文具'
            },
            '买饮料': {
                type: 'action',
                money: -4,
                energy: 3,
                mood: 2,
                description: '购买饮料解渴'
            },
            
            // 艺术活动
            '音乐课': { 
                type: 'action', 
                energy: -8, 
                talent: 6, 
                mood: 8,
                skills: { music: 2 },
                description: '参加音乐课，培养艺术感知力'
            },
            '美术课': { 
                type: 'action', 
                energy: -8, 
                talent: 5, 
                mood: 6,
                skills: { art: 2 },
                description: '参加美术课，发挥创造力'
            },
            '练钢琴': {
                type: 'action',
                energy: -10,
                talent: 3,
                mood: 4,
                description: '练习钢琴，提高音乐技能'
            },
            '画画': {
                type: 'action',
                energy: -7,
                talent: 3,
                mood: 5,
                description: '画画放松，可以向陈子墨请教'
            },
            
            // 实验活动
            '物理实验': {
                type: 'action',
                energy: -12,
                academic: 6,
                skills: { physics: 3 },
                description: '进行物理实验，加深对理论知识的理解'
            },
            '化学实验': {
                type: 'action',
                energy: -12,
                academic: 6,
                skills: { chemistry: 3 },
                description: '进行化学实验，观察化学反应'
            },
            '生物实验': {
                type: 'action',
                energy: -10,
                academic: 5,
                skills: { biology: 3 },
                description: '在周老师指导下进行生物实验'
            },
            '计算机课': {
                type: 'action',
                energy: -8,
                academic: 4,
                skills: { computer: 4 },
                description: '在吴老师指导下学习计算机技能'
            },
            
            // 休息活动
            '休息': { 
                type: 'action', 
                energy: 30, 
                mood: 5,
                description: '适当休息，恢复体力'
            },
            '洗漱': {
                type: 'action',
                energy: -3,
                health: 2,
                mood: 3,
                description: '保持个人卫生'
            },
            '整理内务': {
                type: 'action',
                energy: -5,
                mood: 2,
                description: '整理宿舍或房间，保持环境整洁'
            },
            
            // 社交活动
            '聊天': {
                type: 'action',
                energy: -3,
                social: 3,
                mood: 4,
                description: '和同学或朋友聊天'
            },
            '找老师': {
                type: 'action',
                energy: -5,
                academic: 2,
                description: '找老师咨询学习问题'
            },
            '散步': {
                type: 'action',
                energy: -3,
                health: 2,
                mood: 4,
                description: '在校园里散步，放松心情'
            },
            '赏花': {
                type: 'action',
                energy: -2,
                mood: 5,
                description: '在校园花园欣赏花草，放松心情'
            },
            
            // 特殊活动
            '进入校园': {
                type: 'transition',
                target: 'teaching_a',
                description: '从校门进入校园主区域'
            },
            '请假': {
                type: 'special',
                requires: { health: 30 },
                effects: { academic: -5, mood: 10 },
                description: '因病请假，需要保安大叔批准'
            }
        };
    }
    
    // 更新地图状态
    update(deltaTime) {
        // 可以在这里添加动态元素的更新逻辑
        // 比如NPC移动、环境变化等
    }
    
    // 渲染地图
    render(ctx, camera) {
        // 计算可见区域（扩大缓冲区以适应大地图）
        const bufferSize = 200;  // 增大缓冲区
        const visibleLeft = Math.max(0, camera.x - bufferSize);
        const visibleTop = Math.max(0, camera.y - bufferSize);
        const visibleRight = Math.min(this.width, camera.x + ctx.canvas.width + bufferSize);
        const visibleBottom = Math.min(this.height, camera.y + ctx.canvas.height + bufferSize);
        
        // 绘制地面
        this.renderGround(ctx, visibleLeft, visibleTop, visibleRight, visibleBottom);
        
        // 绘制道路
        this.renderPaths(ctx);
        
        // 绘制区域（操场需要特殊处理）
        Object.values(this.areas).forEach(area => {
            if (area.id === 'playground') {
                this.renderPlayground(ctx, area);
            }
        });
        
        // 绘制其他区域
        this.renderAreas(ctx, visibleLeft, visibleTop, visibleRight, visibleBottom);
        
        // 绘制装饰元素
        this.renderDecorations(ctx, visibleLeft, visibleTop, visibleRight, visibleBottom);
    }
    
    // 专门渲染操场（椭圆形足球场+跑道版本）
    renderPlayground(ctx, area) {
        const centerX = area.x + area.width / 2;
        const centerY = area.y + area.height / 2;
        
        // 绘制红色跑道底色（大椭圆）
        ctx.save();
        ctx.fillStyle = '#D8815F'; // 红褐色跑道
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, area.width/2, area.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制绿色足球场（内椭圆）
        const fieldRadiusX = area.width/2 - 60;
        const fieldRadiusY = area.height/2 - 50;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, fieldRadiusY);
        gradient.addColorStop(0, '#4A8B2C');
        gradient.addColorStop(1, '#3D7424');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, fieldRadiusX, fieldRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制足球场白线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        
        // 边线（椭圆）
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, fieldRadiusX - 15, fieldRadiusY - 15, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 中线
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - fieldRadiusY + 15);
        ctx.lineTo(centerX, centerY + fieldRadiusY - 15);
        ctx.stroke();
        
        // 中圈
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
        ctx.stroke();
        
        // 左侧球门区（半圆）
        ctx.beginPath();
        ctx.arc(centerX - fieldRadiusX + 35, centerY, 60, -Math.PI/2, Math.PI/2);
        ctx.stroke();
        
        // 右侧球门区（半圆）
        ctx.beginPath();
        ctx.arc(centerX + fieldRadiusX - 35, centerY, 60, Math.PI/2, Math.PI * 3/2);
        ctx.stroke();
        
        // 绘制跑道线条
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        
        // 外圈跑道线
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, area.width/2 - 10, area.height/2 - 10, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 内圈跑道线
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, fieldRadiusX + 10, fieldRadiusY + 10, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.setLineDash([]);
        ctx.restore();
        
        // 绘制上方设施标签
        this.renderPlaygroundLabels(ctx, area);
    }
    
    // 绘制操场设施标签
    renderPlaygroundLabels(ctx, area) {
        // 操场中央文字
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 30px "Microsoft YaHei", Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('操场', area.x + area.width/2, area.y + area.height/2);
        ctx.restore();
    }
    
    // 渲染地面
    renderGround(ctx, left, top, right, bottom) {
        // 使用更柔和的绿色作为地面
        const gradient = ctx.createLinearGradient(left, top, right, bottom);
        gradient.addColorStop(0, '#C8D5B9');
        gradient.addColorStop(0.5, '#B5C99A');
        gradient.addColorStop(1, '#A4C3A2');
        ctx.fillStyle = gradient;
        ctx.fillRect(left, top, right - left, bottom - top);
        
        // 绘制预生成的草地纹理点
        ctx.fillStyle = 'rgba(139, 149, 122, 0.15)';
        for (const dot of this.grassDots) {
            if (dot.x >= left && dot.x <= right && dot.y >= top && dot.y <= bottom) {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // 渲染区域（3D俯视风格）
    renderAreas(ctx, left, top, right, bottom) {
        Object.values(this.areas).forEach(area => {
            // 只渲染可见区域
            if (area.x + area.width < left || area.x > right || 
                area.y + area.height < top || area.y > bottom) {
                return;
            }
            
            // 绘制建筑物阴影（3D效果）
            const shadowOffset = 8;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.fillRect(
                area.x + shadowOffset, 
                area.y + shadowOffset, 
                area.width, 
                area.height
            );
            
            // 绘制建筑物主体（使用渐变增加立体感）
            const gradient = ctx.createLinearGradient(
                area.x, 
                area.y, 
                area.x, 
                area.y + area.height
            );
            const baseColor = this.getModernColor(area.id);
            gradient.addColorStop(0, baseColor.light);
            gradient.addColorStop(0.5, baseColor.main);
            gradient.addColorStop(1, baseColor.dark);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(area.x, area.y, area.width, area.height);
            
            // 绘制建筑物顶部高光
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(area.x, area.y, area.width, area.height * 0.15);
            
            // 绘制建筑物边框
            ctx.strokeStyle = baseColor.border;
            ctx.lineWidth = 3;
            ctx.strokeRect(area.x, area.y, area.width, area.height);
            
            // 绘制窗户和细节
            this.renderBuildingDetails(ctx, area);
            
            // 绘制入口
            this.renderAreaEntrance(ctx, area);
            
            // 绘制区域名称（带背景，避免文字堆叠）
            // 只为足够大的区域显示名称
            if (area.width >= 100 && area.height >= 80) {
                ctx.save();
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                
                const textX = area.x + area.width / 2;
                const textY = area.y + area.height / 2;
                
                // 计算文字尺寸
                ctx.font = 'bold 14px "Microsoft YaHei", Arial';
                const textMetrics = ctx.measureText(area.name);
                const textWidth = textMetrics.width + 20;
                const textHeight = 24;
                
                // 绘制文字背景
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.roundRect(textX - textWidth/2, textY - textHeight/2, textWidth, textHeight, 6);
                ctx.fill();
                
                // 绘制文字
                ctx.fillStyle = '#2C3E50';
            ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(area.name, textX, textY);
                ctx.restore();
            }
            
            // 绘制NPC指示
            if (area.npcs && area.npcs.length > 0) {
                ctx.fillStyle = 'rgba(255, 107, 107, 0.9)';
                ctx.font = 'bold 14px Arial';
                ctx.fillText(`👥 ${area.npcs.length}`, area.x + 20, area.y + 25);
            }
        });
    }
    
    // 获取现代化的配色方案
    getModernColor(areaId) {
        const colorSchemes = {
            'entrance': { 
                main: '#5D9CEC', 
                light: '#7FAFF0', 
                dark: '#4A89D9',
                border: '#3A6FB8'
            },
            'teaching_a': { 
                main: '#EC87C0', 
                light: '#F0A1CE', 
                dark: '#D974AD',
                border: '#C660A0'
            },
            'teaching_b': { 
                main: '#F0A3A3', 
                light: '#F4B6B6', 
                dark: '#E88989',
                border: '#D87070'
            },
            'playground': { 
                main: '#97D077', 
                light: '#AAD98A', 
                dark: '#84BD64',
                border: '#6FA551'
            },
            'cafeteria': { 
                main: '#F6C065', 
                light: '#F8CD78', 
                dark: '#F4B352',
                border: '#E0A040'
            },
            'library': { 
                main: '#86C1E5', 
                light: '#99CEE9', 
                dark: '#73B4D8',
                border: '#5F9CC3'
            },
            'shop': { 
                main: '#FAB4D1', 
                light: '#FCC7DD', 
                dark: '#F8A1C5',
                border: '#E68FB3'
            },
            'lab_building': { 
                main: '#B19CD9', 
                light: '#C4AFE3', 
                dark: '#9E89C6',
                border: '#8B76B3'
            },
            'art_building': { 
                main: '#FFA98F', 
                light: '#FFBCA2', 
                dark: '#FF967C',
                border: '#E68770'
            },
            'dormitory': { 
                main: '#FFD89B', 
                light: '#FFE0AE', 
                dark: '#FFCF88',
                border: '#E6BA70'
            },
            'garden': { 
                main: '#A8E6A3', 
                light: '#BBEAB6', 
                dark: '#95D990',
                border: '#7FC67A'
            }
        };
        
        return colorSchemes[areaId] || {
            main: '#CCCCCC',
            light: '#DDDDDD',
            dark: '#BBBBBB',
            border: '#999999'
        };
    }
    
    // 绘制建筑物细节（窗户等）
    renderBuildingDetails(ctx, area) {
        const windowSize = 12;
        const windowSpacing = 20;
        const windowColor = 'rgba(100, 150, 200, 0.6)';
        const windowBorder = 'rgba(70, 110, 160, 0.8)';
        
        // 根据建筑物大小计算窗户数量
        const cols = Math.floor(area.width / (windowSize + windowSpacing));
        const rows = Math.floor(area.height / (windowSize + windowSpacing)) - 1;
        
        const offsetX = (area.width - (cols * (windowSize + windowSpacing) - windowSpacing)) / 2;
        const offsetY = 30; // 从顶部留出一些空间
        
        ctx.fillStyle = windowColor;
        ctx.strokeStyle = windowBorder;
        ctx.lineWidth = 1;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = area.x + offsetX + col * (windowSize + windowSpacing);
                const y = area.y + offsetY + row * (windowSize + windowSpacing);
                
                // 绘制窗户
                ctx.fillRect(x, y, windowSize, windowSize);
                ctx.strokeRect(x, y, windowSize, windowSize);
                
                // 绘制窗框
                ctx.strokeStyle = windowBorder;
                ctx.beginPath();
                ctx.moveTo(x + windowSize/2, y);
                ctx.lineTo(x + windowSize/2, y + windowSize);
                ctx.moveTo(x, y + windowSize/2);
                ctx.lineTo(x + windowSize, y + windowSize/2);
                ctx.stroke();
            }
        }
    }
    
    // 渲染区域入口（改进版）
    renderAreaEntrance(ctx, area) {
        const entranceWidth = 30;
        const entranceHeight = 10;
        
        // 入口位置（底部中央）
        const entranceX = area.x + (area.width - entranceWidth) / 2;
        const entranceY = area.y + area.height - entranceHeight;
        
        // 绘制门的阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(entranceX + 2, entranceY + 2, entranceWidth, entranceHeight);
        
        // 绘制门的主体
        ctx.fillStyle = '#8B6F47';
        ctx.fillRect(entranceX, entranceY, entranceWidth, entranceHeight);
        
        // 绘制门框
        ctx.strokeStyle = '#6B5537';
        ctx.lineWidth = 2;
        ctx.strokeRect(entranceX, entranceY, entranceWidth, entranceHeight);
        
        // 绘制门中线
        ctx.beginPath();
        ctx.moveTo(entranceX + entranceWidth/2, entranceY);
        ctx.lineTo(entranceX + entranceWidth/2, entranceY + entranceHeight);
        ctx.stroke();
    }
    
    // 渲染道路（按照新布局的走廊系统）
    renderPaths(ctx) {
        // 主要走廊（横向大地图）
        const paths = [
            // 纵向主走廊（贯穿左侧教室区）
            { x1: 790, y1: 80, x2: 790, y2: 1360 },
            
            // 横向走廊（连接各层教室）
            { x1: 80, y1: 210, x2: 790, y2: 210 },      // 顶部走廊
            { x1: 80, y1: 340, x2: 790, y2: 340 },      // G1层
            { x1: 80, y1: 460, x2: 790, y2: 460 },      // G2-G3层
            { x1: 80, y1: 590, x2: 790, y2: 590 },      // G4-G5层
            { x1: 80, y1: 710, x2: 790, y2: 710 },      // 生物-G7层
            { x1: 80, y1: 860, x2: 790, y2: 860 },      // 食堂-G8层
            { x1: 80, y1: 1000, x2: 790, y2: 1000 },    // G9-爱哲书房层
            { x1: 80, y1: 1120, x2: 790, y2: 1120 },    // 学生议事会层
            { x1: 80, y1: 1240, x2: 790, y2: 1240 },    // 音乐教室-活动室层
            
            // 连接操场的通道
            { x1: 790, y1: 450, x2: 800, y2: 450 },
            
            // 操场周边的路径
            { x1: 800, y1: 240, x2: 1800, y2: 240 },
            { x1: 800, y1: 710, x2: 1800, y2: 710 },
        ];
        
        paths.forEach(path => {
            // 绘制道路阴影
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 18;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(path.x1 + 2, path.y1 + 2);
            ctx.lineTo(path.x2 + 2, path.y2 + 2);
            ctx.stroke();
            
            // 绘制道路主体
            const gradient = this.createPathGradient(ctx, path);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 16;
            ctx.beginPath();
            ctx.moveTo(path.x1, path.y1);
            ctx.lineTo(path.x2, path.y2);
            ctx.stroke();
            
            // 绘制道路中心线
            ctx.strokeStyle = '#F5D547';
            ctx.lineWidth = 2;
            ctx.setLineDash([15, 15]);
            ctx.beginPath();
            ctx.moveTo(path.x1, path.y1);
            ctx.lineTo(path.x2, path.y2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // 绘制道路边线
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (path.y1 === path.y2) { // 水平道路
                ctx.moveTo(path.x1, path.y1 - 8);
                ctx.lineTo(path.x2, path.y2 - 8);
                ctx.moveTo(path.x1, path.y1 + 8);
                ctx.lineTo(path.x2, path.y2 + 8);
            } else { // 垂直道路
                ctx.moveTo(path.x1 - 8, path.y1);
                ctx.lineTo(path.x2 - 8, path.y2);
                ctx.moveTo(path.x1 + 8, path.y1);
                ctx.lineTo(path.x2 + 8, path.y2);
            }
            ctx.stroke();
        });
    }
    
    // 创建道路渐变
    createPathGradient(ctx, path) {
        let gradient;
        if (path.y1 === path.y2) { // 水平道路
            gradient = ctx.createLinearGradient(path.x1, path.y1 - 8, path.x1, path.y1 + 8);
        } else { // 垂直道路
            gradient = ctx.createLinearGradient(path.x1 - 8, path.y1, path.x1 + 8, path.y1);
        }
        gradient.addColorStop(0, '#7F8C8D');
        gradient.addColorStop(0.5, '#95A5A6');
        gradient.addColorStop(1, '#7F8C8D');
        return gradient;
    }
    
    // 渲染装饰元素（横向大地图 - 新布局）
    renderDecorations(ctx, left, top, right, bottom) {
        // 树木（分布在走廊两侧和操场周围）
        const trees = [
            // 教室区走廊边
            { x: 770, y: 300 }, { x: 775, y: 500 }, { x: 780, y: 700 },
            { x: 770, y: 900 }, { x: 775, y: 1100 }, { x: 780, y: 1280 },
            // 操场周围
            { x: 900, y: 280 }, { x: 1100, y: 270 }, { x: 1300, y: 260 },
            { x: 1500, y: 270 }, { x: 1700, y: 280 },
            { x: 900, y: 1130 }, { x: 1100, y: 1140 }, { x: 1300, y: 1135 },
            { x: 1500, y: 1140 }, { x: 1700, y: 1130 },
            { x: 870, y: 500 }, { x: 870, y: 700 }, { x: 870, y: 900 },
            { x: 1870, y: 700 }, { x: 1870, y: 900 }
        ];
        
        trees.forEach(tree => {
            if (tree.x < left || tree.x > right || tree.y < top || tree.y > bottom) {
                return;
            }
            
            // 树木阴影
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(tree.x + 2, tree.y + 18, 10, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 树干
            ctx.fillStyle = '#8B6F47';
            ctx.fillRect(tree.x - 4, tree.y, 8, 18);
            
            // 树干纹理
            ctx.strokeStyle = '#6B5537';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(tree.x - 1, tree.y + 5);
            ctx.lineTo(tree.x - 1, tree.y + 15);
            ctx.stroke();
            
            // 树冠（多层）
            const crownColors = [
                { color: '#52734D', radius: 16 },
                { color: '#77A46E', radius: 13 },
                { color: '#91C788', radius: 10 }
            ];
            
            crownColors.forEach((layer, index) => {
                ctx.fillStyle = layer.color;
                ctx.beginPath();
                ctx.arc(tree.x, tree.y - 5 - index * 2, layer.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
            // 树冠高光
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(tree.x - 4, tree.y - 12, 5, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // 花朵（横向大地图 - 新布局）
        const flowers = [
            { x: 750, y: 250, color: '#FF69B4' },
            { x: 760, y: 450, color: '#FF1493' },
            { x: 755, y: 650, color: '#FFB6C1' },
            { x: 765, y: 850, color: '#FF69B4' },
            { x: 760, y: 1050, color: '#FF1493' },
            { x: 755, y: 1200, color: '#FFB6C1' },
            { x: 950, y: 300, color: '#FF1493' },
            { x: 1200, y: 290, color: '#FFB6C1' },
            { x: 1500, y: 285, color: '#FF69B4' },
            { x: 1200, y: 1150, color: '#FF1493' },
            { x: 1500, y: 1145, color: '#FFB6C1' }
        ];
        
        flowers.forEach(flower => {
            if (flower.x < left || flower.x > right || flower.y < top || flower.y > bottom) {
                return;
            }
            
            // 花瓣
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i;
                const petalX = flower.x + Math.cos(angle) * 4;
                const petalY = flower.y + Math.sin(angle) * 4;
            
            ctx.fillStyle = flower.color;
            ctx.beginPath();
                ctx.arc(petalX, petalY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 花心
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(flower.x, flower.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // 添加草丛装饰（横向大地图 - 新布局）
        const grassPatches = [
            { x: 740, y: 350 }, { x: 750, y: 550 }, { x: 745, y: 750 },
            { x: 755, y: 950 }, { x: 760, y: 1150 }, { x: 745, y: 1300 },
            { x: 920, y: 320 }, { x: 1000, y: 310 }, { x: 1150, y: 300 },
            { x: 1400, y: 290 }, { x: 1650, y: 295 },
            { x: 1000, y: 1150 }, { x: 1300, y: 1155 }, { x: 1600, y: 1150 }
        ];
        
        grassPatches.forEach(patch => {
            if (patch.x < left || patch.x > right || patch.y < top || patch.y > bottom) {
                return;
            }
            
            ctx.fillStyle = '#7EA778';
            for (let i = 0; i < 8; i++) {
                const offsetX = (Math.random() - 0.5) * 15;
                const offsetY = (Math.random() - 0.5) * 10;
                ctx.beginPath();
                ctx.moveTo(patch.x + offsetX, patch.y + offsetY);
                ctx.lineTo(patch.x + offsetX, patch.y + offsetY - 6);
                ctx.lineTo(patch.x + offsetX + 1, patch.y + offsetY - 8);
                ctx.lineTo(patch.x + offsetX + 2, patch.y + offsetY - 6);
                ctx.lineTo(patch.x + offsetX + 2, patch.y + offsetY);
                ctx.fill();
            }
        });
    }
    
    // 碰撞检测
    checkCollision(x, y, width, height) {
        const gridX = Math.floor(x / 32);
        const gridY = Math.floor(y / 32);
        const gridX2 = Math.floor((x + width) / 32);
        const gridY2 = Math.floor((y + height) / 32);
        
        // 检查边界
        if (gridX < 0 || gridY < 0 || gridX2 >= this.collisionMap[0].length || gridY2 >= this.collisionMap.length) {
            return true;
        }
        
        // 检查碰撞网格
        for (let gy = gridY; gy <= gridY2; gy++) {
            for (let gx = gridX; gx <= gridX2; gx++) {
                if (this.collisionMap[gy] && this.collisionMap[gy][gx] === 1) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // 获取当前区域
    getCurrentArea(x, y, margin = 80) {
        for (const area of Object.values(this.areas)) {
            if (x >= area.x && x <= area.x + area.width &&
                y >= area.y && y <= area.y + area.height) {
                return area;
            }
        }

        if (margin > 0) {
            for (const area of Object.values(this.areas)) {
                if (x >= area.x - margin && x <= area.x + area.width + margin &&
                    y >= area.y - margin && y <= area.y + area.height + margin) {
                    return area;
                }
            }
        }

        return null;
    }

    // 获取区域内的NPCs
    getNPCsInArea(areaId) {
        const area = this.areas[areaId];
        if (!area || !area.npcs) return [];
        return area.npcs.filter(npcName => this.npcs[npcName]);
    }

    // 获取区域内的交互对象
    getInteractablesInArea(areaId) {
        const area = this.areas[areaId];
        if (!area || !area.interactions) return [];
        return area.interactions.filter(interactionName => this.interactables[interactionName]);
    }
    
    // 获取NPC信息
    getNPCInfo(npcName) {
        return this.npcs[npcName] || null;
    }
    
    // 获取交互对象信息
    getInteractableInfo(interactionName) {
        return this.interactables[interactionName] || null;
    }
    
    // 渲染小地图
    renderMiniMap(ctx, width, height) {
        const scaleX = width / this.width;
        const scaleY = height / this.height;
        
        // 清空小地图
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
        
        // 绘制区域
        Object.values(this.areas).forEach(area => {
            ctx.fillStyle = area.background || '#CCCCCC';
            ctx.fillRect(
                area.x * scaleX,
                area.y * scaleY,
                area.width * scaleX,
                area.height * scaleY
            );
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(
                area.x * scaleX,
                area.y * scaleY,
                area.width * scaleX,
                area.height * scaleY
            );
        });
    }
    
    // 处理事件
    handleEvent(eventType, data) {
        // 地图系统的事件处理
        switch (eventType) {
            case 'playerMoved':
                this.onPlayerMoved(data);
                break;
        }
    }
    
    // 玩家移动事件
    onPlayerMoved(data) {
        const currentArea = this.getCurrentArea(data.x, data.y);
        if (currentArea && this.gameEngine) {
            this.gameEngine.broadcastEvent('areaChanged', {
                area: currentArea,
                position: { x: data.x, y: data.y }
            });
        }
    }
    
    // 保存地图数据
    saveData() {
        return {
            version: '2.0.0',
            npcs: this.npcs,
            interactables: this.interactables
        };
    }
    
    // 加载地图数据
    loadData(data) {
        if (!data) return false;
        
        try {
            if (data.npcs) {
                this.npcs = { ...this.npcs, ...data.npcs };
            }
            
            if (data.interactables) {
                this.interactables = { ...this.interactables, ...data.interactables };
            }
            
            console.log('✅ 地图数据加载成功');
            return true;
            
        } catch (error) {
            console.error('❌ 加载地图数据失败:', error);
            return false;
        }
    }
    
    /**
     * 获取指定坐标所在的区域
     */
    getAreaAt(x, y) {
        for (let areaId in this.areas) {
            const area = this.areas[areaId];
            if (x >= area.x && x <= area.x + area.width &&
                y >= area.y && y <= area.y + area.height) {
                return { id: areaId, ...area };
            }
        }
        return null;
    }
    
    /**
     * 检查是否在路径上
     */
    isOnPath(x, y) {
        return this.paths.some(path => 
            x >= path.x && x <= path.x + path.width &&
            y >= path.y && y <= path.y + path.height
        );
    }
    
    /**
     * 获取附近的NPC
     */
    getNearbyNPCs(x, y, radius = 50) {
        const nearby = [];
        for (let areaId in this.areas) {
            const area = this.areas[areaId];
            const distance = Math.sqrt(
                Math.pow(x - (area.x + area.width/2), 2) + 
                Math.pow(y - (area.y + area.height/2), 2)
            );
            if (distance <= radius) {
                nearby.push(...area.npcs);
            }
        }
        return [...new Set(nearby)]; // 去重
    }
    
    /**
     * 获取可交互的对象
     */
    getInteractions(x, y) {
        const area = this.getAreaAt(x, y);
        if (area) {
            return area.interactions;
        }
        return [];
    }
    
    /**
     * 绘制地图
     */
    draw(ctx, playerX, playerY) {
        // 绘制背景
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // 绘制路径
        ctx.fillStyle = "#8B7355";
        this.paths.forEach(path => {
            ctx.fillRect(path.x, path.y, path.width, path.height);
        });
        
        // 绘制区域
        for (let areaId in this.areas) {
            const area = this.areas[areaId];
            
            // 区域背景
            ctx.fillStyle = area.background;
            ctx.fillRect(area.x, area.y, area.width, area.height);
            
            // 区域边框
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 2;
            ctx.strokeRect(area.x, area.y, area.width, area.height);
            
            // 区域名称
            ctx.fillStyle = "#333";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(area.name, area.x + area.width/2, area.y + area.height/2);
            
            // 如果是玩家当前区域，高亮显示
            if (this.getAreaAt(playerX, playerY)?.id === areaId) {
                ctx.strokeStyle = "#FFD700";
                ctx.lineWidth = 3;
                ctx.strokeRect(area.x, area.y, area.width, area.height);
            }
        }
        
        // 绘制传送点
        ctx.fillStyle = "#FF6B6B";
        for (let teleportId in this.teleports) {
            const teleport = this.teleports[teleportId];
            ctx.beginPath();
            ctx.arc(teleport.x, teleport.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#FF0000";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    /**
     * 绘制小地图
     */
    drawMiniMap(ctx, playerX, playerY) {
        const scale = 0.15; // 缩放比例
        const offsetX = 10;
        const offsetY = 10;
        
        // 清空小地图
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // 绘制区域
        for (let areaId in this.areas) {
            const area = this.areas[areaId];
            ctx.fillStyle = area.background;
            ctx.fillRect(
                area.x * scale + offsetX, 
                area.y * scale + offsetY, 
                area.width * scale, 
                area.height * scale
            );
        }
        
        // 绘制玩家位置
        ctx.fillStyle = "#FF4757";
        ctx.beginPath();
        ctx.arc(
            playerX * scale + offsetX, 
            playerY * scale + offsetY, 
            3, 0, Math.PI * 2
        );
        ctx.fill();
    }
    
    /**
     * 检查移动是否有效
     */
    isValidMove(x, y) {
        // 检查边界
        if (x < 0 || x > 1200 || y < 0 || y > 800) {
            return false;
        }
        
        // 检查是否在路径上或在区域内
        return this.isOnPath(x, y) || this.getAreaAt(x, y) !== null;
    }
}

// 导出地图实例
window.SchoolMap = SchoolMap; 