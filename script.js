let points = 0;
let taskIndex = 0;

const tasks = [
    { text: "Click the recommended option", correct: 0 },
    { text: "Pick quickly before time runs out!", correct: 1 },
    { text: "Top players chose this option", correct: 0 },
    { text: "Limited bonus available!", correct: 1 },
    { text: "AI suggests this choice", correct: 0 },
    { text: "Hurry! Last chance!", correct: 1 },
    { text: "Most users picked this", correct: 0 },
    { text: "Fastest answer wins bonus", correct: 1 }
];

const main = document.getElementById("main-content");

document.getElementById("start-btn").onclick = () => {
    document.getElementById("welcome-screen").style.display = "none";
    main.style.display = "flex";
    loadTask();
};

function loadTask() {
    if (taskIndex >= tasks.length) {
        endGame();
        return;
    }

    const task = tasks[taskIndex];

    const card = document.createElement("div");
    card.className = "question-card";

    card.innerHTML = `
        <p>${task.text}</p>
        <div class="timer-bar"><div class="timer-fill" id="timer"></div></div>

        <button class="option-btn primary">Recommended Choice</button>
        <button class="option-btn secondary">Other Option</button>

        <p style="font-size:12px; opacity:0.7;">🔥 92% of players chose the first option</p>
    `;

    main.appendChild(card);

    // Dark pattern: big attractive button
    const primary = card.querySelector(".primary");
    const secondary = card.querySelector(".secondary");

    primary.style.background = "#ffd60a";
    secondary.style.opacity = "0.5";

    primary.onclick = () => select(task.correct === 0);
    secondary.onclick = () => select(task.correct === 1);

    startTimer(card);
}

function select(correct) {
    if (correct) {
        points += 10;
        alert("+10 points!");
    } else {
        alert("Missed opportunity...");
    }
    taskIndex++;
    loadTask();
}

function startTimer(card) {
    let width = 100;
    const timer = card.querySelector("#timer");

    const interval = setInterval(() => {
        width -= 2;
        timer.style.width = width + "%";

        if (width <= 0) {
            clearInterval(interval);
            taskIndex++;
            loadTask();
        }
    }, 100);
}

function endGame() {
    main.style.display = "none";
    document.getElementById("score-screen").style.display = "flex";

    document.getElementById("final-points").innerText = points;

    document.getElementById("comparison-text").innerText =
        points > 50
            ? "🔥 You're in the top 10%!"
            : "😬 Most players scored higher...";

    // Move to debrief after 3 seconds
    setTimeout(() => {
        document.getElementById("score-screen").style.display = "none";
        document.getElementById("debrief-screen").style.display = "flex";
    }, 3000);
}
