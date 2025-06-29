
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
  const randNum = Math.random();
  if (randNum >= 0.5) { return "black" }
  return "red";
}

function getRandomSuits() {
  const randNum = getRandomNum(1, 4);
  switch (randNum) {
    case 1: return "suit-heart";
    case 2: return "suit-diamond";
    case 3: return "suit-club";
    case 4: return "suit-spade";
  }
}

function convertNum(num) {
  switch(num) {
    case 1:   return 'A';
    case 11:  return 'J';
    case 12:  return 'Q';
    case 13:  return 'K';
    case 'A': return 1;
    case 'J': return 11;
    case 'Q': return 12;
    case 'K': return 13;
    default:  return num;
  }
}

function createCard(num, suit, color) {
  num = convertNum(num)

  return {
    number: num, 
    suit: suit, 
    color: color
  };
}

function drawCards(num, list = [], i = 0) {
  for (i; i < num; i++) {    
    if (list.length == num) {
      break;
    }

    const cardNum = getRandomNum(1, 14);
    const card = createCard(cardNum, getRandomSuits(), getRandomColor());

    const isRepeated = (c) => JSON.stringify(c) === JSON.stringify(card);

    if (list.some(isRepeated)) { drawCards(num, list, i)} 
    else { list.push(card) }
  }

  return list;
}

function structureCard(card) {
  const cardDiv          = document.createElement("div");
  const leftTopCornerDiv = document.createElement("div");
  const centerDiv        = document.createElement("div");
  const rightBottomDiv   = document.createElement("div");
  const numDiv           = document.createElement("div");
  const icon             = document.createElement( "i" );
  
  cardDiv.className          = "card";
  leftTopCornerDiv.className = "left-top-corner";
  centerDiv.className        = "center";
  rightBottomDiv.className   = "right-bottom-corner";
  numDiv.className           = "num";
  icon.className             = `bi bi-${card['suit']}-fill`;
  
  cardDiv.style.color = card['color'];
  numDiv.innerText = card['number'];
  
  leftTopCornerDiv.append(numDiv.cloneNode(true), icon.cloneNode());
  centerDiv.appendChild(icon.cloneNode());
  rightBottomDiv.append(icon.cloneNode(), numDiv.cloneNode(true));
  cardDiv.append(leftTopCornerDiv, centerDiv, rightBottomDiv);

  return cardDiv;
}

function removeChildren(container) {
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }
}

function renderCards(cards) {
  const cardsContainer = document.querySelector(".cards-container");

  removeChildren(cardsContainer);

  for (const card of cards) {
    const cardDiv = structureCard(card);
    cardsContainer.appendChild(cardDiv);
  }
}

function renderSortedCards(changes) {
  const sortedContainer = document.querySelector(".sorted-container");
  
  removeChildren(sortedContainer);
  
  for (const cards of changes) {
    const changeContainer = document.createElement("div");
    changeContainer.className = "change-container";

    for (const card of cards) {
      const cardDiv = structureCard(card);
      changeContainer.appendChild(cardDiv);
    }

    sortedContainer.appendChild(changeContainer);
  }
}

function sortingBubble(cards) {
  let changes = [];
  let aux = 0;
  let swapped = false;
  
  for (let i = 0; i < cards.length - 1; i++) {
    for (let j = 0; j < cards.length - i - 1; j++){
      
      const jNumber = convertNum(cards[j].number);
      const jPlusNumber = convertNum(cards[j + 1].number);

      if (jNumber > jPlusNumber) {
        aux = cards[j];
        cards[j] = cards[j + 1];
        cards[j + 1] = aux;
        changes.push(cards.slice(0));
        swapped = true;
      }
    }
    if (swapped === false) {
      break;
    }
  }
  return changes;
}

window.onload = function() {
  const drawBtn         = document.querySelector(".btn-primary");
  const sortBtn         = document.querySelector(".btn-secondary");
  const input           = document.querySelector("#number");
  
  sortBtn.disabled = true;

  let nCards = input.innerHTML;
  let cards  = [];
  
  input.addEventListener("change", (e) => {
    nCards = e.target.value;
  })
  
  drawBtn.addEventListener("click", (e) => {
    e.preventDefault();

    cards = drawCards(nCards);
    renderCards(cards);

    sortBtn.disabled = false;
  })
  
  sortBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const changes = sortingBubble(cards);
    renderSortedCards(changes)

    sortBtn.disabled = true;
  })
};
