# [Pomodoro Timer](https://enetwarch.github.io/pomodoro-timer/)

This is a personal Pomodoro Timer that I built as a small project for honing my **JavaScript fundamentals**. It's designed to improve focus and productivity using the **Pomodoro Technique**. Only the Pomodoro details, timer, and background color indicating work or rest states are displayed to keep it minimalistic. **The design is based off [Pomofocus](https://pomofocus.io/)**.

### Settings

There is **no dynamic UI** that will help the user change the settings. The website will instead base it off of the personal hard-coded settings I set. The background color and favicon will change when the timer is running depending on the Pomodoro state, this will **default to black** if the timer is idle.

* **Work Minutes**: Red background, 50 minutes
* **Rest Minutes**: Blue background, 10 minutes
* **Long Break Minutes**: Green background, 60 minutes
* **Long Break Intervals**: 4

### Controls

* **Tap, Space or Left Click**: Toggles the timer to idle or running.
* **Hold Space or Left Click**: Will have varying changes depending on how long you hold.
    * **3 seconds**: Resets the current session's timer.
    * **5 seconds**: Hard resets the timer and reverts it back to work state, session 1.