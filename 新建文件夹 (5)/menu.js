// 主菜单功能脚本

// 显示卡牌图鉴
function showDeck() {
    const modal = document.getElementById('deck-modal');
    const gallery = document.getElementById('deck-gallery');
    
    // 清空现有内容
    gallery.innerHTML = '';
    
    // 卡牌数据（从script.js中获取）
    if (typeof cardTemplates !== 'undefined' && cardTemplates.length > 0) {
        cardTemplates.forEach(card => {
            const cardPreview = document.createElement('div');
            cardPreview.className = 'card-preview';
            cardPreview.style.cursor = 'pointer';
            cardPreview.dataset.cardId = card.id;
            
            // 直接使用卡牌图片，不添加任何装饰文字或数字覆盖层
            cardPreview.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${card.image || ''}" alt="${card.name}" />
                </div>
            `;
            
            // 添加点击放大功能
            cardPreview.addEventListener('click', () => {
                toggleCardZoom(cardPreview, card);
            });
            
            gallery.appendChild(cardPreview);
        });
    } else {
        gallery.innerHTML = '<p style="text-align: center; color: #6b5b3d; padding: 20px;">暂无卡牌数据，等待添加...</p>';
    }
    
    modal.style.display = 'block';
}

// 切换卡牌放大/缩小
function toggleCardZoom(cardElement, cardData) {
    const existingZoom = document.getElementById('card-zoom-overlay');
    
    if (existingZoom) {
        // 如果已存在放大视图，则关闭
        existingZoom.remove();
    } else {
        // 创建放大视图
        const zoomOverlay = document.createElement('div');
        zoomOverlay.id = 'card-zoom-overlay';
        zoomOverlay.className = 'card-zoom-overlay';
        zoomOverlay.innerHTML = `
            <div class="card-zoom-content">
                <div class="card-image-wrapper">
                    <img src="${cardData.image || ''}" alt="${cardData.name}" />
                </div>
            </div>
        `;
        
        // 点击关闭
        zoomOverlay.addEventListener('click', () => {
            zoomOverlay.remove();
        });
        
        document.body.appendChild(zoomOverlay);
    }
}

// 显示设置
function showSettings() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'block';
}

// 显示关于
function showAbout() {
    const modal = document.getElementById('about-modal');
    modal.style.display = 'block';
}

// 关闭弹窗
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('主菜单已加载');
});

