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

    // Initialize from localStorage
    applyTheme(savedTheme === 'light');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isNowLight = !document.body.classList.contains('light-mode');
            applyTheme(isNowLight);
            localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
        });
    }
});
