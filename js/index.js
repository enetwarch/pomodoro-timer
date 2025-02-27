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
    "interval": 1
}

let pomodoro;

window.addEventListener("load", retrievePomodoro);
window.addEventListener("beforeunload", savePomodoro);

function retrievePomodoro() {
    const storedPomodoro = localStorage.getItem("pomodoro");
    const noStoredPomodoro = storedPomodoro === null || storedPomodoro === "undefined"
    pomodoro = noStoredPomodoro ? defaultPomodoro : JSON.parse(storedPomodoro);
    setInterval(savePomodoro, 1 * minute);
    printText();
}

function savePomodoro() {
    localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
}

document.addEventListener("touchstart", handleHeldDown);
document.addEventListener("touchend", (event) => {event.preventDefault(), handleLetGo();});
document.addEventListener("mousedown", (event) => {if (event.button === 0) handleHeldDown();});
document.addEventListener("mouseup", (event) => {if (event.button === 0) handleLetGo();});
document.addEventListener("keydown", (event) => {if (event.code === "Space" && !isHeldDown) handleHeldDown();});
document.addEventListener("keyup", (event) => {if (event.code === "Space") handleLetGo();});
document.addEventListener("contextmenu", (event) => {event.preventDefault();});

let isHeldDown = false;
let heldDownTimeouts = [];

function handleHeldDown() {
    isHeldDown = true;
    if (isRunning) setHeldDownTimeout(toggleTimer, 1 * second);
    setHeldDownTimeout(resetSession, 3 * second);
    setHeldDownTimeout(hardResetSession, 5 * second);
}

function handleLetGo() {
    isHeldDown = false;
    clearHeldDownTimeouts();
    toggleTimer();
}

function setHeldDownTimeout(foo, delay) {
    heldDownTimeouts.push(setTimeout(foo, delay));
}

function clearHeldDownTimeouts() {
    heldDownTimeouts.forEach((heldDownTimeout) => clearTimeout(heldDownTimeout));
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

function printText() {
    printState(), printTimer(), printSession();
}

function printState() {
    document.getElementById("state").innerText = formatState();
}

function formatState() {
    const state = pomodoro.state.replace(/([A-Z])/g, ' $1');
    return state.charAt(0).toUpperCase() + state.slice(1);
}

function printTimer() {
    const minutes = String(Math.floor(pomodoro.timer / minute)).padStart(2, "0");
    const seconds = String(Math.floor(pomodoro.timer % minute / second)).padStart(2, "0");
    const timer = `${minutes}:${seconds}`;
    document.getElementById("timer").innerText = timer;
}

function printSession() {
    const session = pomodoro.interval ? pomodoro.interval : "Reset";
    document.getElementById("session").innerText = `Session ${session}`;
}

let isRunning = false;
let updateTimerInterval;
let endingTime;

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

function setBackground(rootVar) {
    const color = getComputedStyle(document.documentElement).getPropertyValue(rootVar);
    document.getElementById("background").style.backgroundColor = color;
}

function setFavicon(faviconLink) {
    document.getElementById("favicon").setAttribute("href", faviconLink);
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
    pushNotification();
    printText();
}

function modifyPomodoro(state, timer, interval) {
    pomodoro.state = state;
    pomodoro.timer = timer;
    pomodoro.interval = interval;
}

async function pushNotification() {
    if (Notification.permission !== "granted") await Notification.requestPermission();
    if (Notification.permission === "granted") {
        const title = "Pomodoro Timer";
        const body = `${formatState()} for ${pomodoro.timer / minute} minutes.`;
        new Notification(title, {body}); 
    }
}