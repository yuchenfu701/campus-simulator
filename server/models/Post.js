const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: {
    type: String,
    required: true,
    index: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorAvatar: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  // 点赞
  likes: [{
    userId: String,
    userName: String,
    likedAt: Date
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  // 评论
  comments: [{
    userId: String,
    userName: String,
    content: String,
    createdAt: Date
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  // 分享次数
  shareCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt
});

// 创建索引
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);



