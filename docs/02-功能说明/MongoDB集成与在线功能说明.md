# 🗄️ MongoDB集成与在线功能说明

## 📋 功能概述

将校园模拟器从本地存储（localStorage）升级为在线数据库（MongoDB），实现：
- ✅ 数据云端存储
- ✅ 多设备同步
- ✅ 在线论坛系统
- ✅ 好友系统
- ✅ 实时数据交互

---

## 🏗️ 架构设计

### 前后端分离架构

```
前端（HTML/JS）
    ↓ HTTP请求
后端服务器（Node.js + Express）
    ↓ 数据库操作
MongoDB数据库
```

### 技术栈

**前端：**
- HTML/CSS/JavaScript
- API客户端（`js/api-client.js`）

**后端：**
- Node.js + Express
- MongoDB + Mongoose
- RESTful API

---

## 📦 项目结构

```
server/
├── config/
│   └── database.js          # 数据库连接配置
├── models/
│   ├── User.js              # 用户数据模型
│   └── Post.js              # 帖子数据模型
├── routes/
│   ├── users.js             # 用户相关API
│   ├── posts.js             # 帖子相关API
│   └── friends.js           # 好友相关API
├── server.js                # 服务器入口
├── package.json             # 依赖配置
└── README.md                # 服务器说明文档
```

---

## 🚀 快速开始

### 1. 安装后端依赖

```bash
cd server
npm install
```

### 2. 配置MongoDB

1. 打开 MongoDB Compass
2. 连接到本地 MongoDB（默认：`mongodb://localhost:27017`）
3. 创建数据库 `campus_simulator`

### 3. 配置环境变量

创建 `server/.env` 文件：

```env
MONGODB_URI=mongodb://localhost:27017/campus_simulator
PORT=3000
CORS_ORIGIN=http://localhost:8080
```

### 4. 启动服务器

```bash
npm start
# 或开发模式
npm run dev
```

### 5. 测试连接

访问 `http://localhost:3000/api/health` 应该返回：

```json
{
  "success": true,
  "message": "服务器运行正常",
  "timestamp": "2024-12-19T..."
}
```

---

## 🔄 数据迁移

### 从localStorage迁移到MongoDB

系统会自动处理数据迁移：

1. **首次使用API时**：如果API可用，数据会自动同步到MongoDB
2. **API不可用时**：自动回退到localStorage模式
3. **数据同步**：登录时自动同步本地数据到服务器

### 迁移步骤

1. 启动后端服务器
2. 打开前端页面
3. 登录账号
4. 系统自动将localStorage数据上传到MongoDB

---

## 📡 API使用说明

### API客户端

前端使用 `js/api-client.js` 统一管理API调用：

```javascript
// 获取用户信息
const user = await apiClient.getUser(userId);

// 创建帖子
await apiClient.createPost(userId, content);

// 添加好友
await apiClient.sendFriendRequest(fromUserId, toUserId);
```

### 错误处理

API客户端会自动处理错误：
- API不可用时回退到localStorage
- 网络错误时显示友好提示
- 自动重试机制（可扩展）

---

## 💬 论坛系统

### 功能特点

- ✅ 发布帖子（实时保存到MongoDB）
- ✅ 点赞/取消点赞
- ✅ 评论功能
- ✅ 分享功能
- ✅ 实时显示最新帖子

### 使用方式

1. 打开 `campus-forum.html`
2. 点击"发布新帖子"
3. 输入内容并发布
4. 帖子自动保存到MongoDB
5. 其他用户可以看到你的帖子

---

## 👥 好友系统

### 功能特点

- ✅ 搜索用户（按姓名或手机号）
- ✅ 发送好友请求
- ✅ 接受/拒绝好友请求
- ✅ 查看好友列表
- ✅ 好友请求通知

### 使用方式

1. 打开 `campus-friends.html`
2. 切换到"添加好友"标签
3. 输入用户名或手机号搜索
4. 点击"添加好友"发送请求
5. 对方在"好友请求"中接受

---

## 🔐 数据安全

### 用户数据

- 用户ID唯一标识
- 手机号唯一验证
- 数据加密存储（可扩展）

### API安全

- CORS配置限制来源
- 输入验证和过滤
- SQL注入防护（MongoDB天然防护）

---

## 📊 数据库设计

### User集合

```javascript
{
  userId: "student_001",
  name: "玩家",
  phone: "13800138000",
  points: 100,
  virtualAvatar: {
    hair: "default",
    glasses: "none",
    hat: "none"
  },
  inventory: [...],
  friends: [...],
  friendRequests: [...]
}
```

### Post集合

```javascript
{
  authorId: "student_001",
  authorName: "玩家",
  content: "帖子内容",
  likes: [...],
  comments: [...],
  createdAt: Date
}
```

---

## 🐛 故障排除

### 问题1：无法连接MongoDB

**解决方案：**
1. 检查MongoDB Compass是否运行
2. 检查连接字符串是否正确
3. 确认MongoDB服务已启动

### 问题2：API请求失败

**解决方案：**
1. 检查后端服务器是否启动
2. 检查CORS配置
3. 查看浏览器控制台错误信息

### 问题3：数据不同步

**解决方案：**
1. 检查网络连接
2. 刷新页面重新加载
3. 检查API响应状态

---

## 🔄 兼容性说明

### 向后兼容

系统保持向后兼容：
- API不可用时自动使用localStorage
- 数据自动同步机制
- 平滑迁移体验

### 浏览器支持

- Chrome/Edge（推荐）
- Firefox
- Safari
- 移动端浏览器

---

## 📈 性能优化

### 已实现

- 数据库索引优化
- API请求缓存（可扩展）
- 分页加载帖子

### 未来优化

- Redis缓存
- CDN加速
- 数据库读写分离

---

## 🎯 功能清单

### ✅ 已完成

- [x] MongoDB数据库集成
- [x] 用户数据API
- [x] 帖子系统API
- [x] 好友系统API
- [x] 前端API客户端
- [x] 论坛页面完善
- [x] 好友系统页面
- [x] 错误处理和回退机制

### 🚧 待开发

- [ ] 用户认证系统（JWT）
- [ ] 实时消息推送
- [ ] 文件上传功能
- [ ] 数据备份和恢复
- [ ] 管理员后台

---

## 📝 使用示例

### 发布帖子

```javascript
// 在论坛页面
const content = "今天天气真好！";
await apiClient.createPost(currentUserId, content);
```

### 添加好友

```javascript
// 在好友页面
await apiClient.sendFriendRequest(currentUserId, targetUserId);
```

### 更新积分

```javascript
// 在积分系统
await apiClient.updatePoints(userId, 100, "完成任务", "老师");
```

---

## 🎊 总结

通过MongoDB集成，校园模拟器实现了：
- 🌐 **在线数据存储** - 数据不再局限于本地
- 🔄 **多设备同步** - 随时随地访问数据
- 💬 **在线论坛** - 真实社交互动
- 👥 **好友系统** - 建立社交网络
- 🚀 **可扩展性** - 为未来功能打下基础

---

**完成时间**：2024-12-19  
**版本**：v3.0.0  
**状态**：✅ 已完成



