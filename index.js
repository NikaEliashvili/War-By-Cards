const newDeckBtn = document.getElementById("newDeck-btn");
const drawCardBtn = document.getElementById("draw-btn");
const cardsSection = document.getElementById("cards-section");
const cardContainer1 = document.getElementById("card-container1");
const cardContainer2 = document.getElementById("card-container2");
const warningContainer = document.getElementById("warning");
const remainingText = document.getElementById("remaining-text");
const cardsSectionChild1 = cardsSection.children[0];
const cardsSectionChild2 = cardsSection.children[1];
const cardsSectionChild3 = cardsSection.children[2];
const cardsSectionChild4 = cardsSection.children[3];
const cardsSectionChild5 = cardsSection.children[4];
let card1Score = 0;
let card2Score = 0;

const cardsArray = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "JACK",
  "QUEEN",
  "KING",
  "ACE",
];
function cardsScoreHTML() {
  cardsSectionChild2.textContent = `Computer: ${card1Score}`;
  cardsSectionChild5.textContent = `Me: ${card2Score}`;
}
cardsScoreHTML();
warningAlert();
drawCardBtn.disabled = true;

let deckId;
function handleClick() {
  fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    .then((res) => res.json())
    .then((data) => {
      deckId = data.deck_id;
      drawCardBtn.disabled = false;
      remainingText.innerHTML = `Remaining Cards:<p id="remaining-cards">52</p>`;
      warningContainer.classList.add("visible");
      card1Score = 0;
      card2Score = 0;
      cardsScoreHTML();
      console.log(data);
    });
}

newDeckBtn.addEventListener("click", handleClick);
drawCardBtn.addEventListener("click", () => {
  const remainingCards = document.getElementById("remaining-cards");
  cardsSectionChild1.classList.remove("whowins");
  remainingCards.classList.remove("remaining-number");
  fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const card1 = data.cards[0];
        const card2 = data.cards[1];
        cardsSectionChild1.classList.add("whowins");
        cardsSectionChild1.classList.remove("warning");
        if (card1Score === 0 && card2Score)
          document.getElementById("loser-gif").classList.add("visible");
        document.getElementById("winner-gif").classList.add("visible");
        remainingCards.textContent = data.remaining;
        remainingCards.classList.add("remaining-number");
        cardsSectionChild1.textContent = "";
        let imageUrl1 = data.cards[0].image;
        let imageUrl2 = data.cards[1].image;
        cardsSectionChild3.innerHTML = `<img src="${imageUrl1}" alt="Card" />`;
        cardsSectionChild4.innerHTML = `<img src="${imageUrl2}" alt="Card" />`;
        cardsSectionChild1.textContent = determineCardsWinner(card1, card2);
        let scoresSubtract = card1Score - card2Score;
        if (scoresSubtract < 0) {
          scoresSubtract = scoresSubtract * -1;
        }
        console.log(scoresSubtract);
        if (data.remaining === 0 || data.remaining / 2 < scoresSubtract) {
          if (card1Score > card2Score) {
            cardsSectionChild1.innerHTML = `<p class="winner-reverse">Computer Won The Game</p>`;
            document.getElementById("loser-gif").classList.remove("visible");
          } else if (card1Score < card2Score) {
            cardsSectionChild1.innerHTML = `<p class="winner">You Won The Game</p>`;
            document.getElementById("winner-gif").classList.remove("visible");
          } else cardsSectionChild1.textContent = `It's Tie`;
          drawCardBtn.disabled = true;
        }
      } else {
        warningAlert();
      }
    });
});

function warningAlert() {
  warningContainer.classList.remove("visible");
  // setTimeout(() => {
  //   warningContainer.classList.add("visible");
  // }, 3500);
}

function determineCardsWinner(card1, card2) {
  const card1Val = cardsArray.indexOf(card1.value);
  const card2Val = cardsArray.indexOf(card2.value);

  if (card1Val > card2Val) {
    card1Score++;
    cardsSectionChild2.innerHTML = `Computer: <p class="score-number">${card1Score}</p>`;
    return `Computer Wins`;
  } else if (card1Val < card2Val) {
    card2Score++;
    cardsSectionChild5.innerHTML = `Me: <p class="score-number">${card2Score}</p>`;
    return `You win`;
  } else return "War";
}
