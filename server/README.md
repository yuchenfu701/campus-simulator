# 🚀 校园模拟器后端服务器

## 📋 简介

这是校园模拟器的后端服务器，使用 Node.js + Express + MongoDB 构建，提供用户数据管理、论坛帖子、好友系统等功能。

---

## 🛠️ 技术栈

- **Node.js** - 运行环境
- **Express** - Web框架
- **MongoDB** - 数据库
- **Mongoose** - MongoDB ODM

---

## 📦 安装步骤

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
# MongoDB连接配置
MONGODB_URI=mongodb://localhost:27017/campus_simulator

# 服务器配置
PORT=3000

# CORS配置
CORS_ORIGIN=http://localhost:8080
```

### 3. 启动MongoDB

确保 MongoDB Compass 已安装并运行：

1. 打开 MongoDB Compass
2. 连接到本地 MongoDB（默认：`mongodb://localhost:27017`）
3. 创建数据库 `campus_simulator`（如果不存在）

### 4. 启动服务器

**开发模式（自动重启）：**
```bash
npm run dev
```

**生产模式：**
```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

---

## 📡 API接口文档

### 用户相关

#### 获取用户信息
```
GET /api/users/:userId
```

#### 创建或更新用户
```
POST /api/users
Body: {
  userId: string,
  name: string,
  phone: string,
  class?: string,
  avatar?: string
}
```

#### 更新积分
```
POST /api/users/:userId/points
Body: {
  amount: number,
  reason?: string,
  teacher?: string
}
```

#### 更新虚拟形象
```
POST /api/users/:userId/avatar
Body: {
  virtualAvatar: {
    hair?: string,
    glasses?: string,
    hat?: string,
    background?: string
  }
}
```

#### 搜索用户
```
GET /api/users/search/:keyword
```

### 帖子相关

#### 获取所有帖子
```
GET /api/posts
```

#### 创建帖子
```
POST /api/posts
Body: {
  authorId: string,
  content: string
}
```

#### 点赞帖子
```
POST /api/posts/:postId/like
Body: {
  userId: string,
  userName: string
}
```

#### 评论帖子
```
POST /api/posts/:postId/comment
Body: {
  userId: string,
  userName: string,
  content: string
}
```

### 好友相关

#### 获取好友列表
```
GET /api/friends/:userId
```

#### 发送好友请求
```
POST /api/friends/request
Body: {
  fromUserId: string,
  toUserId: string
}
```

#### 处理好友请求
```
POST /api/friends/request/:requestId
Body: {
  userId: string,
  action: 'accept' | 'reject'
}
```

#### 获取好友请求列表
```
GET /api/friends/:userId/requests
```

---

## 🗄️ 数据库结构

### User（用户）
- userId: 用户ID
- name: 姓名
- phone: 手机号
- points: 积分
- virtualAvatar: 虚拟形象
- inventory: 背包物品
- friends: 好友列表
- friendRequests: 好友请求

### Post（帖子）
- authorId: 作者ID
- authorName: 作者姓名
- content: 内容
- likes: 点赞列表
- comments: 评论列表

---

## 🔧 常见问题

### MongoDB连接失败

1. 确保 MongoDB Compass 已启动
2. 检查连接字符串是否正确
3. 确认 MongoDB 服务正在运行

### CORS错误

在 `.env` 文件中设置正确的 `CORS_ORIGIN`，或使用 `*` 允许所有来源（仅开发环境）。

### 端口被占用

修改 `.env` 文件中的 `PORT` 值，或关闭占用3000端口的程序。

---

## 📝 开发说明

### 添加新功能

1. 在 `models/` 中创建数据模型
2. 在 `routes/` 中创建路由
3. 在 `server.js` 中注册路由

### 调试

使用 `console.log()` 输出调试信息，或使用 Node.js 调试工具。

---

## 🌐 云端部署

服务器可以部署到云端，让所有人通过网页访问，无需在本地运行。

### 快速部署

1. **准备MongoDB Atlas**（免费云数据库）
   - 注册：https://www.mongodb.com/cloud/atlas/register
   - 创建免费集群
   - 获取连接字符串

2. **部署到Railway**（推荐，最简单）
   - 注册：https://railway.app/
   - 连接GitHub仓库
   - 配置环境变量
   - 自动部署

3. **配置前端**
   - 打开 `server-config.html`
   - 输入服务器地址
   - 保存配置

**详细步骤：** 查看 `快速部署指南.md` 或 `docs/02-功能说明/云端部署指南.md`

---

## 🎯 下一步计划

- [x] 添加消息系统
- [ ] 添加用户认证（JWT）
- [ ] 添加文件上传功能
- [ ] 添加实时通知系统（WebSocket）
- [ ] 性能优化和缓存

---

**版本**: 1.0.0  
**最后更新**: 2024-12-19


