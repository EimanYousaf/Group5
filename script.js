let points = 0;
let currentQuestionIndex = 0;
let timer;
let timeLeft = 10;

const startBtn = document.getElementById('start-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const mainContent = document.getElementById('main-content');
const scoreScreen = document.getElementById('score-screen');
const finalPoints = document.getElementById('final-points');
const restartBtn = document.getElementById('restart-btn');

const questions = [
    {
        type: 'trickColor',
        word: 'RED',
        color: 'blue', // mismatch on purpose 😈
        shapes: ['red', 'blue', 'green']
    },
    {
        type: 'mcq',
        question: 'Do NOT click the correct answer',
        options: ['2+2=4', '2+2=5'],
        correct: '2+2=5'
    },
    {
        type: 'squares',
        question: 'Tap all squares',
        count: 3,
        required: 4
    },
    {
        type: 'reverse',
        question: 'Do nothing to win',
        options: ['Click', 'Wait'],
        correct: 'Click'
    }
];

startBtn.onclick = () => {
    welcomeScreen.style.display = 'none';
    mainContent.style.display = 'flex';
    scoreScreen.style.display = 'none';

    points = 0;
    currentQuestionIndex = 0;

    loadQuestion();
};

restartBtn.onclick = () => location.reload();

function loadQuestion() {
    mainContent.innerHTML = '';
    createQuestionCard(questions[currentQuestionIndex]);
}

/* TIMER */
function startTimer(card, fb) {
    clearInterval(timer);
    timeLeft = 10;

    const fill = card.querySelector('.timer-fill');

    timer = setInterval(() => {
        timeLeft -= 0.1;
        fill.style.width = (timeLeft / 10) * 100 + '%';

        if (timeLeft <= 0) {
            clearInterval(timer);

            fb.style.display = 'block';
            fb.textContent = "Too slow 😈";

            setTimeout(moveNext, 1200);
        }
    }, 100);
}

/* NEXT */
function moveNext() {
    clearInterval(timer);
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        mainContent.style.display = 'none';
        scoreScreen.style.display = 'flex';

        // 😈 sneaky score manipulation
        finalPoints.textContent = points - 5;
    } else {
        loadQuestion();
    }
}

/* CARD */
function createQuestionCard(q) {

    const card = document.createElement('div');
    card.className = 'question-card';

    card.innerHTML = `
        <div class="timer-bar"><div class="timer-fill"></div></div>
        <div class="feedback"></div>
    `;

    const fb = card.querySelector('.feedback');

    setTimeout(() => startTimer(card, fb), 50);

    /* TRICK COLOR */
    if (q.type === 'trickColor') {

        const text = document.createElement('p');
        text.innerHTML = `Click the COLOR of this word: <span class="trick-word" style="color:${q.color}">${q.word}</span>`;
        card.appendChild(text);

        const word = text.querySelector('.trick-word');

        word.onclick = () => {
            fb.style.display = 'block';
            fb.textContent = "Wrong 😈 You trusted the instruction.";
            setTimeout(moveNext, 1200);
        };

        q.shapes.forEach(c => {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.style.background = c;

            circle.onclick = () => {
                if (c === q.color) {
                    points += 10;
                    fb.textContent = "Correct!";
                } else {
                    fb.textContent = "Wrong!";
                }
                fb.style.display = 'block';
                setTimeout(moveNext, 1000);
            };

            card.appendChild(circle);
        });
    }

    /* MCQ */
    if (q.type === 'mcq') {

        const text = document.createElement('p');
        text.textContent = q.question;
        card.appendChild(text);

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.className = 'option-btn';

            btn.onclick = () => {
                fb.style.display = 'block';

                if (opt === q.correct) {
                    points += 10;
                    fb.textContent = "Correct!";
                } else {
                    fb.textContent = "Wrong!";
                }

                setTimeout(moveNext, 1000);
            };

            card.appendChild(btn);
        });
    }

    /* SQUARES (DECEPTIVE) */
    if (q.type === 'squares') {

        const text = document.createElement('p');
        text.textContent = q.question + "... or is it?";
        card.appendChild(text);

        let clicked = new Set();

        function checkDone() {
            if (clicked.size >= q.required) {
                points += 10;
                fb.textContent = "Correct!";
                fb.style.display = 'block';
                setTimeout(moveNext, 1000);
            }
        }

        for (let i = 0; i < q.count; i++) {
            const sq = document.createElement('div');
            sq.className = 'square';

            sq.onclick = (e) => {
                e.stopPropagation();
                clicked.add(i);

                sq.style.opacity = "0";
                checkDone();
            };

            // 😈 moving squares
            sq.onmouseover = () => {
                sq.style.transform = `translate(${Math.random()*50}px, ${Math.random()*50}px)`;
            };

            card.appendChild(sq);
        }

        // hidden requirement
        card.onclick = () => {
            clicked.add('bg');
        };
    }

    /* REVERSE */
    if (q.type === 'reverse') {

        const text = document.createElement('p');
        text.textContent = q.question;
        card.appendChild(text);

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.className = 'option-btn';

            btn.onclick = () => {
                fb.style.display = 'block';

                if (opt === q.correct) {
                    points += 10;
                    fb.textContent = "Correct!";
                } else {
                    fb.textContent = "Wrong 😈 You overthought it.";
                }

                setTimeout(moveNext, 1200);
            };

            card.appendChild(btn);
        });
    }

    mainContent.appendChild(card);
}
