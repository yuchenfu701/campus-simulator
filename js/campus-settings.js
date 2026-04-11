/**
 * 全局设置（含手机模式）— 存 localStorage，全站读取
 */
(function () {
    var KEY = 'campus_settings';

    function load() {
        try {
            var s = localStorage.getItem(KEY);
            if (s) return JSON.parse(s);
        } catch (e) {}
        return { mobileMode: false, reduceMotion: false };
    }

    function save(partial) {
        var next = Object.assign(load(), partial);
        try {
            localStorage.setItem(KEY, JSON.stringify(next));
        } catch (e) {}
        apply();
    }

    function isMobileMode() {
        return !!load().mobileMode;
    }

    function apply() {
        var d = load();
        document.documentElement.classList.toggle('campus-mobile-mode', !!d.mobileMode);
        document.documentElement.classList.toggle('campus-reduce-motion', !!d.reduceMotion);
    }

    window.CampusSettings = {
        load: load,
        save: save,
        isMobileMode: isMobileMode,
        apply: apply,
        setMobileMode: function (v) {
            save({ mobileMode: !!v });
        },
        setReduceMotion: function (v) {
            save({ reduceMotion: !!v });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
    } else {
        apply();
    }
})();
