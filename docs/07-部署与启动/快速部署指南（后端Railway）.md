# 🚀 快速部署指南 - 后端服务器部署（Railway）

> 此指南用于部署后端服务器（论坛、好友等在线功能）。
> 纯前端部署请查看《公网部署指南.md》。

---

## 📋 准备工作

1. **GitHub账号**（用于连接Railway）
2. **MongoDB Atlas账号**（免费云数据库）

---

## 第一步：准备MongoDB Atlas（5分钟）

1. 访问：https://www.mongodb.com/cloud/atlas/register
2. 注册账号（免费）
3. 创建免费集群：选择 **Free** 套餐（512MB）
4. 创建数据库用户（记住用户名和密码）
5. 配置网络访问：允许所有IP（0.0.0.0/0）
6. 获取连接字符串（保存备用）

---

## 第二步：部署到Railway（5分钟）

1. 访问：https://railway.app/ → 用GitHub登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择 `campus-simulator` 仓库
4. 在 "Variables" 中添加：
   ```
   MONGODB_URI = mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/campus_simulator
   CORS_ORIGIN = *
   NODE_ENV = production
   ```
5. 等待部署完成，获取域名（如：`https://your-app.up.railway.app`）

---

## 第三步：配置前端连接后端

1. 打开游戏中的 `server-config.html`
2. 输入Railway域名
3. 点击"测试连接"→"保存配置"

---

## ✅ 部署检查清单

- [ ] MongoDB Atlas已配置
- [ ] Railway部署成功
- [ ] 前端已配置服务器地址
- [ ] 测试连接成功

---

**需要帮助？** 查看 `server/README.md` 获取详细文档。
