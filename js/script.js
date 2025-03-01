const millisecond = 1;
const second = 1000 * millisecond;
const minute = 60 * second;

const settings = {
    "minutes": {
        "work": 0.1 * minute,
        "rest": 0.1 * minute,
        "longBreak": 0.1 * minute
    },
    "interval": 4
};

const defaultPomodoro = {
    "state": "work",
    "timer": settings.minutes.work,
    "session": 1
};

let pomodoro;

window.addEventListener("load", retrievePomodoro);
window.addEventListener("beforeunload", savePomodoro);

function retrievePomodoro() {
    const storedPomodoro = localStorage.getItem("pomodoro");
    if (storedPomodoro === null || storedPomodoro === "undefined") {
        pomodoro = structuredClone(defaultPomodoro);
    } else {
        pomodoro = JSON.parse(storedPomodoro);
    }
    setInterval(savePomodoro, 1 * minute);
    printText();
}

function savePomodoro() {
    localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
}

let isRunning = false;
let updateTimerInterval;
let endingTime;

document.body.addEventListener("touchend", toggleTimerHandler);
document.body.addEventListener("mouseup", toggleTimerHandler);
document.body.addEventListener("keyup", toggleTimerHandler);
document.body.addEventListener("contextmenu", event => event.preventDefault());

function toggleTimerHandler(event) {
    if (event.type === "touchend") event.preventDefault();
    if (event.type === "mouseup" && event.button !== 0) return;
    if (event.type === "keyup" && event.code !== "Space") return;
    if (resetButtonPressed) {
        resetButtonPressed = false;
        return;
    }
    toggleTimer();
}

function toggleTimer() {
    isRunning ? stopTimer() : startTimer();
}

function stopTimer() {
    isRunning = false;
    clearInterval(updateTimerInterval);
    updateColor("idle");
}

function startTimer() {
    isRunning = true;
    endingTime = Date.now() + pomodoro.timer;
    updateTimerInterval = setInterval(updateTimer, 100 * millisecond);
    updateColor(pomodoro.state);
}

function updateTimer() {
    pomodoro.timer = endingTime - Date.now();
    pomodoro.timer < 0 ? handleTimerEnd() : printTimer();
}

const reset = document.getElementById("reset");
let resetButtonPressed = false;
let hardResetTimeout;

reset.addEventListener("touchstart", hardReset);
reset.addEventListener("touchend", softReset);
reset.addEventListener("mousedown", hardReset)
reset.addEventListener("mouseup", softReset);

function hardReset() {
    if (resetButtonPressed) return;
    resetButtonPressed = true;
    hardResetTimeout = setTimeout(() => {
        if (confirm("Do you want to HARD reset the timer?")) {
            pomodoro = structuredClone(defaultPomodoro);
        }
        resetButtonPressed = false;
        stopTimer();
        printText();        
    }, 1 * second);
}

function softReset() {
    clearTimeout(hardResetTimeout);
    if (confirm("Do you want to soft reset the timer?")) {
        pomodoro.timer = settings.minutes[pomodoro.state];
    }
    stopTimer();
    printTimer();
}

function printText() {
    printState(); 
    printTimer(); 
}

function printState() {
    const session = pomodoro.session !== 0 ? `#${pomodoro.session}` : "";
    const state = `${formatState()} ${session}`.trim();
    document.getElementById("state").innerText = state;
}

function printTimer() {
    let minutes = formatTime(pomodoro.timer / minute);
    let seconds = formatTime(pomodoro.timer % minute / second);
    const timer = `${minutes}:${seconds}`;
    document.getElementById("timer").innerText = timer;
}

function formatState() {
    const state = pomodoro.state.replace(/([A-Z])/g, ' $1');
    return state.charAt(0).toUpperCase() + state.slice(1);
}

function formatTime(time) {
    return String(Math.floor(time)).padStart(2, "0");
}

const stateColors = {
    "work": "red",
    "rest": "blue",
    "longBreak": "green",
    "idle": "black"
};

function updateColor(state) {
    const stateColor = stateColors[state];
    setBackground(`--${stateColor}`);
    setFavicon(`img/${stateColor}.ico`);
}

function setBackground(rootVariable) {
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue(rootVariable);
    document.body.style.backgroundColor = color;
}

function setFavicon(faviconLink) {
    const favicon = document.getElementById("favicon");
    favicon.setAttribute("href", faviconLink);
}

function handleTimerEnd() {
    toggleTimer();
    if (pomodoro.state === "work") {
        if (pomodoro.session === settings.interval) {
            pomodoro.state = "longBreak";
            pomodoro.session = 0;
        } else {
            pomodoro.state = "rest";
        }
    } else {
        pomodoro.state = "work";
        pomodoro.session++;
    }
    pomodoro.timer = settings.minutes[pomodoro.state];
    pushNotification();
    printText();
}

async function pushNotification() {
    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
        const title = "Pomodoro Timer";
        const body = `${formatState()} for ${pomodoro.timer / minute} minutes.`;
        new Notification(title, {body}); 
    }
}