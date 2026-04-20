let points = 0;
let currentQuestionIndex = 0;
let timer;
let timeLeft = 10;
let playerName = "Guest";
let locked = false;

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
    shapes: ["red", "blue", "green"],
    answer: "Blue",
    reason: "The word said RED, but the text color was blue. The instruction asked for the color, not the word."
  },
  {
    type: "mcq",
    question: "Do NOT click the correct answer",
    options: ["2 + 2 = 4", "2 + 2 = 5"],
    correct: "2 + 2 = 5",
    answer: "2 + 2 = 5",
    reason: "The sentence told you not to click the correct answer, so the intentionally wrong math choice became the winning choice."
  },
  {
    type: "squares",
    question: "Tap all squares",
    count: 3,
    required: 4,
    answer: "All 3 squares + the card background",
    reason: "There were only 3 visible squares, so the fourth tap had to be hidden somewhere else. The background counted too."
  },
  {
    type: "reverse",
    question: "Do nothing to win",
    options: ["Click", "Wait"],
    correct: "Click",
    answer: "Click",
    reason: "The instruction was designed to bait you into waiting. The opposite action was the correct one."
  },
  {
    type: "wordMemory",
    question: "Remember this word:",
    word: "APPLE",
    fakeNote: "you will be asked about it next",
    answer: "No answer here",
    reason: "This was planted to build false confidence before the next trick."
  },
  {
    type: "mcq",
    question: "What word were you just told to remember?",
    options: ["APPLE", "ORANGE", "BANANA"],
    correct: "ORANGE",
    answer: "ORANGE",
    reason: "The previous screen was a trap. It told you to remember APPLE, so naturally you trusted it."
  },
  {
    type: "biggestNumber",
    question: "Click the biggest number",
    options: ["12", "7", "100", "9"],
    correct: "12",
    answer: "12",
    reason: "This one relies on ambiguity. 'Biggest' can mean how large the number looks on the screen, not numerical value."
  },
  {
    type: "opposite",
    question: "Click the opposite of UP",
    options: ["Down", "UP", "Left", "Stay"],
    correct: "UP",
    answer: "UP",
    reason: "It never said click the word that means the opposite. It said click the opposite of UP, which visually flips your expectation."
  },
  {
    type: "countDots",
    question: "How many dots are below?",
    dots: 5,
    options: ["4", "5", "6"],
    correct: "6",
    answer: "6",
    reason: "The punctuation in the question counts too. The dot in the sentence plus the 5 shown below makes 6."
  },
  {
    type: "lastOption",
    question: "Don't click the last option",
    options: ["First", "Middle", "Last"],
    correct: "Last",
    answer: "Last",
    reason: "The wording was there to steer you away from the exact answer you needed."
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
  locked = false;
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
  locked = false;
  updateLiveScore();
  questionCount.textContent = "1 / " + questions.length;
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
  questionCount.textContent = (currentQuestionIndex + 1) + " / " + questions.length;
}

function loadQuestion() {
  mainContent.innerHTML = "";
  updateQuestionCount();
  locked = false;
  createQuestionCard(questions[currentQuestionIndex]);
}

function startTimer(card) {
  clearInterval(timer);
  timeLeft = 10;

  const fill = card.querySelector(".timer-fill");

  timer = setInterval(function () {
    timeLeft -= 0.1;
    fill.style.width = (timeLeft / 10) * 100 + "%";

    if (timeLeft <= 0) {
      clearInterval(timer);
      if (!locked) {
        locked = true;
        showFeedback(
          false,
          "Too slow.",
          questions[currentQuestionIndex].answer || "No answer",
          questions[currentQuestionIndex].reason || "The timer pressure was part of the trick.",
          "The game beat you before you even chose. Embarrassing."
        );
      }
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

  if (manipulatedScore >= 70) {
    scoreMessage.textContent = "You caught most of the tricks. Annoying for the game, impressive for you.";
  } else if (manipulatedScore >= 40) {
    scoreMessage.textContent = "You survived a decent amount, but the interface clearly got inside your head.";
  } else if (manipulatedScore >= 15) {
    scoreMessage.textContent = "You were confident, and the game used that against you.";
  } else {
    scoreMessage.textContent = "This interface absolutely cooked you.";
  }

  welcomeScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  scoreScreen.classList.remove("hidden");
}

function showFeedback(isCorrect, title, correctAnswer, reason, insult) {
  clearInterval(timer);

  const card = document.querySelector(".question-card");
  const feedback = card.querySelector(".feedback");

  feedback.className = isCorrect ? "feedback good" : "feedback bad";
  feedback.style.display = "block";
  feedback.innerHTML = `
    <div class="feedback-title">${title}</div>
    <div class="feedback-answer">Correct answer: ${correctAnswer}</div>
    <div class="feedback-reason">${reason}</div>
    <div class="feedback-insult">${insult}</div>
  `;

  disableAllInputs(card);

  setTimeout(moveNext, 2300);
}

function disableAllInputs(card) {
  const buttons = card.querySelectorAll("button");
  buttons.forEach(function (btn) {
    btn.disabled = true;
  });

  const circles = card.querySelectorAll(".circle");
  circles.forEach(function (circle) {
    circle.style.pointerEvents = "none";
  });

  const squares = card.querySelectorAll(".square");
  squares.forEach(function (sq) {
    sq.style.pointerEvents = "none";
  });
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

  setTimeout(function () {
    startTimer(card);
  }, 50);

  if (q.type === "trickColor") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.innerHTML = `${q.question} <span style="color:${q.color}; font-weight:bold;">${q.word}</span>`;
    card.appendChild(text);

    const row = document.createElement("div");
    row.className = "circle-row";

    q.shapes.forEach(function (c) {
      const circle = document.createElement("div");
      circle.className = "circle";
      circle.style.background = c;

      circle.onclick = function () {
        if (locked) return;
        locked = true;

        if (c === q.color) {
          points += 10;
          updateLiveScore();
          showFeedback(
            true,
            "Correct.",
            q.answer,
            q.reason,
            "You noticed the trick. For once."
          );
        } else {
          showFeedback(
            false,
            "Wrong.",
            q.answer,
            q.reason,
            "You read too fast and paid for it."
          );
        }
      };

      row.appendChild(circle);
    });

    card.appendChild(row);
  }

  if (q.type === "mcq") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const group = document.createElement("div");
    group.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        if (locked) return;
        locked = true;

        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          showFeedback(
            true,
            "Correct.",
            q.answer,
            q.reason,
            "You resisted the obvious bait."
          );
        } else {
          showFeedback(
            false,
            "Wrong.",
            q.answer,
            q.reason,
            "The trap worked exactly as intended."
          );
        }
      };

      group.appendChild(btn);
    });

    card.appendChild(group);
  }

  if (q.type === "squares") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const note = document.createElement("div");
    note.className = "small-note";
    note.textContent = "seems simple, right?";
    card.appendChild(note);

    const row = document.createElement("div");
    row.className = "square-row";

    let clicked = new Set();

    function checkDone() {
      if (clicked.size >= q.required && !locked) {
        locked = true;
        points += 10;
        updateLiveScore();
        showFeedback(
          true,
          "Correct.",
          q.answer,
          q.reason,
          "You found the hidden interaction. Mildly impressive."
        );
      }
    }

    for (let i = 0; i < q.count; i++) {
      const sq = document.createElement("div");
      sq.className = "square";

      sq.onclick = function (e) {
        if (locked) return;
        e.stopPropagation();
        clicked.add(i);
        sq.style.opacity = "0.18";
        checkDone();
      };

      sq.onmouseover = function () {
        if (!locked) {
          sq.style.transform = `translate(${Math.random() * 38}px, ${Math.random() * 38}px)`;
        }
      };

      row.appendChild(sq);
    }

    card.onclick = function () {
      if (locked) return;
      clicked.add("background");
      checkDone();
    };

    card.appendChild(row);
  }

  if (q.type === "reverse") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const group = document.createElement("div");
    group.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        if (locked) return;
        locked = true;

        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          showFeedback(
            true,
            "Correct.",
            q.answer,
            q.reason,
            "You ignored the bait. Nice."
          );
        } else {
          showFeedback(
            false,
            "Wrong.",
            q.answer,
            q.reason,
            "You obeyed the instruction like the game hoped you would."
          );
        }
      };

      group.appendChild(btn);
    });

    card.appendChild(group);
  }

  if (q.type === "wordMemory") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const memoryWord = document.createElement("div");
    memoryWord.className = "fake-memory";
    memoryWord.textContent = q.word;
    card.appendChild(memoryWord);

    const note = document.createElement("div");
    note.className = "small-note";
    note.textContent = q.fakeNote;
    card.appendChild(note);

    const group = document.createElement("div");
    group.className = "option-group";

    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = "Continue";

    btn.onclick = function () {
      if (locked) return;
      locked = true;

      showFeedback(
        true,
        "Moving on.",
        q.word,
        q.reason,
        "You trusted the setup. That will matter very soon."
      );
    };

    group.appendChild(btn);
    card.appendChild(group);
  }

  if (q.type === "biggestNumber") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const note = document.createElement("div");
    note.className = "small-note";
    note.textContent = "be careful how you define “biggest”";
    card.appendChild(note);

    const group = document.createElement("div");
    group.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        if (locked) return;
        locked = true;

        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          showFeedback(
            true,
            "Correct.",
            q.answer,
            q.reason,
            "You caught the wording loophole."
          );
        } else {
          showFeedback(
            false,
            "Wrong.",
            q.answer,
            q.reason,
            "You assumed biggest meant numerical value. Predictable."
          );
        }
      };

      group.appendChild(btn);
    });

    card.appendChild(group);
  }

  if (q.type === "opposite") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const group = document.createElement("div");
    group.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        if (locked) return;
        locked = true;

        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          showFeedback(
            true,
            "Correct.",
            q.answer,
            q.reason,
            "You looked past the obvious meaning."
          );
        } else {
          showFeedback(
            false,
            "Wrong.",
            q.answer,
            q.reason,
            "Your brain auto-completed the question and walked into the trap."
          );
        }
      };

      group.appendChild(btn);
    });

    card.appendChild(group);
  }

  if (q.type === "countDots") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const dotRow = document.createElement("div");
    dotRow.className = "dot-row";
    dotRow.textContent = "• • • • •";
    card.appendChild(dotRow);

    const group = document.createElement("div");
    group.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        if (locked) return;
        locked = true;

        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          showFeedback(
            true,
            "Correct.",
            q.answer,
            q.reason,
            "You counted more carefully than most people do."
          );
        } else {
          showFeedback(
            false,
            "Wrong.",
            q.answer,
            q.reason,
            "You counted only what was obvious. The question counted too."
          );
        }
      };

      group.appendChild(btn);
    });

    card.appendChild(group);
  }

  if (q.type === "lastOption") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const group = document.createElement("div");
    group.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        if (locked) return;
        locked = true;

        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          showFeedback(
            true,
            "Correct.",
            q.answer,
            q.reason,
            "You ignored the warning and clicked anyway."
          );
        } else {
          showFeedback(
            false,
            "Wrong.",
            q.answer,
            q.reason,
            "The wording controlled your choice exactly like it was supposed to."
          );
        }
      };

      group.appendChild(btn);
    });

    card.appendChild(group);
  }

  mainContent.appendChild(card);
}
