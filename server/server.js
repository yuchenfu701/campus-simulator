const http    = require('http');
const express = require('express');
const cors    = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB      = require('./config/database');
const userRoutes     = require('./routes/users');
const postRoutes     = require('./routes/posts');
const friendRoutes   = require('./routes/friends');
const messageRoutes  = require('./routes/messages');
const Message        = require('./models/Message');
const User           = require('./models/User');

const app        = express();
const httpServer = http.createServer(app);
const PORT       = process.env.PORT || 3000;

// ==================== Socket.io ====================
const { Server } = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin : process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout : 60000,
  pingInterval: 25000
});

// 在线用户表：userId -> socketId
const onlineUsers = new Map();

// ==================== Express 中间件 ====================
app.use(cors({
  origin     : process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// 数据库
connectDB();

// ==================== REST 路由 ====================
app.use('/api/users',    userRoutes);
app.use('/api/posts',    postRoutes);
app.use('/api/friends',  friendRoutes);
app.use('/api/messages', messageRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success    : true,
    message    : '服务器运行正常',
    timestamp  : new Date().toISOString(),
    onlineCount: onlineUsers.size
  });
});

// 查询一批用户的在线状态（REST 回退方案）
app.get('/api/online', (req, res) => {
  const ids    = (req.query.ids || '').split(',').filter(Boolean);
  const result = {};
  ids.forEach(id => { result[id] = onlineUsers.has(id); });
  res.json({ success: true, data: result });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('❌ 服务器错误:', err);
  res.status(500).json({ success: false, message: '服务器内部错误' });
});

// ==================== Socket.io 实时通信 ====================
io.on('connection', (socket) => {
  console.log(`🔌 新连接: ${socket.id}`);

  // ---- 用户上线 ----
  socket.on('user:join', (userId) => {
    if (!userId) return;
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    console.log(`👤 上线: ${userId}（共 ${onlineUsers.size} 人在线）`);
    // 广播给其他人：此用户上线
    socket.broadcast.emit('user:online', { userId });
  });

  // ---- 发送消息（实时） ----
  socket.on('message:send', async ({ fromUserId, toUserId, content, fromUserName, fromUserAvatar }) => {
    if (!fromUserId || !toUserId || !content?.trim()) return;

    try {
      // 验证好友关系
      const fromUser = await User.findOne({ userId: fromUserId }).select('friends name avatar');
      if (!fromUser) return socket.emit('message:error', { error: '用户不存在，请重新登录' });

      const isFriend = fromUser.friends.some(f => f.userId === toUserId);
      if (!isFriend) return socket.emit('message:error', { error: '只能给好友发送消息' });

      // 保存到数据库
      const message = new Message({
        fromUserId,
        fromUserName : fromUserName  || fromUser.name || fromUserId,
        fromUserAvatar: fromUserAvatar || fromUser.avatar || '',
        toUserId,
        content: content.trim().substring(0, 1000)
      });
      await message.save();

      const msgObj = message.toObject();

      // 推送给接收方（如果在线）
      const recipientSocket = onlineUsers.get(toUserId);
      if (recipientSocket) {
        io.to(recipientSocket).emit('message:receive', msgObj);
      }

      // 确认发送方
      socket.emit('message:sent', msgObj);

    } catch (err) {
      console.error('保存消息失败:', err);
      socket.emit('message:error', { error: '消息发送失败，请重试' });
    }
  });

  // ---- 输入状态 ----
  socket.on('typing:start', ({ toUserId }) => {
    const target = onlineUsers.get(toUserId);
    if (target && socket.userId) {
      io.to(target).emit('typing:start', { fromUserId: socket.userId });
    }
  });

  socket.on('typing:stop', ({ toUserId }) => {
    const target = onlineUsers.get(toUserId);
    if (target && socket.userId) {
      io.to(target).emit('typing:stop', { fromUserId: socket.userId });
    }
  });

  // ---- 查询一批用户在线状态 ----
  socket.on('users:status', (userIds) => {
    if (!Array.isArray(userIds)) return;
    const result = {};
    userIds.forEach(id => { result[id] = onlineUsers.has(id); });
    socket.emit('users:status', result);
  });

  // ---- 断开 ----
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      console.log(`👋 下线: ${socket.userId}（剩余 ${onlineUsers.size} 人在线）`);
      socket.broadcast.emit('user:offline', { userId: socket.userId });
    }
  });
});

// ==================== 启动（必须用 httpServer，不能用 app.listen）====================
httpServer.listen(PORT, () => {
  console.log('🚀 服务器启动成功');
  console.log(`📡 端口: ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.io 实时通信已启用`);
  console.log(`💾 MongoDB: ${process.env.MONGODB_URI ? '云端 Atlas' : 'localhost'}`);
});
