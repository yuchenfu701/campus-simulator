const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 获取用户信息
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建或更新用户
router.post('/', async (req, res) => {
  try {
    const { userId, name, phone, class: userClass, avatar } = req.body;
    
    // 检查手机号是否已存在
    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser.userId !== userId) {
      return res.status(400).json({ success: false, message: '该手机号已被注册' });
    }
    
    let user = await User.findOne({ userId });
    
    if (user) {
      // 更新用户信息
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.class = userClass || user.class;
      user.avatar = avatar || user.avatar;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // 创建新用户
      user = new User({
        userId,
        name,
        phone,
        class: userClass || '初一(1)班',
        avatar: avatar || '',
        points: 100,
        totalEarned: 100,
        lastLogin: new Date()
      });
      await user.save();
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新积分
router.post('/:userId/points', async (req, res) => {
  try {
    const { amount, reason, teacher } = req.body;
    const user = await User.findOne({ userId: req.params.userId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    user.points += amount;
    if (amount > 0) {
      user.totalEarned += amount;
    }
    
    user.pointsHistory.push({
      date: new Date(),
      amount,
      reason: reason || '系统操作',
      teacher: teacher || '系统'
    });
    
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新虚拟形象
router.post('/:userId/avatar', async (req, res) => {
  try {
    const { virtualAvatar } = req.body;
    const user = await User.findOne({ userId: req.params.userId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    user.virtualAvatar = { ...user.virtualAvatar, ...virtualAvatar };
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加物品到背包
router.post('/:userId/inventory', async (req, res) => {
  try {
    const { itemId, itemName, itemType } = req.body;
    const user = await User.findOne({ userId: req.params.userId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    user.inventory.push({
      itemId,
      itemName,
      itemType,
      obtainedAt: new Date()
    });
    
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 搜索用户（用于添加好友）
router.get('/search/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword;
    
    // 如果搜索的是手机号格式，也搜索userId（因为userId可能是user_手机号格式）
    let searchConditions = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    // 如果关键词是手机号格式，也搜索userId
    if (/^1[3-9]\d{9}$/.test(keyword)) {
      searchConditions.$or.push({ userId: { $regex: keyword, $options: 'i' } });
    }
    
    const users = await User.find(searchConditions)
      .select('userId name phone avatar points')
      .limit(50); // 限制返回数量
    
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


