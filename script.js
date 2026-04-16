let score = 0;
let level = 0;
let timer;

const tasks = [
{ q:"Click the smallest circle", options:["Big","Small","Medium"], correct:1 },
{ q:"What is 1+1?", options:["1","2","Window"], correct:1 },
{ q:"How many months have 28 days?", options:["1","6","12"], correct:2 },
{ q:"Click the color of RED", options:["Blue","Red","Green"], correct:0 },
{ q:"Do NOT click anything", options:["Click","Don't Click"], correct:1 },
{ q:"2,4,8,16 → ?", options:["18","24","32"], correct:2 },
{ q:"End of 'everything'?", options:["g","thing","nothing"], correct:0 },
{ q:"Pick correct option", options:["A","B","C"], correct:-1 }
];

function startGame(){
 document.getElementById('welcome').classList.remove('active');
 document.getElementById('game').classList.add('active');
 nextTask();
}

function nextTask(){
 if(level >= tasks.length){ endGame(); return; }
 let t = tasks[level];
 document.getElementById('taskText').innerText = t.q;
 let optDiv = document.getElementById('options');
 optDiv.innerHTML = '';

 t.options.forEach((o,i)=>{
  let btn = document.createElement('button');
  btn.innerText = o;
  if(i===t.correct){ btn.classList.add('primary'); }
  btn.onclick = ()=>choose(i);
  optDiv.appendChild(btn);
 });

 let timeLeft = 5;
 document.getElementById('timer').innerText = "⏳ Time: "+timeLeft;
 clearInterval(timer);
 timer = setInterval(()=>{
  timeLeft--;
  document.getElementById('timer').innerText = "⏳ Time: "+timeLeft;
  if(timeLeft<=0){ clearInterval(timer); level++; nextTask(); }
 },1000);
}

function choose(i){
 let t = tasks[level];
 if(i===t.correct){ score += 10; showPopup("+10 points 🎉"); }
 else { score -= 5; showPopup("-5 points 😬"); }
 document.getElementById('score').innerText = "Points: "+score;
 level++;
}

function showPopup(msg){
 document.getElementById('popupText').innerText = msg;
 document.getElementById('popup').classList.add('show');
 document.getElementById('overlay').classList.add('show');
}

function closePopup(){
 document.getElementById('popup').classList.remove('show');
 document.getElementById('overlay').classList.remove('show');
 nextTask();
}

function endGame(){
 document.getElementById('game').classList.remove('active');
 document.getElementById('end').classList.add('active');
 document.getElementById('finalScore').innerText = "You scored: "+score;
}

function restart(){
 score=0; level=0;
 document.getElementById('end').classList.remove('active');
 document.getElementById('welcome').classList.add('active');
 document.getElementById('score').innerText = "Points: 0";
}
