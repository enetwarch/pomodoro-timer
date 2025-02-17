const millisecond = 1;
const second = millisecond * 1000;
const minute = second * 60;

const pomodoroSettings = {
    "workMinutes": 0.5 * minute,
    "restMinutes": 0.1 * minute,
    "longBreakMinutes": 0.6 * minute,
    "longBreakInterval": 4
};

let pomodoroState;

function retrieveState() {
    const storedState = localStorage.getItem("pomodoroState");
    if (storedState === null || storedState === "undefined") {
        pomodoroState = {
            "pomodoroState": "work",
            "pomodoroTimer": pomodoroSettings.workMinutes,
            "longBreakInterval": 1
        };
    } else {
        pomodoroState = JSON.parse(storedState);
    }
    setInterval(saveState, minute);
    initializeState(undefined);
}

function saveState() {
    localStorage.setItem("pomodoroState", JSON.stringify(pomodoroState));
}

function initializeState(body) {
    pushNotification(body);
    updateBackground();
    printTimer();
}

const title = "Pomodoro Timer";

async function pushNotification(body) {
    if (requestNotification()) {
        new Notification(title, {body});
    }
}

async function requestNotification() {
    if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    } else {
        return true;
    }
}

function updateBackground() {
    switch (pomodoroState.pomodoroState) {
        case "work":
            setBackground("--work-color");
            break;
        case "rest":
            setBackground("--rest-color");
            break;
        case "longBreak":
            setBackground("--long-break-color");
    }
}

function setBackground(rootVariable) {
    document.getElementById("background").style.backgroundColor = getColor(rootVariable);
}

function getColor(rootVariable) {
    return getComputedStyle(document.documentElement).getPropertyValue(rootVariable);
}

let running = false;
let updateInterval;

function toggleTimer() {
    if (running) {
        running = false;
        clearInterval(updateInterval);
    } else {
        running = true;
        updateInterval = setInterval(updateTimer, second);
    }
}

function updateTimer() {
    pomodoroState.pomodoroTimer -= second;
    if (pomodoroState.pomodoroTimer < 0) {
        handleTimerEnd();
        return;
    }
    printTimer();
}

function printTimer() {
    document.getElementById("timer").innerText = formatTimer();
}

function formatTimer() {
    const timer = pomodoroState.pomodoroTimer;
    let minutes = Math.floor(timer / minute);
    let seconds = Math.floor(timer % minute / second);
    return `${formatPadding(minutes)}:${formatPadding(seconds)}`;
}

function formatPadding(time) {
    return String(time).padStart(2, "0");
}

function handleTimerEnd() {
    if (pomodoroState.pomodoroState === "work") {
        if (pomodoroState.longBreakInterval === pomodoroSettings.longBreakInterval) {
            pomodoroState.pomodoroState = "longBreak";
            pomodoroState.pomodoroTimer = pomodoroSettings.longBreakMinutes;
            pomodoroState.longBreakInterval = 1;
        } else {
            pomodoroState.pomodoroState = "rest";
            pomodoroState.pomodoroTimer = pomodoroSettings.restMinutes;
        }
    } else {
        pomodoroState.pomodoroState = "work";
        pomodoroState.pomodoroTimer = pomodoroSettings.workMinutes;
        pomodoroState.longBreakInterval += 1;
    }
    clearInterval(updateInterval);
    initializeState(formatNotificationBody());
}

function formatNotificationBody() {
    const state = pomodoroState.pomodoroState.replace(/([A-Z])/g, ' $1');
    const finalState = state.charAt(0).toUpperCase() + state.slice(1);
    const minutes = pomodoroState.pomodoroTimer / minute;
    return `${finalState} for ${minutes} minutes.`;
}