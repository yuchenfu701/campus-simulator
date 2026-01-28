const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 12
  },
  phone: {
    type: String,
    required: false, // 改为可选，允许临时用户
    unique: true,
    sparse: true, // 允许null值重复
    index: true,
    // 移除格式验证，允许临时手机号格式
    validate: {
      validator: function(v) {
        // 如果为空或undefined，允许（临时用户）
        if (!v) return true;
        // 如果是临时格式（temp_开头），允许
        if (v.startsWith('temp_')) return true;
        // 否则必须是11位手机号格式
        return /^1[3-9]\d{9}$/.test(v);
      },
      message: '手机号格式不正确'
    }
  },
  class: {
    type: String,
    default: '初一(1)班'
  },
  avatar: {
    type: String, // 头像URL或base64
    default: ''
  },
  // 积分系统数据
  points: {
    type: Number,
    default: 100
  },
  totalEarned: {
    type: Number,
    default: 100
  },
  // 虚拟形象
  virtualAvatar: {
    hair: { type: String, default: 'none' },
    glasses: { type: String, default: 'none' },
    hat: { type: String, default: 'none' },
    background: { type: String, default: 'classroom' }
  },
  // 背包物品
  inventory: [{
    itemId: String,
    itemName: String,
    itemType: String,
    obtainedAt: Date
  }],
  // 积分历史
  pointsHistory: [{
    date: Date,
    amount: Number,
    reason: String,
    teacher: String
  }],
  // 兑换历史
  exchangeHistory: [{
    date: Date,
    itemId: String,
    itemName: String,
    points: Number
  }],
  // 成就
  achievements: [{
    id: String,
    name: String,
    description: String,
    unlockedAt: Date
  }],
  // 好友列表
  friends: [{
    userId: String,
    name: String,
    addedAt: Date
  }],
  // 好友请求
  friendRequests: [{
    fromUserId: String,
    fromUserName: String,
    createdAt: Date,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  // 最后登录时间
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // 连续登录天数
  consecutiveDays: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt
});

// 创建索引
userSchema.index({ userId: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ name: 1 });

module.exports = mongoose.model('User', userSchema);

