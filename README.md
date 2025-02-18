# Pomodoro Timer

This is a personal Pomodoro Timer that I built as a small project for honing my **JavaScript fundamentals**. It's designed to improve focus and productivity using the **Pomodoro Technique**. Only the pomodoro details, timer, and background color indicating work or rest states are displayed to keep it minimalistic. **The design is based off of a couple resources listed below**.

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

The following color schemes are applied to the background depending on the current pomodoro state.

```CSS
:root {
    --work-color: #bb4948; /* Red */
    --rest-color: #608cab; /* Blue */
    --long-break-color: #72a079; /* Green */
}
```

### Development Checklist

- [x] Notification System
- [x] Pomodoro Details
- [ ] Spacebar and Backspace Controls
- [ ] Unfocused Window Blurring

### Resources

* [Pomofocus](https://pomofocus.io/)
* [Favicon](https://www.flaticon.com/free-icons/pomodoro)