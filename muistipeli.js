let score = 0;
const scoreDisplay = document.getElementById('score');

let timer = 0;
const timerDisplay = document.getElementById('timer');
let timerInterval;

let timerStarted = false;


const emojis = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍍', '🥝', '🍓'];
let cards = [...emojis, ...emojis]; // jokainen kahdesti
cards.sort(() => 0.5 - Math.random()); // satunnaista järjestys

const gameBoard = document.getElementById('gameBoard');
let flippedCards = [];
let lockBoard = false;

// Luo kortit
cards.forEach((emoji, index) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.emoji = emoji;
  card.dataset.index = index;

  const frontFace = document.createElement('div');
  frontFace.classList.add('front-face');
  frontFace.textContent = emoji;

  const backFace = document.createElement('div');
  backFace.classList.add('back-face');
  backFace.textContent = ''; // tai vaikka kuvio

  card.appendChild(frontFace);
  card.appendChild(backFace);

  card.addEventListener('click', handleCardClick);
  gameBoard.appendChild(card);
});


function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}


function handleCardClick(e) {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  const card = e.currentTarget;

  if (lockBoard || card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
      score++;
      scoreDisplay.textContent = score;

      if (score === emojis.length) {
        clearInterval(timerInterval);
        alert(`Voitit pelin ajassa ${timer} sekuntia!`);
      }

      flippedCards = [];
      lockBoard = false;
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }
  }
}

const resetButton = document.getElementById('resetButton');

function resetGame() {
  // Pysäytä ajastin
  clearInterval(timerInterval);

  // Nollaa pisteet ja aika
  score = 0;
  timer = 0;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timer;
  timerStarted = false;
  lockBoard = false;
  flippedCards = [];

  // Tyhjennä pelilauta
  gameBoard.innerHTML = '';

  // Sekoita kortit uudelleen
  cards = [...emojis, ...emojis];
  cards.sort(() => 0.5 - Math.random());

  // Luo kortit uudestaan
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;

    const frontFace = document.createElement('div');
    frontFace.classList.add('front-face');
    frontFace.textContent = emoji;

    const backFace = document.createElement('div');
    backFace.classList.add('back-face');
    backFace.textContent = '';

    card.appendChild(frontFace);
    card.appendChild(backFace);

    card.addEventListener('click', handleCardClick);
    gameBoard.appendChild(card);
  });
}

resetButton.addEventListener('click', resetGame);

const backButton = document.getElementById('backButton');
if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}
