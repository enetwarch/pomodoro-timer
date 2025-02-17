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

function retrieveTimer() {
    const storedState = localStorage.getItem("pomodoroState");
    if (storedState === null) {
        pomodoroState = {
            "pomodoroState": "work",
            "pomodoroTimer": pomodoroSettings.workMinutes,
            "longBreakInterval": 1
        };
    } else {
        pomodoroState = JSON.parse(storedState);
    }
    initializeState();
    setInterval(saveTimer, minute);
}

function initializeState() {
    updateBackground();
    printTimer();
}

function saveTimer() {
    localStorage.setItem("pomodoroState", JSON.stringify(pomodoroState));
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
    initializeState();
    clearInterval(updateInterval);
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