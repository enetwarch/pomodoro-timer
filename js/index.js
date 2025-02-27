const millisecond = 1;
const second = 1000 * millisecond;
const minute = 60 * second;

const pomodoroSettings = {
    "workMinutes": 50 * minute,
    "restMinutes": 10 * minute,
    "longBreakMinutes": 60 * minute,
    "longBreakInterval": 4
};

const defaultPomodoroState = {
    "pomodoroState": "work",
    "pomodoroTimer": pomodoroSettings.workMinutes,
    "longBreakInterval": 1
}

let pomodoroState;
let idleNotificationInterval;

window.addEventListener("load", () => {
    const storedState = localStorage.getItem("pomodoroState");
    if (storedState === null || storedState === "undefined") {
        pomodoroState = defaultPomodoroState;
    } else {
        pomodoroState = JSON.parse(storedState);
    }
    setInterval(saveState, 1 * minute);
    setIdleNotificationInterval();
    pushNotification(undefined);
    printText();
});

window.addEventListener("beforeunload", () => {
    saveState();
});

function saveState() {
    const currentState = JSON.stringify(pomodoroState);
    localStorage.setItem("pomodoroState", currentState);
}

function setIdleNotificationInterval() {
    idleNotificationInterval = setInterval(() => {
        pushNotification("Timer is paused.");
    }, 2 * minute);
}

document.addEventListener("touchstart", () => {
    handleHeldDown();
});

document.addEventListener("touchend", (event) => {
    event.preventDefault(); 
    handleLetGo();
});

document.addEventListener("mousedown", (event) => {
    if (event.button === 0) handleHeldDown();
});

document.addEventListener("mouseup", (event) => {
    if (event.button === 0) handleLetGo();
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") handleHeldDown(); 
});

document.addEventListener("keyup", (event) => {
    if (event.code === "Space") handleLetGo();
});

document.addEventListener("contextmenu", (event) => {
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
    const state = pomodoroState.pomodoroState + "Minutes";
    pomodoroState.pomodoroTimer = pomodoroSettings[state];
    printText();
}

function hardResetSession() {
    pomodoroState = defaultPomodoroState;
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
    const background = document.getElementById("background");
    background.style.backgroundColor = getColor(rootVariable);
}

function getColor(rootVariable) {
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue(rootVariable);
}

function setFavicon(faviconLink) {
    const favicon = document.getElementById("favicon");
    favicon.setAttribute("href", faviconLink);
}

let isRunning = false;
let endingTime;
let updateTimerInterval;

function toggleTimer() {
    isRunning ? stopTimer() : startTimer();
}

function stopTimer() {
    isRunning = false;
    updateColor("idle");
    setIdleNotificationInterval();
    clearInterval(updateTimerInterval);
}

function startTimer() {
    isRunning = true;
    endingTime = Date.now() + pomodoroState.pomodoroTimer;
    updateColor(pomodoroState.pomodoroState);
    clearInterval(idleNotificationInterval);
    updateTimerInterval = setInterval(updateTimer, 100 * millisecond);
}

function updateTimer() {
    pomodoroState.pomodoroTimer = endingTime - Date.now();
    pomodoroState.pomodoroTimer < 0 ? handleTimerEnd() : printTimer();
}

function printState() {
    document.getElementById("state").innerText = formatState();
}

function formatState() {
    const state = pomodoroState.pomodoroState.replace(/([A-Z])/g, ' $1');
    return state.charAt(0).toUpperCase() + state.slice(1);
}

function printTimer() {
    document.getElementById("timer").innerText = formatTimer();
}

function formatTimer() {
    const timer = pomodoroState.pomodoroTimer;
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
    const interval = pomodoroState.longBreakInterval;
    return interval ? interval : "Reset";
}

function handleTimerEnd() {
    toggleTimer();
    if (pomodoroState.pomodoroState === "work") {
        if (pomodoroState.longBreakInterval === pomodoroSettings.longBreakInterval) {
            modifyPomodoroState("longBreak", pomodoroSettings.longBreakMinutes, 0);
        } else {
            modifyPomodoroState("rest", pomodoroSettings.restMinutes, pomodoroState.longBreakInterval);
        }
    } else {
        modifyPomodoroState("work", pomodoroSettings.workMinutes, pomodoroState.longBreakInterval + 1);
    }
    pushNotification(formatNotificationBody());
    printText();
}

function modifyPomodoroState(state, timer, interval) {
    pomodoroState.pomodoroState = state;
    pomodoroState.pomodoroTimer = timer;
    pomodoroState.longBreakInterval = interval;
}

function formatNotificationBody() {
    const state = formatState();
    const minutes = pomodoroState.pomodoroTimer / minute;
    return `${state} for ${minutes} minutes.`;
}