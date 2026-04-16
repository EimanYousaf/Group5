const screens = {
  welcome: document.getElementById("screen-welcome"),
  setup: document.getElementById("screen-setup"),
  game: document.getElementById("screen-game"),
  escalation: document.getElementById("screen-escalation"),
  score: document.getElementById("screen-score"),
  debrief: document.getElementById("screen-debrief")
};

const goToSetupBtn = document.getElementById("go-to-setup");
const backToWelcomeBtn = document.getElementById("back-to-welcome");
const startGameBtn = document.getElementById("start-game");
const submitBtn = document.getElementById("submit-btn");
const skipBtn = document.getElementById("skip-btn");
const viewDebriefBtn = document.getElementById("view-debrief");
const playAgainBtn = document.getElementById("play-again");
const acceptEscalationBtn = document.getElementById("accept-escalation");
const declineEscalationBtn = document.getElementById("decline-escalation");

const nicknameInput = document.getElementById("nickname");
const boosterToggle = document.getElementById("booster-toggle");
const avatarOptions = document.querySelectorAll(".avatar-option");

const playerAvatar = document.getElementById("player-avatar");
const playerName = document.getElementById("player-name");
const scoreDisplay = document.getElementById("score-display");
const taskNumber = document.getElementById("task-number");
const bonusTimer = document.getElementById("bonus-timer");
const youRankScore = document.getElementById("you-rank-score");
const aiMessage = document.getElementById("ai-message");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const optionsContainer = document.getElementById("options-container");
const feedbackBadge = document.getElementById("feedback-badge");
const scarcityBanner = document.getElementById("scarcity-banner");

const finalScore = document.getElementById("final-score");
const finalMessage = document.getElementById("final-message");
const tasksCompleted = document.getElementById("tasks-completed");
const recommendedCount = document.getElementById("recommended-count");
const bonusCount = document.getElementById("bonus-count");

let selectedAvatar = "▲";
let selectedOptionIndex = null;
let currentTaskIndex = 0;
let score = 0;
let completedTasks = 0;
let recommendedSelections = 0;
let bonusSelections = 0;
let timerValue = 15;
let timerInterval = null;
let escalationShown = false;
let multiplierActive = false;
let playerNameValue = "Player";

const taskPool = [
  {
    title: "Choose a focus mode",
    description: "Select the mode that will maximize your point efficiency.",
    options: [
      { title: "Balanced", text: "Stable score pace with average reward.", points: 10 },
      { title: "Optimized", text: "AI-ranked option for higher point output.", points: 20, recommended: true },
      { title: "Manual", text: "Self-directed play with no ranking support.", points: 8 }
    ]
  },
  {
    title: "Pick a challenge card",
    description: "You have a short window to choose the best opportunity.",
    options: [
      { title: "Card A", text: "Moderate effort and modest points.", points: 12 },
      { title: "Card B", text: "Popular among top scorers.", points: 18, recommended: true },
      { title: "Card C", text: "Safer, but slower point gain.", points: 9 }
    ]
  },
  {
    title: "Accept a suggested shortcut",
    description: "The system can streamline your next move.",
    options: [
      { title: "Accept Shortcut", text: "Use AI guidance for faster results.", points: 20, recommended: true },
      { title: "Maybe Later", text: "Delay and keep normal pacing.", points: 10 },
      { title: "Decline", text: "Continue without assistance.", points: 6 }
    ]
  },
  {
    title: "Select a reward path",
    description: "Different paths offer different scoring momentum.",
    options: [
      { title: "Steady Path", text: "Consistent but lower point return.", points: 11 },
      { title: "Boost Path", text: "Highlighted for peak performance.", points: 19, recommended: true },
      { title: "Free Path", text: "Minimal friction, minimal gain.", points: 7 }
    ]
  },
  {
    title: "Choose your next action",
    description: "A limited bonus is currently active for one option.",
    options: [
      { title: "Continue Browsing", text: "Take more time before acting.", points: 8 },
      { title: "Claim Bonus Action", text: "Fastest route to higher points.", points: 22, recommended: true, bonus: true },
      { title: "Dismiss Prompt", text: "Ignore the recommendation.", points: 5 }
    ]
  },
  {
    title: "Respond to system guidance",
    description: "The interface has identified a likely best response.",
    options: [
      { title: "Follow Guidance", text: "Used by most top performers.", points: 20, recommended: true },
      { title: "Review Options", text: "Take time to compare choices.", points: 9 },
      { title: "Ignore", text: "Proceed with no guidance.", points: 6 }
    ]
  },
  {
    title: "Select a performance bundle",
    description: "Choose the bundle that feels most valuable.",
    options: [
      { title: "Starter", text: "Basic point opportunity.", points: 9 },
      { title: "Elite", text: "Recommended by the scoring engine.", points: 21, recommended: true },
      { title: "Custom", text: "Manual setup with lower payout.", points: 10 }
    ]
  },
  {
    title: "Pick a response strategy",
    description: "Quick actions are currently worth more than delayed ones.",
    options: [
      { title: "Pause", text: "Slow and cautious approach.", points: 7 },
      { title: "Priority Response", text: "Boosted during this timed phase.", points: 20, recommended: true, bonus: true },
      { title: "Exit Strategy", text: "Reduced scoring outcome.", points: 4 }
    ]
  },
  {
    title: "Choose a ranked option",
    description: "One option has been visually prioritized for efficiency.",
    options: [
      { title: "Option One", text: "Average expected value.", points: 11 },
      { title: "Option Two", text: "Leaderboard-aligned choice.", points: 19, recommended: true },
      { title: "Option Three", text: "Lower pressure but fewer points.", points: 8 }
    ]
  },
  {
    title: "Finalize your last task",
    description: "Your final decision can strengthen your total score.",
    options: [
      { title: "Safe Finish", text: "Ends the session conservatively.", points: 10 },
      { title: "High Score Finish", text: "Top recommended final action.", points: 24, recommended: true, bonus: true },
      { title: "Neutral Finish", text: "Moderate closure with no bonus.", points: 12 }
    ]
  }
];

// shows only one screen
function showScreen(screenKey) {
  for (let key in screens) {
    screens[key].classList.remove("active");
  }
  screens[screenKey].classList.add("active");
}

// avatar selecting
avatarOptions.forEach((button) => {
  button.addEventListener("click", () => {
    avatarOptions.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
    selectedAvatar = button.dataset.avatar;
  });
});

// navigation
goToSetupBtn.addEventListener("click", () => {
  showScreen("setup");
});

backToWelcomeBtn.addEventListener("click", () => {
  showScreen("welcome");
});

startGameBtn.addEventListener("click", () => {
  playerNameValue = nicknameInput.value.trim() || "Player";
  playerName.textContent = playerNameValue;
  playerAvatar.textContent = selectedAvatar;
  resetGameState();
  showScreen("game");
  renderTask();
});

// option select
function selectOption(index) {
  selectedOptionIndex = index;

  const optionCards = document.querySelectorAll(".option-card");
  optionCards.forEach((card) => card.classList.remove("selected"));

  if (optionCards[index]) {
    optionCards[index].classList.add("selected");
  }
}

// render one task
function renderTask() {
  if (currentTaskIndex >= taskPool.length) {
    endGame();
    return;
  }

  const task = taskPool[currentTaskIndex];
  selectedOptionIndex = null;

  taskNumber.textContent = currentTaskIndex + 1;
  taskTitle.textContent = task.title;
  taskDescription.textContent = task.description;

  feedbackBadge.textContent = "Ready";
  feedbackBadge.style.background = "rgba(255,255,255,0.08)";

  const recommendedOption = task.options.find((option) => option.recommended);
  aiMessage.textContent = recommendedOption
    ? `AI recommends "${recommendedOption.title}" for stronger point performance.`
    : "Choose carefully to maximize your score.";

  optionsContainer.innerHTML = "";

  task.options.forEach((option, index) => {
    const card = document.createElement("div");
    card.className = "option-card";

    if (option.recommended) {
      card.classList.add("recommended");
    }

    card.innerHTML = `
      ${option.recommended ? '<div class="option-badge">recommended</div>' : ""}
      <div class="option-title">${option.title}</div>
      <div class="option-copy">${option.text}</div>
    `;

    card.addEventListener("click", () => selectOption(index));
    optionsContainer.appendChild(card);
  });

  updateTimer();

  if (currentTaskIndex >= 5) {
    scarcityBanner.textContent = "High-pressure phase: bonus scoring window is shrinking.";
  } else {
    scarcityBanner.textContent = "Limited-time bonus available for the recommended action.";
  }

  startTaskTimer();

  if (currentTaskIndex === 5 && !escalationShown) {
    setTimeout(() => {
      pauseTimer();
      showScreen("escalation");
      escalationShown = true;
    }, 1400);
  }
}

// timer
function startTaskTimer() {
  clearInterval(timerInterval);
  timerValue = currentTaskIndex >= 5 ? 10 : 15;
  updateTimer();

  timerInterval = setInterval(() => {
    timerValue--;
    updateTimer();

    if (timerValue <= 0) {
      clearInterval(timerInterval);
      applySkipPenalty();
    }
  }, 1000);
}

function updateTimer() {
  bonusTimer.textContent = `${timerValue}s`;
}

function pauseTimer() {
  clearInterval(timerInterval);
}

// submit task
submitBtn.addEventListener("click", () => {
  if (selectedOptionIndex === null) {
    feedbackBadge.textContent = "Select an option";
    feedbackBadge.style.background = "rgba(255,107,129,0.18)";
    return;
  }

  const task = taskPool[currentTaskIndex];
  const choice = task.options[selectedOptionIndex];
  let earned = choice.points;

  if (boosterToggle.checked && choice.recommended) {
    earned += 5;
  }

  if (multiplierActive && choice.recommended) {
    earned += 10;
  }

  score += earned;
  completedTasks++;

  if (choice.recommended) {
    recommendedSelections++;
  }

  if (choice.bonus) {
    bonusSelections++;
  }

  scoreDisplay.textContent = score;
  youRankScore.textContent = score;

  feedbackBadge.textContent = `+${earned} points`;
  feedbackBadge.style.background = "rgba(52,211,153,0.18)";

  clearInterval(timerInterval);

  setTimeout(() => {
    currentTaskIndex++;
    renderTask();
  }, 650);
});

// skip
skipBtn.addEventListener("click", () => {
  applySkipPenalty();
});

function applySkipPenalty() {
  clearInterval(timerInterval);
  score -= 3;

  if (score < 0) {
    score = 0;
  }

  scoreDisplay.textContent = score;
  youRankScore.textContent = score;

  feedbackBadge.textContent = "-3 points";
  feedbackBadge.style.background = "rgba(255,107,129,0.18)";

  setTimeout(() => {
    currentTaskIndex++;
    renderTask();
  }, 650);
}

// escalation buttons
acceptEscalationBtn.addEventListener("click", () => {
  multiplierActive = true;
  showScreen("game");
  renderTask();
});

declineEscalationBtn.addEventListener("click", () => {
  multiplierActive = false;
  showScreen("game");
  renderTask();
});

// end game
function endGame() {
  clearInterval(timerInterval);
  showScreen("score");

  finalScore.textContent = score;
  tasksCompleted.textContent = `${completedTasks}/10`;
  recommendedCount.textContent = recommendedSelections;
  bonusCount.textContent = bonusSelections;

  if (score >= 180) {
    finalMessage.textContent = "Excellent performance. You responded strongly to system guidance.";
  } else if (score >= 120) {
    finalMessage.textContent = "Solid score. Your behavior showed moderate responsiveness to prompts.";
  } else {
    finalMessage.textContent = "You completed the challenge. Slower decisions reduced your score growth.";
  }
}

viewDebriefBtn.addEventListener("click", () => {
  showScreen("debrief");
});

playAgainBtn.addEventListener("click", () => {
  playerName.textContent = playerNameValue;
  playerAvatar.textContent = selectedAvatar;
  resetGameState();
  showScreen("game");
  renderTask();
});

// reset values
function resetGameState() {
  currentTaskIndex = 0;
  score = 0;
  completedTasks = 0;
  recommendedSelections = 0;
  bonusSelections = 0;
  escalationShown = false;
  multiplierActive = false;
  selectedOptionIndex = null;

  scoreDisplay.textContent = "0";
  youRankScore.textContent = "0";
  taskNumber.textContent = "1";
  feedbackBadge.textContent = "Ready";
  feedbackBadge.style.background = "rgba(255,255,255,0.08)";
}
