/**
 * 微信式实时消息通知
 * 在 api-client.js 之后引入此脚本即可在任意页面收到私信弹窗
 */
(function () {
    const userData = JSON.parse(localStorage.getItem('campus_user') || '{}');
    const currentUserId = userData.userId || userData.id || '';
    if (!currentUserId) return;

    /* ── 样式 ── */
    const style = document.createElement('style');
    style.textContent = `
#msg-notify-wrap {
    position: fixed;
    top: 18px;
    right: 18px;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}
.msg-notify-toast {
    background: rgba(10, 14, 30, 0.96);
    backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(139, 92, 246, 0.45);
    border-radius: 16px;
    padding: 13px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 270px;
    max-width: 340px;
    box-shadow: 0 8px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(139,92,246,.18);
    pointer-events: all;
    cursor: pointer;
    animation: mnIn .38s cubic-bezier(.34,1.56,.64,1);
    transition: transform .2s, box-shadow .2s;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.msg-notify-toast:hover {
    transform: scale(1.025);
    box-shadow: 0 12px 48px rgba(139,92,246,.35);
}
.msg-notify-toast.mn-out {
    animation: mnOut .28s ease forwards;
}
@keyframes mnIn {
    from { transform: translateX(115%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
}
@keyframes mnOut {
    from { transform: translateX(0);    opacity: 1; max-height: 120px; }
    to   { transform: translateX(115%); opacity: 0; max-height: 0;   }
}
.mn-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
    box-shadow: 0 0 12px rgba(139,92,246,.5);
}
.mn-body { flex: 1; overflow: hidden; }
.mn-header {
    display: flex; align-items: center; gap: 6px; margin-bottom: 3px;
}
.mn-name {
    color: #fff; font-size: 14px; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 160px;
}
.mn-badge {
    font-size: 10px; color: #a78bfa;
    background: rgba(139,92,246,.18); border-radius: 4px;
    padding: 1px 5px; white-space: nowrap; flex-shrink: 0;
}
.mn-text {
    color: rgba(255,255,255,.65); font-size: 13px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mn-close {
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(255,255,255,.1); border: none;
    color: rgba(255,255,255,.55); font-size: 13px;
    cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s, color .2s;
}
.mn-close:hover { background: rgba(255,255,255,.22); color: #fff; }
`;
    document.head.appendChild(style);

    /* ── 容器 ── */
    const wrap = document.createElement('div');
    wrap.id = 'msg-notify-wrap';
    const mountWrap = () => document.body ? document.body.appendChild(wrap) : setTimeout(mountWrap, 50);
    mountWrap();

    function escHtml(t) {
        const d = document.createElement('div');
        d.textContent = String(t);
        return d.innerHTML;
    }

    function removeToast(el) {
        if (!el.parentNode) return;
        el.classList.add('mn-out');
        setTimeout(() => el.remove(), 290);
    }

    function showNotification(senderName, senderAvatar, content, senderId) {
        const toast = document.createElement('div');
        toast.className = 'msg-notify-toast';
        toast.innerHTML = `
            <div class="mn-avatar">${escHtml(senderAvatar || '👤')}</div>
            <div class="mn-body">
                <div class="mn-header">
                    <span class="mn-name">${escHtml(senderName || senderId)}</span>
                    <span class="mn-badge">私信</span>
                </div>
                <div class="mn-text">${escHtml(content)}</div>
            </div>
            <button class="mn-close" title="关闭">✕</button>`;

        toast.querySelector('.mn-close').addEventListener('click', (e) => {
            e.stopPropagation();
            removeToast(toast);
        });

        toast.addEventListener('click', () => {
            const chatUrl = `campus-chat.html?friendId=${encodeURIComponent(senderId)}&friendName=${encodeURIComponent(senderName || senderId)}&friendAvatar=${encodeURIComponent(senderAvatar || '👤')}`;
            if (window.innerWidth > 700) {
                window.open(chatUrl, '_blank', 'width=820,height=640,noopener');
            } else {
                window.location.href = chatUrl;
            }
            removeToast(toast);
        });

        wrap.appendChild(toast);
        setTimeout(() => removeToast(toast), 6000);
    }

    /* ── 订阅 ── */
    const notifiedIds = new Set();

    async function initNotifier() {
        try {
            const db = await apiClient.getDB();
            db.channel(`mnot_${currentUserId}`)
                .on('postgres_changes', {
                    event : 'INSERT',
                    schema: 'public',
                    table : 'messages',
                    filter: `to_user_id=eq.${currentUserId}`
                }, (payload) => {
                    const msg = payload.new;
                    const id = msg.id || msg._id || '';
                    if (id && notifiedIds.has(id)) return;
                    if (id) notifiedIds.add(id);

                    // 如果当前已在与此人的聊天页则跳过
                    const fp = new URLSearchParams(window.location.search).get('friendId');
                    if (fp && fp === msg.from_user_id) return;

                    showNotification(
                        msg.from_user_name || msg.from_user_id,
                        msg.from_user_avatar || '👤',
                        msg.content,
                        msg.from_user_id
                    );
                })
                .subscribe((s) => console.log('📨 通知订阅:', s));
        } catch (e) {
            console.warn('消息通知订阅失败:', e);
        }
    }

    function tryInit() {
        if (typeof apiClient !== 'undefined') {
            initNotifier();
        } else {
            setTimeout(tryInit, 300);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }
})();
