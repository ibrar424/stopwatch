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
const downloadBtn = document.getElementById('download-btn');

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


downloadBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const timers = JSON.parse(localStorage.getItem('savedTimers')) || [];

    if (timers.length === 0) {
        alert('No saved timers to download.');
        return;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text('Saved Timers', pageWidth / 2, 15, { align: 'center' });

    let y = 30;
    const startX = 20;
    const col1X = startX;
    const col2X = startX + 25;
    const col3X = startX + 90;

    // Table Header
    doc.setFont('helvetica', 'bold');
    doc.text('Sr. No.', col1X, y);
    doc.text('Name', col2X, y);
    doc.text('Time', col3X, y);
    y += 10;
    doc.setFont('helvetica', 'normal');

    // Table Rows
    timers.forEach((timer, index) => {
        doc.text(`${index + 1}`, col1X, y);
        doc.text(timer.title, col2X, y);
        doc.text(timer.time, col3X, y);
        y += 10;
    });

    doc.save('saved-timers.pdf');
});
