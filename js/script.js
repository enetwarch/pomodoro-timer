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
    [() => hardReset(), [["touchstart", "reset"], ["mousedown", "reset"]]],
    [() => softReset(), [["touchend", "reset"], ["mouseup", "reset"]]],
    [() => toggleTimer(), [["click", "play"], ["keyup", "Space"]]],
    [() => changeSettings(), [["click", "settings"]]]
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
        "workMinutes": 25 * minute,
        "restMinutes": 5 * minute,
        "longBreakMinutes": 15 * minute,
        "longBreakInterval": 4,
    },
    "state": "work",
    "timer": 25 * minute,
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

let resetButtonPressed = false;
let hardResetTimeout;

function hardReset() {
    if (resetButtonPressed) return;
    resetButtonPressed = true;
    hardResetTimeout = setTimeout(() => {
        if (confirm("Do you want to HARD reset the timer?")) {
            pomodoro.state = "work";
            pomodoro.timer = pomodoro.settings.workMinutes;
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
        pomodoro.timer = pomodoro.settings[`${pomodoro.state}Minutes`];
    }
    stopTimer();
    displayTimer();
}

const playElement = document.getElementById("play");
let isRunning = false;
let updateTimerInterval;
let idleNotificationInterval;
let endingTime;

function toggleTimer() {
    isRunning ? stopTimer() : startTimer();
}

function stopTimer() {
    isRunning = false;
    clearInterval(updateTimerInterval);
    idleNotificationInterval = setInterval(() => {
        const body = "Timer is idle.";
        pushNotification(body);
    }, 5 * minute);
    changePlayIcon();
}

function startTimer() {
    isRunning = true;
    endingTime = Date.now() + pomodoro.timer;
    updateTimerInterval = setInterval(updateTimer, 1 * millisecond);
    clearInterval(idleNotificationInterval);
    changePlayIcon();
}

function changePlayIcon() {
    if (isRunning) {
        playElement.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    } else {
        playElement.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
}

function updateTimer() {
    pomodoro.timer = endingTime - Date.now();
    pomodoro.timer < 0 ? handleTimerEnd() : displayTimer();
}

const stateElement = document.getElementById("state");
const timerElement = document.getElementById("timer");
const sessionElement = document.getElementById("session");

function displayOutput() {
    const state = sentenceCase(pomodoro.state);
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

function sentenceCase(string) {
    string = string.replace(/([A-Z])/g, ' $1');
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function handleTimerEnd() {
    toggleTimer();
    if (pomodoro.state === "work") {
        const notAtInterval = pomodoro.session !== pomodoro.settings.longBreakInterval;
        pomodoro.state = notAtInterval ? "rest" : "longBreak";
    } else {
        const atRestState = pomodoro.state === "rest";
        pomodoro.session = atRestState ? pomodoro.session + 1 : 1;
        pomodoro.state = "work";
    }
    pomodoro.timer = pomodoro.settings[`${pomodoro.state}Minutes`];
    const body = getStateForMinutes();
    pushNotification(body);
    displayOutput();
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

function getStateForMinutes() {
    const state = sentenceCase(pomodoro.state);
    const minutes = pomodoro.timer / minute;
    return `${state} for ${minutes} minutes.`;
}

function changeSettings() {
    const settings = structuredClone(pomodoro.settings);
    for (const setting in settings) {
        const message = `Modify ${sentenceCase(setting)}`;
        changeSetting(setting, message);
    }
}

function changeSetting(setting, message) {
    let defaultValue = pomodoro.settings[setting];
    const isMinutes = setting.includes("Minutes");
    if (isMinutes) defaultValue /= minute; 
    while (true) {
        let input = prompt(message, defaultValue);
        if (input === null) break;
        input = parseInt(input);
        if (isNaN(input)) {
            alert("Please input a number.");
            continue;
        }
        pomodoro.settings[setting] = isMinutes ? input * minute : input;
        break;
    }
}