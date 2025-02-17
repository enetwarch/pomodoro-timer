# Pomodoro Timer

This is a personal Pomodoro Timer that I built as a small project for honing my **JavaScript fundamentals**. It's designed to improve focus and productivity using the **Pomodoro Technique**. There is only a timer, and a background color indicating work or rest states to keep it minimalistic. **The design is based off of a couple resources listed below** but I plan on adding original designs soon.

### Settings

There is **no dynamic UI** that will help the user change the settings. The website will instead base it off of the personal hard-coded settings I set.

```JavaScript
const pomodoroSettings = {
    "workMinutes": 50 * minute,
    "restMinutes": 10 * minute,
    "longBreakMinutes": 60 * minute,
    "longBreakInterval": 4
};
```

### Development Checklist

- [ ] Notification System
- [ ] Spacebar and Backspace Controls
- [ ] Unfocused Window Blurring
- [ ] Original Color Scheme
- [ ] Original Favicon

### Resources

* [Pomofocus](https://pomofocus.io/)
* [Favicon](https://www.flaticon.com/free-icons/pomodoro)