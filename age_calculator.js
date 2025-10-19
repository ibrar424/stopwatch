document.addEventListener('DOMContentLoaded', () => {
    flatpickr("#birth-date", {
        dateFormat: "m/d/Y",
    });

    flatpickr("#current-date", {
        dateFormat: "m/d/Y",
    });

    const birthDateInput = document.getElementById('birth-date');
    const currentDateInput = document.getElementById('current-date');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');

    // Set the current date input to today's date
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
    currentDateInput.value = `${month}/${day}/${year}`;

    calculateBtn.addEventListener('click', () => {
        const birthDate = new Date(birthDateInput.value);
        const currentDate = new Date(currentDateInput.value);

        if (isNaN(birthDate.getTime()) || isNaN(currentDate.getTime())) {
            resultDiv.textContent = 'Please enter valid dates.';
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
    });
});
