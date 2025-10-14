const timeInput = document.getElementById('time-input');
const titleInput = document.getElementById('title-input');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const pauseBtn = document.getElementById('pause-btn');
const timeUnit = document.getElementById('time-unit');
const clearBtn = document.getElementById('clear-btn');
const timerDisplay = document.getElementById('timer-display');
const savedTimersList = document.getElementById('saved-timers-list');
const currentTimerTitle = document.getElementById('current-timer-title');
const notificationSound = document.getElementById('notification-sound');
const muteBtn = document.getElementById('mute-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

let countdown;
let currentTitle;
let initialTime;
let isPaused = false;
let timeLeft;
let isMuted = false;

// Load saved timers from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const timers = JSON.parse(localStorage.getItem('savedTimers')) || [];
    timers.forEach(timer => addTimerToList(timer.title, timer.time));
});

function timer(seconds) {
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    currentTimerTitle.textContent = currentTitle;

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        timeLeft = secondsLeft;

        if (secondsLeft < 0) {
            clearInterval(countdown);
            if (!isMuted) {
                notificationSound.play();
            }
            saveTimer(currentTitle, formatTime(initialTime));
            currentTimerTitle.textContent = '';
            countdown = null;
            isPaused = false;
            pauseBtn.textContent = 'Pause';
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
    let time = parseInt(timeInput.value);
    const unit = timeUnit.value;
    const title = titleInput.value.trim();

    if (isNaN(time) || time <= 0) {
        alert('Please enter a valid time.');
        return;
    }

    let seconds;
    if (unit === 'minutes') {
        seconds = time * 60;
    } else if (unit === 'hours') {
        seconds = time * 3600;
    } else {
        seconds = time;
    }

    currentTitle = title || 'Unnamed';
    initialTime = seconds;
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    timer(seconds);
    titleInput.value = '';
    timeInput.value = '';
});

stopBtn.addEventListener('click', () => {
    if (countdown) {
        clearInterval(countdown);
        const elapsedTime = initialTime - timeLeft;
        saveTimer(currentTitle, `Counted ${formatTime(elapsedTime)}`);
        timerDisplay.textContent = '00:00:00';
        currentTimerTitle.textContent = '';
        countdown = null;
        isPaused = false;
        pauseBtn.textContent = 'Pause';
    }
    notificationSound.pause();
    notificationSound.currentTime = 0;
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('savedTimers');
    savedTimersList.innerHTML = '';
});

pauseBtn.addEventListener('click', () => {
    if (!countdown) return;

    if (isPaused) {
        isPaused = false;
        pauseBtn.textContent = 'Pause';
        timer(timeLeft);
    } else {
        isPaused = true;
        pauseBtn.textContent = 'Resume';
        clearInterval(countdown);
    }
});

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
    muteBtn.style.background = isMuted ? '#00aaff' : '#6c757d';
});

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggleBtn.textContent = 'Dark Mode';
    } else {
        themeToggleBtn.textContent = 'Light Mode';
    }
});
