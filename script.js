const timeInput = document.getElementById('time-input');
const titleInput = document.getElementById('title-input');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const pauseBtn = document.getElementById('pause-btn');
const timeUnit = document.getElementById('time-unit');
const clearBtn = document.getElementById('clear-btn');
const timerDisplay = document.getElementById('timer-display');
const timerStatus = document.getElementById('timer-status');
const timerProgress = document.getElementById('timer-progress');
const dialCircle = document.getElementById('dial-progress-circle');
const savedTimersList = document.getElementById('saved-timers-list');
const savedCountBadge = document.getElementById('saved-count-badge');
const currentTimerTitle = document.getElementById('current-timer-title');
const notificationSound = document.getElementById('notification-sound');
const muteBtn = document.getElementById('mute-btn');
const downloadBtn = document.getElementById('download-btn');
const toastEl = document.getElementById('toast');

// Mode switching elements
const tabCountdown = document.getElementById('tab-countdown');
const tabStopwatch = document.getElementById('tab-stopwatch');
const countdownPanel = document.getElementById('countdown-panel');
const stopwatchPanel = document.getElementById('stopwatch-panel');

// Stopwatch elements
const swDisplay = document.getElementById('stopwatch-display');
const swStatus = document.getElementById('stopwatch-status');
const swStartBtn = document.getElementById('sw-start-btn');
const swLapBtn = document.getElementById('sw-lap-btn');
const swResetBtn = document.getElementById('sw-reset-btn');

// SVG Icons (Lucide / Heroicons standard, zero emojis)
const ICON_PLAY = `<svg class="icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`;
const ICON_PAUSE = `<svg class="icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
const ICON_VOL_ON = `<svg class="icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
const ICON_VOL_MUTE = `<svg class="icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
const ICON_CLOSE = `<svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const RING_CIRCUMFERENCE = 2 * Math.PI * 116; // r=116 -> ~728.85

let countdown = null;
let currentTitle = 'Unnamed';
let initialTime = 0;
let isPaused = false;
let timeLeft = 0;
let isMuted = false;
let toastTimeout = null;

// Stopwatch state
let swInterval = null;
let swRunning = false;
let swStartTime = 0;
let swElapsedMs = 0;
let swLapCount = 0;

function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

function playAlertSound() {
    if (isMuted) return;
    if (notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(() => {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.6);
            } catch (_) {}
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderSavedTimers();
    updateProgress(0);
});

function getSavedTimers() {
    try {
        return JSON.parse(localStorage.getItem('savedTimers')) || [];
    } catch (_) {
        return [];
    }
}

function renderSavedTimers() {
    const timers = getSavedTimers();
    savedTimersList.innerHTML = '';
    if (savedCountBadge) savedCountBadge.textContent = String(timers.length);

    if (timers.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'empty-state';
        emptyLi.textContent = 'No saved sessions yet. Start a timer or stopwatch to log your history.';
        savedTimersList.appendChild(emptyLi);
        return;
    }

    timers.forEach((item, index) => {
        const li = document.createElement('li');

        const infoDiv = document.createElement('div');
        infoDiv.className = 'timer-item-info';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'timer-item-title';
        titleSpan.textContent = `${item.title} —`;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'timer-item-time';
        timeSpan.textContent = item.time;

        infoDiv.appendChild(titleSpan);
        infoDiv.appendChild(timeSpan);

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'timer-item-delete';
        delBtn.title = 'Delete entry';
        delBtn.setAttribute('aria-label', `Delete ${item.title}`);
        delBtn.innerHTML = ICON_CLOSE;
        delBtn.addEventListener('click', () => {
            deleteTimerAt(index);
        });

        li.appendChild(infoDiv);
        li.appendChild(delBtn);
        savedTimersList.appendChild(li);
    });
}

function deleteTimerAt(index) {
    const timers = getSavedTimers();
    timers.splice(index, 1);
    localStorage.setItem('savedTimers', JSON.stringify(timers));
    renderSavedTimers();
}

function saveTimer(title, time) {
    const timers = getSavedTimers();
    timers.unshift({ title, time, createdAt: new Date().toISOString() });
    localStorage.setItem('savedTimers', JSON.stringify(timers));
    renderSavedTimers();
}

function updateProgress(secondsLeft) {
    if (!initialTime || initialTime <= 0) {
        if (timerProgress) timerProgress.style.width = '0%';
        if (dialCircle) dialCircle.style.strokeDashoffset = '0';
        return;
    }
    const elapsedRatio = Math.min(1, Math.max(0, (initialTime - secondsLeft) / initialTime));
    const remainingRatio = Math.min(1, Math.max(0, secondsLeft / initialTime));
    if (timerProgress) {
        timerProgress.style.width = `${elapsedRatio * 100}%`;
    }
    if (dialCircle) {
        const offset = RING_CIRCUMFERENCE * (1 - remainingRatio);
        dialCircle.style.strokeDashoffset = `${offset}`;
    }
}

function setPauseButtonState(paused) {
    if (!pauseBtn) return;
    pauseBtn.innerHTML = paused
        ? `${ICON_PLAY}<span>Resume</span>`
        : `${ICON_PAUSE}<span>Pause</span>`;
}

function timer(seconds) {
    clearInterval(countdown);

    timeLeft = seconds;
    const now = Date.now();
    const then = now + seconds * 1000;

    displayTimeLeft(seconds);
    updateProgress(seconds);
    currentTimerTitle.textContent = currentTitle;
    if (timerStatus) timerStatus.textContent = 'Running...';

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        timeLeft = Math.max(0, secondsLeft);

        if (secondsLeft < 0) {
            clearInterval(countdown);
            countdown = null;
            isPaused = false;
            setPauseButtonState(false);
            displayTimeLeft(0);
            updateProgress(0);
            if (timerStatus) timerStatus.textContent = 'Completed';
            playAlertSound();
            saveTimer(currentTitle, `Completed ${formatTime(initialTime)}`);
            showToast(`"${currentTitle}" finished!`);
            currentTimerTitle.textContent = '';
            document.title = 'Countdown Pro & Stopwatch';
            return;
        }

        displayTimeLeft(secondsLeft);
        updateProgress(secondsLeft);
        document.title = `(${formatTime(secondsLeft)}) ${currentTitle}`;
    }, 250);
}

function displayTimeLeft(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    timerDisplay.textContent = formatTime(safeSeconds);
}

function formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safeSeconds / 3600);
    const remainderMinutes = safeSeconds % 3600;
    const minutes = Math.floor(remainderMinutes / 60);
    const remainderSeconds = remainderMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainderSeconds).padStart(2, '0')}`;
}

function startCountdownWithSeconds(seconds, titleText) {
    currentTitle = titleText || 'Focus Session';
    initialTime = seconds;
    timeLeft = seconds;
    isPaused = false;
    setPauseButtonState(false);
    timer(seconds);
}

// Preset Chips
document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const secs = parseInt(chip.getAttribute('data-seconds'), 10);
        const label = chip.getAttribute('data-label') || 'Quick Timer';
        if (secs > 0) {
            const customTitle = titleInput.value.trim() || label;
            startCountdownWithSeconds(secs, customTitle);
            showToast(`Started "${customTitle}"`);
        }
    });
});

startBtn.addEventListener('click', () => {
    const time = parseFloat(timeInput.value);
    const unit = timeUnit.value;
    const title = titleInput.value.trim();

    if (isNaN(time) || time <= 0) {
        showToast('Please enter a valid positive number for time.');
        timeInput.focus();
        return;
    }

    let seconds;
    if (unit === 'minutes') {
        seconds = Math.round(time * 60);
    } else if (unit === 'hours') {
        seconds = Math.round(time * 3600);
    } else {
        seconds = Math.round(time);
    }

    startCountdownWithSeconds(seconds, title || 'Unnamed');
    titleInput.value = '';
    timeInput.value = '';
});

stopBtn.addEventListener('click', () => {
    if (countdown || isPaused) {
        clearInterval(countdown);
        const elapsedTime = Math.max(0, initialTime - (typeof timeLeft === 'number' ? timeLeft : 0));
        saveTimer(currentTitle, `Counted ${formatTime(elapsedTime)}`);
        timerDisplay.textContent = '00:00:00';
        currentTimerTitle.textContent = '';
        if (timerStatus) timerStatus.textContent = 'Stopped & Saved';
        initialTime = 0;
        updateProgress(0);
        countdown = null;
        isPaused = false;
        setPauseButtonState(false);
        document.title = 'Countdown Pro & Stopwatch';
        showToast(`Saved "${currentTitle}" to history.`);
    }
    if (notificationSound) {
        notificationSound.pause();
        notificationSound.currentTime = 0;
    }
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('savedTimers');
    renderSavedTimers();
    showToast('Cleared all saved timers.');
});

pauseBtn.addEventListener('click', () => {
    if (!countdown && !isPaused) return;

    if (isPaused) {
        isPaused = false;
        setPauseButtonState(false);
        if (timerStatus) timerStatus.textContent = 'Running...';
        timer(timeLeft);
    } else {
        isPaused = true;
        setPauseButtonState(true);
        if (timerStatus) timerStatus.textContent = 'Paused';
        clearInterval(countdown);
        countdown = null;
    }
});

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.innerHTML = isMuted
        ? `${ICON_VOL_MUTE}<span>Unmute</span>`
        : `${ICON_VOL_ON}<span>Mute</span>`;
    muteBtn.setAttribute('aria-pressed', String(isMuted));
    muteBtn.classList.toggle('muted', isMuted);
});

// Mode Tabs (Countdown vs Stopwatch)
if (tabCountdown && tabStopwatch) {
    tabCountdown.addEventListener('click', () => {
        tabCountdown.classList.add('active');
        tabStopwatch.classList.remove('active');
        tabCountdown.setAttribute('aria-selected', 'true');
        tabStopwatch.setAttribute('aria-selected', 'false');
        countdownPanel.classList.remove('hidden');
        stopwatchPanel.classList.add('hidden');
    });

    tabStopwatch.addEventListener('click', () => {
        tabStopwatch.classList.add('active');
        tabCountdown.classList.remove('active');
        tabStopwatch.setAttribute('aria-selected', 'true');
        tabCountdown.setAttribute('aria-selected', 'false');
        stopwatchPanel.classList.remove('hidden');
        countdownPanel.classList.add('hidden');
    });
}

// Stopwatch Logic
function formatStopwatch(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return {
        main: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        ms: `.${String(centiseconds).padStart(2, '0')}`
    };
}

function updateStopwatchDisplay() {
    const formatted = formatStopwatch(swElapsedMs);
    if (swDisplay) {
        swDisplay.innerHTML = `${formatted.main}<span id="stopwatch-ms" class="ms-display">${formatted.ms}</span>`;
    }
}

if (swStartBtn) {
    swStartBtn.addEventListener('click', () => {
        if (!swRunning) {
            swRunning = true;
            swStartTime = Date.now() - swElapsedMs;
            swStartBtn.innerHTML = `${ICON_PAUSE}<span>Pause</span>`;
            if (swStatus) swStatus.textContent = 'Stopwatch Running...';
            swInterval = setInterval(() => {
                swElapsedMs = Date.now() - swStartTime;
                updateStopwatchDisplay();
            }, 30);
        } else {
            swRunning = false;
            clearInterval(swInterval);
            swStartBtn.innerHTML = `${ICON_PLAY}<span>Resume</span>`;
            if (swStatus) swStatus.textContent = 'Stopwatch Paused';
        }
    });
}

if (swLapBtn) {
    swLapBtn.addEventListener('click', () => {
        if (swElapsedMs <= 0) return;
        swLapCount++;
        const f = formatStopwatch(swElapsedMs);
        saveTimer(`Stopwatch Lap #${swLapCount}`, `${f.main}${f.ms}`);
        showToast(`Recorded Lap #${swLapCount}: ${f.main}${f.ms}`);
    });
}

if (swResetBtn) {
    swResetBtn.addEventListener('click', () => {
        if (swElapsedMs > 0) {
            const f = formatStopwatch(swElapsedMs);
            saveTimer('Stopwatch Session', `Total ${f.main}${f.ms}`);
            showToast(`Saved Stopwatch session (${f.main}${f.ms})`);
        }
        swRunning = false;
        clearInterval(swInterval);
        swElapsedMs = 0;
        swLapCount = 0;
        updateStopwatchDisplay();
        if (swStartBtn) swStartBtn.innerHTML = `${ICON_PLAY}<span>Start</span>`;
        if (swStatus) swStatus.textContent = 'Stopwatch Ready';
    });
}

// PDF Export with Pagination
downloadBtn.addEventListener('click', () => {
    const timers = getSavedTimers();

    if (timers.length === 0) {
        showToast('No saved timers to download.');
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast('PDF library is loading. Please try again in a moment.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Stopwatch.name - Saved Timers Report', pageWidth / 2, 18, { align: 'center' });

    let y = 32;
    const col1X = 20;
    const col2X = 42;
    const col3X = 125;

    const drawHeader = () => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Sr. No.', col1X, y);
        doc.text('Name', col2X, y);
        doc.text('Time', col3X, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
    };

    drawHeader();

    timers.forEach((item, index) => {
        if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
            drawHeader();
        }
        doc.text(`${index + 1}`, col1X, y);
        doc.text(String(item.title || 'Unnamed').substring(0, 38), col2X, y);
        doc.text(String(item.time || ''), col3X, y);
        y += 9;
    });

    doc.save('saved-timers.pdf');
    showToast('Downloaded saved-timers.pdf');
});
