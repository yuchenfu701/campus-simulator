const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// 获取所有帖子（按时间倒序）
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建帖子
router.post('/', async (req, res) => {
  try {
    const { authorId, content, authorName, authorAvatar } = req.body;
    
    if (!authorId || !content) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }
    
    // 获取用户信息，如果不存在则自动创建
    let user = await User.findOne({ userId: authorId });
    
    if (!user) {
      // 用户不存在，自动创建用户
      // 生成唯一的临时手机号，避免唯一性冲突
      const tempPhone = `temp_${authorId}_${Date.now()}`;
      
      user = new User({
        userId: authorId,
        name: authorName || '玩家',
        phone: tempPhone, // 临时手机号格式
        class: '初一(1)班',
        avatar: authorAvatar || '',
        points: 100,
        totalEarned: 100
      });
      
      await user.save();
      console.log(`✅ 自动创建用户: ${authorId} (${authorName || '玩家'})`);
    }
    
    const post = new Post({
      authorId,
      authorName: user.name,
      authorAvatar: user.avatar || '',
      content
    });
    
    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 点赞帖子
router.post('/:postId/like', async (req, res) => {
  try {
    const { userId, userName } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' });
    }
    
    // 检查是否已点赞
    const existingLike = post.likes.find(like => like.userId === userId);
    
    if (existingLike) {
      // 取消点赞
      post.likes = post.likes.filter(like => like.userId !== userId);
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      // 添加点赞
      post.likes.push({
        userId,
        userName,
        likedAt: new Date()
      });
      post.likeCount += 1;
    }
    
    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 评论帖子
router.post('/:postId/comment', async (req, res) => {
  try {
    const { userId, userName, content } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' });
    }
    
    post.comments.push({
      userId,
      userName,
      content,
      createdAt: new Date()
    });
    post.commentCount += 1;
    
    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

