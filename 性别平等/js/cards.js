/**
 * 卡牌数据文件
 * 包含所有游戏卡牌的定义：角色、事件卡、行动卡、项目卡、刻板印象卡
 */

/* ========== 角色定义 ========== */
const ROLES = [
    {
        id: 'policy_maker',
        name: '政策制定者',
        icon: '🏛️',
        description: '制定法律，推动社会变革',
        initialResources: {
            influence: 4,
            money: 2,
            support: 3
        },
        color: '#007AFF',
        passiveSkill: {
            name: '法令颁布',
            description: '在政治象限完成项目时，额外获得1影响力和1支持'
        },
        activeSkill: {
            name: '政治动员',
            description: '消耗2支持，使你所在象限本回合行动消耗减少1影响力',
            cost: { support: 2 },
            cooldown: 2,
            currentCooldown: 0
        }
    },
    {
        id: 'business_leader',
        name: '企业领袖',
        icon: '💼',
        description: '改变职场文化，创造平等机会',
        initialResources: {
            influence: 3,
            money: 5,
            support: 1
        },
        color: '#FF9500',
        passiveSkill: {
            name: '商业投资',
            description: '在职场象限执行赚取资金行动时，额外获得1资金'
        },
        activeSkill: {
            name: '经济赋能',
            description: '支付3资金，为一个项目立即推进2点进度',
            cost: { money: 3 },
            cooldown: 3,
            currentCooldown: 0
        }
    },
    {
        id: 'community_organizer',
        name: '社区组织者',
        icon: '🤝',
        description: '凝聚社会共识，推动基层改革',
        initialResources: {
            influence: 3,
            money: 1,
            support: 5
        },
        color: '#30D158',
        passiveSkill: {
            name: '草根网络',
            description: '手牌上限+1。在家庭象限移除刻板印象时，额外+1%进度'
        },
        activeSkill: {
            name: '团结一心',
            description: '消耗1支持，使你和同象限的另一名玩家下回合获得额外行动',
            cost: { support: 1 },
            cooldown: 2,
            currentCooldown: 0
        }
    },
    {
        id: 'educator',
        name: '教育工作者',
        icon: '📚',
        description: '打破刻板印象，培育平等意识',
        initialResources: {
            influence: 4,
            money: 2,
            support: 3
        },
        color: '#5E5CE6',
        passiveSkill: {
            name: '启迪心智',
            description: '在教育象限执行行动后，50%概率抽一张牌'
        },
        activeSkill: {
            name: '批判性思维',
            description: '立即免费破解你所在象限的一个刻板印象',
            cost: {},
            cooldown: 3,
            currentCooldown: 0
        }
    }
];

/* ========== 事件卡定义 ========== */
const EVENT_CARDS = [
    // 职场领域事件
    {
        id: 'event_01',
        name: '科技公司董事会性别失衡',
        type: 'event',
        category: 'negative',
        quadrant: 'workplace',
        description: '大型科技公司董事会中女性比例不足10%，引发公众关注。',
        effect: '本回合所有玩家在职场象限的行动消耗+1影响力',
        solveCost: { support: 2 },
        solveReward: { progress: 3, influence: 1 },
        flavorText: '玻璃天花板依然存在，但我们可以打破它。'
    },
    {
        id: 'event_02',
        name: '同工同酬法案提上议程',
        type: 'event',
        category: 'positive',
        quadrant: 'workplace',
        description: '政府开始讨论加强同工同酬的立法，社会反响热烈。',
        effect: '本回合在职场象限完成的行动效果+50%',
        solveReward: { progress: 4 },
        flavorText: '平等的劳动应获得平等的报酬。'
    },
    {
        id: 'event_03',
        name: '职场性骚扰案件曝光',
        type: 'event',
        category: 'negative',
        quadrant: 'workplace',
        description: '多家企业被曝出存在职场性骚扰问题，缺乏有效的举报机制。',
        effect: '职场象限暂时关闭，下回合才能进入',
        solveCost: { influence: 2, support: 1 },
        solveReward: { progress: 4 },
        flavorText: '每一个勇敢发声的人都在推动改变。'
    },
    {
        id: 'event_04',
        name: '灵活工作制度试点成功',
        type: 'event',
        category: 'positive',
        quadrant: 'workplace',
        description: '多家企业试点灵活工作制，帮助员工平衡工作与家庭。',
        effect: '本回合家庭与职场象限的行动可以联合执行',
        solveReward: { progress: 3, money: 1 },
        flavorText: '工作与生活的平衡让每个人都受益。'
    },
    
    // 家庭领域事件
    {
        id: 'event_05',
        name: '无偿家务劳动分配不公',
        type: 'event',
        category: 'negative',
        quadrant: 'family',
        description: '调查显示，女性承担了75%的无偿家务劳动，严重影响职业发展。',
        effect: '在家庭象限的行动消耗+1影响力',
        solveCost: { influence: 2 },
        solveReward: { progress: 3 },
        flavorText: '家务不是某一性别的专属责任。'
    },
    {
        id: 'event_06',
        name: '男性产假倡议获得支持',
        type: 'event',
        category: 'positive',
        quadrant: 'family',
        description: '越来越多企业开始提供男性带薪产假，促进育儿责任共担。',
        effect: '本回合所有玩家获得+1支持',
        solveReward: { progress: 4, support: 1 },
        flavorText: '育儿是双方的责任和幸福。'
    },
    {
        id: 'event_07',
        name: '家庭暴力案件增加',
        type: 'event',
        category: 'negative',
        quadrant: 'family',
        description: '家庭暴力报案数量上升，需要更多社会支持和保护措施。',
        effect: '所有玩家-1支持',
        solveCost: { support: 2, money: 1 },
        solveReward: { progress: 5 },
        flavorText: '保护受害者，打破沉默的循环。'
    },
    {
        id: 'event_08',
        name: '普惠托儿服务扩展',
        type: 'event',
        category: 'positive',
        quadrant: 'family',
        description: '政府投资建设更多公共托儿所，减轻家庭育儿负担。',
        effect: '本回合在家庭象限执行行动的玩家可以额外抽1张行动卡',
        solveReward: { progress: 4, money: 1 },
        flavorText: '社会支持让父母都能追求事业。'
    },
    
    // 教育领域事件
    {
        id: 'event_09',
        name: '教材中的性别刻板印象',
        type: 'event',
        category: 'negative',
        quadrant: 'education',
        description: '学校教材中存在大量性别刻板印象内容，需要修订。',
        effect: '在教育象限添加1个"刻板印象"标记',
        solveCost: { influence: 2, support: 1 },
        solveReward: { progress: 4 },
        flavorText: '教育塑造未来，我们要给孩子正确的价值观。'
    },
    {
        id: 'event_10',
        name: '女性STEM教育项目启动',
        type: 'event',
        category: 'positive',
        quadrant: 'education',
        description: '专门鼓励女生学习科学、技术、工程和数学的教育项目获得资助。',
        effect: '本回合在教育象限执行行动时效果翻倍',
        solveReward: { progress: 5, influence: 1 },
        flavorText: '兴趣和能力无关性别，只关乎机会。'
    },
    {
        id: 'event_11',
        name: '校园性别欺凌事件',
        type: 'event',
        category: 'negative',
        quadrant: 'education',
        description: '多所学校报告了基于性别的校园欺凌事件，需要干预机制。',
        effect: '下回合所有玩家在教育象限的行动被跳过',
        solveCost: { influence: 2, support: 2 },
        solveReward: { progress: 4 },
        flavorText: '创造安全包容的校园环境是每个人的责任。'
    },
    {
        id: 'event_12',
        name: '性别平等教育课程推广',
        type: 'event',
        category: 'positive',
        quadrant: 'education',
        description: '多所学校开始在课程中加入性别平等教育内容。',
        effect: '移除所有象限的1个刻板印象标记',
        solveReward: { progress: 4, influence: 1 },
        flavorText: '从小培养平等意识，改变从教育开始。'
    },
    
    // 政治领域事件
    {
        id: 'event_13',
        name: '女性参政率依然偏低',
        type: 'event',
        category: 'negative',
        quadrant: 'politics',
        description: '议会中女性代表比例不足30%，声音难以被充分听见。',
        effect: '在政治象限的行动消耗+1支持',
        solveCost: { influence: 2, support: 1 },
        solveReward: { progress: 3 },
        flavorText: '代表性很重要，决策应反映全体人民的利益。'
    },
    {
        id: 'event_14',
        name: '反歧视法获得通过',
        type: 'event',
        category: 'positive',
        quadrant: 'politics',
        description: '一项全面的反性别歧视法律正式生效，提供法律保护。',
        effect: '本回合社会进度+5%',
        solveReward: { progress: 6, support: 2 },
        flavorText: '法律是保护平等的基石。'
    },
    {
        id: 'event_15',
        name: '政策制定过程缺乏性别视角',
        type: 'event',
        category: 'negative',
        quadrant: 'politics',
        description: '许多公共政策在制定时没有充分考虑性别影响评估。',
        effect: '本回合所有项目推进速度减半',
        solveCost: { influence: 3 },
        solveReward: { progress: 4 },
        flavorText: '政策应考虑对所有性别的不同影响。'
    },
    {
        id: 'event_16',
        name: '性别平等委员会成立',
        type: 'event',
        category: 'positive',
        quadrant: 'politics',
        description: '政府成立专门的性别平等委员会，监督和推进平等政策。',
        effect: '所有玩家+1影响力',
        solveReward: { progress: 5, support: 1 },
        flavorText: '制度化的保障让平等成为持续的承诺。'
    },
    
    // 跨领域事件
    {
        id: 'event_17',
        name: '媒体中的性别刻板印象',
        type: 'event',
        category: 'negative',
        quadrant: 'all',
        description: '影视、广告中充斥着性别刻板印象，影响公众认知。',
        effect: '所有象限各添加1个刻板印象标记',
        solveCost: { influence: 3, support: 2 },
        solveReward: { progress: 6 },
        duration: 2, // 持续2回合
        failTurns: 3, // 3回合未解决触发失败
        failEffect: { progressLoss: 5 },
        flavorText: '媒体塑造文化，我们需要更负责任的表达。'
    },
    {
        id: 'event_18',
        name: '国际妇女节庆祝活动',
        type: 'event',
        category: 'positive',
        quadrant: 'all',
        description: '全社会举办丰富的性别平等主题活动，提高公众意识。',
        effect: '所有玩家选择获得2点任意资源',
        solveReward: { progress: 3 },
        flavorText: '纪念过往成就，展望未来目标。'
    },
    {
        id: 'event_19',
        name: '经济危机冲击',
        type: 'event',
        category: 'negative',
        quadrant: 'all',
        description: '经济下行期间，性别平等议题的关注度和资源都在下降。',
        effect: '所有玩家-1资金',
        solveCost: { money: 2, support: 1 },
        solveReward: { progress: 3 },
        duration: 1,
        failTurns: 2,
        failEffect: { progressLoss: 3 },
        flavorText: '危机不应成为倒退的借口。'
    },
    {
        id: 'event_20',
        name: '社会运动推动变革',
        type: 'event',
        category: 'positive',
        quadrant: 'all',
        description: '大规模的性别平等社会运动引发全国讨论和行动。',
        effect: '本回合所有行动效果+2进度',
        solveReward: { progress: 5, influence: 2 },
        flavorText: '人民的声音是改变的力量。'
    },
    // 新增挑战事件
    {
        id: 'event_21',
        name: '算法性别偏见曝光',
        type: 'event',
        category: 'negative',
        quadrant: 'workplace',
        description: '研究发现，AI招聘算法存在系统性性别歧视，偏好男性求职者。',
        effect: '职场象限本地进度-3%',
        solveCost: { influence: 3, money: 2 },
        solveReward: { progress: 5, influence: 1 },
        duration: 2,
        failTurns: 3,
        failEffect: { progressLoss: 4 },
        flavorText: '技术不是中立的，它反映了创造者的价值观。'
    },
    {
        id: 'event_22',
        name: '职场母职惩罚现象',
        type: 'event',
        category: 'negative',
        quadrant: 'workplace',
        description: '统计显示，女性员工生育后面临明显的升职困难和工资下降。',
        effect: '职场和家庭象限的行动消耗各+1资源',
        solveCost: { support: 3, influence: 2 },
        solveReward: { progress: 6 },
        duration: 2,
        failTurns: 3,
        failEffect: { progressLoss: 4 },
        flavorText: '生育不应成为职业发展的惩罚。'
    },
    {
        id: 'event_23',
        name: '男性育儿假改革',
        type: 'event',
        category: 'positive',
        quadrant: 'family',
        description: '政府推动男性带薪育儿假政策，鼓励父亲参与育儿。',
        effect: '家庭象限本地进度+3%，本回合家庭象限行动效率翻倍',
        solveReward: { progress: 7, support: 2 },
        flavorText: '育儿是双方的责任，也是双倍的幸福。'
    },
    {
        id: 'event_24',
        name: 'STEM领域性别差距报告',
        type: 'event',
        category: 'negative',
        quadrant: 'education',
        description: '最新研究显示，女性在STEM领域的代表性持续下降。',
        effect: '教育象限本地进度-2%',
        solveCost: { influence: 2, support: 2 },
        solveReward: { progress: 5 },
        duration: 2,
        failTurns: 3,
        failEffect: { progressLoss: 3 },
        flavorText: '兴趣和能力无关性别，只关乎机会和鼓励。'
    },
    {
        id: 'event_25',
        name: '性别平等教育立法',
        type: 'event',
        category: 'positive',
        quadrant: 'politics',
        description: '性别平等教育正式纳入国家课程标准。',
        effect: '教育和政治象限本地进度各+2%',
        solveReward: { progress: 8, influence: 2 },
        flavorText: '教育是改变的起点，立法是承诺的保障。'
    }
];

/* ========== 行动卡定义 ========== */
const ACTION_CARDS = [
    // 基础行动卡
    {
        id: 'action_01',
        name: '公众倡导',
        type: 'action',
        description: '通过媒体和社交平台倡导性别平等理念',
        cost: { influence: 1 },
        effect: { progress: 2, support: 1 },
        quadrant: 'any',
        flavorText: '每一次发声都在改变认知。'
    },
    {
        id: 'action_02',
        name: '社区教育活动',
        type: 'action',
        description: '在社区组织性别平等教育讲座和工作坊',
        cost: { influence: 1, money: 1 },
        effect: { progress: 3 },
        quadrant: 'family',
        flavorText: '改变从身边开始。'
    },
    {
        id: 'action_03',
        name: '政策研究报告',
        type: 'action',
        description: '发布详实的性别平等研究报告，为政策制定提供依据',
        cost: { influence: 2 },
        effect: { progress: 3, support: 1 },
        quadrant: 'politics',
        flavorText: '数据揭示真相，研究推动政策。'
    },
    {
        id: 'action_04',
        name: '企业培训项目',
        type: 'action',
        description: '为企业提供性别平等意识培训',
        cost: { influence: 1, money: 1 },
        effect: { progress: 3, money: 1 },
        quadrant: 'workplace',
        flavorText: '改变企业文化，从培训开始。'
    },
    {
        id: 'action_05',
        name: '草根抗议活动',
        type: 'action',
        description: '组织和平抗议，反对性别歧视',
        cost: { influence: 2, support: 1 },
        effect: { progress: 4 },
        quadrant: 'any',
        flavorText: '沉默不会带来改变。'
    },
    {
        id: 'action_06',
        name: '建立支持网络',
        type: 'action',
        description: '为受歧视者建立互助支持网络',
        cost: { influence: 1 },
        effect: { support: 2 },
        quadrant: 'family',
        flavorText: '团结就是力量。'
    },
    {
        id: 'action_07',
        name: '媒体曝光',
        type: 'action',
        description: '通过媒体曝光性别不平等现象',
        cost: { influence: 2 },
        effect: { progress: 3, influence: 1 },
        quadrant: 'any',
        flavorText: '阳光是最好的消毒剂。'
    },
    {
        id: 'action_08',
        name: '法律诉讼',
        type: 'action',
        description: '通过法律途径维护性别平等权益',
        cost: { money: 2, influence: 1 },
        effect: { progress: 4 },
        quadrant: 'politics',
        flavorText: '法律是最后的防线。'
    },
    {
        id: 'action_09',
        name: '课程改革',
        type: 'action',
        description: '推动学校课程中加入性别平等内容',
        cost: { influence: 2, support: 1 },
        effect: { progress: 4 },
        quadrant: 'education',
        flavorText: '教育塑造未来。'
    },
    {
        id: 'action_10',
        name: '资金筹集',
        type: 'action',
        description: '为性别平等项目筹集资金',
        cost: { influence: 1, support: 1 },
        effect: { money: 3 },
        quadrant: 'any',
        flavorText: '资源是行动的基础。'
    },
    {
        id: 'action_11',
        name: '联合行动',
        type: 'action',
        description: '与其他玩家联合执行一个更强大的行动',
        cost: { influence: 1 },
        effect: { progress: 2 },
        special: 'cooperative',
        quadrant: 'any',
        flavorText: '合作的力量大于个体之和。'
    },
    {
        id: 'action_12',
        name: '破除刻板印象',
        type: 'action',
        description: '针对性地破除一个领域的性别刻板印象',
        cost: { influence: 2, support: 1 },
        effect: 'remove_stereotype',
        quadrant: 'any',
        flavorText: '打破固有认知，创造新的可能。'
    },
    {
        id: 'action_13',
        name: '跨领域合作',
        type: 'action',
        description: '与其他象限的玩家合作，产生协同效应',
        cost: { influence: 1, support: 1 },
        effect: { progress: 3, support: 1 },
        special: 'requires_cooperation',
        quadrant: 'any',
        flavorText: '打破壁垒，共同前进。'
    },
    {
        id: 'action_14',
        name: '数据调研',
        type: 'action',
        description: '进行深入的性别数据调查，为政策提供依据',
        cost: { money: 2 },
        effect: { progress: 2, influence: 2 },
        quadrant: 'any',
        flavorText: '数据揭示真相，研究推动变革。'
    },
    {
        id: 'action_15',
        name: '公益诉讼',
        type: 'action',
        description: '支持具有里程碑意义的平等权利诉讼',
        cost: { money: 3, influence: 1 },
        effect: 'remove_stereotype_any_quadrant',
        quadrant: 'politics',
        flavorText: '法律的改变是社会进步的镜子。'
    },
    {
        id: 'action_16',
        name: '企业内部培训',
        type: 'action',
        description: '为企业提供性别平等意识和反骚扰培训',
        cost: { money: 2, influence: 1 },
        effect: { progress: 4 },
        quadrant: 'workplace',
        flavorText: '改变企业文化，从培训开始。'
    },
    {
        id: 'action_17',
        name: '建立互助小组',
        type: 'action',
        description: '在社区建立女性互助支持小组',
        cost: { support: 2 },
        effect: { support: 3, progress: 2 },
        quadrant: 'family',
        flavorText: '团结就是力量，倾听即是疗愈。'
    },
    {
        id: 'action_18',
        name: '课程改革',
        type: 'action',
        description: '推动学校教材和课程中的性别平等内容改革',
        cost: { influence: 3, support: 1 },
        effect: { progress: 5 },
        quadrant: 'education',
        flavorText: '今天的教育，塑造明天的社会。'
    },
    {
        id: 'action_19',
        name: '快速响应',
        type: 'action',
        description: '对突发的性别歧视事件进行快速公众响应',
        cost: { influence: 2 },
        effect: { progress: 3, influence: 1 },
        quadrant: 'any',
        flavorText: '及时发声，让不公无处藏身。'
    },
    {
        id: 'action_20',
        name: '资源整合',
        type: 'action',
        description: '整合各方资源，为平等事业提供支持',
        cost: { support: 2 },
        effect: { money: 3, influence: 1 },
        quadrant: 'any',
        flavorText: '集众人之力，成大事之业。'
    }
];

/* ========== 项目卡定义 ========== */
const PROJECT_CARDS = [
    {
        id: 'project_01',
        name: '建立普惠托儿所网络',
        type: 'project',
        quadrant: 'family',
        description: '在社区建立可负担的优质托儿服务，让父母都能工作',
        initiationCost: { money: 2, influence: 1 },
        requiredTotal: { money: 8, support: 4, influence: 2 },
        progressNeeded: 14, // 总资源值
        reward: { progress: 10, support: 2 },
        completionBonus: '永久效果：所有玩家在职场获取资金时+1',
        flavorText: '让育儿不再是职业发展的障碍。'
    },
    {
        id: 'project_02',
        name: '推动反歧视立法',
        type: 'project',
        quadrant: 'politics',
        description: '推动一项全面的反性别歧视法律通过',
        initiationCost: { influence: 2, support: 2 },
        requiredTotal: { influence: 6, support: 8, money: 2 },
        progressNeeded: 16,
        reward: { progress: 15, influence: 2 },
        completionBonus: '永久效果：移除刻板印象消耗减少1',
        flavorText: '法律保障让平等成为权利而非恩赐。'
    },
    {
        id: 'project_03',
        name: '性别平等教育课程',
        type: 'project',
        quadrant: 'education',
        description: '在全国学校推广系统的性别平等教育',
        initiationCost: { influence: 2, money: 1 },
        requiredTotal: { influence: 5, support: 5, money: 3 },
        progressNeeded: 13,
        reward: { progress: 12, support: 1 },
        completionBonus: '永久效果：每回合开始时抽1张额外手牌',
        flavorText: '从小培养，影响一代人。'
    },
    {
        id: 'project_04',
        name: '企业平等认证计划',
        type: 'project',
        quadrant: 'workplace',
        description: '建立企业性别平等认证体系，鼓励最佳实践',
        initiationCost: { money: 2, support: 1 },
        requiredTotal: { money: 6, influence: 3, support: 3 },
        progressNeeded: 12,
        reward: { progress: 10, money: 2 },
        completionBonus: '永久效果：职场象限本地进度+5%',
        flavorText: '市场的力量推动企业自发改变。'
    },
    {
        id: 'project_05',
        name: '家暴庇护所建设',
        type: 'project',
        quadrant: 'family',
        description: '建立安全庇护所和支持系统，保护家暴受害者',
        initiationCost: { money: 2, influence: 1 },
        requiredTotal: { money: 5, support: 6, influence: 2 },
        progressNeeded: 13,
        reward: { progress: 8, support: 2 },
        completionBonus: '永久效果：家庭象限本地进度+5%',
        flavorText: '每个人都应该有安全的住所。'
    },
    {
        id: 'project_06',
        name: '女性领导力培养计划',
        type: 'project',
        quadrant: 'workplace',
        description: '培养和支持女性进入领导岗位',
        initiationCost: { influence: 2, money: 1 },
        requiredTotal: { influence: 5, money: 4, support: 3 },
        progressNeeded: 12,
        reward: { progress: 10, influence: 1 },
        completionBonus: '永久效果：职场项目所需进度-2',
        flavorText: '领导力无关性别，只关乎能力和机会。'
    },
    {
        id: 'project_07',
        name: '反性骚扰举报机制',
        type: 'project',
        quadrant: 'workplace',
        description: '建立有效的性骚扰举报和处理机制',
        initiationCost: { influence: 2, support: 1 },
        requiredTotal: { influence: 4, support: 5, money: 2 },
        progressNeeded: 11,
        reward: { progress: 9, support: 2 },
        completionBonus: '永久效果：解决职场事件时奖励+2进度',
        flavorText: '安全的工作环境是基本权利。'
    },
    {
        id: 'project_08',
        name: 'STEM女性导师计划',
        type: 'project',
        quadrant: 'education',
        description: '为女生提供STEM领域的榜样和指导',
        initiationCost: { money: 1, support: 1 },
        requiredTotal: { influence: 3, money: 4, support: 4 },
        progressNeeded: 11,
        reward: { progress: 10, influence: 1 },
        completionBonus: '永久效果：教育象限本地进度+5%',
        flavorText: '看见可能性，才能成为可能性。'
    }
];

/* ========== 刻板印象卡定义 ========== */
const STEREOTYPE_CARDS = [
    {
        id: 'stereotype_01',
        name: '男主外女主内',
        quadrant: 'family',
        effect: '在家庭象限的行动消耗+1影响力',
        description: '传统观念认为男性应该工作，女性应该照顾家庭'
    },
    {
        id: 'stereotype_02',
        name: '女性不适合领导',
        quadrant: 'workplace',
        effect: '在职场象限的项目需要额外1点进度',
        description: '根深蒂固的偏见认为女性缺乏领导能力'
    },
    {
        id: 'stereotype_03',
        name: '理工科是男生的天下',
        quadrant: 'education',
        effect: '在教育象限的行动消耗+1资金',
        description: '刻板印象导致女生在STEM领域被低估'
    },
    {
        id: 'stereotype_04',
        name: '政治是男人的游戏',
        quadrant: 'politics',
        effect: '在政治象限的行动消耗+1支持',
        description: '女性在政治领域面临更多阻力和偏见'
    }
];

/* ========== 里程碑卡定义 ========== */
const MILESTONE_CARDS = [
    {
        id: 'milestone_01',
        name: '女性参政率突破30%',
        quadrant: 'politics',
        effect: '政治领域的所有行动效果+1',
        trigger: 'progress >= 30'
    },
    {
        id: 'milestone_02',
        name: '同工同酬法律生效',
        quadrant: 'workplace',
        effect: '职场领域的资源消耗-1',
        trigger: 'progress >= 40'
    },
    {
        id: 'milestone_03',
        name: '性别平等教育普及',
        quadrant: 'education',
        effect: '每回合开始时额外获得1张行动卡',
        trigger: 'progress >= 50'
    },
    {
        id: 'milestone_04',
        name: '社会托儿体系建立',
        quadrant: 'family',
        effect: '家庭象限的行动可以额外获得1支持',
        trigger: 'progress >= 60'
    }
];

