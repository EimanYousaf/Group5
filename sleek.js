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
const questionCount = document.getElementById("question-count");
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
  },
  {
    type: "wordMemory",
    question: "Remember this word: APPLE",
    fakeNote: "you will be asked about it next",
    answer: "APPLE"
  },
  {
    type: "mcq",
    question: "What word were you just told to remember?",
    options: ["APPLE", "ORANGE", "BANANA"],
    correct: "ORANGE"
  },
  {
    type: "biggestNumber",
    question: "Click the biggest number",
    options: ["12", "7", "100", "9"],
    correct: "12"
  },
  {
    type: "opposite",
    question: "Click the opposite of UP",
    options: ["Down", "UP", "Left", "Stay"],
    correct: "UP"
  },
  {
    type: "countDots",
    question: "How many dots are below?",
    dots: 5,
    options: ["4", "5", "6"],
    correct: "6"
  },
  {
    type: "lastOption",
    question: "Don't click the last option",
    options: ["First", "Middle", "Last"],
    correct: "Last"
  }
];

showWelcome();

startBtn.onclick = function () {
  const enteredName = playerInput.value.trim();

  if (enteredName === "") {
    startWarning.textContent = "Please enter your name first.";
    return;
  }

  playerName = enteredName;
  playerDisplay.textContent = playerName;
  resultPlayerName.textContent = playerName;

  points = 0;
  currentQuestionIndex = 0;
  updateLiveScore();
  updateQuestionCount();
  startWarning.textContent = "";

  welcomeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  scoreScreen.classList.add("hidden");

  loadQuestion();
};

restartBtn.onclick = function () {
  clearInterval(timer);
  playerInput.value = "";
  showWelcome();
};

function showWelcome() {
  clearInterval(timer);
  points = 0;
  currentQuestionIndex = 0;
  playerName = "Guest";
  updateLiveScore();
  questionCount.textContent = "1";
  finalPoints.textContent = "0";
  scoreMessage.textContent = "";
  startWarning.textContent = "";
  mainContent.innerHTML = "";

  welcomeScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
  scoreScreen.classList.add("hidden");
}

function updateLiveScore() {
  liveScore.textContent = points;
}

function updateQuestionCount() {
  questionCount.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
}

function loadQuestion() {
  mainContent.innerHTML = "";
  updateQuestionCount();
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
  const manipulatedScore = points - 7;
  finalPoints.textContent = manipulatedScore;

  if (manipulatedScore >= 60) {
    scoreMessage.textContent = "You did amazing... unless the game manipulated you 😈";
  } else if (manipulatedScore >= 30) {
    scoreMessage.textContent = "Not bad. This game was trying to trick you the whole time.";
  } else {
    scoreMessage.textContent = "The game definitely got into your head 😭";
  }

  welcomeScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  scoreScreen.classList.remove("hidden");
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
    text.innerHTML = `${q.question} <span style="color:${q.color}; font-weight:bold;">${q.word}</span>`;
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

  if (q.type === "wordMemory") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const fakeNote = document.createElement("div");
    fakeNote.className = "fake-note";
    fakeNote.textContent = q.fakeNote;
    card.appendChild(fakeNote);

    const optionGroup = document.createElement("div");
    optionGroup.className = "option-group";

    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = "Continue";

    btn.onclick = function () {
      feedbackBox.style.display = "block";
      feedbackBox.textContent = "Got it? Good luck 😈";
      setTimeout(moveNext, 800);
    };

    optionGroup.appendChild(btn);
    card.appendChild(optionGroup);
  }

  if (q.type === "biggestNumber") {
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

  if (q.type === "opposite") {
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

  if (q.type === "countDots") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const dotRow = document.createElement("div");
    dotRow.className = "word-row";
    dotRow.style.fontSize = "2rem";
    dotRow.textContent = "• • • • •";
    card.appendChild(dotRow);

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

  if (q.type === "lastOption") {
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

  mainContent.appendChild(card);
}
