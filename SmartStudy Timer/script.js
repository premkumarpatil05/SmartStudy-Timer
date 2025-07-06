const studyInput = document.getElementById('studyTime');
const breakInput = document.getElementById('breakTime');
const timeDisplay = document.getElementById('time');
const bar = document.getElementById('bar');
const alertSound = document.getElementById('alertSound');
const toggleSound = document.getElementById('toggleSound');
const sessionTracker = document.getElementById('sessionTracker');
const sessionLog = document.getElementById('sessionLog');

let timerInterval;
let totalTime = 0;
let remainingTime = 0;
let soundOn = true;
let sessions = 0;
let log = [];

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(remainingTime);
  const percent = 100 - (remainingTime / totalTime) * 100;
  bar.style.width = `${percent}%`;
}

function updateSessionTracker() {
  sessionTracker.textContent = `🔢 Sessions: ${sessions}`;
  sessionLog.innerHTML = log.map(entry => `<div>⏰ ${entry}</div>`).join('');
}

function startTimer(minutes, label) {
  clearInterval(timerInterval);
  totalTime = minutes * 60;
  remainingTime = totalTime;
  updateDisplay();

  timerInterval = setInterval(() => {
    remainingTime--;
    updateDisplay();

    if (remainingTime <= 0) {
      clearInterval(timerInterval);

      if (soundOn) {
        alertSound.loop = true;
        alertSound.play();
        setTimeout(() => {
          alertSound.pause();
          alertSound.currentTime = 0;
          alertSound.loop = false;
        }, 60000);
      }

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      log.unshift(`${label} session ended at ${now}`);

      if (label === 'Study') {
        sessions++;
      }
      updateSessionTracker();

      if ('vibrate' in navigator) navigator.vibrate(500);
    }
  }, 1000);
}

document.getElementById('startStudy').onclick = () => {
  const minutes = parseInt(studyInput.value);
  if (minutes > 0) startTimer(minutes, 'Study');
};

document.getElementById('startBreak').onclick = () => {
  const minutes = parseInt(breakInput.value);
  if (minutes > 0) startTimer(minutes, 'Break');
};

document.getElementById('reset').onclick = () => {
  clearInterval(timerInterval);
  alertSound.pause();
  alertSound.currentTime = 0;
  remainingTime = parseInt(studyInput.value) * 60;
  updateDisplay();
  bar.style.width = '0%';
};

document.getElementById('stopAlert').onclick = () => {
  alertSound.pause();
  alertSound.currentTime = 0;
  alertSound.loop = false;
};

toggleSound.onclick = () => {
  soundOn = !soundOn;
  toggleSound.textContent = soundOn ? '🔊 Sound' : '🔇 Muted';
};

function toggleMenu() {
  document.getElementById('toggleSection').classList.toggle('show');
}

remainingTime = parseInt(studyInput.value) * 60;
updateDisplay();
updateSessionTracker();
