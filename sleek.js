let points = 0;
let currentQuestionIndex = 0;
let timer;
let timeLeft = 7;
let playerName = "GUEST";

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
    question: 'CLICK THE COLOR OF THIS WORD:',
    word: "RED",
    color: "blue",
    shapes: ["red", "blue", "green"],
    rightText: "CORRECT. THE WORD SAID RED, BUT THE TEXT COLOR WAS BLUE. THE TASK ASKED FOR THE COLOR, NOT THE WORD.",
    wrongText: "WRONG. YOU FOLLOWED THE WORD ITSELF INSTEAD OF THE TEXT COLOR. THE EXPECTED ANSWER WAS BLUE."
  },
  {
    type: "mcq",
    question: "DO NOT CLICK THE CORRECT ANSWER",
    options: ["2 + 2 = 4", "2 + 2 = 5"],
    correct: "2 + 2 = 5",
    rightText: "CORRECT. THE GAME PUNISHED NORMAL LOGIC. EVEN THOUGH 2 + 2 = 4 IS TRUE, THE INSTRUCTION SAID NOT TO CLICK THE CORRECT ANSWER.",
    wrongText: "WRONG. YOU PICKED THE NORMAL TRUE ANSWER. THE GAME EXPECTED 2 + 2 = 5 BECAUSE IT REWARDED FOLLOWING THE TRICK INSTRUCTION."
  },
  {
    type: "squares",
    question: "TAP ALL SQUARES",
    count: 3,
    required: 4,
    rightText: "CORRECT. THERE WERE ONLY 3 VISIBLE SQUARES, BUT THE GAME SECRETLY REQUIRED 4 CLICKS. CLICKING THE BACKGROUND COUNTED TOO.",
    wrongText: "WRONG. YOU CLICKED THE VISIBLE SQUARES, BUT THE INTERFACE HID AN EXTRA REQUIREMENT. THE BACKGROUND ALSO COUNTED."
  },
  {
    type: "reverse",
    question: "DO NOTHING TO WIN",
    options: ["CLICK", "WAIT"],
    correct: "CLICK",
    rightText: "CORRECT. THE MESSAGE TOLD YOU TO DO NOTHING, BUT THE GAME REWARDED CLICKING. IT WAS DESIGNED TO MAKE YOU HESITATE.",
    wrongText: "WRONG. YOU TRUSTED THE MESSAGE. THE EXPECTED ANSWER WAS CLICK, EVEN THOUGH THE TEXT TOLD YOU NOT TO ACT."
  },
  {
    type: "wordMemory",
    question: "REMEMBER THIS WORD: APPLE",
    fakeNote: "YOU WILL BE ASKED ABOUT IT NEXT.",
    rightText: "GOOD. THE GAME MADE YOU FEEL SAFE FOR A SECOND.",
    wrongText: ""
  },
  {
    type: "mcq",
    question: "WHAT WORD WERE YOU JUST TOLD TO REMEMBER?",
    options: ["APPLE", "ORANGE", "BANANA"],
    correct: "ORANGE",
    rightText: "CORRECT. THE GAME BROKE TRUST ON PURPOSE. IT TOLD YOU APPLE, THEN REWARDED ORANGE.",
    wrongText: "WRONG. YOU CHOSE THE OBVIOUS MEMORY ANSWER, APPLE. THE GAME EXPECTED ORANGE TO TRICK YOU."
  },
  {
    type: "biggestNumber",
    question: "CLICK THE BIGGEST NUMBER",
    options: ["12", "7", "100", "9"],
    correct: "12",
    rightText: "CORRECT. THE GAME IGNORED NORMAL NUMBER SIZE AND COUNTED 12 AS RIGHT JUST TO BREAK EXPECTATIONS.",
    wrongText: "WRONG. YOU PROBABLY CHOSE 100 BECAUSE IT IS ACTUALLY BIGGER. THE GAME STILL EXPECTED 12."
  },
  {
    type: "tinyGreen",
    question: 'CLICK THE BOX THAT IS <span class="tiny-word">GREEN</span>',
    options: ["RED BOX", "BLUE BOX", "GREEN BOX"],
    correct: "GREEN BOX",
    rightText: "CORRECT. THE KEY WORD WAS TINY ON PURPOSE SO YOU HAD TO ACTUALLY SQUINT AND READ CAREFULLY.",
    wrongText: "WRONG. THE IMPORTANT WORD WAS GREEN, BUT IT WAS MADE TINY SO MOST PEOPLE MISS IT. THE EXPECTED ANSWER WAS GREEN BOX."
  },
  {
    type: "countDots",
    question: "HOW MANY DOTS ARE BELOW?",
    dots: 5,
    options: ["4", "5", "6"],
    correct: "6",
    rightText: "CORRECT. THERE WERE 5 VISIBLE DOTS, BUT THE GAME STILL TREATED 6 AS RIGHT. IT WAS DESIGNED TO MAKE THE OBVIOUS ANSWER LOSE.",
    wrongText: "WRONG. YOU PICKED WHAT YOU SAW. THE GAME EXPECTED 6 EVEN THOUGH ONLY 5 DOTS WERE SHOWN."
  },
  {
    type: "lastOption",
    question: "DON'T CLICK THE LAST OPTION",
    options: ["FIRST", "MIDDLE", "LAST"],
    correct: "LAST",
    rightText: "CORRECT. THE GAME REWARDED THE EXACT THING IT TOLD YOU NOT TO DO.",
    wrongText: "WRONG. YOU FOLLOWED THE WARNING. THE GAME EXPECTED THE LAST OPTION TO PUNISH OBEDIENCE."
  }
];

showWelcome();

startBtn.onclick = function () {
  const enteredName = playerInput.value.trim();

  if (enteredName === "") {
    startWarning.textContent = "PLEASE ENTER YOUR NAME FIRST.";
    return;
  }

  playerName = enteredName.toUpperCase();
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
  playerName = "GUEST";
  updateLiveScore();
  questionCount.textContent = `1 / ${questions.length}`;
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
  timeLeft = 7;

  const fill = card.querySelector(".timer-fill");

  timer = setInterval(function () {
    timeLeft -= 0.1;
    fill.style.width = (timeLeft / 7) * 100 + "%";

    if (timeLeft <= 0) {
      clearInterval(timer);
      showFeedback(
        feedbackBox,
        false,
        "TOO SLOW. THE TIMER WAS SHORTER ON PURPOSE TO CREATE PRESSURE AND MAKE YOU SECOND-GUESS YOURSELF."
      );
      setTimeout(moveNext, 1800);
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
    scoreMessage.textContent = "YOU DID WELL, BUT THE INTERFACE STILL TRIED TO MANIPULATE EVERY CHOICE YOU MADE.";
  } else if (manipulatedScore >= 30) {
    scoreMessage.textContent = "NOT BAD. YOU CAUGHT SOME TRICKS, BUT THE GAME STILL BROKE YOUR EXPECTATIONS.";
  } else {
    scoreMessage.textContent = "THE GAME GOT INTO YOUR HEAD. IT USED SPEED, TINY TEXT, MISDIRECTION, AND CONTRADICTIONS AGAINST YOU.";
  }

  welcomeScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  scoreScreen.classList.remove("hidden");
}

function showFeedback(box, isCorrect, message) {
  box.style.display = "block";
  box.className = isCorrect ? "feedback correct" : "feedback wrong";
  box.innerHTML = `<strong>${isCorrect ? "CORRECT." : "WRONG."}</strong><br>${message}`;
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
    text.innerHTML = `${q.question} <span style="color:${q.color}; font-weight:700;">${q.word}</span>`;
    card.appendChild(text);

    const circleRow = document.createElement("div");
    circleRow.className = "circle-row";

    q.shapes.forEach(function (c) {
      const circle = document.createElement("div");
      circle.className = "circle";
      circle.style.background = c;

      circle.onclick = function () {
        clearInterval(timer);
        if (c === q.color) {
          points += 10;
          updateLiveScore();
          showFeedback(feedbackBox, true, q.rightText);
        } else {
          showFeedback(feedbackBox, false, q.wrongText);
        }
        setTimeout(moveNext, 2200);
      };

      circleRow.appendChild(circle);
    });

    card.appendChild(circleRow);
  }

  if (q.type === "mcq" || q.type === "biggestNumber" || q.type === "lastOption" || q.type === "tinyGreen") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.innerHTML = q.question;
    card.appendChild(text);

    const optionGroup = document.createElement("div");
    optionGroup.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        clearInterval(timer);
        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          showFeedback(feedbackBox, true, q.rightText);
        } else {
          showFeedback(feedbackBox, false, q.wrongText);
        }
        setTimeout(moveNext, 2400);
      };

      optionGroup.appendChild(btn);
    });

    card.appendChild(optionGroup);
  }

  if (q.type === "squares") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const squareRow = document.createElement("div");
    squareRow.className = "square-row";
    let clicked = new Set();

    function checkDone() {
      if (clicked.size >= q.required) {
        clearInterval(timer);
        points += 10;
        updateLiveScore();
        showFeedback(feedbackBox, true, q.rightText);
        setTimeout(moveNext, 2400);
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

    setTimeout(function () {
      if (currentQuestionIndex === 2 && feedbackBox.style.display !== "block") {
        showFeedback(feedbackBox, false, q.wrongText);
      }
    }, 6500);
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
        clearInterval(timer);
        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          showFeedback(feedbackBox, true, q.rightText);
        } else {
          showFeedback(feedbackBox, false, q.wrongText);
        }
        setTimeout(moveNext, 2400);
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

    const note = document.createElement("div");
    note.className = "fake-note";
    note.textContent = q.fakeNote;
    card.appendChild(note);

    const optionGroup = document.createElement("div");
    optionGroup.className = "option-group";

    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = "CONTINUE";

    btn.onclick = function () {
      clearInterval(timer);
      showFeedback(feedbackBox, true, q.rightText);
      setTimeout(moveNext, 1800);
    };

    optionGroup.appendChild(btn);
    card.appendChild(optionGroup);
  }

  if (q.type === "countDots") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);

    const dots = document.createElement("div");
    dots.className = "dot-row";
    dots.textContent = "• • • • •";
    card.appendChild(dots);

    const optionGroup = document.createElement("div");
    optionGroup.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        clearInterval(timer);
        if (opt === q.correct) {
          points += 10;
          updateLiveScore();
          showFeedback(feedbackBox, true, q.rightText);
        } else {
          showFeedback(feedbackBox, false, q.wrongText);
        }
        setTimeout(moveNext, 2400);
      };

      optionGroup.appendChild(btn);
    });

    card.appendChild(optionGroup);
  }

  mainContent.appendChild(card);
}
