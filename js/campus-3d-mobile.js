/**
 * 3D 校园手机模式：虚拟摇杆 + 交互 + 跳跃
 * 依赖 campus-settings.js，需在页面中先加载
 */
(function () {
    function init() {
        if (typeof CampusSettings === 'undefined' || !CampusSettings.isMobileMode()) {
            return;
        }

        window._campusJoy = { x: 0, y: 0 };

        var root = document.createElement('div');
        root.id = 'campus-3d-mobile-root';

        var joyWrap = document.createElement('div');
        joyWrap.className = 'campus-joy-wrap';
        joyWrap.innerHTML =
            '<div class="campus-joy-label">移动</div>' +
            '<div class="campus-joy-base" id="campus-joy-base">' +
            '<div class="campus-joy-stick" id="campus-joy-stick"></div></div>';

        var actions = document.createElement('div');
        actions.className = 'campus-3d-actions';
        actions.innerHTML =
            '<button type="button" class="campus-mbtn campus-mbtn-e" id="campus-mbtn-e">交互</button>' +
            '<button type="button" class="campus-mbtn campus-mbtn-space" id="campus-mbtn-jump">跳</button>';

        root.appendChild(joyWrap);
        root.appendChild(actions);
        document.body.appendChild(root);

        var style = document.createElement('style');
        style.textContent =
            '.campus-joy-wrap{position:fixed;left:12px;bottom:max(16px,env(safe-area-inset-bottom));pointer-events:auto;z-index:601;}' +
            '.campus-joy-label{font-size:11px;color:rgba(255,255,255,.85);margin-bottom:6px;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.5);}' +
            '.campus-joy-base{width:120px;height:120px;border-radius:50%;background:rgba(15,23,42,.6);' +
            'border:2px solid rgba(148,163,184,.45);position:relative;touch-action:none;}' +
            '.campus-joy-stick{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);' +
            'position:absolute;left:50%;top:50%;margin:-24px 0 0 -24px;box-shadow:0 4px 14px rgba(0,0,0,.35);transition:transform .05s;}' +
            '.campus-3d-actions{position:fixed;right:12px;bottom:max(16px,env(safe-area-inset-bottom));' +
            'display:flex;flex-direction:column;gap:10px;align-items:flex-end;z-index:601;}' +
            '.campus-mbtn{min-width:76px;padding:14px 18px;border-radius:16px;border:none;font-size:15px;font-weight:800;' +
            'color:#fff;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.35);font-family:inherit;touch-action:manipulation;}' +
            '.campus-mbtn-e{background:linear-gradient(135deg,#059669,#10b981);}' +
            '.campus-mbtn-space{background:linear-gradient(135deg,#2563eb,#3b82f6);}';
        document.head.appendChild(style);

        var base = document.getElementById('campus-joy-base');
        var stick = document.getElementById('campus-joy-stick');
        var maxR = 36;

        function joyFromClient(clientX, clientY) {
            var rect = base.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            var dx = clientX - cx;
            var dy = clientY - cy;
            var len = Math.hypot(dx, dy) || 1;
            var nx = dx / len;
            var ny = dy / len;
            var mag = Math.min(len, maxR) / maxR;
            window._campusJoy.x = nx * mag;
            window._campusJoy.y = ny * mag;
            var dist = Math.min(len, maxR);
            stick.style.transform = 'translate(' + nx * dist + 'px,' + ny * dist + 'px)';
        }

        function joyReset() {
            window._campusJoy.x = 0;
            window._campusJoy.y = 0;
            stick.style.transform = 'translate(0,0)';
        }

        var joyActive = false;

        base.addEventListener('touchstart', function (ev) {
            joyActive = true;
            var t = ev.touches[0];
            joyFromClient(t.clientX, t.clientY);
        }, { passive: false });

        base.addEventListener('touchmove', function (ev) {
            if (!joyActive) return;
            ev.preventDefault();
            var t = ev.touches[0];
            joyFromClient(t.clientX, t.clientY);
        }, { passive: false });

        base.addEventListener('touchend', function () {
            joyActive = false;
            joyReset();
        });
        base.addEventListener('touchcancel', function () {
            joyActive = false;
            joyReset();
        });

        base.addEventListener('mousedown', function (ev) {
            joyActive = true;
            joyFromClient(ev.clientX, ev.clientY);
            function mm(e) {
                if (!joyActive) return;
                joyFromClient(e.clientX, e.clientY);
            }
            function mu() {
                joyActive = false;
                window.removeEventListener('mousemove', mm);
                window.removeEventListener('mouseup', mu);
                joyReset();
            }
            window.addEventListener('mousemove', mm);
            window.addEventListener('mouseup', mu);
        });

        function fireKey(key) {
            try {
                var opts = { key: key, bubbles: true, cancelable: true };
                if (key === ' ') opts.code = 'Space';
                else if (key === 'e') opts.code = 'KeyE';
                window.dispatchEvent(new KeyboardEvent('keydown', opts));
                setTimeout(function () {
                    window.dispatchEvent(new KeyboardEvent('keyup', opts));
                }, 80);
            } catch (e) {}
        }

        document.getElementById('campus-mbtn-e').addEventListener('click', function () {
            fireKey('e');
        });
        document.getElementById('campus-mbtn-jump').addEventListener('click', function () {
            fireKey(' ');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
