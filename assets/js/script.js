/* ----------- Global Variable declaration ----------- */
//Game space
var cardContainerEle = document.getElementById("gameCards");
var cards = [];
var cardsFront = [];
var cardsBack = [];
var classNames = [  "css-logo" ,"docker-logo" ,"github-logo" ,
                    "html-logo" ,"js-logo" ,"mysql-logo" ,
                    "node-logo" ,"php-logo", "react-logo"
                  ]

// Card matching mechanics
var firstCardClicked;
var secondCardClicked;
var firstCardClasses;
var secondCardClasses;
var thirdCardClicked;
var thirdCardClasses;
var maxMatches = 10;
var matches = 0;

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
    firstCardClasses = firstCardClicked.previousElementSibling.classList.value;
  } else {
    secondCardClicked = event.target;
    secondCardClasses = secondCardClicked.previousElementSibling.classList.value;
    cardContainerEle.removeEventListener("click", handleClick);

    if (firstCardClasses === secondCardClasses) {
      cardContainerEle.addEventListener("click", handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
      matches++;
      attempts++;
      displayStats();
      if(matches===maxMatches){
        winModalEle.classList.remove("hidden");
      }
    } else {
      setTimeout(unhide, 1500);
    }
  }
}

function unhide(){
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
  accuracyEle.textContent = calculateAccuracy(matches, attempts);
}

function calculateAccuracy(matches, attempts){
  if(!attempts){
    return "0%";
  }
  return `${Math.floor((matches / attempts) * 100)}%`;
}

function resetGame(){
  gamesPlayed++;
  matches = 0;
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

  for (let cardIndex = 0; cardIndex < 18; cardIndex++) {
    cardContainerEle.append(cards[cardIndex]);
  }
}

function createCards(){
  if(cards || cardsFront || cardBacks){
    cards = [];
    cardsFront = [];
    cardsBack = [];
  }

  for(let cardIndex = 0; cardIndex<18 ; cardIndex++){
    cards.push(document.createElement("div"));
    cardsFront.push(document.createElement("div"));
    cardsBack.push(document.createElement("div"));

    cards[cardIndex].classList.add("card", "col-2");
    cards[cardIndex].setAttribute("id", `card${cardIndex}`)

    cardsFront[cardIndex].classList.add("card-front", `${classNames[cardIndex%9]}`);
    cardsFront[cardIndex].setAttribute("id", `card-front${cardIndex}`);

    cardsBack[cardIndex].classList.add("card-back");
    cardsBack[cardIndex].setAttribute("id", `card-back${cardIndex}`);

    cards[cardIndex].appendChild(cardsFront[cardIndex]);
    cards[cardIndex].appendChild(cardsBack[cardIndex]);
  }
}
