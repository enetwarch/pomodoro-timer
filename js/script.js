const millisecond = 1;
const second = 1000 * millisecond;
const minute = 60 * second;

window.addEventListener("beforeunload", savePomodoro);
window.addEventListener("load", () => {
    addListeners();
    retrievePomodoro();
    setInterval(savePomodoro, 1 * minute);
    displayOutput();
});

const listenerConfig = [
    [() => toggleTimer(), [["click", "play"], ["keyup", "Space"]]],
    [() => hardReset(), [["touchstart", "reset"], ["mousedown", "reset"]]],
    [() => softReset(), [["touchend", "reset"], ["mouseup", "reset"]]],
];

function addListeners() {
    listenerConfig.forEach(config => {
        const func = config[0];
        const listeners = config[1];
        listeners.forEach(listener => {
            addListener(listener, func);
        });
    }); 
}

function addListener(listener, func) {
    const eventType = listener[0];
    if (eventType !== "keyup") {
        const id = listener[1];
        const element = document.getElementById(id);
        element.addEventListener(eventType, func);
    } else {
        const eventCode = listener[1];
        document.addEventListener(eventType, event => {
            if (event.code === eventCode) func();
        });
    }
}

let pomodoro;
const defaultPomodoro = {
    "settings": {
        "minutes": {
            "work": 50 * minute,
            "rest": 10 * minute,
            "longBreak": 60 * minute    
        },
        "interval": 4
    },
    "state": "work",
    "timer": 50 * minute,
    "session": 1
};

function retrievePomodoro() {
    const storedPomodoro = localStorage.getItem("pomodoro");
    if (storedPomodoro === null || storedPomodoro === undefined) {
        pomodoro = structuredClone(defaultPomodoro);
    } else {
        pomodoro = JSON.parse(storedPomodoro);
    }
}

function savePomodoro() {
    localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
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
    setBackground("idle");
}

function startTimer() {
    isRunning = true;
    endingTime = Date.now() + pomodoro.timer;
    updateTimerInterval = setInterval(updateTimer, 1 * millisecond);
    setBackground(pomodoro.state);
}

function updateTimer() {
    pomodoro.timer = endingTime - Date.now();
    pomodoro.timer < 0 ? handleTimerEnd() : displayTimer();
}

const stateElement = document.getElementById("state");
const timerElement = document.getElementById("timer");
const sessionElement = document.getElementById("session");
let resetButtonPressed = false;
let hardResetTimeout;

function hardReset() {
    if (resetButtonPressed) return;
    resetButtonPressed = true;
    hardResetTimeout = setTimeout(() => {
        if (confirm("Do you want to HARD reset the timer?")) {
            pomodoro.state = "work";
            pomodoro.timer = pomodoro.settings.minutes.work;
            pomodoro.session = 1;
        }
        resetButtonPressed = false;
        stopTimer();
        displayOutput();
    }, 1 * second);
}

function softReset() {
    clearTimeout(hardResetTimeout);
    if (confirm("Do you want to soft reset the timer?")) {
        pomodoro.timer = pomodoro.settings.minutes[pomodoro.state];
    }
    stopTimer();
    displayTimer();
}

function displayOutput() {
    const state = getState();
    const session = `Session ${pomodoro.session}`;
    stateElement.innerText = state;
    sessionElement.innerText = session;
    displayTimer();
}

function displayTimer() {
    let minutes = pomodoro.timer / minute;
    let seconds = pomodoro.timer % minute / second;
    minutes = String(Math.floor(minutes)).padStart(2, "0");
    seconds = String(Math.floor(seconds)).padStart(2, "0");
    const time = `${minutes}:${seconds}`;
    timerElement.innerText = time;
}

function getState() {
    const state = pomodoro.state.replace(/([A-Z])/g, ' $1');
    return state.charAt(0).toUpperCase() + state.slice(1);
}

const stateBackgroundColors = {
    "work": "red",
    "rest": "blue",
    "longBreak": "green",
    "idle": "black"
};

function setBackground(state) {
    const stateBackgroundColor = stateBackgroundColors[state];
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue(`--${stateBackgroundColor}`);
    document.body.style.backgroundColor = color;
}

function handleTimerEnd() {
    toggleTimer();
    if (pomodoro.state === "work") {
        const notAtInterval = pomodoro.session !== pomodoro.settings.interval;
        pomodoro.state = notAtInterval ? "rest" : "longBreak";
    } else {
        const atRestState = pomodoro.state === "rest";
        pomodoro.session = atRestState ? pomodoro.session + 1 : 1;
        pomodoro.state = "work";
    }
    pomodoro.timer = pomodoro.settings.minutes[pomodoro.state];
    pushNotification();
    displayOutput();
}

async function pushNotification() {
    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
        const title = "Pomodoro Timer";
        const state = getState();
        const minutes = pomodoro.timer / minute;
        const body = `${state} for ${minutes} minutes.`;
        new Notification(title, {body}); 
    }
}