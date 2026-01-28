const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 获取好友列表
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    // 获取好友详细信息
    const friendIds = user.friends.map(f => f.userId);
    const friends = await User.find({ userId: { $in: friendIds } })
      .select('userId name phone avatar points');
    
    res.json({ success: true, data: friends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 发送好友请求
router.post('/request', async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;
    
    if (fromUserId === toUserId) {
      return res.status(400).json({ success: false, message: '不能添加自己为好友' });
    }
    
    let fromUser = await User.findOne({ userId: fromUserId });
    let toUser = await User.findOne({ userId: toUserId });
    
    // 如果发送请求的用户不存在，自动创建
    if (!fromUser) {
      const tempPhone = `temp_${fromUserId}_${Date.now()}`;
      fromUser = new User({
        userId: fromUserId,
        name: '玩家',
        phone: tempPhone,
        class: '初一(1)班',
        points: 100,
        totalEarned: 100
      });
      await fromUser.save();
      console.log(`✅ 自动创建用户: ${fromUserId}`);
    }
    
    // 如果目标用户不存在，返回错误
    if (!toUser) {
      return res.status(404).json({ success: false, message: '目标用户不存在' });
    }
    
    // 检查是否已是好友
    const isAlreadyFriend = fromUser.friends.some(f => f.userId === toUserId);
    if (isAlreadyFriend) {
      return res.status(400).json({ success: false, message: '你们已经是好友了' });
    }
    
    // 检查是否已有待处理请求
    const existingRequest = toUser.friendRequests.find(
      req => req.fromUserId === fromUserId && req.status === 'pending'
    );
    
    if (existingRequest) {
      return res.status(400).json({ success: false, message: '已发送过好友请求' });
    }
    
    // 添加好友请求
    toUser.friendRequests.push({
      fromUserId,
      fromUserName: fromUser.name,
      createdAt: new Date(),
      status: 'pending'
    });
    
    await toUser.save();
    res.json({ success: true, message: '好友请求已发送' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 处理好友请求（接受/拒绝）
router.post('/request/:requestId', async (req, res) => {
  try {
    const { userId, action } = req.body; // action: 'accept' or 'reject'
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    const request = user.friendRequests.id(req.params.requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: '好友请求不存在' });
    }
    
    if (action === 'accept') {
      // 接受好友请求
      const fromUser = await User.findOne({ userId: request.fromUserId });
      
      // 添加到双方好友列表
      user.friends.push({
        userId: fromUser.userId,
        name: fromUser.name,
        addedAt: new Date()
      });
      
      fromUser.friends.push({
        userId: user.userId,
        name: user.name,
        addedAt: new Date()
      });
      
      // 更新请求状态
      request.status = 'accepted';
      
      await user.save();
      await fromUser.save();
      
      res.json({ success: true, message: '已接受好友请求' });
    } else if (action === 'reject') {
      // 拒绝好友请求
      request.status = 'rejected';
      await user.save();
      res.json({ success: true, message: '已拒绝好友请求' });
    } else {
      res.status(400).json({ success: false, message: '无效的操作' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取好友请求列表
router.get('/:userId/requests', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    const pendingRequests = user.friendRequests.filter(req => req.status === 'pending');
    res.json({ success: true, data: pendingRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


