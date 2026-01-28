// 卡牌数据模板文件
// 请根据图片填写每张卡牌的具体信息，然后复制到 script.js 的 cardTemplates 数组中
// 
// 格式说明：
// - id: 卡牌唯一ID（从1开始递增）
// - name: 卡牌名称
// - cost: 左上角大数字（部署消耗）
// - moveCost: 左上角小数字（移动费用，单位卡才有，技能牌和事件牌不需要）
// - attack: 中下方左边数字（攻击力，单位卡才有）
// - health: 中下方右边数字（血量，单位卡才有）
// - type: 中下方中间图标（兵种：infantry/tank/artillery/fighter/bomber，或order/location）
// - nation: 国家（FR/UK/GER/USSR/US/JAP等）
// - keywords: 关键词数组（如['blitz', 'deploy', 'guard']等）
// - description: 最下面的文字（特殊效果描述）
// - image: 图片路径（相对于项目根目录）
// - rarity: 稀有度（common/limited/special/elite）
//
// 注意：
// - 技能牌和事件牌（type为'order'或'location'）不能占位置，只能打出获得效果
// - 单位卡（infantry/tank/artillery/fighter/bomber）需要填写 attack、health、moveCost
// - 如果单位卡没有移动费用，moveCost 可以不填或设为 undefined

const cardTemplates = [
    // 请根据图片填写以下34张卡牌的信息
    // 图片文件列表：
    // 1. 新建文件夹/微信图片_20260104130538_1061_25.png
    // 2. 新建文件夹/微信图片_20260104130539_1062_25.png
    // 3. 新建文件夹/微信图片_20260104130540_1063_25.png
    // ... (共34张)
    
    // 示例格式：
    // { id: 1, name: '卡牌名称', cost: 3, moveCost: 1, attack: 2, health: 3, type: 'infantry', nation: 'FR', keywords: ['blitz'], description: '特殊效果描述', image: '新建文件夹/微信图片_20260104130538_1061_25.png', rarity: 'common' },
    // { id: 2, name: '技能牌名称', cost: 2, type: 'order', nation: 'FR', keywords: [], description: '技能效果描述', image: '新建文件夹/微信图片_20260104130539_1062_25.png', rarity: 'special' },
];


