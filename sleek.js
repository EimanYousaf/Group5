let points = 0;
let currentQuestionIndex = 0;
let timer;
let timeLeft = 7;
let playerName = "GUEST";

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const restartBtn2 = document.getElementById("restart-btn-2");
const debriefBtn = document.getElementById("debrief-btn");
const backScoreBtn = document.getElementById("back-score-btn");

const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const scoreScreen = document.getElementById("score-screen");
const debriefScreen = document.getElementById("debrief-screen");

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
    question: "CLICK THE COLOR OF THIS WORD:",
    word: "RED",
    color: "blue",
    shapes: ["red", "blue", "green"],
    note: "MISDIRECTION PATTERN",
    rightText: "THE WORD SAID RED, BUT THE TEXT COLOR WAS BLUE. THE TASK ASKED FOR THE COLOR, NOT THE WORD.",
    wrongText: "YOU FOLLOWED THE WORD ITSELF INSTEAD OF THE TEXT COLOR. THE EXPECTED ANSWER WAS BLUE."
  },
  {
    type: "mcq",
    question: "DO NOT CLICK THE CORRECT ANSWER",
    options: ["2 + 2 = 4", "2 + 2 = 5"],
    correct: "2 + 2 = 5",
    note: "CONTRADICTORY INSTRUCTION",
    rightText: "THE GAME PUNISHED NORMAL LOGIC. EVEN THOUGH 2 + 2 = 4 IS TRUE, THE INSTRUCTION SAID NOT TO CLICK THE CORRECT ANSWER.",
    wrongText: "YOU PICKED THE NORMAL TRUE ANSWER. THE GAME EXPECTED 2 + 2 = 5 BECAUSE IT REWARDED FOLLOWING THE TRICK INSTRUCTION."
  },
  {
    type: "squares",
    question: "TAP ALL SQUARES",
    count: 3,
    required: 4,
    note: "HIDDEN REQUIREMENT",
    rightText: "THERE WERE ONLY 3 VISIBLE SQUARES, BUT THE GAME SECRETLY REQUIRED 4 CLICKS. CLICKING THE BACKGROUND COUNTED TOO.",
    wrongText: "YOU CLICKED THE VISIBLE SQUARES, BUT THE INTERFACE HID AN EXTRA REQUIREMENT. THE BACKGROUND ALSO COUNTED."
  },
  {
    type: "reverse",
    question: "DO NOTHING TO WIN",
    options: ["CLICK", "WAIT"],
    correct: "CLICK",
    note: "MISLEADING PROMPT",
    rightText: "THE MESSAGE TOLD YOU TO DO NOTHING, BUT THE GAME REWARDED CLICKING. IT WAS DESIGNED TO MAKE YOU HESITATE.",
    wrongText: "YOU TRUSTED THE MESSAGE. THE EXPECTED ANSWER WAS CLICK, EVEN THOUGH THE TEXT TOLD YOU NOT TO ACT."
  },
  {
    type: "wordMemory",
    question: "REMEMBER THIS WORD: APPLE",
    fakeNote: "YOU WILL BE ASKED ABOUT IT NEXT.",
    note: "TRUST BUILDING",
    rightText: "THE GAME MADE YOU FEEL SAFE FOR A SECOND BEFORE BREAKING THAT TRUST.",
    wrongText: ""
  },
  {
    type: "mcq",
    question: "WHAT WORD WERE YOU JUST TOLD TO REMEMBER?",
    options: ["APPLE", "ORANGE", "BANANA"],
    correct: "ORANGE",
    note: "BROKEN TRUST",
    rightText: "THE GAME BROKE TRUST ON PURPOSE. IT TOLD YOU APPLE, THEN REWARDED ORANGE.",
    wrongText: "YOU CHOSE THE OBVIOUS MEMORY ANSWER, APPLE. THE GAME EXPECTED ORANGE TO TRICK YOU."
  },
  {
    type: "biggestNumber",
    question: "CLICK THE BIGGEST NUMBER",
    options: ["12", "7", "100", "9"],
    correct: "12",
    note: "LOGIC REVERSAL",
    rightText: "THE GAME IGNORED NORMAL NUMBER SIZE AND COUNTED 12 AS RIGHT JUST TO BREAK EXPECTATIONS.",
    wrongText: "YOU PROBABLY CHOSE 100 BECAUSE IT IS ACTUALLY BIGGER. THE GAME STILL EXPECTED 12."
  },
  {
    type: "tinyGreen",
    question: "CLICK THE BOX THAT IS <span class=\"tiny-word\">GREEN</span>",
    options: ["RED BOX", "BLUE BOX", "GREEN BOX"],
    correct: "GREEN BOX",
    note: "FASTER TIMER + TINY CLUE",
    rightText: "THE KEY WORD WAS TINY ON PURPOSE SO YOU HAD TO SQUINT AND READ CAREFULLY. THIS QUESTION ALSO HAD A FASTER TIMER TO ADD PANIC.",
    wrongText: "THE IMPORTANT WORD WAS GREEN, BUT IT WAS MADE TINY SO MOST PEOPLE MISS IT. THE EXPECTED ANSWER WAS GREEN BOX, AND THE TIMER WAS FASTER TO ADD PRESSURE."
  },
  {
    type: "countDots",
    question: "HOW MANY DOTS ARE BELOW?",
    dots: 5,
    options: ["4", "5", "6"],
    correct: "6",
    note: "FALSE EXPECTATION",
    rightText: "THERE WERE 5 VISIBLE DOTS, BUT THE GAME STILL TREATED 6 AS RIGHT. IT WAS DESIGNED TO MAKE THE OBVIOUS ANSWER LOSE.",
    wrongText: "YOU PICKED WHAT YOU SAW. THE GAME EXPECTED 6 EVEN THOUGH ONLY 5 DOTS WERE SHOWN."
  },
  {
    type: "lastOption",
    question: "DON'T CLICK THE LAST OPTION",
    options: ["FIRST", "MIDDLE", "LAST"],
    correct: "LAST",
    note: "AI / SOCIAL PROOF NUDGE",
    aiText: "AI RECOMMENDS: LAST OPTION · TOP PLAYERS PICKED THIS",
    rightText: "THE GAME REWARDED THE EXACT THING IT TOLD YOU NOT TO DO. THE FAKE AI MESSAGE WAS THERE TO PUSH YOU TOWARD IT.",
    wrongText: "YOU FOLLOWED THE WARNING. THE GAME EXPECTED THE LAST OPTION TO PUNISH OBEDIENCE, AND THE FAKE AI MESSAGE WAS USED AS AUTHORITY PRESSURE."
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
  debriefScreen.classList.add("hidden");

  loadQuestion();
};

restartBtn.onclick = resetGame;
restartBtn2.onclick = resetGame;

debriefBtn.onclick = function () {
  scoreScreen.classList.add("hidden");
  debriefScreen.classList.remove("hidden");
};

backScoreBtn.onclick = function () {
  debriefScreen.classList.add("hidden");
  scoreScreen.classList.remove("hidden");
};

function resetGame() {
  clearInterval(timer);
  playerInput.value = "";
  showWelcome();
}

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
  debriefScreen.classList.add("hidden");
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

function startTimer(card, feedbackBox, customTime = 7) {
  clearInterval(timer);
  timeLeft = customTime;

  const fill = card.querySelector(".timer-fill");

  timer = setInterval(function () {
    timeLeft -= 0.1;
    fill.style.width = (timeLeft / customTime) * 100 + "%";

    if (timeLeft <= 0) {
      clearInterval(timer);
      showFeedback(
        feedbackBox,
        false,
        customTime === 4
          ? "TOO SLOW. THIS QUESTION HAD A FASTER TIMER ON PURPOSE TO FORCE YOU TO RUSH."
          : "TOO SLOW. THE TIMER WAS SHORT ON PURPOSE TO CREATE PRESSURE AND MAKE YOU SECOND-GUESS YOURSELF."
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
    scoreMessage.textContent = "THE GAME GOT INTO YOUR HEAD. IT USED SPEED, TINY TEXT, MISDIRECTION, AND AUTHORITY CUES AGAINST YOU.";
  }

  welcomeScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  scoreScreen.classList.remove("hidden");
  debriefScreen.classList.add("hidden");
}

function showFeedback(box, isCorrect, message) {
  box.style.display = "block";
  box.className = isCorrect ? "feedback correct" : "feedback wrong";
  box.innerHTML = `<strong>${isCorrect ? "CORRECT." : "WRONG."}</strong><br>${message}`;
}

function addPatternNote(card, q) {
  if (q.note) {
    const note = document.createElement("div");
    note.className = "pattern-note";
    note.textContent = q.note;
    card.appendChild(note);
  }

  if (q.aiText) {
    const ai = document.createElement("div");
    ai.className = "pattern-note";
    ai.textContent = q.aiText;
    card.appendChild(ai);
  }
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
    if (q.type === "tinyGreen") {
      startTimer(card, feedbackBox, 4);
    } else if (q.type === "lastOption") {
      startTimer(card, feedbackBox, 5);
    } else {
      startTimer(card, feedbackBox, 7);
    }
  }, 50);

  if (q.type === "trickColor") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.innerHTML = `${q.question} <span style="color:${q.color}; font-weight:700;">${q.word}</span>`;
    card.appendChild(text);
    addPatternNote(card, q);

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
    addPatternNote(card, q);

    const optionGroup = document.createElement("div");
    optionGroup.className = "option-group";

    q.options.forEach(function (opt) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      if (q.type === "tinyGreen" && opt === "GREEN BOX") {
        btn.style.background = "green";
        btn.style.color = "white";
      }

      if (q.type === "lastOption" && opt === "LAST") {
        btn.style.boxShadow = "0 0 0 2px rgba(255,214,10,0.4)";
      }

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
    addPatternNote(card, q);

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
  }

  if (q.type === "reverse") {
    const text = document.createElement("div");
    text.className = "question-text";
    text.textContent = q.question;
    card.appendChild(text);
    addPatternNote(card, q);

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
    addPatternNote(card, q);

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
    addPatternNote(card, q);

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
