// get elements
const mainDisplay = document.querySelector('main');
const timerDisplay = document.getElementById("timer");
const timerOptions = document.getElementsByName("timer-option");
const startPauseButton = document.getElementById("start-pause");
const resetButton = document.getElementById("reset");
const pomodoroCountDisplay = document.getElementById("pomodoro-count");
const completedCyclesDisplay = document.getElementById("completed-cycles")
const todoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo");
const todoItems = document.getElementById("todo-items");
const maxCharacters = 50;

// colors for each mode
const modeColors = {
    "pomodoro-timer": "#FF554F",
    "short-break": "#ff794f",
    "medium-break": "#ff9744",
    "long-break": "#ffcd4f"
};

let timer; // hold interval
let currentTime = 1500;
let currentMode = "";
let isRunning = false;
let pomodoroCount = 0; // track the number of completed Pomodoro sessions
let completedCycles = 0; // track completed Pomodoro cycles (4 sessions = 1 cycle)
let completedBreaks = 0;

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateCounters() {
    pomodoroCountDisplay.textContent = pomodoroCount;
    completedCyclesDisplay.textContent = completedCycles;
}

function switchToPomodoro() {
    if (currentMode.includes("break")) {
        document.getElementById("pomodoro-timer").checked = true; // select pomodoro button
        currentTime = parseInt(document.getElementById("pomodoro-timer").value); // set timer value
        currentMode = "pomodoro-timer";
        alert("Break Over! Back to Work!");
    }
    isRunning = false; // pause timer
    updateTimerDisplay(); // update timer display
    updateCounters(); // update stats display
    startPauseButton.textContent = "Start"; // reset button text
    updateBackgroundColor(currentMode); // ensure colors and UI are updated
}

function switchToBreak() { 
    if (pomodoroCount === 4) {
        document.getElementById("long-break").checked = true; // select long break button
        currentTime = parseInt(document.getElementById("long-break").value); // set timer value
        currentMode = "long-break";
        completedCycles++; // increment completed cycles
        pomodoroCount = 0;
        alert("Long Break! Take a rest!");
    } else if (pomodoroCount === 3) {
        document.getElementById("medium-break").checked = true; // select medium break button
        currentTime = parseInt(document.getElementById("medium-break").value); // set timer value
        currentMode = "medium-break";
        alert("Medium Break! Take a rest!");
    } else {
        document.getElementById("short-break").checked = true; // select short break button
        currentTime = parseInt(document.getElementById("short-break").value); // set timer value
        currentMode = "short-break";
        alert("Short Break! Take a rest!");
    }
    isRunning = false; // pause timer
    updateTimerDisplay(); // update timer display
    updateCounters(); // update stats display
    startPauseButton.textContent = "Start"; // reset button text
    updateBackgroundColor(currentMode); // ensure colors and UI are updated
}

// mode switch logic (after pomodoro timeris over switch to next corresponding break)
function switchToPomodoroOrBreak() {
    if (currentMode === "pomodoro-timer") {
        pomodoroCount++;
        switchToBreak();
    } else if (currentMode.includes("break")) {
        switchToPomodoro();
    }
}

// timer option Function
function setTimer(mode) {
    clearInterval(timer); // stop the current timer
    isRunning = false; // ensure timer is not running
    currentTime = parseInt(mode.value); // set the current time based on the selected mode
    updateTimerDisplay(); // update the timer display
    startPauseButton.textContent = "Start"; // reset button text
}

// update color function (originally it was the background only)
function updateBackgroundColor(mode) {
    const color = modeColors[mode] || "#f7f7f7"; // get the main background color
    const lighterColor = adjustColorBrightness(color, 10); // adjust brightness for the main element
    const textColor = adjustColorBrightness(color, 60)
    const checkedRadio = document.querySelector("#timer-selector input:checked + .name");

    // update body and main background colors
    document.body.style.backgroundColor = color;
    mainDisplay.style.backgroundColor = lighterColor;

    // reset the styles for all span.name elements (radio buttons)
    document.querySelectorAll("#timer-selector .name").forEach((label) => {
        label.style.backgroundColor = ""; // reset background
        label.style.color = ""; // reset text color
    });

    // update little text color
    const littleTexts = document.querySelectorAll(".little-text");
    littleTexts.forEach((textElement) => {
        textElement.style.color = textColor;
    });

    // update heading text color
    const headingsColor = document.querySelectorAll(".headings");
    headingsColor.forEach((textElement) => {
        textElement.style.color = textColor;
    });

    // update task text color dynamically
    const taskTexts = document.querySelectorAll(".task-text");
    taskTexts.forEach((taskText) => {
        taskText.style.color = textColor;
    });

    // update line breaks color
    const lineBreaks = document.querySelectorAll(".line-breaks");
    lineBreaks.forEach((lineBreak) => {
        lineBreak.style.backgroundColor = textColor;
    });

    // apply styles dynamically to the selected span.name (task text)
    if (checkedRadio) {
        checkedRadio.style.backgroundColor = adjustColorBrightness(color, 20); // slightly darker background
        checkedRadio.style.color = "#fff"; // ensure text is readable
    }
}

// adjust color brightness function
function adjustColorBrightness(hex, percent) {
    const num = parseInt(hex.slice(1), 16); // convert hex to an integer
    const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(2.55 * percent)));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent)));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + Math.round(2.55 * percent)));

    return `rgb(${r}, ${g}, ${b})`; // return the adjusted color as an RGB string
}

function updateCurrentMode() {
    const selectedOption = document.querySelector('input[name="timer-option"]:checked');
    if (selectedOption) {
        currentMode = selectedOption.id; // set the mode to the ID of the selected radio button
        updateBackgroundColor(currentMode);
    }
    console.log(`Current mode updated to: ${currentMode}`);
}

// event listeners to update the mode and background color
document.querySelectorAll("#timer-selector input").forEach((radio) => {
    radio.addEventListener("change", () => {
        const mode = radio.id; // get the ID of the selected input
        updateBackgroundColor(mode);
    });
});

// start-pause Button
startPauseButton.addEventListener("click", () => {
    if (isRunning) {
        // pause the timer
        clearInterval(timer);
        isRunning = false;
        startPauseButton.textContent = "Start"; // update start button text
    } else {
        // start the timer
        timer = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
            } else {
                clearInterval(timer); // stop the timer
                const selectedOption = document.querySelector('input[name="timer-option"]:checked');
                currentTime = parseInt(selectedOption ? selectedOption.value : 0); // default to the selected option or 0
                currentMode = selectedOption ? selectedOption.id : ""; // default to the selected mode or empty string
                switchToPomodoroOrBreak()
            }
        }, 1000);
        isRunning = true;
        startPauseButton.textContent = "Pause"; // update pause button text
    }
});

// timer Reset Button
resetButton.addEventListener("click", () => {
    clearInterval(timer); // stop the timer
    isRunning = false; // set timer to not running
    const selectedOption = document.querySelector('input[name="timer-option"]:checked'); // get the selected timer option
    currentTime = parseInt(selectedOption.value); // set the timer to the selected option's value
    updateTimerDisplay(); // update the timer display
    startPauseButton.textContent = "Start"; // reset start-pause button text
})

// event listeners to the radio buttons
timerOptions.forEach(option => {
    option.addEventListener("change", (event) => {
        setTimer(event.target); // update the timer when a new mode is selected
        updateCurrentMode();
    });
});

// adding task to the to-do list
addTodoButton.addEventListener("click", () => {
    const task = todoInput.value.trim();
        if (task.length === 0) {
        alert("Task cannot be empty!");
        } else if (task.length > maxCharacters) {
        alert(`Task cannot exceed ${maxCharacters} characters!`);
        } else {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span class="task-text">${task}</span>
            <div class="todo-button-container">
                <button id="complete-todo" class="todo-button">
                    <img id="complete-svg" src="svg/check-mark-icon.svg">
                </button>
                <button id="delete-todo" class="todo-button">
                    <img id="delete-svg" src="svg/cross-icon.svg">
                </button>
            </div>
        `;
        todoItems.appendChild(listItem);
        todoInput.value = ""; // clear the input field

        // event listener to the to-do list delete & complete button
        listItem.querySelector("#delete-todo").addEventListener("click", () => {
            listItem.remove();
        });
        listItem.querySelector("#complete-todo").addEventListener("click", () => {
            const taskText = listItem.querySelector(".task-text");
            taskText.classList.toggle("strike-through");
        });
        updateBackgroundColor(currentMode);
    }
});

todoInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTodoButton.click();
    }
});

// initialize display and stats
updateCurrentMode();
updateTimerDisplay();
updateCounters();