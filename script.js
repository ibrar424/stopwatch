const timeInput = document.getElementById('time-input');
const titleInput = document.getElementById('title-input');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const clearBtn = document.getElementById('clear-btn');
const timerDisplay = document.getElementById('timer-display');
const savedTimersList = document.getElementById('saved-timers-list');
const currentTimerTitle = document.getElementById('current-timer-title');

let countdown;
let currentTitle;
let initialTime;

// Load saved timers from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const timers = JSON.parse(localStorage.getItem('savedTimers')) || [];
    timers.forEach(timer => addTimerToList(timer.title, timer.time));
});

function timer(seconds) {
    clearInterval(countdown);
    initialTime = seconds;

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    currentTimerTitle.textContent = currentTitle;

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        if (secondsLeft < 0) {
            clearInterval(countdown);
            saveTimer(currentTitle, formatTime(initialTime));
            currentTimerTitle.textContent = '';
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const hours = Math.floor(seconds / 3600);
    const remainderMinutes = seconds % 3600;
    const minutes = Math.floor(remainderMinutes / 60);
    const remainderSeconds = remainderMinutes % 60;
    const display = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const remainderMinutes = seconds % 3600;
    const minutes = Math.floor(remainderMinutes / 60);
    const remainderSeconds = remainderMinutes % 60;
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
}

function addTimerToList(title, time) {
    const li = document.createElement('li');
    li.textContent = `${title} - ${time}`;
    savedTimersList.appendChild(li);
}

function saveTimer(title, time) {
    addTimerToList(title, time);
    const timers = JSON.parse(localStorage.getItem('savedTimers')) || [];
    timers.push({ title, time });
    localStorage.setItem('savedTimers', JSON.stringify(timers));
}

startBtn.addEventListener('click', () => {
    const seconds = parseInt(timeInput.value);
    let title = titleInput.value;

    if (!title) {
        title = "unnamed";
    }
    if (isNaN(seconds) || seconds <= 0) {
        alert('Please enter a valid number of seconds.');
        return;
    }
    currentTitle = title;
    timer(seconds);
    titleInput.value = '';
    timeInput.value = '';
});

stopBtn.addEventListener('click', () => {
    if (countdown) {
        clearInterval(countdown);
        const remainingTime = timerDisplay.textContent;
        saveTimer(currentTitle, `Stopped at ${remainingTime}`);
        timerDisplay.textContent = '00:00:00';
        currentTimerTitle.textContent = '';
        countdown = null;
    }
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('savedTimers');
    savedTimersList.innerHTML = '';
});
