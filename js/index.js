const millisecond = 1;
const second = 1000 * millisecond;
const minute = 60 * second;

const settings = {
    "minutes": {
        "work": 50 * minute,
        "rest": 10 * minute,
        "longBreak": 60 * minute
    },
    "interval": 4
};

const defaultPomodoro = {
    "state": "work",
    "timer": settings.minutes.work,
    "interval": 1
}

let pomodoro;
let idleNotificationInterval;

window.addEventListener("load", retrievePomodoro);
window.addEventListener("beforeunload", savePomodoro);

function retrievePomodoro() {
    const storedState = localStorage.getItem("pomodoro");
    if (storedState === null || storedState === "undefined") {
        pomodoro = defaultPomodoro;
    } else {
        pomodoro = JSON.parse(storedState);
    }
    setInterval(savePomodoro, 1 * minute);
    setIdleNotificationInterval();
    initializeState();
}

function savePomodoro() {
    const currentState = JSON.stringify(pomodoro);
    localStorage.setItem("pomodoro", currentState);
}

function setIdleNotificationInterval() {
    idleNotificationInterval = setInterval(() => {
        pushNotification("Timer is paused.");
    }, 2 * minute);
}

document.addEventListener("touchstart", handleHeldDown);

document.addEventListener("touchend", (event) => {
    event.preventDefault(), handleLetGo();
});

document.addEventListener("mousedown", event => {
    if (event.button === 0) handleHeldDown();
});

document.addEventListener("mouseup", event => {
    if (event.button === 0) handleLetGo();
});

document.addEventListener("keydown", event => {
    if (event.code === "Space") handleHeldDown();
});

document.addEventListener("keyup", event => {
    if (event.code === "Space") handleLetGo();
});

document.addEventListener("contextmenu", event => {
    event.preventDefault();
});

let isHeldDown = false;
let heldDownTimeouts = [];

function handleHeldDown() {
    isHeldDown = true;
    createHeldDownTimeout(() => {
        if (isRunning) toggleTimer(); 
    }, 1 * second);
    createHeldDownTimeout(resetSession, 3 * second);
    createHeldDownTimeout(hardResetSession, 5 * second);
}

function createHeldDownTimeout(foo, delay) {
    heldDownTimeouts.push(setTimeout(foo, delay));
}

function handleLetGo() {
    isHeldDown = false;
    clearHeldDownTimeouts();
    toggleTimer();
}

function clearHeldDownTimeouts() {
    heldDownTimeouts.forEach((heldDownTimeout) => {
        clearTimeout(heldDownTimeout);
    });
    heldDownTimeouts = [];
}

function resetSession() {
    pomodoro.timer = settings.minutes[pomodoro.state];
    printText();
}

function hardResetSession() {
    pomodoro = defaultPomodoro;
    printText();
}

function initializeState(body) {
    pushNotification(body);
    printText();
}

function printText() {
    printState();
    printTimer();
    printSession();
}

async function pushNotification(body) {
    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
        const title = "Pomodoro Timer";
        new Notification(title, {body});
    } 
}

const stateColors = {
    "work": {
        "background": "--red", 
        "favicon": "img/red.ico"
    },
    "rest": {
        "background": "--blue", 
        "favicon": "img/blue.ico"
    },
    "longBreak": {
        "background": "--green", 
        "favicon": "img/green.ico"
    },
    "idle": {
        "background": "--black", 
        "favicon": "img/black.ico"
    }
};

function updateColor(state) {
    const stateColor = stateColors[state];
    setBackground(stateColor.background);
    setFavicon(stateColor.favicon);
}

function setBackground(rootVariable) {
    document.getElementById("background").style.backgroundColor = getColor(rootVariable);
}

function getColor(rootVariable) {
    return getComputedStyle(document.documentElement).getPropertyValue(rootVariable);
}

function setFavicon(faviconLink) {
    document.getElementById("favicon").setAttribute("href", faviconLink);
}

let isRunning = false;
let endingTime;
let updateTimerInterval;

function toggleTimer() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

function stopTimer() {
    isRunning = false;
    updateColor("idle");
    setIdleNotificationInterval();
    clearInterval(updateTimerInterval);
}

function startTimer() {
    isRunning = true;
    endingTime = Date.now() + pomodoro.timer;
    updateColor(pomodoro.state);
    clearInterval(idleNotificationInterval);
    updateTimerInterval = setInterval(updateTimer, 100 * millisecond);
}

function updateTimer() {
    pomodoro.timer = endingTime - Date.now();
    pomodoro.timer < 0 ? handleTimerEnd() : printTimer();
}

function printState() {
    document.getElementById("state").innerText = formatState();
}

function formatState() {
    const state = pomodoro.state.replace(/([A-Z])/g, ' $1');
    return state.charAt(0).toUpperCase() + state.slice(1);
}

function printTimer() {
    document.getElementById("timer").innerText = formatTimer();
}

function formatTimer() {
    const timer = pomodoro.timer;
    const minutes = Math.floor(timer / minute);
    const seconds = Math.floor(timer % minute / second);
    return `${formatTimerPadding(minutes)}:${formatTimerPadding(seconds)}`;
}

function formatTimerPadding(time) {
    return String(time).padStart(2, "0");
}

function printSession() {
    document.getElementById("session").innerText = `Session ${formatSession()}`;
}

function formatSession() {
    const interval = pomodoro.interval;
    return interval ? interval : "Reset";
}

function handleTimerEnd() {
    toggleTimer();
    if (pomodoro.state === "work") {
        pomodoro.interval === settings.interval ?
        modifyPomodoro("longBreak", settings.minutes.longBreak, 0) :
        modifyPomodoro("rest", settings.minutes.rest, pomodoro.interval);
    } else {
        modifyPomodoro("work", settings.minutes.work, pomodoro.interval + 1);
    }
    initializeState(formatNotificationBody());
}

function modifyPomodoro(state, timer, interval) {
    pomodoro.state = state;
    pomodoro.timer = timer;
    pomodoro.interval = interval;
}

function formatNotificationBody() {
    const state = formatState();
    const minutes = pomodoro.timer / minute;
    return `${state} for ${minutes} minutes.`;
}