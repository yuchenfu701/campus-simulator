# 🇨🇳 部署到GitHub Pages - 国内可访问版本

由于Netlify在中国访问受限，推荐使用GitHub Pages，国内可以访问（虽然有时较慢）。

---

## 🚀 快速部署（5分钟）

### 步骤1：创建GitHub仓库

1. **访问GitHub**
   - 打开：https://github.com/
   - 如果没有账号，先注册（免费）

2. **创建新仓库**
   - 点击右上角 "+" → "New repository"
   - Repository name: `campus-simulator`（或你喜欢的名字）
   - Description: "校园模拟器"
   - **必须选择 Public**（公开，GitHub Pages需要）
   - **不要**勾选 "Initialize with README"
   - 点击 "Create repository"

### 步骤2：上传代码

**方法A：使用GitHub Desktop（最简单）**

1. **下载GitHub Desktop**
   - 访问：https://desktop.github.com/
   - 下载并安装

2. **登录并添加仓库**
   - 打开GitHub Desktop
   - 登录你的GitHub账号
   - 点击 "File" → "Add Local Repository"
   - 点击 "Choose..." 选择你的项目文件夹（`d:\编程\test`）
   - 点击 "Add repository"

3. **提交并上传**
   - 在左下角输入提交信息："Initial commit"
   - 点击 "Commit to main"
   - 点击 "Publish repository"
   - 等待上传完成

**方法B：网页上传（无需安装）**

1. **压缩项目文件**
   - 将项目文件夹压缩成zip
   - **注意**：不要包含 `node_modules` 文件夹

2. **上传到GitHub**
   - 在GitHub仓库页面，点击 "uploading an existing file"
   - 将压缩包解压后的文件拖拽上传
   - 输入提交信息："Initial commit"
   - 点击 "Commit changes"

### 步骤3：启用GitHub Pages

1. **进入仓库设置**
   - 在GitHub仓库页面，点击 "Settings"（设置）

2. **启用Pages**
   - 左侧菜单找到 "Pages"
   - Source: 选择 "Deploy from a branch"
   - Branch: 选择 "main"
   - Folder: 选择 "/ (root)"
   - 点击 "Save"

3. **等待部署**
   - 等待1-2分钟
   - 刷新页面，会显示你的网站地址

### 步骤4：访问网站

你的网站地址：
```
https://你的用户名.github.io/campus-simulator
```

例如：
```
https://zhangsan.github.io/campus-simulator
```

---

## ⚠️ 重要说明

### 关于"拒绝连接"错误

**这是正常的！** 因为：

1. **GitHub Pages只支持静态文件**（HTML、CSS、JS）
2. **不支持后端服务器**（Node.js、数据库等）
3. **论坛、好友等功能需要后端服务器**

### 解决方案

**选项1：不使用在线功能**
- ✅ 游戏主功能正常
- ✅ 积分系统正常（使用LocalStorage）
- ✅ 虚拟形象正常
- ✅ 小游戏正常
- ❌ 论坛无法使用（会显示"拒绝连接"）
- ❌ 好友系统无法使用

**选项2：部署后端服务器**
1. 参考 `docs/02-功能说明/云端部署指南.md`
2. 部署后端到Railway（免费）
3. 访问 `server-config.html` 配置API地址
4. 所有功能都可以使用

---

## 🎯 推荐流程

1. **先部署前端到GitHub Pages**（5分钟）
2. **测试基本功能**（游戏、积分系统等）
3. **如果需要在线功能，再部署后端服务器**

---

## 📱 分享给朋友

部署完成后：
- 复制网址发送给朋友
- 国内可以直接访问（不需要翻墙）
- 如果访问较慢，可以尝试：
  - 使用手机热点
  - 更换DNS（如8.8.8.8）
  - 使用VPN（可选）

---

## 🔧 修改网站名称（可选）

如果你觉得网址太长：

1. 在GitHub仓库页面，点击 "Settings"
2. 找到 "Pages"
3. 在 "Custom domain" 中输入你的域名（如果有）
4. 或保持默认的 `用户名.github.io/仓库名` 格式

---

**就这么简单！5分钟搞定！** 🚀




