# 📊 MongoDB Compass 配置步骤

## ✅ 你已经打开了MongoDB Compass，很好！

现在按照以下步骤操作：

---

## 🔍 步骤1：检查连接

### 确认连接状态

在MongoDB Compass左侧，你应该能看到：
- ✅ 连接名称（如 "school" 或 "localhost"）
- ✅ 数据库列表（如 "admin", "config", "local"）

**如果看到这些，说明连接正常！** ✅

---

## 📁 步骤2：创建数据库（如果需要）

### 方法1：自动创建（推荐）

数据库会在后端服务器首次连接时自动创建，**不需要手动创建**。

### 方法2：手动创建（可选）

如果你想手动创建：

1. 在MongoDB Compass左侧，点击 **"+"** 或 **"Create Database"**
2. 数据库名称：`campus_simulator`
3. 集合名称：留空（会自动创建）
4. 点击 **"Create Database"**

---

## 🚀 步骤3：启动后端服务器

### 方法1：使用启动脚本（最简单）

1. **双击运行** `启动服务器.bat` 文件
2. 等待看到以下信息：
   ```
   ✅ MongoDB连接成功
   📊 数据库: campus_simulator
   🚀 服务器启动成功
   ```

### 方法2：手动启动

1. 打开命令行（cmd 或 PowerShell）
2. 输入命令：
   ```bash
   cd server
   npm start
   ```

---

## ✅ 步骤4：验证连接

### 在MongoDB Compass中查看

启动服务器后，在MongoDB Compass中：

1. **刷新数据库列表**（点击刷新按钮或按F5）
2. 你应该能看到 `campus_simulator` 数据库
3. 点击展开，应该能看到集合：
   - `users` - 用户数据
   - `posts` - 帖子数据

### 在浏览器中测试

1. 打开浏览器
2. 访问：`http://localhost:3000/api/health`
3. 应该看到：
   ```json
   {
     "success": true,
     "message": "服务器运行正常"
   }
   ```

---

## 🎯 步骤5：测试功能

### 测试论坛发布帖子

1. 打开 `campus-forum.html`
2. 点击"发布新帖子"
3. 输入内容并发布
4. 如果成功，说明一切正常！✅

### 在MongoDB Compass中查看数据

1. 点击 `campus_simulator` 数据库
2. 点击 `posts` 集合
3. 你应该能看到刚才发布的帖子数据

---

## 🐛 常见问题

### 问题1：看不到 campus_simulator 数据库

**原因：** 后端服务器还没有启动，或者还没有创建数据

**解决：**
1. 确保后端服务器已启动
2. 尝试发布一个帖子（会自动创建数据库）
3. 刷新MongoDB Compass

### 问题2：服务器启动时显示MongoDB连接失败

**检查：**
1. MongoDB Compass是否正在运行？
2. 连接地址是否正确？（默认：`mongodb://localhost:27017`）
3. MongoDB服务是否启动？

**解决：**
- Windows: 打开"服务"（services.msc），查找"MongoDB"服务，确保它正在运行

### 问题3：看到"Invalid UTF-8 string"错误

**说明：** 这是MongoDB Compass的显示问题，不影响功能

**解决：**
- 忽略这个错误，不影响数据库使用
- 或者删除有问题的集合，重新创建

---

## 📝 完整操作流程

```
1. ✅ 打开MongoDB Compass（已完成）
2. ✅ 确认连接正常（检查左侧连接列表）
3. ⏳ 启动后端服务器（运行 启动服务器.bat）
4. ⏳ 等待看到"服务器启动成功"
5. ⏳ 刷新MongoDB Compass，查看 campus_simulator 数据库
6. ⏳ 打开论坛页面，测试发布帖子
7. ⏳ 在MongoDB Compass中查看帖子数据
```

---

## 💡 提示

- **数据库会自动创建**：不需要手动创建，后端服务器启动时会自动创建
- **保持服务器运行**：发布帖子等功能需要服务器一直运行
- **查看数据**：可以在MongoDB Compass中实时查看所有数据

---

## 🎊 完成！

如果一切正常，你应该能够：
- ✅ 在论坛发布帖子
- ✅ 在MongoDB Compass中看到帖子数据
- ✅ 使用好友系统
- ✅ 数据保存在云端，多设备同步

---

**需要帮助？** 告诉我你卡在哪一步了！



