/**
 * API客户端 - 统一管理所有API调用
 */

class APIClient {
  constructor() {
    // ⚡ 默认云端服务器地址（用户无需任何配置，打开即用）
    // 如需更换服务器，只改这一行即可
    const DEFAULT_CLOUD = 'https://campussimulatorapi-6n8pusd7.b4a.run/api';

    const configServer = localStorage.getItem('api_server_url');
    const isElectron   = navigator.userAgent.includes('Electron');
    const isLocalhost  = window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1';

    if (configServer) {
      // 用户在设置里手动填了地址 → 优先使用
      this.baseURL = configServer.endsWith('/api') ? configServer : `${configServer}/api`;
      console.log('🌐 使用手动配置的服务器:', this.baseURL);
    } else if (isLocalhost && !isElectron) {
      // 本地开发环境 → 用本地服务器
      this.baseURL = 'http://localhost:3000/api';
      console.log('💻 使用本地服务器:', this.baseURL);
    } else {
      // 网页版 / 软件版 → 自动使用云端服务器，无需用户操作
      this.baseURL = DEFAULT_CLOUD;
      console.log('☁️ 自动使用云端服务器:', this.baseURL);
    }
  }
  
  /**
   * 设置API服务器地址（用于切换到云端服务器）
   */
  setServerURL(url) {
    if (url && url.trim()) {
      const cleanURL = url.trim().replace(/\/+$/, ''); // 移除末尾的斜杠
      this.baseURL = cleanURL.endsWith('/api') ? cleanURL : `${cleanURL}/api`;
      localStorage.setItem('api_server_url', this.baseURL);
      console.log('✅ API服务器地址已更新:', this.baseURL);
    } else {
      localStorage.removeItem('api_server_url');
      this.baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : '/api';
      console.log('✅ 已重置为默认服务器地址:', this.baseURL);
    }
  }
  
  /**
   * 获取当前服务器地址
   */
  getServerURL() {
    return this.baseURL;
  }

  /**
   * 获取 Socket.io 连接地址（去掉 /api 后缀）
   */
  getSocketURL() {
    const api = this.baseURL;
    if (api === '/api') return window.location.origin;
    return api.endsWith('/api') ? api.slice(0, -4) : api;
  }

  /**
   * 通用请求方法
   */
  async request(url, options = {}) {
    try {
      // 检查是否使用file://协议（Electron 桌面版除外）
      const isElectron = navigator.userAgent.includes('Electron');
      if (window.location.protocol === 'file:' && !isElectron) {
        const errorMsg = `❌ 检测到使用文件协议打开页面！\n\n` +
          `请使用HTTP服务器打开页面，而不是直接双击HTML文件。\n\n` +
          `解决方法：\n` +
          `1. 使用VS Code的Live Server插件\n` +
          `2. 或使用Python简单服务器：python -m http.server 8000\n` +
          `3. 或访问：http://localhost:8000/main-menu.html\n\n` +
          `当前API地址：${this.baseURL}`;
        console.error(errorMsg);
        throw new Error('请使用HTTP服务器打开页面，不要直接双击HTML文件');
      }

      const response = await fetch(`${this.baseURL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      // 检查响应类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // 如果返回的不是JSON，可能是HTML错误页面
        const text = await response.text();
        console.error('❌ 服务器返回了非JSON响应:', text.substring(0, 200));
        throw new Error(`服务器返回了错误页面（${response.status}），请检查API路径是否正确`);
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `请求失败 (${response.status})`);
      }
      
      return data;
    } catch (error) {
      console.error('API请求错误:', error);
      
      // 详细的错误诊断
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        const diagnosticInfo = this.getDiagnosticInfo();
        console.error('🔍 诊断信息:', diagnosticInfo);
        
        // 检查是否在静态托管平台（Netlify、GitHub Pages等）
        const isStaticHosting = window.location.hostname.includes('netlify.app') || 
                               window.location.hostname.includes('github.io') ||
                               window.location.hostname.includes('gitee.io') ||
                               window.location.hostname.includes('vercel.app');
        
        if (isStaticHosting && this.baseURL === '/api') {
          // 在静态托管平台上，如果没有配置后端服务器，这是正常的
          console.warn('⚠️ 检测到在静态托管平台上运行，但未配置后端服务器');
          console.warn('💡 在线功能（论坛、好友等）需要后端服务器支持');
          console.warn('💡 访问 server-config.html 配置云端服务器地址');
          console.warn('💡 或者这些功能可以暂时不使用（游戏主功能不受影响）');
          
          // 返回一个友好的错误，而不是抛出异常
          return Promise.reject(new Error('此功能需要后端服务器支持。请访问 server-config.html 配置服务器地址，或使用本地服务器。'));
        }
        
        let errorMessage = '无法连接到服务器。\n\n';
        errorMessage += `当前API地址：${this.baseURL}\n`;
        errorMessage += `页面协议：${window.location.protocol}\n\n`;
        errorMessage += '请检查：\n';
        errorMessage += '1. 后端服务器是否已启动（运行"启动服务器.bat"）\n';
        errorMessage += '2. 服务器是否在 http://localhost:3000 运行\n';
        errorMessage += '3. 浏览器控制台是否有更多错误信息\n';
        errorMessage += '4. 尝试访问：http://localhost:3000/api/health\n';
        errorMessage += '5. 如果部署在静态托管平台，请配置云端服务器地址\n\n';
        
        if (window.location.protocol === 'file:') {
          errorMessage += '⚠️ 重要：检测到使用文件协议！\n';
          errorMessage += '请使用HTTP服务器打开页面，不要直接双击HTML文件。\n';
        }
        
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * 获取诊断信息
   */
  getDiagnosticInfo() {
    return {
      baseURL: this.baseURL,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
      fullURL: window.location.href
    };
  }

  /**
   * 测试服务器连接
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: `服务器返回错误：${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 用户相关API ====================
  
  /**
   * 获取用户信息
   */
  async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  /**
   * 创建或更新用户
   */
  async createOrUpdateUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  /**
   * 更新积分
   */
  async updatePoints(userId, amount, reason, teacher) {
    return this.request(`/users/${userId}/points`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason, teacher })
    });
  }

  /**
   * 更新虚拟形象
   */
  async updateAvatar(userId, virtualAvatar) {
    return this.request(`/users/${userId}/avatar`, {
      method: 'POST',
      body: JSON.stringify({ virtualAvatar })
    });
  }

  /**
   * 添加物品到背包
   */
  async addToInventory(userId, itemId, itemName, itemType) {
    return this.request(`/users/${userId}/inventory`, {
      method: 'POST',
      body: JSON.stringify({ itemId, itemName, itemType })
    });
  }

  /**
   * 搜索用户（用于添加好友）
   */
  async searchUsers(keyword) {
    return this.request(`/users/search/${encodeURIComponent(keyword)}`);
  }

  // ==================== 帖子相关API ====================
  
  /**
   * 获取所有帖子
   */
  async getPosts() {
    return this.request('/posts');
  }

  /**
   * 创建帖子
   */
  async createPost(authorId, content, authorName, authorAvatar) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify({ authorId, content, authorName, authorAvatar })
    });
  }

  /**
   * 点赞帖子
   */
  async likePost(postId, userId, userName) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId, userName })
    });
  }

  /**
   * 评论帖子
   */
  async commentPost(postId, userId, userName, content) {
    return this.request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ userId, userName, content })
    });
  }

  // ==================== 好友相关API ====================
  
  /**
   * 获取好友列表
   */
  async getFriends(userId) {
    return this.request(`/friends/${userId}`);
  }

  /**
   * 发送好友请求
   */
  async sendFriendRequest(fromUserId, toUserId) {
    return this.request('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ fromUserId, toUserId })
    });
  }

  /**
   * 处理好友请求
   */
  async handleFriendRequest(userId, requestId, action) {
    return this.request(`/friends/request/${requestId}`, {
      method: 'POST',
      body: JSON.stringify({ userId, action })
    });
  }

  /**
   * 获取好友请求列表
   */
  async getFriendRequests(userId) {
    return this.request(`/friends/${userId}/requests`);
  }

  // ==================== 消息相关API ====================
  
  /**
   * 获取与某个好友的聊天记录
   */
  async getMessages(userId, friendId, limit = 50) {
    return this.request(`/messages/${userId}/${friendId}?limit=${limit}`);
  }

  /**
   * 发送消息
   */
  async sendMessage(fromUserId, toUserId, content) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ fromUserId, toUserId, content })
    });
  }

  /**
   * 获取未读消息数量
   */
  async getUnreadCount(userId) {
    return this.request(`/messages/${userId}/unread/count`);
  }

  /**
   * 获取所有会话列表
   */
  async getConversations(userId) {
    return this.request(`/messages/${userId}/conversations`);
  }
}

// 创建全局实例
const apiClient = new APIClient();

