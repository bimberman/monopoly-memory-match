/* ----------- Global Variable declaration ----------- */
//Game space
var cardContainerEle = document.getElementById("gameCards");
var cards = [];
var cardsFront = [];
var cardsBack = [];
var pairSet = [ "card-front0", "card-front1", "card-front7",
                  "card-front20", "card-front27", "card-front28"];
var tripleSet = ["card-front3", "card-front4", "card-front5",
                 "card-front6", "card-front8", "card-front9",
                 "card-front11", "card-front12", "card-front13",
                 "card-front14", "card-front15", "card-front16",
                 "card-front18", "card-front19", "card-front21",
                 "card-front22", "card-front23", "card-front24"]
var quadSet = ["card-front2", "card-front10", "card-front17", "card-front26"];
var numOfCards = 28;
var numOfCardsInSet;

// Card matching mechanics
var firstCardClicked;
var secondCardClicked;
var thirdCardClicked;
var fourthCardClicked;

// The card clicked is the back of the card and a sibling to the front
var firstCardFront;
var secondCardFront;
var thirdCardFront;
var fourthCardFront;

var maxRounds = 10;
var rounds = 0;

// The modal which will inform the user they have won
var winModalEle = document.getElementById("win-modal");
var attempts = 0;
var gamesPlayed = 0;

// Stats column elements
var gamesPlayedEle = document.getElementById("games-played");
var attemptsEle = document.getElementById("attempts");
var accuracyEle = document.getElementById("accuracy");

// Game reset mechanics
var resetButtonEle = document.getElementById("reset-button");

/* ----------- function calls ----------- */
createCards();
shuffleCards();
addCards();

/*----------- Event Listeners -----------*/
// Event listener for a click on a card
cardContainerEle.addEventListener("click", handleClick);
//Event listener to reset the game
resetButtonEle.addEventListener("click", resetGame);

/*----------- Functions -----------*/
// Handles the click on the cards
function handleClick(event){

  if (event.target.className.indexOf("card-back") === -1) {
    return;
  }

  event.target.classList.add("hidden");
  if (!firstCardClicked) {
    firstCardClicked = event.target;
    firstCardFront = firstCardClicked.previousElementSibling;
    numOfCardsInSet = cardsInSet(firstCardFront.id);
  } else if (!secondCardClicked) {
    secondCardClicked = event.target;
    secondCardFront = secondCardClicked.previousElementSibling;
    if (numOfCardsInSet===2){
      cardContainerEle.removeEventListener("click", handleClick);
      if (match2(firstCardFront.id, secondCardFront.id)) {
        resetRound();
      } else {
        setTimeout(unsuccessfulMatch, 1500);
      }
    } else {
      return;
    }
  } else if (!thirdCardClicked) {
    thirdCardClicked = event.target;
    thirdCardFront = thirdCardClicked.previousElementSibling;
    if (numOfCardsInSet === 3) {
      cardContainerEle.removeEventListener("click", handleClick);
      if (match3(firstCardClicked.id, secondCardClicked.id, thirdCardClicked.id)) {
        resetRound();
      } else {
        setTimeout(unsuccessfulMatch, 1500);
      }
    } else if (numOfCardsInSet === 2){
      cardContainerEle.removeEventListener("click", handleClick);
      setTimeout(unsuccessfulMatch, 1500);
      } else {
      return;
    }
  } else if (!fourthCardClicked) {
    fourthCardClicked = event.target;
    fourthCardFront = fourthCardClicked.previousElementSibling;

    if (cardsInSet() === 4) {
      cardContainerEle.removeEventListener("click", handleClick);
      if (match4(firstCardClicked.id, secondCardClicked.id, thirdCardClicked.id, fourthCardClicked.id)) {
        resetRound();
      } else {
        setTimeout(unsuccessfulMatch, 1500);
      }
    } else {

    }
  }
}

function cardsInSet(cardID){

  if (!cardID){
    return 0;
  }

  for (let cardIndex = 0; cardIndex < pairSet.length; cardIndex++){
    if (cardID === pairSet[cardIndex]){
      return 2;
    }
  }

  for (let cardIndex = 0; cardIndex < quadSet.length; cardIndex++) {
    if (cardID === quadSet[cardIndex]) {
      return 4;
    }
  }

  return 3;
}

function match2(cardID1, cardID2){

  if ((cardID1 === cardPairs[0] && cardID2 === cardPairs[1]) | (cardID1 === cardPairs[1] && cardID2 === cardPairs[0])){
    return true;
  }

  if ((cardID1 === cardPairs[2] && cardID2 === cardPairs[3]) | (cardID1 === cardPairs[3] && cardID2 === cardPairs[2])) {
    return true;
  }

  if ((cardID1 === cardPairs[4] && cardID2 === cardPairs[5]) | (cardID1 === cardPairs[5] && cardID2 === cardPairs[4])) {
    return true;
  }
}

function match3(cardID1, cardID2, cardID3) {

  // if(card1)

}

function match4(cardID1, cardID2, cardID3, cardID4) {

  // if(card1)

}

function unsuccessfulMatch(){
  firstCardClicked.classList.remove("hidden");
  secondCardClicked.classList.remove("hidden");
  cardContainerEle.addEventListener("click", handleClick);
  firstCardClicked = null;
  secondCardClicked = null;
  attempts++;
  displayStats();
}

function displayStats(){
  gamesPlayedEle.textContent = gamesPlayed;
  attemptsEle.textContent = attempts;
  accuracyEle.textContent = calculateAccuracy(rounds, attempts);
}

function calculateAccuracy(rounds, attempts){
  if(!attempts){
    return "0%";
  }
  return `${Math.floor((rounds / attempts) * 100)}%`;
}

function resetRound(){
  cardContainerEle.addEventListener("click", handleClick);
  firstCardClicked = null;
  secondCardClicked = null;
  rounds++;
  attempts++;
  displayStats();
  if (rounds === maxRounds) {
    winModalEle.classList.remove("hidden");
  }
}

function resetGame(){
  gamesPlayed++;
  rounds = 0;
  attempts = 0;
  displayStats();
  resetCards();
  removeCards();
  shuffleCards();
  addCards();
  winModalEle.classList.add("hidden");
}

function resetCards(){
  let cardBacks = cardContainerEle.getElementsByClassName("card-back");
  for (let cardBacksIndex = 0; cardBacksIndex < cardBacks.length; cardBacksIndex++){
    cardBacks[cardBacksIndex].classList.remove("hidden");
  }
}

function shuffleCards(){
  let currentIndex = cards.length;
  let tempValue;
  let randomIndex;

  while(0!==currentIndex){
    randomIndex = Math.floor(Math.random()*currentIndex);
    currentIndex--;

    tempValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = tempValue;
  }
}

function removeCards(){
  while (cardContainerEle.firstElementChild) {
    if (cardContainerEle.lastElementChild.id === "win-modal") {
      break;
    }
    cardContainerEle.removeChild(cardContainerEle.lastChild);
  }
}

function addCards(){
  if(!cards){
    console.log("No cards in the collection");
    return "No cards in the collection";
  }

  for (let cardIndex = 0; cardIndex < numOfCards; cardIndex++) {
    cardContainerEle.append(cards[cardIndex]);
  }
}

function createCards(){
  if(cards || cardsFront || cardsBack){
    cards = [];
    cardsFront = [];
    cardsBack = [];
  }

  for(let cardIndex = 0; cardIndex<numOfCards ; cardIndex++){
    cards.push(document.createElement("div"));
    cardsFront.push(document.createElement("div"));
    cardsBack.push(document.createElement("div"));

    cards[cardIndex].classList.add("card", "game-col2");
    cards[cardIndex].setAttribute("id", `card${cardIndex}`)

    cardsFront[cardIndex].classList.add("card-front", `card-front${cardIndex}`);
    cardsFront[cardIndex].style.backgroundImage = `url(./assets/images/slim_cards/slim_card_${cardIndex}.jpg)`;
    cardsFront[cardIndex].setAttribute("id", `card-front${cardIndex}`);

    cardsBack[cardIndex].classList.add("card-back");
    cardsBack[cardIndex].setAttribute("id", `card-back${cardIndex}`);

    cards[cardIndex].appendChild(cardsFront[cardIndex]);
    cards[cardIndex].appendChild(cardsBack[cardIndex]);
  }
}
