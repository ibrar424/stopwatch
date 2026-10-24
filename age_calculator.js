document.addEventListener('DOMContentLoaded', () => {
    const birthDateInput = document.getElementById('birth-date');
    const currentDateInput = document.getElementById('current-date');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    const statsGrid = document.getElementById('age-stats-grid');
    const statMonths = document.getElementById('stat-months');
    const statWeeks = document.getElementById('stat-weeks');
    const statDays = document.getElementById('stat-days');
    const statNextBday = document.getElementById('stat-next-bday');

    const today = new Date();
    const formattedToday = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
    currentDateInput.value = formattedToday;

    if (typeof flatpickr === 'function') {
        flatpickr('#birth-date', {
            dateFormat: 'm/d/Y',
            allowInput: true
        });

        flatpickr('#current-date', {
            dateFormat: 'm/d/Y',
            defaultDate: today,
            allowInput: true
        });
    }

    function parseMDY(str) {
        if (!str) return null;
        const parts = str.trim().split(/[\/\-]/);
        if (parts.length === 3) {
            const m = parseInt(parts[0], 10);
            const d = parseInt(parts[1], 10);
            const y = parseInt(parts[2], 10);
            if (!isNaN(m) && !isNaN(d) && !isNaN(y) && m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 100) {
                const dateObj = new Date(y, m - 1, d);
                if (dateObj.getFullYear() === y && dateObj.getMonth() === m - 1 && dateObj.getDate() === d) {
                    return dateObj;
                }
            }
        }
        const fallback = new Date(str);
        return isNaN(fallback.getTime()) ? null : fallback;
    }

    calculateBtn.addEventListener('click', () => {
        const birthDate = parseMDY(birthDateInput.value);
        const currentDate = parseMDY(currentDateInput.value);

        resultDiv.classList.remove('error-msg');

        if (!birthDate || !currentDate) {
            resultDiv.textContent = 'Please enter valid dates in MM/DD/YYYY format.';
            resultDiv.classList.add('error-msg');
            if (statsGrid) statsGrid.classList.add('hidden');
            return;
        }

        if (birthDate > currentDate) {
            resultDiv.textContent = 'Birth date cannot be in the future relative to the target date.';
            resultDiv.classList.add('error-msg');
            if (statsGrid) statsGrid.classList.add('hidden');
            return;
        }

        let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
        let ageMonths = currentDate.getMonth() - birthDate.getMonth();
        let ageDays = currentDate.getDate() - birthDate.getDate();

        if (ageDays < 0) {
            ageMonths--;
            const daysInLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            ageDays += daysInLastMonth;
        }

        if (ageMonths < 0) {
            ageYears--;
            ageMonths += 12;
        }

        resultDiv.textContent = `You are ${ageYears} years, ${ageMonths} months, and ${ageDays} days old.`;

        // Compute additional statistics
        const diffMs = currentDate.getTime() - birthDate.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = ageYears * 12 + ageMonths;

        // Next birthday calculation
        let nextBday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBday < currentDate) {
            nextBday = new Date(currentDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
        }
        const daysUntilBday = Math.ceil((nextBday.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        if (statsGrid) {
            statMonths.textContent = totalMonths.toLocaleString();
            statWeeks.textContent = totalWeeks.toLocaleString();
            statDays.textContent = totalDays.toLocaleString();
            statNextBday.textContent = daysUntilBday === 0 ? '🎉 Today!' : `${daysUntilBday} days`;
            statsGrid.classList.remove('hidden');
        }
    });
});
