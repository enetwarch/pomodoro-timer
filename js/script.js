const millisecond = 1;
const second = 1000 * millisecond;
const minute = 60 * second;

const settings = {
    "minutes": {
        "work": 50 * minute,
        "rest": 10 * minute,
        "longBreak": 60 * minute
    },
    "interval": 4
};

const defaultPomodoro = {
    "state": "work",
    "timer": settings.minutes.work,
    "session": 1
};

let pomodoro;

window.addEventListener("load", retrievePomodoro);
window.addEventListener("beforeunload", savePomodoro);

function retrievePomodoro() {
    const storedPomodoro = localStorage.getItem("pomodoro");
    if (storedPomodoro === null || storedPomodoro === "undefined") {
        pomodoro = defaultPomodoro;
    } else {
        pomodoro = JSON.parse(storedPomodoro);
    }
    setInterval(savePomodoro, 1 * minute);
    printText();
}

function savePomodoro() {
    localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
}

document.addEventListener("touchstart", handleHeldDown);

document.addEventListener("touchend", (event) => {
    event.preventDefault(), handleLetGo();
});

document.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        handleHeldDown();
    } 
});

document.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        handleLetGo();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !isHeldDown) {
        handleHeldDown();
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
        handleLetGo();
    } 
});

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

let isHeldDown = false;
let heldDownTimeouts = [];
let isHeldDownForOneSecond = false;

function handleHeldDown() {
    isHeldDown = true;
    if (isRunning) {
        setHeldDownTimeout(toggleTimer, 1 * second);
    }
    setHeldDownTimeout(() => {
        isHeldDownForOneSecond = true;
    }, 1 * second);
    setHeldDownTimeout(() => {
        pomodoro.timer = settings.minutes[pomodoro.state];
    }, 3 * second);
    setHeldDownTimeout(() => {
        pomodoro = defaultPomodoro;
    }, 5 * second);
}

function handleLetGo() {
    isHeldDown = false;
    clearHeldDownTimeouts();
    if (isHeldDownForOneSecond) {
        isHeldDownForOneSecond = false;
    } else {
        toggleTimer();
    }
}

function setHeldDownTimeout(foo, delay) {
    heldDownTimeouts.push(setTimeout(() => {
        foo();
        fadeText();
    }, delay));
}

function clearHeldDownTimeouts() {
    heldDownTimeouts.forEach((heldDownTimeout) => {
        clearTimeout(heldDownTimeout);
    });
    heldDownTimeouts = [];
}

function fadeText() {
    const text = document.querySelectorAll(".text");
    text.forEach((textElement) => {
        textElement.classList.add("fade-out");
        setTimeout(() => {
            textElement.classList.remove("fade-out");
            textElement.classList.add("fade-in");
            printText();
        }, 500 * millisecond);    
    });
}

function printText() {
    printState(); 
    printTimer(); 
    printSession();
}

function printState() {
    document.getElementById("state").innerText = formatState();
}

function formatState() {
    const state = pomodoro.state.replace(/([A-Z])/g, ' $1');
    return state.charAt(0).toUpperCase() + state.slice(1);
}

function printTimer() {
    let minutes = formatTime(pomodoro.timer / minute);
    let seconds = formatTime(pomodoro.timer % minute / second);
    const timer = `${minutes}:${seconds}`;
    document.getElementById("timer").innerText = timer;
}

function formatTime(time) {
    return String(Math.floor(time)).padStart(2, "0");
}

function printSession() {
    let session;
    if (pomodoro.session !== 0) {
        session = pomodoro.session;
    } else {
        session = "Reset";
    }
   document.getElementById("session").innerText = `Session ${session}`;
}

let isRunning = false;
let updateTimerInterval;
let endingTime;

function toggleTimer() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
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
    if (pomodoro.timer < 0) {
        handleTimerEnd();
    } else {
        printTimer();
    }
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

function setBackground(rootVariable) {
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue(rootVariable);
    document.getElementById("background").style.backgroundColor = color;
}

function setFavicon(faviconLink) {
    document.getElementById("favicon").setAttribute("href", faviconLink);
}

function handleTimerEnd() {
    toggleTimer();
    if (pomodoro.state === "work") {
        if (pomodoro.session === settings.interval) {
            pomodoro.state = "longBreak";
            pomodoro.session = 0;
        } else {
            pomodoro.state = "rest";
        }
    } else {
        pomodoro.state = "work";
        pomodoro.session++;
    }
    pomodoro.timer = settings.minutes[pomodoro.state];
    pushNotification();
    printText();
}

async function pushNotification() {
    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
        const title = "Pomodoro Timer";
        const state = formatState();
        const minutes = pomodoro.timer / minute;
        const body = `${state} for ${minutes} minutes.`;
        new Notification(title, {body}); 
    }
}