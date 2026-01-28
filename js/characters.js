/**
 * 角色数据管理系统
 * 管理所有NPC的信息、对话、头像等
 */

class CharacterManager {
    constructor() {
        this.characters = {
            // === 系统角色 ===
            narrator: {
                id: 'narrator',
                name: '旁白',
                avatar: '📖',
                type: 'system'
            },
            
            player: {
                id: 'player',
                name: '我',
                avatar: '👤',
                type: 'player'
            },
            
            // === 核心同学 ===
            liMingxuan: {
                id: 'liMingxuan',
                name: '李明轩',
                avatar: '🤓',
                type: 'student',
                personality: 'studious', // 学霸型
                description: '班级学霸，成绩优异但不高冷，愿意帮助同学',
                traits: ['聪明', '友善', '有责任感'],
                favoriteTopics: ['学习', '科学', '未来规划'],
                dialogStyle: '说话条理清晰，经常引用书本知识，但很平易近人'
            },
            
            wangXiaoyu: {
                id: 'wangXiaoyu',
                name: '王小雨',
                avatar: '😄',
                type: 'student',
                personality: 'cheerful', // 活泼型
                description: '班级开心果，组织能力强，总是充满活力',
                traits: ['活泼', '乐观', '领导力'],
                favoriteTopics: ['活动', '音乐', '朋友'],
                dialogStyle: '语气轻快活泼，经常用感叹号，喜欢组织大家一起活动'
            },
            
            zhangFeng: {
                id: 'zhangFeng',
                name: '张峰',
                avatar: '😎',
                type: 'student',
                personality: 'rebellious', // 叛逆型
                description: '成绩一般但很讲义气，有自己的原则和想法',
                traits: ['义气', '独立', '有原则'],
                favoriteTopics: ['自由', '公平', '友谊'],
                dialogStyle: '说话直接坦率，有时会挑战权威，但对朋友很忠诚'
            },
            
            chenShiya: {
                id: 'chenShiya',
                name: '陈诗雅',
                avatar: '😌',
                type: 'student',
                personality: 'gentle', // 温柔型
                description: '文静善良，是很好的倾听者，喜欢文学艺术',
                traits: ['温柔', '善良', '有艺术天分'],
                favoriteTopics: ['文学', '艺术', '心情'],
                dialogStyle: '说话轻声细语，善于倾听，经常给出温暖的建议'
            },
            
            liuHaoran: {
                id: 'liuHaoran',
                name: '刘浩然',
                avatar: '💪',
                type: 'student',
                personality: 'competitive', // 竞争型
                description: '什么都要争第一，但也推动大家一起进步',
                traits: ['好胜', '努力', '有上进心'],
                favoriteTopics: ['比赛', '成绩', '挑战'],
                dialogStyle: '说话充满干劲，喜欢比较和竞争，但也会鼓励别人'
            },
            
            // === 老师们 ===
            teacherLin: {
                id: 'teacherLin',
                name: '林老师',
                avatar: '👩‍🏫',
                type: 'teacher',
                subject: '语文',
                personality: 'literary', // 文艺型
                description: '语文老师，文艺范，经常引用古诗词，温和但有原则',
                traits: ['文雅', '有原则', '博学'],
                favoriteTopics: ['文学', '人生', '品格'],
                dialogStyle: '说话优雅，经常引用诗词，善于用文学来教育学生'
            },
            
            teacherWang: {
                id: 'teacherWang',
                name: '王老师',
                avatar: '👨‍🏫',
                type: 'teacher',
                subject: '数学',
                personality: 'logical', // 逻辑型
                description: '数学老师，逻辑严谨，看似严厉实则关心学生',
                traits: ['严谨', '逻辑性强', '负责任'],
                favoriteTopics: ['逻辑', '思维', '解题'],
                dialogStyle: '说话条理清晰，喜欢讲道理，看似严厉但关心学生'
            },
            
            teacherChen: {
                id: 'teacherChen',
                name: 'Miss Chen',
                avatar: '👩‍💼',
                type: 'teacher',
                subject: '英语',
                personality: 'energetic', // 活力型
                description: '英语老师，年轻活力，喜欢用英语口语互动',
                traits: ['年轻', '活力', '国际化'],
                favoriteTopics: ['英语', '文化', '未来'],
                dialogStyle: '说话活力四射，经常夹杂英语，鼓励学生开口说英语'
            },
            
            teacherZhang: {
                id: 'teacherZhang',
                name: '张教练',
                avatar: '🏃‍♂️',
                type: 'teacher',
                subject: '体育',
                personality: 'energetic', // 热血型
                description: '体育老师，热血青春，经常说"身体是革命的本钱"',
                traits: ['热血', '正能量', '关心健康'],
                favoriteTopics: ['运动', '健康', '团队'],
                dialogStyle: '说话充满激情，声音洪亮，总是强调运动的重要性'
            },
            
            teacherLi: {
                id: 'teacherLi',
                name: '李老师',
                avatar: '👩‍🔬',
                type: 'teacher',
                subject: '生物',
                role: '班主任',
                personality: 'caring', // 关怀型
                description: '班主任兼生物老师，温柔细心，像大姐姐一样关心每个学生',
                traits: ['温柔', '细心', '负责任'],
                favoriteTopics: ['学生成长', '生活', '未来'],
                dialogStyle: '说话温柔关怀，总是为学生着想，善于发现学生的优点'
            },
            
            // === 学校工作人员 ===
            securityWang: {
                id: 'securityWang',
                name: '保安老王',
                avatar: '👮‍♂️',
                type: 'staff',
                personality: 'protective', // 保护型
                description: '学校保安，看似严厉实际温暖，总是关心学生安全',
                traits: ['负责', '温暖', '有原则'],
                favoriteTopics: ['安全', '纪律', '关心'],
                dialogStyle: '说话直接但关心，经常提醒安全事项，实际很温暖'
            },
            
            cafeteriaLi: {
                id: 'cafeteriaLi',
                name: '李阿姨',
                avatar: '👩‍🍳',
                type: 'staff',
                personality: 'motherly', // 母性型
                description: '食堂阿姨，热情大嗓门，会多给喜欢的学生打菜',
                traits: ['热情', '大嗓门', '关心学生'],
                favoriteTopics: ['吃饭', '营养', '关心'],
                dialogStyle: '说话热情洪亮，像妈妈一样关心学生的饮食'
            },
            
            shopZhang: {
                id: 'shopZhang',
                name: '张叔',
                avatar: '👨‍💼',
                type: 'staff',
                personality: 'friendly', // 亲切型
                description: '小卖部老板，记得每个学生的喜好，像邻居大叔一样亲切',
                traits: ['记忆力好', '亲切', '关注细节'],
                favoriteTopics: ['学生喜好', '小零食', '日常'],
                dialogStyle: '说话亲切随和，总能记住学生的小习惯和喜好'
            },
            
            // === 家人 ===
            father: {
                id: 'father',
                name: '爸爸',
                avatar: '👨‍💻',
                type: 'family',
                personality: 'rational', // 理性型
                description: 'IT工程师，理性温和，支持孩子的兴趣发展',
                traits: ['理性', '温和', '支持型'],
                favoriteTopics: ['技术', '未来', '成长'],
                dialogStyle: '说话理性客观，善于分析问题，给出建设性建议'
            },
            
            mother: {
                id: 'mother',
                name: '妈妈',
                avatar: '👩‍🏫',
                type: 'family',
                personality: 'caring', // 关怀型
                description: '中学教师，既理解教育又有时会焦虑孩子成绩',
                traits: ['关心', '理解教育', '有时焦虑'],
                favoriteTopics: ['学习', '成长', '未来'],
                dialogStyle: '说话关怀备至，有时会担心成绩，但理解教育的真谛'
            },
            
            hakimi: {
                id: 'hakimi',
                name: '哈基米',
                avatar: '🐱',
                type: 'pet',
                personality: 'cute', // 可爱型
                description: '家里的橘猫，开心果，会在关键时刻给主角安慰',
                traits: ['可爱', '温暖', '治愈'],
                favoriteTopics: ['玩耍', '陪伴', '撒娇'],
                dialogStyle: '喵喵叫和各种可爱的行为，是情感支持的来源'
            }
        };
    }
    
    /**
     * 获取角色信息
     * @param {string} characterId - 角色ID
     * @returns {Object} 角色信息
     */
    getCharacter(characterId) {
        return this.characters[characterId] || null;
    }
    
    /**
     * 获取角色头像
     * @param {string} characterId - 角色ID
     * @returns {string} 头像emoji
     */
    getAvatar(characterId) {
        const character = this.getCharacter(characterId);
        return character ? character.avatar : '👤';
    }
    
    /**
     * 获取角色名称
     * @param {string} characterId - 角色ID
     * @returns {string} 角色名称
     */
    getName(characterId) {
        const character = this.getCharacter(characterId);
        return character ? character.name : '未知';
    }
    
    /**
     * 根据类型获取角色列表
     * @param {string} type - 角色类型
     * @returns {Array} 角色列表
     */
    getCharactersByType(type) {
        return Object.values(this.characters).filter(char => char.type === type);
    }
    
    /**
     * 获取所有学生角色
     * @returns {Array} 学生角色列表
     */
    getStudents() {
        return this.getCharactersByType('student');
    }
    
    /**
     * 获取所有老师角色
     * @returns {Array} 老师角色列表
     */
    getTeachers() {
        return this.getCharactersByType('teacher');
    }
    
    /**
     * 获取所有家人角色
     * @returns {Array} 家人角色列表
     */
    getFamily() {
        return this.getCharactersByType('family');
    }
    
    /**
     * 根据性格类型获取角色
     * @param {string} personality - 性格类型
     * @returns {Array} 匹配的角色列表
     */
    getCharactersByPersonality(personality) {
        return Object.values(this.characters).filter(char => char.personality === personality);
    }
    
    /**
     * 获取角色的关系值
     * @param {string} characterId - 角色ID
     * @returns {number} 关系值 (-10 到 10)
     */
    getRelationship(characterId) {
        return window.player ? window.player.relationships[characterId] || 0 : 0;
    }
    
    /**
     * 获取关系描述文本
     * @param {string} characterId - 角色ID
     * @returns {string} 关系描述
     */
    getRelationshipText(characterId) {
        const value = this.getRelationship(characterId);
        
        if (value >= 8) return '非常亲密';
        if (value >= 6) return '很好的朋友';
        if (value >= 4) return '好朋友';
        if (value >= 2) return '朋友';
        if (value >= 0) return '普通';
        if (value >= -2) return '有些疏远';
        if (value >= -4) return '关系紧张';
        if (value >= -6) return '不太喜欢';
        if (value >= -8) return '很不喜欢';
        return '非常讨厌';
    }
    
    /**
     * 根据关系值生成对话语气
     * @param {Object} character - 角色对象
     * @param {string} baseDialog - 基础对话
     * @returns {string} 调整后的对话
     */
    adjustDialogByRelationship(character, baseDialog) {
        // 获取关系系统
        const relationshipSystem = this.gameEngine?.getSystem('relationship');
        
        if (!relationshipSystem) return baseDialog;
        
        // 根据关系值和角色性格调整对话语气
        // TODO: 实现关系值对对话的影响
        return baseDialog;
    }
    
    // ===== 升级的对话系统 =====
    
    /**
     * 获取角色的所有对话内容（多套）
     * @param {string} characterId - 角色ID
     * @returns {Object} 包含不同关系等级的对话
     */
    getAllDialogues(characterId) {
        console.log('🗣️ 获取角色所有对话:', characterId);
        
        // 多套对话系统 - 根据关系等级
        const multiDialogues = {
            // === 老师们 ===
            '语文老师': {
                hostile: [ // 关系恶劣 (0-20)
                    { speaker: '语文老师', text: '呃...你好...', mood: 'distant', action: 'look_away' },
                    { speaker: '我', text: '老师...', mood: 'nervous' },
                    { speaker: '语文老师', text: '有事吗？我还有课要准备...', mood: 'cold' }
                ],
                distant: [ // 关系疏远 (21-40)
                    { speaker: '语文老师', text: '你好，最近学习怎么样？', mood: 'professional', action: 'adjust_materials' },
                    { speaker: '我', text: '还可以吧，老师。', mood: 'polite' },
                    { speaker: '语文老师', text: '嗯，继续努力。', mood: 'neutral' }
                ],
                normal: [ // 关系正常 (41-69)
                    { speaker: '语文老师', text: '哈哈，又见面了！最近有在好好学习吗？', mood: 'cheerful', action: 'smile' },
                    { speaker: '我', text: '当然有！老师您教得很有趣。', mood: 'happy' },
                    { speaker: '语文老师', text: '那就好！记住，学习语文不仅仅是为了考试，更是为了提升自己的文化素养哦。', mood: 'encouraging' }
                ],
                close: [ // 关系亲密 (70-100)
                    { speaker: '语文老师', text: '小家伙！又来找我啦？哈哈哈！', mood: 'excited', action: 'pat_shoulder' },
                    { speaker: '我', text: '老师您今天心情真好！', mood: 'delighted' },
                    { speaker: '语文老师', text: '当然啦！看到你们进步我就开心！来，有什么问题尽管问！', mood: 'warm', action: 'open_arms' }
                ]
            },
            
            '数学老师': {
                hostile: [
                    { speaker: '数学老师', text: '哼！你还敢来见我？', mood: 'angry', action: 'stern_look' },
                    { speaker: '我', text: '老师，我...', mood: 'scared' },
                    { speaker: '数学老师', text: '别废话！赶紧去做题！', mood: 'furious', action: 'point_finger' }
                ],
                distant: [
                    { speaker: '数学老师', text: '站住！你最近上课有没有好好听讲？', mood: 'strict', action: 'cross_arms' },
                    { speaker: '我', text: '有... 有的，老师。', mood: 'nervous' },
                    { speaker: '数学老师', text: '那好，这道题你会做吗？不会的话给我站到后面去！', mood: 'testing' }
                ],
                normal: [
                    { speaker: '数学老师', text: '来，我看看你最近的作业怎么样。', mood: 'professional', action: 'check_notebook' },
                    { speaker: '我', text: '老师，这道题我不太懂...', mood: 'confused' },
                    { speaker: '数学老师', text: '嗯，让我看看...这里你要注意...', mood: 'teaching', action: 'point_at_problem' }
                ],
                close: [
                    { speaker: '数学老师', text: '不错嘛，最近进步很大！', mood: 'proud', action: 'nod_approval' },
                    { speaker: '我', text: '谢谢老师的指导！', mood: 'grateful' },
                    { speaker: '数学老师', text: '继续保持，数学是需要持之以恒的！有问题随时来问我。', mood: 'encouraging' }
                ]
            },
            
            // === 学生们 ===
            '刘语晴': {
                hostile: [
                    { speaker: '刘语晴', text: '哼，怎么是你...', mood: 'annoyed', action: 'turn_away' },
                    { speaker: '我', text: '雨晴...', mood: 'awkward' },
                    { speaker: '刘语晴', text: '有事快说，没事别烦我。', mood: 'cold' }
                ],
                distant: [
                    { speaker: '刘语晴', text: '哦，是你啊...', mood: 'neutral', action: 'shrug' },
                    { speaker: '我', text: '最近怎么样？', mood: 'polite' },
                    { speaker: '刘语晴', text: '还行吧...', mood: 'distant' }
                ],
                normal: [
                    { speaker: '刘语晴', text: '哈哈，你看到刚才那个笑话了吗？太好笑了！', mood: 'excited', action: 'laugh' },
                    { speaker: '我', text: '什么笑话？分享一下呗。', mood: 'curious' },
                    { speaker: '刘语晴', text: '就是... 哈哈哈，我现在想起来还想笑！', mood: 'amused', action: 'cover_mouth' }
                ],
                close: [
                    { speaker: '刘语晴', text: '我的好朋友！快来快来！我有好消息告诉你！', mood: 'excited', action: 'grab_hands' },
                    { speaker: '我', text: '什么好消息？你这么开心！', mood: 'excited' },
                    { speaker: '刘语晴', text: '新番出了！而且超级好看！我们一起追剧吧！', mood: 'delighted', action: 'bounce' }
                ]
            },
            
            '李昕瑶': {
                hostile: [
                    { speaker: '李昕瑶', text: '...', mood: 'cold', action: 'ignore' },
                    { speaker: '我', text: '昕瑶？', mood: 'confused' },
                    { speaker: '李昕瑶', text: '我很忙，没时间闲聊。', mood: 'dismissive' }
                ],
                distant: [
                    { speaker: '李昕瑶', text: '你好。', mood: 'polite', action: 'nod_slightly' },
                    { speaker: '我', text: '最近学习压力大吗？', mood: 'concerned' },
                    { speaker: '李昕瑶', text: '还好，我能应付。', mood: 'composed' }
                ],
                normal: [
                    { speaker: '李昕瑶', text: '这道题你会做吗？我想验证一下我的答案。', mood: 'curious', action: 'show_notebook' },
                    { speaker: '我', text: '让我看看... 应该是这样做的。', mood: 'thoughtful' },
                    { speaker: '李昕瑶', text: '太好了，我们的答案一样！看来都做对了。', mood: 'satisfied' }
                ],
                close: [
                    { speaker: '李昕瑶', text: '你来得正好！我正想找人讨论这个问题呢！', mood: 'enthusiastic', action: 'wave_excitedly' },
                    { speaker: '我', text: '什么问题？我来看看能不能帮上忙。', mood: 'helpful' },
                    { speaker: '李昕瑶', text: '太好了！有你这样的学习伙伴真是太幸运了！', mood: 'grateful', action: 'beam' }
                ]
            }
            
            // ... 可以为每个角色添加更多对话套路
        };
        
        return multiDialogues[characterId] || {
            normal: [
                { speaker: characterId, text: '你好！', mood: 'neutral' },
                { speaker: '我', text: '你好！', mood: 'neutral' }
            ]
        };
    }
    
    /**
     * 获取角色的随机对话内容
     * @param {string} characterId - 角色ID
     * @param {string} relationshipLevel - 关系等级
     * @returns {Array} 随机选择的对话内容
     */
    getRandomDialogue(characterId, relationshipLevel = 'normal') {
        const allDialogues = this.getAllDialogues(characterId);
        const dialoguesForLevel = allDialogues[relationshipLevel] || allDialogues.normal;
        
        // 如果有多套对话，随机选择一套
        if (Array.isArray(dialoguesForLevel[0])) {
            const randomIndex = Math.floor(Math.random() * dialoguesForLevel.length);
            return dialoguesForLevel[randomIndex];
        }
        
        return dialoguesForLevel;
    }
    
    /**
     * 根据时间和情境获取特殊对话
     * @param {string} characterId - 角色ID
     * @param {string} context - 对话情境
     * @returns {Array} 特殊对话内容
     */
    getContextualDialogue(characterId, context) {
        const contextDialogues = {
            // 考试前
            'before_exam': {
                '李昕瑶': [
                    { speaker: '李昕瑶', text: '明天就要考试了，你准备好了吗？', mood: 'concerned', action: 'check_watch' },
                    { speaker: '我', text: '还有点紧张...', mood: 'nervous' },
                    { speaker: '李昕瑶', text: '别紧张，我们一起复习一下重点吧！', mood: 'encouraging', action: 'pat_back' }
                ],
                '张俊熙': [
                    { speaker: '张俊熙', text: '哎，明天又要考试，烦死了！', mood: 'frustrated', action: 'scratch_head' },
                    { speaker: '我', text: '你复习了吗？', mood: 'concerned' },
                    { speaker: '张俊熙', text: '复习什么啊，反正也考不好，算了算了！', mood: 'resigned', action: 'wave_hand' }
                ]
            },
            
            // 课间
            'break_time': {
                '刘语晴': [
                    { speaker: '刘语晴', text: '课间休息！终于可以放松一下了！', mood: 'relieved', action: 'stretch' },
                    { speaker: '我', text: '刚才的课听懂了吗？', mood: 'curious' },
                    { speaker: '刘语晴', text: '还行吧～不过我更想聊聊昨晚的动漫！', mood: 'excited', action: 'lean_forward' }
                ]
            },
            
            // 放学后
            'after_school': {
                '郑兴冉': [
                    { speaker: '郑兴冉', text: '放学了！要不要一起去操场运动一下？', mood: 'energetic', action: 'bounce_ball' },
                    { speaker: '我', text: '好啊，正好活动活动！', mood: 'excited' },
                    { speaker: '郑兴冉', text: '太好了！运动对身体好，对学习也有帮助！', mood: 'enthusiastic' }
                ]
            }
        };
        
        return contextDialogues[context]?.[characterId] || null;
    }
    
    /**
     * 获取角色在特定情境下的反应
     * @param {string} characterId - 角色ID
     * @param {string} situation - 情境类型
     * @returns {Object} 反应信息
     */
    getReaction(characterId, situation) {
        const character = this.getCharacter(characterId);
        const relationship = this.getRelationship(characterId);
        
        if (!character) return null;
        
        // 根据角色性格和关系值生成反应
        const reactions = {
            // 当玩家选择帮助他人时
            helpOthers: {
                studious: { positive: '这样做很棒！帮助别人也是一种学习。', neutral: '嗯，这是正确的选择。' },
                cheerful: { positive: '太好了！我也想一起帮忙！', neutral: '哇，你真善良！' },
                gentle: { positive: '你真的很温柔呢...', neutral: '这样很好。' },
                competitive: { positive: '虽然我不太理解，但你的想法很特别。', neutral: '每个人都有自己的选择。' },
                rebellious: { positive: '有原则的人，我欣赏。', neutral: '还不错。' }
            },
            
            // 当玩家专注学习时
            focusStudy: {
                studious: { positive: '太好了！一起努力吧！', neutral: '学习确实很重要。' },
                competitive: { positive: '这才对！我们来比比看谁学得更好！', neutral: '不错的选择。' },
                cheerful: { positive: '加油加油！不过也要注意休息哦！', neutral: '学习也很重要呢。' },
                gentle: { positive: '你很努力呢，要注意身体。', neutral: '学习确实需要专注。' },
                rebellious: { positive: '只要是你自己的选择就好。', neutral: '随你。' }
            }
        };
        
        const situationReactions = reactions[situation];
        if (!situationReactions || !situationReactions[character.personality]) {
            return { text: '...', mood: 'neutral' };
        }
        
        const personalityReactions = situationReactions[character.personality];
        const mood = relationship >= 4 ? 'positive' : 'neutral';
        
        return {
            text: personalityReactions[mood] || personalityReactions.neutral,
            mood: mood
        };
    }
    
    /**
     * 兼容性方法：获取角色的对话内容（保持向后兼容）
     * @param {string} characterId - 角色ID
     * @returns {Array} 对话数组
     */
    getDialogue(characterId) {
        console.log('🗣️ 获取角色对话 (兼容性调用):', characterId);
        
        // 获取关系系统
        const relationshipSystem = this.gameEngine?.getSystem('relationship');
        let relationshipLevel = 'normal';
        let relationshipValue = 50; // 默认关系值
        
        if (relationshipSystem) {
            relationshipValue = relationshipSystem.getRelationship(characterId);
            if (relationshipValue >= 70) {
                relationshipLevel = 'close';
            } else if (relationshipValue >= 40) {
                relationshipLevel = 'normal';
            } else if (relationshipValue >= 10) {
                relationshipLevel = 'distant';
            } else {
                relationshipLevel = 'hostile';
            }
            
            console.log('📊 关系等级:', characterId, '=', relationshipValue, '→', relationshipLevel);
        }
        
        // 获取对应等级的对话
        const dialogue = this.getRandomDialogue(characterId, relationshipLevel);
        
        // 添加音效和调试信息
        const processedDialogue = dialogue.map(line => ({
            ...line,
            soundEffect: line.soundEffect || this.getCharacterSoundEffect(characterId)
        }));
        
        console.log('🎭 生成对话:', characterId, relationshipLevel, processedDialogue);
        return processedDialogue;
    }
    
    /**
     * 获取角色音效类型
     * @param {string} characterId - 角色ID
     * @returns {string} 音效类型
     */
    getCharacterSoundEffect(characterId) {
        const soundMap = {
            // 老师们
            '语文老师': 'teacher_female',
            '数学老师': 'teacher_male',
            '英语老师': 'teacher_female',
            '道德与法治老师': 'teacher_female',
            '历史老师': 'teacher_male',
            '地理老师': 'teacher_male',
            '生物老师': 'teacher_female',
            '体育老师': 'teacher_male',
            '信息技术老师': 'teacher_male',
            
            // 学生们
            '张俊熙': 'student_male',
            '林浩阳': 'student_male',
            '刘语晴': 'student_female',
            '李昕瑶': 'student_female',
            '郑兴冉': 'student_male',
            '周泽宇': 'student_male',
            '王艺辰': 'student_male',
            '陈梓墨': 'student_male',
            
            // 工作人员
            '保安': 'teacher_male',
            '教导主任': 'teacher_male',
            '食堂阿姨': 'teacher_female'
        };
        
        return soundMap[characterId] || 'notification';
    }
}

// 创建全局角色管理器实例
window.characterManager = new CharacterManager(); 