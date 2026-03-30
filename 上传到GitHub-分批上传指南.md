# 📤 分批上传到GitHub指南

GitHub网页上传一次最多100个文件，如果文件太多，需要分批上传或排除不需要的文件。

---

## 🎯 方法一：排除不需要的文件（推荐）

### 不需要上传的文件：

1. **`node_modules/`** - Node.js依赖包（很大，不需要）
2. **`server/node_modules/`** - 服务器依赖包（很大，不需要）
3. **`.git/`** - Git仓库文件（如果存在）
4. **`*.zip`** - 压缩文件
5. **`*.log`** - 日志文件
6. **临时文件**

### 操作步骤：

1. **创建一个精简的项目文件夹**
   - 复制项目文件夹，命名为 `campus-simulator-upload`
   - 删除以下文件夹：
     - `node_modules/`（如果有）
     - `server/node_modules/`
   
2. **只上传必要的文件**
   - HTML文件（所有 `.html`）
   - CSS文件（`css/` 文件夹）
   - JavaScript文件（`js/` 文件夹）
   - 图片文件（`images/` 文件夹）
   - 游戏文件（`games/` 文件夹）
   - 配置文件（`vercel.json`, `netlify.toml`, `.gitignore`）
   - **不要上传** `server/` 文件夹（后端服务器，GitHub Pages不需要）

3. **分批上传**
   - 第一批：所有HTML文件（约20-30个）
   - 第二批：`css/` 文件夹
   - 第三批：`js/` 文件夹
   - 第四批：`images/` 和 `games/` 文件夹
   - 第五批：配置文件

---

## 🎯 方法二：使用GitHub Desktop（最简单）

**这是最推荐的方法！**

1. **下载GitHub Desktop**
   - 访问：https://desktop.github.com/
   - 下载并安装

2. **添加仓库**
   - 打开GitHub Desktop
   - 登录你的GitHub账号
   - 点击 "File" → "Add Local Repository"
   - 选择项目文件夹
   - 点击 "Add repository"

3. **提交并上传**
   - 输入提交信息："Initial commit"
   - 点击 "Commit to main"
   - 点击 "Push origin"
   - **GitHub Desktop会自动处理所有文件，不受100个文件限制！**

---

## 🎯 方法三：使用命令行Git

如果你熟悉命令行：

```bash
cd d:\编程\test
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yuchenfu701/campus-simulator.git
git push -u origin main
```

---

## 📋 必须上传的文件清单

### 核心文件（必须）：
- ✅ `index.html` - 游戏主界面
- ✅ `login.html` - 登录页面
- ✅ `main-menu.html` - 主菜单
- ✅ `404.html` - 404页面
- ✅ `vercel.json` - Vercel配置
- ✅ `netlify.toml` - Netlify配置
- ✅ `.gitignore` - Git忽略文件

### 功能页面（必须）：
- ✅ `campus-forum.html` - 论坛
- ✅ `campus-friends.html` - 好友系统
- ✅ `campus-games.html` - 小游戏
- ✅ `points-mall.html` - 积分商城
- ✅ `points-rank.html` - 排行榜
- ✅ `points-tasks.html` - 任务中心
- ✅ `points-avatar.html` - 虚拟形象
- ✅ `recharge.html` - 充值中心
- ✅ `teacher-admin.html` - 教师后台
- ✅ `office-*.html` - 各建筑场景页面

### 资源文件（必须）：
- ✅ `css/` 文件夹（所有CSS文件）
- ✅ `js/` 文件夹（所有JS文件）
- ✅ `images/` 文件夹（图片资源）
- ✅ `games/` 文件夹（小游戏文件）

### 不需要上传：
- ❌ `server/` 文件夹（后端服务器，GitHub Pages不需要）
- ❌ `node_modules/` 文件夹
- ❌ `*.zip` 文件
- ❌ `*.log` 文件
- ❌ `.git/` 文件夹（如果存在）

---

## 🚀 快速操作步骤

### 如果使用GitHub Desktop（推荐）：

1. 下载GitHub Desktop
2. 添加项目文件夹
3. 提交并上传
4. 完成！

### 如果使用网页上传：

1. **先创建一个精简文件夹**
   - 复制项目文件夹
   - 删除 `server/` 和 `node_modules/` 文件夹
   
2. **分批上传**
   - 第一批：所有HTML文件
   - 第二批：`css/` 文件夹
   - 第三批：`js/` 文件夹
   - 第四批：`images/` 和 `games/` 文件夹

---

**推荐使用GitHub Desktop，最简单！** 🚀




