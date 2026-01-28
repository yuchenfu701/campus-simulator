const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fromUserId: {
    type: String,
    required: true,
    index: true
  },
  fromUserName: {
    type: String,
    required: true
  },
  fromUserAvatar: {
    type: String,
    default: ''
  },
  toUserId: {
    type: String,
    required: true,
    index: true
  },
  toUserName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt
});

// 创建索引，优化查询性能
messageSchema.index({ fromUserId: 1, toUserId: 1, createdAt: -1 });
messageSchema.index({ toUserId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);


