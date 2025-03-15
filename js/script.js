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
    if (!storedPomodoro) {
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
    changePlayElement();
}

function startTimer() {
    isRunning = true;
    endingTime = Date.now() + pomodoro.timer;
    updateTimerInterval = setInterval(updateTimer, 1 * millisecond);
    clearInterval(idleNotificationInterval);
    changePlayElement();
}

function updateTimer() {
    pomodoro.timer = endingTime - Date.now();
    pomodoro.timer < 0 ? handleTimerEnd() : displayTimer();
}

function changePlayElement() {
    const playElement = document.getElementById("play");
    if (isRunning) {
        playElement.classList.remove("fa-play");
        playElement.classList.add("fa-pause");
    } else {
        playElement.classList.remove("fa-pause");
        playElement.classList.add("fa-play");
    }
    playElement.classList.toggle("inverted");
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

function handleTimerEnd() {
    toggleTimer();
    if (pomodoro.state === "work") {
        const interval = pomodoro.settings.longBreakInterval;
        const notAtInterval = pomodoro.session !== interval;
        pomodoro.state = notAtInterval ? "rest" : "longBreak";
    } else {
        const atRestState = pomodoro.state === "rest";
        pomodoro.session = atRestState ? pomodoro.session + 1 : 1;
        pomodoro.state = "work";
    }
    pomodoro.timer = pomodoro.settings[`${pomodoro.state}Minutes`];
    const state = sentenceCase(pomodoro.state);
    const minutes = pomodoro.timer / minute;
    const body = `${state} for ${minutes} minutes.`;
    pushNotification(body);
    displayOutput();
}

async function pushNotification(body) {
    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
        const title = "Pomodoro Timer";
        new Notification(title, { body }); 
    }
}

const resetElement = document.getElementById("reset");
let resetButtonPressed = false;
let hardResetTimeout;

function hardReset() {
    if (resetButtonPressed) return;
    resetButtonPressed = true;
    hardResetTimeout = setTimeout(() => {
        if (isRunning) stopTimer();
        resetElement.classList.toggle("inverted");
        setTimeout(() => {
            resetTimer(true);
        }, 250 * millisecond);
    }, 1 * second);
}

function softReset() {
    clearTimeout(hardResetTimeout);
    resetButtonPressed = false;
    if (isRunning) stopTimer();
    resetElement.classList.toggle("inverted");
    setTimeout(() => {
        resetTimer(false);
    }, 250 * millisecond);
}

function resetTimer(isHardReset) {
    if (isHardReset) {
        if (confirm("Do you want to HARD reset the timer?")) {
            pomodoro.state = "work";
            pomodoro.timer = pomodoro.settings.workMinutes;
            pomodoro.session = 1;
            displayOutput();
        }
        resetButtonPressed = false;
        resetElement.classList.toggle("inverted"); 
    } else {
        if (confirm("Do you want to soft reset the timer?")) {
            const stateMinutes = `${pomodoro.state}Minutes`;
            pomodoro.timer = pomodoro.settings[stateMinutes];
            displayTimer();    
        }
        resetElement.classList.toggle("inverted");
    }
}

function changeSettings() {
    if (isRunning) stopTimer();
    const settingsElement = document.getElementById("settings");
    settingsElement.classList.toggle("inverted");
    setTimeout(() => {
        const settings = structuredClone(pomodoro.settings);
        for (const setting in settings) {
            const message = `Modify ${sentenceCase(setting)}`;
            changeSetting(setting, message);
        }
        settingsElement.classList.toggle("inverted");
    }, 250 * millisecond);
}

function changeSetting(setting, message) {
    let defaultValue = pomodoro.settings[setting];
    const isMinutes = setting.includes("Minutes");
    if (isMinutes) defaultValue /= minute; 
    while (true) {
        let input = prompt(message, defaultValue);
        if (!input) break;
        input = parseInt(input);
        if (isNaN(input)) {
            alert("Please input a number.");
            continue;
        }
        const changedSetting = isMinutes ? input * minute : input;
        pomodoro.settings[setting] = changedSetting;
    }
}

function sentenceCase(string) {
    string = string.replace(/([A-Z])/g, ' $1');
    return string.charAt(0).toUpperCase() + string.slice(1);
}