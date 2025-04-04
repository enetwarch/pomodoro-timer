const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;

let pomodoro = {};
const defaultPomodoro = {
    "settings": {
        "workMinutes": 25 * MINUTE,
        "restMinutes": 5 * MINUTE,
        "longBreakMinutes": 15 * MINUTE,
        "longBreakInterval": 4,
    },
    "state": "work",
    "timer": 25 * MINUTE,
    "session": 1
};

window.addEventListener("load", async () => {  
    const storedPomodoro = localStorage.getItem("pomodoro");
    if (!storedPomodoro) {
        pomodoro = structuredClone(defaultPomodoro);
    } else {
        pomodoro = JSON.parse(storedPomodoro);
    }

    setInterval(() => {
        localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
    }, 1 * MINUTE);
    
    displayPomodoro();
    changeStateColor("idle");

    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }
});

window.addEventListener("beforeunload", () => {
    localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
});

document.addEventListener("contextmenu", event => event.preventDefault());

const playElement = document.getElementById("play");
playElement.addEventListener("click", toggleTimer);
document.addEventListener("keyup", toggleTimer);

const resetElement = document.getElementById("reset");
resetElement.addEventListener("touchstart", hardReset);
resetElement.addEventListener("mousedown", hardReset);
resetElement.addEventListener("touchend", softReset);
resetElement.addEventListener("mouseup", softReset);

const settingsElement = document.getElementById("settings");
settingsElement.addEventListener("click", changeSettings);

let isRunning = false;
let endingTime = null;
let updateTimerInterval;
let idleNotificationInterval;

function toggleTimer(event) {
    if (event.type === "keyup") {
        if (event.code !== "Space") return;
    }

    isRunning ? stopTimer() : startTimer();
}

function stopTimer() {
    isRunning = false;
    endingTime = null;
    clearInterval(updateTimerInterval);

    idleNotificationInterval = setInterval(() => {
        const body = "Timer is idle.";
        pushNotification(body);
    }, 5 * MINUTE);

    changeStateColor("idle");
    changePlayElement();
}

function startTimer() {
    isRunning = true;
    endingTime = Date.now() + pomodoro.timer;
    clearInterval(idleNotificationInterval);

    updateTimerInterval = setInterval(() => {
        pomodoro.timer = endingTime - Date.now();
        pomodoro.timer < 0 ? handleTimerEnd() : displayTimer();    
    }, 1 * MILLISECOND);

    changeStateColor(pomodoro.state);
    changePlayElement();
}

const stateColors = {
    "idle": "--dark-1",
    "work": "--red",
    "rest": "--blue",
    "longBreak": "--green"
}

function changeStateColor(state) {
    const root = getComputedStyle(document.documentElement);
    const stateColor = root.getPropertyValue(stateColors[state]);

    document.body.style.backgroundColor = stateColor;
}

function changePlayElement() {
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

function displayPomodoro() {
    const state = sentenceCase(pomodoro.state);
    const session = `Session ${pomodoro.session}`;

    stateElement.innerText = state;
    sessionElement.innerText = session;

    displayTimer();
}

function displayTimer() {
    let minutes = pomodoro.timer / MINUTE;
    let seconds = pomodoro.timer % MINUTE / SECOND;

    minutes = String(Math.floor(minutes)).padStart(2, "0");
    seconds = String(Math.floor(seconds)).padStart(2, "0");

    const time = `${minutes}:${seconds}`;
    timerElement.innerText = time;
}

function handleTimerEnd() {
    if (isRunning) stopTimer();

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
    const minutes = pomodoro.timer / MINUTE;
    const body = `${state} for ${minutes} minutes.`;

    pushNotification(body);
    displayPomodoro();
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

let resetButtonPressed = false;
let hardResetTimeout;

function hardReset() {
    if (resetButtonPressed) return;
    resetButtonPressed = true;

    hardResetTimeout = setTimeout(() => {
        if (isRunning) stopTimer();

        setTimeout(() => {
            resetTimer(true);
            resetButtonPressed = false;
        }, 250 * MILLISECOND);

        resetElement.classList.toggle("inverted");
    }, 1 * SECOND);
}

function softReset() {
    resetButtonPressed = false;
    clearTimeout(hardResetTimeout);
    if (isRunning) stopTimer();

    setTimeout(() => {
        resetTimer(false);
    }, 250 * MILLISECOND);

    resetElement.classList.toggle("inverted");
}

function resetTimer(hardReset) {
    if (hardReset) {
        if (confirm("Do you want to HARD reset the timer?")) {
            pomodoro.state = "work";
            pomodoro.timer = pomodoro.settings.workMinutes;
            pomodoro.session = 1;

            displayPomodoro();
        }
    } else {
        if (confirm("Do you want to soft reset the timer?")) {
            const stateMinutes = `${pomodoro.state}Minutes`;
            pomodoro.timer = pomodoro.settings[stateMinutes];

            displayTimer();    
        }
    }

    resetElement.classList.toggle("inverted"); 
}

function changeSettings() {
    if (isRunning) stopTimer();
    settingsElement.classList.toggle("inverted");

    setTimeout(() => {
        const settings = structuredClone(pomodoro.settings);

        for (const setting in settings) {
            const message = `Modify ${sentenceCase(setting)}`;
            changeSetting(setting, message);
        }

        settingsElement.classList.toggle("inverted");
    }, 250 * MILLISECOND);
}

function changeSetting(setting, message) {
    let defaultValue = pomodoro.settings[setting];
    const isMinutes = setting.includes("Minutes");
    if (isMinutes) {
        defaultValue /= MINUTE;
    }

    while (true) {
        let input = prompt(message, defaultValue);
        if (!input) break;

        input = parseInt(input);
        if (isNaN(input)) {
            alert("Please input a number.");
            continue;
        }
        
        const changedSetting = isMinutes ? input * MINUTE : input;
        pomodoro.settings[setting] = changedSetting;
        break;
    }
}

function sentenceCase(string) {
    string = string.replace(/([A-Z])/g, ' $1');
    return string.charAt(0).toUpperCase() + string.slice(1);
}