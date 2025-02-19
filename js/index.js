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
}

function saveState() {
    localStorage.setItem("pomodoroState", JSON.stringify(pomodoroState));
}

function initializeState(body) {
    pushNotification(body);
    updateBackground();
    printState();
    printTimer();
    printSession();
}

async function pushNotification(body) {
    const title = "Pomodoro Timer";
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
    if (running) {
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
    } else {
        setBackground("--idle-color");
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
    if (!isBlurred) {
        updateBackground();
    }
}

function updateTimer() {
    pomodoroState.pomodoroTimer -= second;
    if (pomodoroState.pomodoroTimer < 0) {
        toggleTimer();
        handleTimerEnd();
        return;
    }
    printTimer();
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
    if (pomodoroState.pomodoroState !== "longBreak") {
        return pomodoroState.longBreakInterval
    } else {
        return "Reset";
    }
}

function handleTimerEnd() {
    if (pomodoroState.pomodoroState === "work") {
        if (pomodoroState.longBreakInterval === pomodoroSettings.longBreakInterval) {
            pomodoroState.pomodoroState = "longBreak";
            pomodoroState.pomodoroTimer = pomodoroSettings.longBreakMinutes;
            pomodoroState.longBreakInterval = 0;
        } else {
            pomodoroState.pomodoroState = "rest";
            pomodoroState.pomodoroTimer = pomodoroSettings.restMinutes;
        }
    } else {
        pomodoroState.pomodoroState = "work";
        pomodoroState.pomodoroTimer = pomodoroSettings.workMinutes;
        pomodoroState.longBreakInterval += 1;
    }
    initializeState(formatNotificationBody());
}

function formatNotificationBody() {
    const state = formatState();
    const minutes = pomodoroState.pomodoroTimer / minute;
    return `${state} for ${minutes} minutes.`;
}

let heldDownTimeout;
let isSpaceHeldDown = false;
let isBlurred = false;

document.addEventListener("click", handleLetGo);
document.addEventListener("mousedown", handleHeldDown);

document.addEventListener("keyup", event => {
    if (event.code === "Space") {
        isSpaceHeldDown = false;
        handleLetGo();
    }
});

document.addEventListener("keydown", event => {
    if (event.code === "Space" && !isSpaceHeldDown) {
        isSpaceHeldDown = true;
        handleHeldDown();
    }
});

function handleLetGo() {
    clearTimeout(heldDownTimeout);
    if (isBlurred) {
        isBlurred = false;
        updateBackground();
        setFontColor("--font-color");
    } else {
        toggleTimer();
    }
}

function handleHeldDown() {
    heldDownTimeout = setTimeout(blurBackground, second);
}

function blurBackground() {
    isBlurred = true;
    if (running) {
        toggleTimer();
    }
    setBackground("--blur-color");
    setFontColor("--blur-font-color");
}

function setFontColor(rootVariable) {
    const textCollection = document.getElementsByClassName("text");
    for (textElement of textCollection) {
        textElement.style.color = getColor(rootVariable);
    }
}