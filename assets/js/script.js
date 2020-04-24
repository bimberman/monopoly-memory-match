/* ----------- Global Variable declaration ----------- */
//Game space
var cardContainerEle = document.getElementById("gameCards");
// Empty arrays to be filled with cards
var cards = [];
var cardsFront = [];
var cardsBack = [];

// All possible colors sets for the cards
// var setColors = ["purple", "light-blue", "magenta",
//                 "orange", "red", "yellow",
//                 "green", "dark-blue", "utility", "train"];

// Number of cards in the game
var numOfCards = 28;
// How many cards are in the set of the first card clicked
var cardsInSet;

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

// Rounds
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
//shuffleCards();
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
    cardsInSet = numOfCardsInSet(firstCardFront.getAttribute("data-set-color"));
  } else if (!secondCardClicked) {
    secondCardClicked = event.target;
    secondCardFront = secondCardClicked.previousElementSibling;
    if (cardsInSet===2){
      cardContainerEle.removeEventListener("click", handleClick);
      if (matchCards(cardsInSet, firstCardFront.getAttribute("data-set-color"),
                     secondCardFront.getAttribute("data-set-color"))) {
        resetRound(cardsInSet);
      } else {
        setTimeout(function(){unsuccessfulMatch(cardsInSet)}, 1500);
      }
    } else {
      return;
    }
  } else if (!thirdCardClicked) {
    thirdCardClicked = event.target;
    thirdCardFront = thirdCardClicked.previousElementSibling;
    if (cardsInSet === 3) {
      cardContainerEle.removeEventListener("click", handleClick);
      if (matchCards(cardsInSet, firstCardFront.getAttribute("data-set-color"),
                      secondCardFront.getAttribute("data-set-color"),
                      thirdCardFront.getAttribute("data-set-color"))) {
        resetRound(cardsInSet);
      } else {
        setTimeout(function(){unsuccessfulMatch(cardsInSet)}, 1500);
      }
    }
  } else if (!fourthCardClicked) {
    fourthCardClicked = event.target;
    fourthCardFront = fourthCardClicked.previousElementSibling;

    if (cardsInSet === 4) {
      cardContainerEle.removeEventListener("click", handleClick);
      if (matchCards(cardsInSet, firstCardFront.getAttribute("data-set-color"),
                      secondCardFront.getAttribute("data-set-color"),
                      thirdCardFront.getAttribute("data-set-color"),
                      fourthCardFront.getAttribute("data-set-color"))) {
        resetRound(cardsInSet);
      } else {
        setTimeout(function(){unsuccessfulMatch(cardsInSet)}, 1500);
      }
    }
  }
}

/* Evaluates the first card clicked to find
   out which card set he is a part of */
function numOfCardsInSet(cardSetColor){

  switch (cardSetColor){
    case "purple": return 2;
    case "light-blue": return 3;
    case "magenta": return 3;
    case "orange": return 3;
    case "red": return 3;
    case "yellow": return 3;
    case "green": return 3;
    case "dark-blue": return 2;
    case "utility": return 2;
    case "train": return 4;
  }

  return null;
}

/* check if there is a match between the cards in both
   permutations for all sets of two */
function matchCards(cardsInSet, card1SetColor, card2SetColor,
                    card3SetColor, card4SetColor){

  if (cardsInSet === 2){
    if (card1SetColor && card2SetColor){
      if (card1SetColor === card2SetColor){
        return true;
      }
    }
  } else if (cardsInSet === 3){
    if (card1SetColor && card2SetColor && card3SetColor) {
      if (card1SetColor === card2SetColor &&
          card1SetColor === card3SetColor) {
        return true;
      }
    }
  } else if (cardsInSet === 4) {
    if (card1SetColor && card2SetColor && card3SetColor && card4SetColor) {
      if (card1SetColor === card2SetColor &&
          card1SetColor === card3SetColor &&
          card1SetColor === card4SetColor) {
        return true;
      }
    }
  }

  return false;
}

/* In case of an unsuccessful match of cards restore
   the game state to its original state before this round
   (before the first click this round)*/
function unsuccessfulMatch(cardsInSet){

  switch (cardsInSet){
    case 2:
      firstCardClicked.classList.remove("hidden");
      secondCardClicked.classList.remove("hidden");
      firstCardClicked = null;
      secondCardClicked = null;
      break;
    case 3:
      firstCardClicked.classList.remove("hidden");
      secondCardClicked.classList.remove("hidden");
      thirdCardClicked.classList.remove("hidden");
      firstCardClicked = null;
      secondCardClicked = null;
      thirdCardClicked = null;
      break;
    case 4:
      firstCardClicked.classList.remove("hidden");
      secondCardClicked.classList.remove("hidden");
      thirdCardClicked.classList.remove("hidden");
      fourthCardClicked.classList.remove("hidden");
      firstCardClicked = null;
      secondCardClicked = null;
      thirdCardClicked = null;
      fourthCardClicked = null;
      break;
  }
  cardContainerEle.addEventListener("click", handleClick);
  attempts++;
  displayStats();
}

// Change the text in the relevant stats boxes
function displayStats(){
  gamesPlayedEle.textContent = gamesPlayed;
  attemptsEle.textContent = attempts;
  accuracyEle.textContent = calculateAccuracy(rounds, attempts);
}

// Calculates the accuracy of the player's matching
function calculateAccuracy(rounds, attempts){
  if(!attempts){
    return "0%";
  }
  return `${Math.floor((rounds / attempts) * 100)}%`;
}

/* After a successful match resets the variables from this round
   to prepare for the next round */
function resetRound(cardsInSet){
  switch (cardsInSet) {
    case 2:
      firstCardFront.classList.add("hidden");
      secondCardFront.classList.add("hidden");
      firstCardClicked = null;
      secondCardClicked = null;
      break;
    case 3:
      firstCardFront.classList.add("hidden");
      secondCardFront.classList.add("hidden");
      thirdCardFront.classList.add("hidden");
      firstCardClicked = null;
      secondCardClicked = null;
      thirdCardClicked = null;
      break;
    case 4:
      firstCardFront.classList.add("hidden");
      secondCardFront.classList.add("hidden");
      thirdCardFront.classList.add("hidden");
      fourthCardFront.classList.add("hidden");
      firstCardClicked = null;
      secondCardClicked = null;
      thirdCardClicked = null;
      fourthCardClicked = null;
      break;
  }

  cardContainerEle.addEventListener("click", handleClick);

  rounds++;
  attempts++;
  displayStats();
  if (rounds === maxRounds) {
    winModalEle.classList.remove("hidden");
  }
}

// Restores the game state to an original blank game with no inputs
// Also increases the game count by one
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

// Restores the back of the cards (un-hides them)
function resetCards(){
  let cardBacks = cardContainerEle.getElementsByClassName("card-back");
  for (let cardBacksIndex = 0; cardBacksIndex < cardBacks.length; cardBacksIndex++){
    cardBacks[cardBacksIndex].classList.remove("hidden");
  }
}

// Shuffle the cards
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

// Removes the cards from their parent container
function removeCards(){
  while (cardContainerEle.firstElementChild) {
    if (cardContainerEle.lastElementChild.id === "win-modal") {
      break;
    }
    cardContainerEle.removeChild(cardContainerEle.lastChild);
  }
}

// Adds cards to their parent container
function addCards(){
  if(!cards){
    console.log("No cards in the collection");
    return "No cards in the collection";
  }

  for (let cardIndex = 0; cardIndex < numOfCards; cardIndex++) {
    cardContainerEle.append(cards[cardIndex]);
  }
}

// Creates cards to be matched
function createCards(){
  if(cards || cardsFront || cardsBack){
    cards = [];
    cardsFront = [];
    cardsBack = [];
  }

  let setColor;

  for(let cardIndex = 0; cardIndex<numOfCards ; cardIndex++){
    cards.push(document.createElement("div"));
    cardsFront.push(document.createElement("div"));
    cardsBack.push(document.createElement("div"));

    cards[cardIndex].classList.add("card", "game-col2");
    cards[cardIndex].setAttribute("id", `card${cardIndex}`)

    cardsFront[cardIndex].classList.add("card-front", `card-front${cardIndex}`);
    cardsFront[cardIndex].style.backgroundImage = `url(./assets/images/slim_cards/slim_card_${cardIndex}.jpg)`;
    cardsFront[cardIndex].setAttribute("id", `card-front${cardIndex}`);

    switch (cardIndex){
      case 0: case 1: setColor="purple"; break;
      case 3: case 4: case 5: setColor = "light-blue"; break;
      case 6: case 8: case 9: setColor = "magenta"; break;
      case 11: case 12: case 13: setColor = "orange"; break;
      case 14: case 15: case 16: setColor = "red"; break;
      case 18: case 19: case 21: setColor = "yellow"; break;
      case 22: case 23: case 24: setColor = "green"; break;
      case 26: case 27: setColor = "dark-blue"; break;
      case 2: case 10: case 17: case 25: setColor = "train"; break;
      case 7: case 20: setColor = "utility"; break;
    }

    cardsFront[cardIndex].setAttribute("data-set-color", setColor);

    cardsBack[cardIndex].classList.add("card-back");
    cardsBack[cardIndex].setAttribute("id", `card-back${cardIndex}`);

    cards[cardIndex].appendChild(cardsFront[cardIndex]);
    cards[cardIndex].appendChild(cardsBack[cardIndex]);
  }
}
