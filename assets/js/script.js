/* ----------- Global Variable declaration ----------- */
//Game space
var cardContainerEle = document.getElementById("gameCards");
// Empty arrays to be filled with cards
var cards = [];
var cardsFront = [];
var cardsBack = [];

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

// The model which will inform the user they have won
var winModelEle = document.getElementById("win-model");
var attempts = 0;
var gamesPlayed = 0;

// The tutorial model
var tutorialModalEle = document.getElementById("tutorial-model");

// Stats column elements
var gamesPlayedEle = document.getElementById("games-played");
var attemptsEle = document.getElementById("attempts");
var accuracyEle = document.getElementById("accuracy");

// Completed sets column
var setColors = document.getElementsByClassName("completed-card");

// Game reset mechanics
var resetButtonEle = document.getElementById("reset-button");

// Hide the tutorial model
var tutorialButtonEle = document.getElementById("tutorial-button");

const colorOptions = {
  "purple": 2,
  "light-blue": 3,
  "magenta": 3,
  "orange": 3,
  "red": 3,
  "yellow": 3,
  "green": 3,
  "dark-blue": 2,
  "utility": 2,
  "train": 4
}

/* ----------- function calls ----------- */
createCards();
// shuffleCards();
addCards();

/*----------- Event Listeners -----------*/
// Event listener for a click on a card
cardContainerEle.addEventListener("click", handleClick);
// Event listener to reset the game
resetButtonEle.addEventListener("click", resetGame);
// Event listener to hide the model
tutorialButtonEle.addEventListener("click", function () { fade(tutorialModalEle)})

/*----------- Functions -----------*/
// Handles the click on the cards
function handleClick(event){

  if (event.target.className.indexOf("card-back") === -1) {
    return;
  }

  event.target.classList.add("hidden");
  // check how many cards were clicked prior to this card
  if (!firstCardClicked) {
    // No card was clicked before this one
    firstCardClicked = event.target;
    firstCardFront = firstCardClicked.previousElementSibling;
    cardsInSet = numOfCardsInSet(firstCardFront.getAttribute("data-set-color"));
  } else if (!secondCardClicked) {
    // Only one card was clicked before this one
    secondCardClicked = event.target;
    secondCardFront = secondCardClicked.previousElementSibling;
    // check if there are 2 cards in a set
    if (cardsInSet===2){
      // Disables more clicks until check is complete
      cardContainerEle.removeEventListener("click", handleClick);
      // checks if both cards are part of the same set
      if (matchCards(cardsInSet,
                     firstCardFront.getAttribute("data-set-color"),
                     secondCardFront.getAttribute("data-set-color"))) {
        setTimeout(function(){resetRound(cardsInSet)}, 1500);
        showCompletedSet(firstCardFront.getAttribute("data-set-color"));
      } else {
        setTimeout(function(){unsuccessfulMatch(cardsInSet)}, 1500);
      }
    } else if (matchCards(2,
               firstCardFront.getAttribute("data-set-color"),
               secondCardFront.getAttribute("data-set-color"))) {
      // The first card clicked might not be part of a set of two cards
      /* This block checks to see if the two cards clicked are part of the
         same set regardless of their set size */
      return;
    } else {
      cardContainerEle.removeEventListener("click", handleClick);
      setTimeout(function () { unsuccessfulMatch(2) }, 1500);
    }
  } else if (!thirdCardClicked) {
    // Only two card were clicked before this one
    thirdCardClicked = event.target;
    thirdCardFront = thirdCardClicked.previousElementSibling;
    if (cardsInSet === 3) {
      cardContainerEle.removeEventListener("click", handleClick);
      if (matchCards(cardsInSet, firstCardFront.getAttribute("data-set-color"),
                      secondCardFront.getAttribute("data-set-color"),
                      thirdCardFront.getAttribute("data-set-color"))) {
        setTimeout(function () { resetRound(cardsInSet) }, 1500);
        showCompletedSet(firstCardFront.getAttribute("data-set-color"));
      } else {
        setTimeout(function(){unsuccessfulMatch(cardsInSet)}, 1500);
      }
    } else if (matchCards(3,
      firstCardFront.getAttribute("data-set-color"),
      secondCardFront.getAttribute("data-set-color"),
      thirdCardFront.getAttribute("data-set-color"))) {
      // The first card clicked might not be part of a set of two cards
      /* This block checks to see if the two cards clicked are part of the
         same set regardless of their set size */
      return;
    } else {
      cardContainerEle.removeEventListener("click", handleClick);
      setTimeout(function () { unsuccessfulMatch(3) }, 1500);
    }
  } else if (!fourthCardClicked) {
    // Only three card were clicked before this one
    fourthCardClicked = event.target;
    fourthCardFront = fourthCardClicked.previousElementSibling;

    if (cardsInSet === 4) {
      cardContainerEle.removeEventListener("click", handleClick);
      if (matchCards(cardsInSet, firstCardFront.getAttribute("data-set-color"),
                      secondCardFront.getAttribute("data-set-color"),
                      thirdCardFront.getAttribute("data-set-color"),
                      fourthCardFront.getAttribute("data-set-color"))) {
        setTimeout(function () { resetRound(cardsInSet) }, 1500);
        showCompletedSet(firstCardFront.getAttribute("data-set-color"));
      } else {
        setTimeout(function(){unsuccessfulMatch(cardsInSet)}, 1500);
      }
    }
  }
}

function hideCompletedSets(){
  var setElements = document.getElementsByClassName("completed-card");

  for (let eleIndex = 0; eleIndex < setElements.length; eleIndex++) {
    setElements[eleIndex].classList.add("hidden");
  }
}

function showCompletedSet(setColor) {
  var setElements = document.getElementsByClassName(setColor);

  for(let eleIndex=0; eleIndex<setElements.length ; eleIndex++){
    setElements[eleIndex].classList.remove("hidden");
  }
}

/* In case of an unsuccessful match of cards restore
   the game state to its original state before this round
   (before the first click this round)*/
function unsuccessfulMatch(num){

  switch (num){
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
    winModelEle.classList.remove("hidden");
  }
}


/* Evaluates the first card clicked to find
   out which card set he is a part of */
function numOfCardsInSet(cardSetColor) {

  if(colorOptions[cardSetColor]) {
    return colorOptions[cardSetColor]
  }

  return null;
}

/* check if there is a match between the cards in both
   permutations for all sets of two */
function matchCards(cardsInSet, card1SetColor, card2SetColor,
  card3SetColor, card4SetColor) {

  if (cardsInSet === 2) {
    if (card1SetColor && card2SetColor) {
      if (card1SetColor === card2SetColor) {
        return true;
      }
    }
  } else if (cardsInSet === 3) {
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
  hideCompletedSets();
  winModelEle.classList.add("hidden");
}

// Restores the back of the cards (un-hides them)
function resetCards(){
  let cardBacks = cardContainerEle.getElementsByClassName("card-back");
  let cardFronts = cardContainerEle.getElementsByClassName("card-front");
  for (let cardIndex = 0; cardIndex < cardBacks.length; cardIndex++){
    cardBacks[cardIndex].classList.remove("hidden");
    cardFronts[cardIndex].classList.remove("hidden");
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
    if (cardContainerEle.lastElementChild.id === "win-model") {
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

function fade(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= op * 0.1;
  }, 50);
}

function unfade(element) {
  var op = 0.1;  // initial opacity
  element.style.display = 'block';
  var timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op += op * 0.1;
  }, 10);
}
