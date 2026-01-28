const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/database');

// 导入路由
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const friendRoutes = require('./routes/friends');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 连接数据库
connectDB();

// 路由
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);

// 调试：打印所有注册的路由
console.log('📋 已注册的路由:');
console.log('  - GET /api/users/:userId');
console.log('  - POST /api/users');
console.log('  - GET /api/posts');
console.log('  - POST /api/posts');
console.log('  - GET /api/friends/:userId');
console.log('  - POST /api/friends/request');
console.log('  ✅ GET /api/messages/:userId/:friendId');
console.log('  ✅ POST /api/messages');
console.log('  ✅ GET /api/messages/:userId/unread/count');
console.log('  ✅ GET /api/messages/:userId/conversations');

// 测试路由是否加载
try {
  console.log('🔍 检查消息路由模块...');
  const testRoutes = require('./routes/messages');
  console.log('✅ 消息路由模块加载成功');
} catch (error) {
  console.error('❌ 消息路由模块加载失败:', error);
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('❌ 服务器错误:', err);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 服务器启动成功');
  console.log(`📡 监听端口: ${PORT}`);
  console.log(`🌐 API地址: http://localhost:${PORT}/api`);
  console.log(`💡 MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_simulator'}`);
});


