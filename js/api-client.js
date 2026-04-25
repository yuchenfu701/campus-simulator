/**
 * API客户端 - 使用 Supabase 作为后端（永久免费，无需信用卡）
 */

const SUPABASE_URL = 'https://qfoaoaggyfhkkvoxyxrb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_L7NXVjxZwzJgIV4FGu5MUA_PPLbkNUY';

// ── 动态加载 Supabase SDK ────────────────────────────────────
let _db = null;
const _dbReady = new Promise((resolve) => {
  function init() {
    _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    resolve(_db);
  }
  if (window.supabase) {
    init();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = init;
    s.onerror = () => console.error('❌ Supabase SDK 加载失败');
    document.head.appendChild(s);
  }
});

class APIClient {

  // 获取 Supabase 客户端（异步，等待 SDK 加载）
  async getDB() {
    if (_db) return _db;
    return await _dbReady;
  }

  // ── 兼容旧代码的属性 ──────────────────────────────────────
  get baseURL() { return SUPABASE_URL; }
  getServerURL() { return SUPABASE_URL; }
  getSocketURL() { return null; }
  setServerURL() {}
  async testConnection() {
    try {
      const db = await this.getDB();
      const { error } = await db.from('users').select('user_id').limit(1);
      return error ? { success: false, error: error.message } : { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // ==================== 用户相关API ====================

  async getUser(userId) {
    const db = await this.getDB();
    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code === 'PGRST116') return { success: false, message: '用户不存在' };
    if (error) throw new Error(error.message);
    return { success: true, data: this._mapUser(data) };
  }

  async createOrUpdateUser(userData) {
    const db = await this.getDB();
    const row = {
      user_id      : userData.userId,
      name         : userData.name || userData.nickname || '',
      avatar       : userData.avatar || '',
      virtual_avatar: userData.virtualAvatar || {},
      points       : userData.points || 0,
      inventory    : userData.inventory || [],
      friends      : userData.friends || [],
      last_seen    : new Date().toISOString(),
      updated_at   : new Date().toISOString()
    };
    const { data, error } = await db
      .from('users')
      .upsert(row, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { success: true, data: this._mapUser(data) };
  }

  async updatePoints(userId, amount) {
    const db = await this.getDB();
    const { data: cur } = await db.from('users').select('points').eq('user_id', userId).single();
    const newPoints = (cur?.points || 0) + amount;
    const { data, error } = await db
      .from('users')
      .update({ points: newPoints, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { success: true, data: this._mapUser(data) };
  }

  async updateAvatar(userId, virtualAvatar) {
    const db = await this.getDB();
    const { data, error } = await db
      .from('users')
      .update({ virtual_avatar: virtualAvatar, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { success: true, data: this._mapUser(data) };
  }

  async addToInventory(userId, itemId, itemName, itemType) {
    const db = await this.getDB();
    const { data: cur } = await db.from('users').select('inventory').eq('user_id', userId).single();
    const inventory = cur?.inventory || [];
    if (!inventory.some(i => i.itemId === itemId)) {
      inventory.push({ itemId, itemName, itemType, acquiredAt: new Date().toISOString() });
    }
    const { data, error } = await db
      .from('users')
      .update({ inventory, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { success: true, data: this._mapUser(data) };
  }

  async searchUsers(keyword) {
    const db = await this.getDB();
    const { data, error } = await db
      .from('users')
      .select('user_id, name, avatar, points, friends')
      .or(`name.ilike.%${keyword}%,user_id.ilike.%${keyword}%`)
      .limit(20);
    if (error) throw new Error(error.message);
    return { success: true, data: (data || []).map(r => this._mapUser(r)) };
  }

  // ── 在线心跳 ─────────────────────────────────────────────
  async updateLastSeen(userId) {
    try {
      const db = await this.getDB();
      await db.from('users')
        .update({ last_seen: new Date().toISOString() })
        .eq('user_id', userId);
    } catch (e) {}
  }

  async checkOnlineStatus(userIds) {
    if (!userIds.length) return {};
    const db = await this.getDB();
    const { data } = await db
      .from('users')
      .select('user_id, last_seen')
      .in('user_id', userIds);
    const result = {};
    const threshold = Date.now() - 45000; // 45秒内视为在线
    (data || []).forEach(u => {
      result[u.user_id] = u.last_seen
        ? new Date(u.last_seen).getTime() > threshold
        : false;
    });
    return result;
  }

  // ==================== 帖子相关API ====================

  async getPosts() {
    const db = await this.getDB();
    const { data, error } = await db
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { success: true, data: (data || []).map(r => this._mapPost(r)) };
  }

  async createPost(authorId, content, authorName, authorAvatar) {
    const db = await this.getDB();
    const { data, error } = await db
      .from('posts')
      .insert({ author_id: authorId, author_name: authorName || authorId,
                author_avatar: authorAvatar || '', content })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { success: true, data: this._mapPost(data) };
  }

  async likePost(postId, userId, userName) {
    const db = await this.getDB();
    const { data: post } = await db.from('posts').select('likes').eq('id', postId).single();
    const likes = post?.likes || [];
    const idx = likes.findIndex(l => l.userId === userId);
    if (idx >= 0) { likes.splice(idx, 1); } else { likes.push({ userId, userName }); }
    const { data, error } = await db
      .from('posts').update({ likes }).eq('id', postId).select().single();
    if (error) throw new Error(error.message);
    return { success: true, data: this._mapPost(data) };
  }

  async commentPost(postId, userId, userName, content) {
    const db = await this.getDB();
    const { data: post } = await db.from('posts').select('comments').eq('id', postId).single();
    const comments = post?.comments || [];
    comments.push({ userId, userName, content, createdAt: new Date().toISOString() });
    const { data, error } = await db
      .from('posts').update({ comments }).eq('id', postId).select().single();
    if (error) throw new Error(error.message);
    return { success: true, data: this._mapPost(data) };
  }

  // ==================== 好友相关API ====================

  async getFriends(userId) {
    const db = await this.getDB();
    const { data, error } = await db
      .from('users').select('friends').eq('user_id', userId).single();
    if (error) return { success: true, data: [] };
    return { success: true, data: data?.friends || [] };
  }

  async sendFriendRequest(fromUserId, toUserId) {
    const db = await this.getDB();
    // 检查是否已存在
    const { data: ex } = await db.from('friend_requests')
      .select('id').eq('from_user_id', fromUserId).eq('to_user_id', toUserId)
      .eq('status', 'pending').single();
    if (ex) return { success: false, message: '已发送过好友请求' };

    // 检查是否已经是好友
    const { data: me } = await db.from('users').select('friends').eq('user_id', fromUserId).single();
    if ((me?.friends || []).some(f => f.userId === toUserId)) {
      return { success: false, message: '已经是好友了' };
    }

    // 获取发送者信息
    const { data: sender } = await db.from('users').select('name, avatar').eq('user_id', fromUserId).single();
    const { data, error } = await db.from('friend_requests')
      .insert({
        from_user_id   : fromUserId,
        to_user_id     : toUserId,
        from_user_name : sender?.name || fromUserId,
        from_user_avatar: sender?.avatar || ''
      })
      .select().single();
    if (error) throw new Error(error.message);
    return { success: true, data };
  }

  async handleFriendRequest(userId, requestId, action) {
    const db = await this.getDB();
    const { data: req, error: re } = await db
      .from('friend_requests').select('*').eq('id', requestId).single();
    if (re || !req) return { success: false, message: '请求不存在' };

    await db.from('friend_requests')
      .update({ status: action === 'accept' ? 'accepted' : 'rejected' })
      .eq('id', requestId);

    if (action === 'accept') {
      await this._addFriend(req.from_user_id, req.to_user_id);
      await this._addFriend(req.to_user_id, req.from_user_id);
    }
    return { success: true };
  }

  async _addFriend(userId, friendId) {
    const db = await this.getDB();
    const [{ data: me }, { data: friend }] = await Promise.all([
      db.from('users').select('friends').eq('user_id', userId).single(),
      db.from('users').select('name, avatar').eq('user_id', friendId).single()
    ]);
    const friends = me?.friends || [];
    if (!friends.some(f => f.userId === friendId)) {
      friends.push({ userId: friendId, name: friend?.name || friendId, avatar: friend?.avatar || '' });
      await db.from('users').update({ friends }).eq('user_id', userId);
    }
  }

  async getFriendRequests(userId) {
    const db = await this.getDB();
    const { data, error } = await db
      .from('friend_requests')
      .select('*')
      .eq('to_user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return {
      success: true,
      data: (data || []).map(r => ({
        _id           : r.id,
        fromUserId    : r.from_user_id,
        fromUserName  : r.from_user_name || r.from_user_id,
        fromUserAvatar: r.from_user_avatar || '',
        status        : r.status,
        createdAt     : r.created_at
      }))
    };
  }

  // ==================== 消息相关API ====================

  async getMessages(userId, friendId, limit = 50) {
    const db = await this.getDB();
    const { data, error } = await db
      .from('messages')
      .select('*')
      .or(
        `and(from_user_id.eq.${userId},to_user_id.eq.${friendId}),` +
        `and(from_user_id.eq.${friendId},to_user_id.eq.${userId})`
      )
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) throw new Error(error.message);
    return { success: true, data: (data || []).map(r => this._mapMessage(r)) };
  }

  async sendMessage(fromUserId, toUserId, content) {
    const db = await this.getDB();
    const { data: sender } = await db
      .from('users').select('name, avatar').eq('user_id', fromUserId).single();
    const { data, error } = await db
      .from('messages')
      .insert({
        from_user_id   : fromUserId,
        from_user_name : sender?.name || fromUserId,
        from_user_avatar: sender?.avatar || '',
        to_user_id     : toUserId,
        content
      })
      .select().single();
    if (error) throw new Error(error.message);
    return { success: true, data: this._mapMessage(data) };
  }

  async getUnreadCount(userId) {
    const db = await this.getDB();
    const { count, error } = await db
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('to_user_id', userId)
      .eq('read', false);
    if (error) return { success: true, data: { count: 0 } };
    return { success: true, data: { count: count || 0 } };
  }

  async getConversations(userId) {
    const db = await this.getDB();
    const { data, error } = await db
      .from('messages')
      .select('*')
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    const convMap = new Map();
    for (const msg of (data || [])) {
      const partnerId = msg.from_user_id === userId ? msg.to_user_id : msg.from_user_id;
      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, {
          partnerId,
          partnerName  : msg.from_user_id === userId ? msg.to_user_id : msg.from_user_name,
          partnerAvatar: msg.from_user_id === userId ? '' : msg.from_user_avatar,
          lastMessage  : msg.content,
          lastTime     : msg.created_at,
          unread       : 0
        });
      }
      if (msg.to_user_id === userId && !msg.read) {
        convMap.get(partnerId).unread++;
      }
    }
    return { success: true, data: Array.from(convMap.values()) };
  }

  // ==================== 数据映射（私有）====================

  _mapUser(r) {
    if (!r) return null;
    return {
      userId      : r.user_id,
      name        : r.name,
      avatar      : r.avatar,
      virtualAvatar: r.virtual_avatar,
      points      : r.points,
      inventory   : r.inventory || [],
      friends     : r.friends   || [],
      lastSeen    : r.last_seen,
      createdAt   : r.created_at,
      updatedAt   : r.updated_at
    };
  }

  _mapPost(r) {
    if (!r) return null;
    const likes    = r.likes    || [];
    const comments = r.comments || [];
    return {
      _id         : r.id,
      authorId    : r.author_id,
      authorName  : r.author_name,
      authorAvatar: r.author_avatar,
      content     : r.content,
      likes,
      comments,
      likeCount   : likes.length,
      commentCount: comments.length,
      createdAt   : r.created_at
    };
  }

  _mapMessage(r) {
    if (!r) return null;
    return {
      _id           : r.id,
      fromUserId    : r.from_user_id,
      fromUserName  : r.from_user_name,
      fromUserAvatar: r.from_user_avatar,
      toUserId      : r.to_user_id,
      content       : r.content,
      read          : r.read,
      createdAt     : r.created_at
    };
  }
}

// 创建全局实例
const apiClient = new APIClient();
