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

function retrieveState() {
    const storedState = localStorage.getItem("pomodoroState");
    const noStoredState = storedState === null || storedState === "undefined";
    pomodoroState = noStoredState ? defaultPomodoroState : JSON.parse(storedState);
    setIdleNotificationInterval();
    setInterval(saveState, 1 * minute);
}

function setIdleNotificationInterval() {
    idleNotificationInterval = setInterval(function() {
        pushNotification("Timer is paused.")
    }, 2 * minute);
}

function saveState() {
    localStorage.setItem("pomodoroState", JSON.stringify(pomodoroState));
}

function initializeState(body) {
    pushNotification(body);
    updateColor();
    printText();
}

function printText() {
    printState();
    printTimer();
    printSession();
}

async function pushNotification(body) {
    const title = "Pomodoro Timer";
    if (Notification.permission !== "granted") await Notification.requestPermission();
    if (Notification.permission === "granted") new Notification(title, {body});
}

function updateColor() {
    const stateColors = {
        "work": {"background": "--work-color", "favicon": "img/work-favicon.png"},
        "rest": {"background": "--rest-color", "favicon": "img/rest-favicon.png"},
        "longBreak": {"background": "--long-break-color", "favicon": "img/long-break-favicon.png"},
        "idle": {"background": "--idle-color", "favicon": "img/idle-favicon.png"}
    };
    const stateColor = isRunning ? stateColors[pomodoroState.pomodoroState] : stateColors["idle"];
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
let updateTimerInterval;

function toggleTimer() {
    isRunning ? stopTimer() : startTimer();
    updateColor();
}

function stopTimer() {
    isRunning = false;
    clearInterval(updateTimerInterval);
    setIdleNotificationInterval();
}

function startTimer() {
    isRunning = true;
    updateTimerInterval = setInterval(updateTimer, 1 * second);
    clearInterval(idleNotificationInterval);
}

function updateTimer() {
    pomodoroState.pomodoroTimer -= second;
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
        pomodoroState.longBreakInterval === pomodoroSettings.longBreakInterval ?
        modifyPomodoroState("longBreak", pomodoroSettings.longBreakMinutes, 0) :
        modifyPomodoroState("rest", pomodoroSettings.restMinutes, pomodoroState.longBreakInterval);
    } else {
        modifyPomodoroState("work", pomodoroSettings.workMinutes, pomodoroState.longBreakInterval + 1);
    }
    initializeState(formatNotificationBody());
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

document.addEventListener("click", handleLetGo);
document.addEventListener("mousedown", handleHeldDown);
document.addEventListener("keyup", event => {if (event.code === "Space") handleLetGo()});
document.addEventListener("keydown", event => {if (event.code === "Space") handleHeldDown()});

let isHeldDown = false;
let isBlurred = false;
let heldDownTimeouts = [];

function handleLetGo() {
    isHeldDown = false;
    clearHeldDownTimeouts();
    isBlurred ? removeBlur() : toggleTimer();
}

function removeBlur() {
    isBlurred = false;
    updateColor();
    setFontColor("--font-color");
}

function setFontColor(rootVariable) {
    const textCollection = Array.from(document.getElementsByClassName("text"));
    textCollection.forEach(textElement => textElement.style.color = getColor(rootVariable));
}

function clearHeldDownTimeouts() {
    heldDownTimeouts.forEach(heldDownTimeout => clearTimeout(heldDownTimeout));
    heldDownTimeouts = [];
}

function handleHeldDown() {
    isHeldDown = true;
    createHeldDownTimeout(blurBackground, 1 * second);
    createHeldDownTimeout(resetSession, 3 * second);
    createHeldDownTimeout(hardResetSession, 5 * second);
}

function createHeldDownTimeout(foo, delay) {
    heldDownTimeouts.push(setTimeout(foo, delay));
}

function blurBackground() {
    isBlurred = true;
    if (isRunning) toggleTimer();
    initializeBlurredState();
}

function initializeBlurredState() {
    setBackground("--blur-color");
    setFontColor("--blur-font-color");
    setFavicon("img/idle-favicon.png");
}

function resetSession() {
    const state = pomodoroState.pomodoroState.concat("Minutes");
    pomodoroState.pomodoroTimer = pomodoroSettings[state];
    printText();
}

function hardResetSession() {
    pomodoroState = defaultPomodoroState;
    printText();
}