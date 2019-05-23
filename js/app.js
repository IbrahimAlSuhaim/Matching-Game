/*
 * Create a list that holds all of your cards
 */
const cards=document.querySelectorAll('.card');
const cardArr=[];

document.querySelector('.restart').addEventListener('click',function(){
  window.location.reload();
});

for(let card of cards){
  cardArr.push(card);
}

 /*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const shuffeled=shuffle(cardArr);
deck=document.querySelector('.deck');

for(let i=0; i<cardArr.length;i++){
  deck.appendChild(cardArr[i]);
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
const t1=performance.now(); //Starting count time


function toggleSymbol(card){ // show and hide symbols
  card.style.transform="rotateY(360deg)";
  card.classList.toggle("open");
  card.classList.toggle("show");
}

const tmpOpened=[];
let counter=0;
let nbStar=3;
function toOpen(card){

  tmpOpened.push(card);
  if(tmpOpened.length==2){
    if(tmpOpened[0].firstElementChild.className==tmpOpened[1].firstElementChild.className){ //check if two cards match
      doMatch(tmpOpened[0],tmpOpened[1]);
    }
    else{
      notMatch(tmpOpened[0],tmpOpened[1]);
    }
    tmpOpened.pop();
    tmpOpened.pop();
    counter++;
    if (counter==10) {
      nbStar--;
    }
    if (counter==15) {
      nbStar--;
    }
  }

}

function notMatch(card1,card2){
  toggleSymbol(card1);
  toggleSymbol(card2);
  card1.classList.toggle("not-match");
  card2.classList.toggle("not-match");
  shake(card1,card2);
  setTimeout(function(){
    card1.classList.toggle("not-match");
    card2.classList.toggle("not-match");
    card1.addEventListener('click',clicked(card1));
    card2.addEventListener('click',clicked(card2));
  },800);
}

function shake(card1,card2){
   card1.style.transform="rotate(20deg)";
   card2.style.transform="rotate(20deg)";
   setTimeout(function(){
     card1.style.transform="rotate(-20deg)";
     card2.style.transform="rotate(-20deg)";
     setTimeout(function(){
       card1.style.transform="rotate(20deg)";
       card2.style.transform="rotate(20deg)";
       setTimeout(function(){
         card1.style.transform="rotate(0deg)";
         card2.style.transform="rotate(0deg)";
       },200);
     },300);

   },200);



}
const opened=[];
function doMatch(card1,card2){
  card1.className="card match";
  card2.className="card match";
  opened.push(card1);
  opened.push(card2);
}


function displayCounter(){ //method that displays the counter and decreases the star if exceeds some range of moves
  const moves=document.querySelector('.moves');
  moves.innerHTML=counter;
  if(counter==10){ //decrease one star
    document.querySelector('.stars').innerHTML='<li><i class="fas fa-star"></i></li><li><i class="fas fa-star"></i></li><li><i class="far fa-star"></i></li>'
  }
  if(counter==15){ //decrease one star
    document.querySelector('.stars').innerHTML='<li><i class="fas fa-star"></i></li><li><i class="far fa-star"></i></li><li><i class="far fa-star"></i></li>'
  }

  if(opened.length==16){ // if the player finish the game
    let t2=performance.now();
    const t=(t2-t1)/1000;
    const cTime=t.toFixed(1);
    document.querySelector('.container').innerHTML='<div class="finish"><i class="fas fa-check fa-4x" style="color:#80c95a"></i><h1>Congratulation! You Won!</h1><p>with '+counter+' Moves and '+nbStar+' Stars <br>Consumed time: '+cTime+'s</p><button class="btn btn-success" OnClick="window.location.reload()">Play Again?</button></div>';
  }
}

setInterval(function(){ //display time
  let t2=performance.now();
  const t=(t2-t1)/1000;
  const cTime=t.toFixed(1);
  document.querySelector('.time').innerText=cTime+'Sec';
},1000);


for(let i=0;i<cards.length;i++){ // add listeners to all cards
  cards[i].addEventListener('click',clicked(cards[i]));
}

function clicked(card){
   var handeler =function(){
      card.removeEventListener('click',handeler);
      toggleSymbol(card);
      toOpen(card);
      displayCounter();
   }
   return handeler;
}
