let points = 0;
let currentQuestionIndex = 0;
let timer;
let timeLeft = 10;
let playerName = "Guest";

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const scoreScreen = document.getElementById("score-screen");

const mainContent = document.getElementById("main-content");
const finalPoints = document.getElementById("final-points");
const liveScore = document.getElementById("live-score");
const playerInput = document.getElementById("player-name");
const playerDisplay = document.getElementById("player-display");
const resultPlayerName = document.getElementById("result-player-name");
const startWarning = document.getElementById("start-warning");
const scoreMessage = document.getElementById("score-message");

const questions = [
  {
    type: "trickColor",
    question: "Click the COLOR of this word:",
    word: "RED",
    color: "blue",
    shapes: ["red", "blue", "green"]
  },
  {
    type: "mcq",
    question: "Do NOT click the correct answer",
    options: ["2 + 2 = 4", "2 + 2 = 5"],
    correct: "2 + 2 = 5"
  },
  {
    type: "squares",
    question: "Tap all squares",
    count: 3,
    required: 4
  },
  {
    type: "reverse",
    question: "Do nothing to win",
    options: ["Click", "Wait"],
    correct: "Click"
  }
];

startBtn.onclick = function () {
  const enteredName = playerInput.value.trim();

  if (enteredName === "") {
    startWarning.textContent = "Please enter your name first.";
    return;
  }

  playerName = enteredName;
  startWarning.textContent = "";

  playerDisplay.textContent = playerName;
  resultPlayerName.textContent = playerName;

  points = 0;
  currentQuestionIndex = 0;
  updateLiveScore();

  showScreen(gameScreen);
  loadQuestion();
};

restartBtn.onclick = function () {
  location.reload();
};

function showScreen(screenToShow) {
  welcomeScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  scoreScreen.classList.remove("active");

  screenToShow.classList.add("active");
}

function updateLiveScore() {
  liveScore.textContent = points;
}

function loadQuestion() {
  mainContent.innerHTML = "";
  createQuestionCard(questions[currentQuestionIndex]);
}

function startTimer(card, feedbackBox) {
  clearInterval(timer);
  timeLeft = 10;

  const fill = card.querySelector(".timer-fill");

  timer = setInterval(function () {
    timeLeft -= 0.1;
    fill.style.width = (timeLeft / 10) * 100 + "%";

    if (timeLeft <= 0) {
      clearInterval(timer);
      feedbackBox.style.display = "block";
      feedbackBox.textContent = "Too slow 😈";
      setTimeout(moveNext, 1200);
    }
  }, 100);
}

function moveNext() {
  clearInterval(timer);
  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    endGame();
  } else {
    loadQuestion();
  }
}

function endGame() {
  let manipulatedScore = points - 5;

  finalPoints.textContent = manipulatedScore;

  if (manipulatedScore >= 25) {
    scoreMessage.textContent = "You did great... or did the game let you? 😈";
  } else if (manipulatedScore >= 10) {
    scoreMessage.textContent = "Not bad, but this game was designed to trick you.";
  } else {
    scoreMessage.textContent = "The game definitely got into your head 😭";
  }

  showScreen(scoreScreen);
}

function createQuestionCard(q) {
  const card = document.createElement("div");
  card.className = "question-card";

  card.innerHTML = `
    <div class="timer-bar">
      <div class="timer-fill"></div>
    </div>
    <div class="feedback"></div>
  `;

  const feedbackBox = card.querySelector(".feedback");

  setTimeout(function () {
    startTimer(card, feedbackBox);
  }, 50);

  if (q.type === "trickColor") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.innerHTML = `${q.question} <span class="trick-word" style="color:${q.color}; font-weight:bold;">${q.word}</span>`;
    card.appendChild(text);

    const circleRow = document.createElement("div");
    circleRow.className = "circle-row";

    q.shapes.forEach(function (c) {
      const circle = document.createElement("div");
      circle.className = "circle";
      circle.style.background = c;

      circle.onclick = function () {
        feedbackBox.style.display = "block";

        if (c === q.color) {
          points += 10;
          updateLiveScore();
          feedbackBox.textContent = "Correct!";
        } else {
          feedbackBox.textContent = "Wrong!";
        }

        setTimeout(moveNext, 1000);
      };

      circleRow.appendChild(circle);
    });

    card.appendChild(circleRow);
  }

  if (q.type === "mcq") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const optionGroup = document.createElement("div");
    optionGroup.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        feedbackBox.style.display = "block";

        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          feedbackBox.textContent = "Correct!";
        } else {
          feedbackBox.textContent = "Wrong!";
        }

        setTimeout(moveNext, 1000);
      };

      optionGroup.appendChild(btn);
    });

    card.appendChild(optionGroup);
  }

  if (q.type === "squares") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question + "... or is it?";
    card.appendChild(text);

    const squareRow = document.createElement("div");
    squareRow.className = "square-row";
    let clicked = new Set();

    function checkDone() {
      if (clicked.size >= q.required) {
        points += 10;
        updateLiveScore();
        feedbackBox.style.display = "block";
        feedbackBox.textContent = "Correct!";
        setTimeout(moveNext, 1000);
      }
    }

    for (let i = 0; i < q.count; i++) {
      const sq = document.createElement("div");
      sq.className = "square";

      sq.onclick = function (e) {
        e.stopPropagation();
        clicked.add(i);
        sq.style.opacity = "0";
        checkDone();
      };

      sq.onmouseover = function () {
        sq.style.transform = `translate(${Math.random() * 40}px, ${Math.random() * 40}px)`;
      };

      squareRow.appendChild(sq);
    }

    card.onclick = function () {
      clicked.add("background");
      checkDone();
    };

    card.appendChild(squareRow);
  }

  if (q.type === "reverse") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const optionGroup = document.createElement("div");
    optionGroup.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        feedbackBox.style.display = "block";

        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          feedbackBox.textContent = "Correct!";
        } else {
          feedbackBox.textContent = "Wrong 😈 You overthought it.";
        }

        setTimeout(moveNext, 1200);
      };

      optionGroup.appendChild(btn);
    });

    card.appendChild(optionGroup);
  }

  mainContent.appendChild(card);
}
