document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('theme');

    const sunSvg = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
    const moonSvg = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;

    const applyTheme = (isLight) => {
        if (isLight) {
            document.body.classList.add('light-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = `${moonSvg}<span>Dark Mode</span>`;
                themeToggleBtn.setAttribute('aria-pressed', 'true');
            }
        } else {
            document.body.classList.remove('light-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = `${sunSvg}<span>Light Mode</span>`;
                themeToggleBtn.setAttribute('aria-pressed', 'false');
            }
        }
    };

    applyTheme(savedTheme === 'light');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isNowLight = !document.body.classList.contains('light-mode');
            applyTheme(isNowLight);
            localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
        });
    }
});
