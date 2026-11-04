(function () {
    let sharedAudioCtx = null;

    function getSharedAudioCtx() {
        if (!sharedAudioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) sharedAudioCtx = new Ctx();
        }
        if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
            sharedAudioCtx.resume().catch(() => {});
        }
        return sharedAudioCtx;
    }

    if (typeof window.playUiSfx !== 'function') {
        window.playUiSfx = function (type) {
            try {
                const ctx = getSharedAudioCtx();
                if (!ctx) return;
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type === 'error' ? 'sawtooth' : 'sine';
                osc.frequency.setValueAtTime(type === 'start' ? 523.25 : type === 'error' ? 220 : 620, now);
                osc.frequency.exponentialRampToValueAtTime(type === 'start' ? 659.25 : type === 'error' ? 180 : 740, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.12);
            } catch (_) {}
        };
    }

    document.addEventListener('DOMContentLoaded', () => {
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        const savedTheme = localStorage.getItem('theme');

        const applyTheme = (isLight) => {
            if (isLight) {
                document.body.classList.add('light-mode');
                if (themeToggleBtn) themeToggleBtn.textContent = '🌙 Dark Mode';
            } else {
                document.body.classList.remove('light-mode');
                if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Light Mode';
            }
        };

        applyTheme(savedTheme === 'light');

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                if (typeof window.playUiSfx === 'function') {
                    window.playUiSfx('click');
                }
                const isNowLight = !document.body.classList.contains('light-mode');
                applyTheme(isNowLight);
                localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
            });
        }
    });
})();
