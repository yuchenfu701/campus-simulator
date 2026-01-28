const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

console.log('✅ 消息路由模块已加载');

// 注意：具体的路由要放在参数路由之前，否则会被参数路由匹配

// 获取未读消息数量（必须在 /:userId/:friendId 之前）
router.get('/:userId/unread/count', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const unreadCount = await Message.countDocuments({
      toUserId: userId,
      read: false
    });
    
    res.json({ success: true, data: { count: unreadCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取所有会话列表（必须在 /:userId/:friendId 之前）
router.get('/:userId/conversations', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 获取用户的好友列表
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    const friendIds = user.friends.map(f => f.userId);
    
    // 获取与每个好友的最后一条消息
    const conversations = await Promise.all(
      friendIds.map(async (friendId) => {
        const lastMessage = await Message.findOne({
          $or: [
            { fromUserId: userId, toUserId: friendId },
            { fromUserId: friendId, toUserId: userId }
          ]
        })
        .sort({ createdAt: -1 })
        .lean();
        
        // 获取好友信息
        const friend = await User.findOne({ userId: friendId })
          .select('userId name avatar');
        
        // 获取未读消息数量
        const unreadCount = await Message.countDocuments({
          fromUserId: friendId,
          toUserId: userId,
          read: false
        });
        
        return {
          friendId: friend?.userId || friendId,
          friendName: friend?.name || '未知用户',
          friendAvatar: friend?.avatar || '',
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            fromUserId: lastMessage.fromUserId
          } : null,
          unreadCount
        };
      })
    );
    
    // 按最后消息时间排序
    conversations.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });
    
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取与某个好友的聊天记录（放在最后，因为它是参数路由）
router.get('/:userId/:friendId', async (req, res) => {
  try {
    console.log('📨 收到获取消息请求:', req.params);
    const { userId, friendId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    // 获取双方的所有消息
    const messages = await Message.find({
      $or: [
        { fromUserId: userId, toUserId: friendId },
        { fromUserId: friendId, toUserId: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
    
    // 标记消息为已读（接收到的消息）
    await Message.updateMany(
      { fromUserId: friendId, toUserId: userId, read: false },
      { read: true, readAt: new Date() }
    );
    
    // 反转数组，让最早的消息在前
    messages.reverse();
    
    console.log(`✅ 返回 ${messages.length} 条消息`);
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('❌ 获取消息失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 发送消息
router.post('/', async (req, res) => {
  try {
    const { fromUserId, toUserId, content } = req.body;
    
    if (!fromUserId || !toUserId || !content) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }
    
    // 获取发送者信息
    let fromUser = await User.findOne({ userId: fromUserId });
    if (!fromUser) {
      return res.status(404).json({ success: false, message: '发送者不存在' });
    }
    
    // 获取接收者信息
    let toUser = await User.findOne({ userId: toUserId });
    if (!toUser) {
      return res.status(404).json({ success: false, message: '接收者不存在' });
    }
    
    // 检查是否互为好友
    const isFriend = fromUser.friends.some(f => f.userId === toUserId);
    if (!isFriend) {
      return res.status(403).json({ success: false, message: '只能给好友发送消息' });
    }
    
    // 创建消息
    const message = new Message({
      fromUserId,
      fromUserName: fromUser.name,
      fromUserAvatar: fromUser.avatar || '',
      toUserId,
      toUserName: toUser.name,
      content: content.trim()
    });
    
    await message.save();
    
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;

