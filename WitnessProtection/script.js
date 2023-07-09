
let cards = [
  {image: 'mustache.png', points: 1, cost: 1, type: 'floppy', text: 'Redraw cards', function: 'redrawCards'},
  {image: 'glasses.png', points: 1, cost: 0, type: 'floppy', text: '', function: null},
  {image: 'bowtie.png', points: 0, cost: 0, type: 'floppy', text: 'Redraw cards', function: 'redrawCards'},
  {image: 'wig.png', points: 2, cost: 1, type: 'floppy', text: '', function: null},
  {image: 'mustache.png', points: 1, cost: 1, type: 'floppy', text: '', function: null},
  {image: 'nose.png', points: 1, cost: 1, type: 'floppy', text: '', function: null},
  {image: 'wig.png', points: 3, cost: 1, type: 'floppy', text: '', function: null},
  {image: 'bowtie.png', points: 3, cost: 1, type: 'floppy', text: '', function: null},
  {image: 'hat.png', points: 4, cost: 2, type: 'floppy', text: '', function: null},
  {image: 'mustache.png', points: 8, cost: 3, type: 'floppy', text: '', function: null},
  {image: 'glasses.png', points: 1, cost: 2, type: 'floppy', text: '2x score + redraw', function: 'doubleRedraw'},
  {image: 'nose.png', points: 3, cost: 0, type: 'floppy', text: 'Decrease goal by 4', function: 'modifyTarget', functionArgs: ['increase', 4]},
  {image: 'mustache.png', points: 6, cost: 2, type: 'floppy', text: 'Decrease goal by 3', function: 'modifyTarget', functionArgs: ['increase', 3]},
  {image: 'nose.png', points: 5, cost: 1, type: 'floppy', text: 'Increase goal by 1', function: 'modifyTarget', functionArgs: ['increase', 1]},
  {image: 'mustache.png', points: 0, cost: 1, type: 'cd', text: 'Decrease goal by 2', function: 'modifyTarget', functionArgs: ['decrease', 2]},
  {image: 'glasses.png', points: 2, cost: 1, type: 'cd', text: '', function: null},
  {image: 'wig.png', points: 2, cost: 1, type: 'cd', text: '', function: null},
  {image: 'bowtie.png', points: 3, cost: 2, type: 'cd', text: 'Redraw cards', function: 'redrawCards'},
  {image: 'hat.png', points: 4, cost: 2, type: 'cd', text: '', function: null},
  {image: 'nose.png', points: 5, cost: 2, type: 'cd', text: '', function: null},
  {image: 'hat.png', points: 6, cost: 3, type: 'cd', text: '', function: null},
  {image: 'glasses.png', points: 6, cost: 2, type: 'cd', text: 'Decrease goal by 2', function: 'modifyTarget', functionArgs: ['decrease', 3]},
  // {image: null, points: 1, cost: 1, type: 'floppy', text: 'Decrease random card by 1', function: 'decreaseCardCost', functionArgs: ['random', 1]},
  {image: 'bowtie.png', points: 0, cost: 1, type: 'floppy', text: 'Double score', function: 'doubleScore'},
  {image: 'wig.png', points: 2, cost: 2, type: 'floppy', text: 'Decrease goal by 1', function: 'modifyTarget', functionArgs: ['decrease', 1]},
  // {image: null, points: 0, cost: 3, type: 'cd', text: 'Make a random card cost 0', function: 'decreaseCardCost', functionArgs: ['random', 10]},
  // {image: 'nose.png', points: 0, cost: 0, type: 'cd', text: 'Increase random card by 2', function: 'increaseCardPoints', functionArgs: ['random', 2]}
];

let disguise = [
  {name: 'mustache', id: 'id_mustache.png', card: 'mustache.png'},
  {name: 'glasses', id: 'id_glasses.png', card: 'mustache.png'},
  {name: 'wig', id: 'id_wig.png', card: 'wig.png'},
  {name: 'bowtie', id: 'id_bowtie.png', card: 'bowtie.png'},
  {name: 'nose', id: 'id_nose.png', card: 'nose.png'},
  {name: 'hat', id: 'id_hat.png', card: 'hat.png'},
]

let currentTarget = 5;
let currentScore = 0;
let currentPref = true; //true for floppy, false for cd 
let currentPrefMod = 2;
let reputation = 20;
let currentEnergy = 3;

let drawPile = shuffleArray(cards);
let boardCards = [];
let discardPile = [];

$('.floppy').hide();
$('.overlay-cont').hide();

// Function to deal cards to the board
function dealCards() {
  boardCards = [];
  for (let i = 0; i < 5; i++) {
    if (drawPile.length === 0) {
      drawPile = shuffleArray(discardPile);
      discardPile = [];
    }
    let card = drawPile.pop();
    boardCards.push(card);
  }
}

// Shuffle and deal cards at the start of the game
dealCards();

// Display the cards on the board
displayCards();

//set the caret & targets
adjustTargetScore();

function displayCards() {
  $('.card-row').empty();
  $.each(boardCards, function(index, card) {
    let cardHTML = $(`
      <div class="card" data-index="${index}">
        <div class="stat-row">
          <div class="cost" data-cost="${card.cost}">${card.cost}</div>
          <div class="points">+<span class="card-points" data-points="${card.points}">${card.points}</span></div>
        </div>
        <div class="card-img" data-type="${card.type}"><img src="images/${card.image}" alt=""></div>
        <div class="text">${card.text}</div>
      </div>
    `);

    // Append the new card HTML to the .card-row div
    $('.card-row').append(cardHTML);
  });
}

$(document).on('click', '.card', function() {
  let index = $(this).data('index');
  let card = boardCards[index];
  let thisImg = card.image;
  let newImage = '<img class="id_disguise" src="images/id_' + thisImg + '" alt="">';

  

  if ( !$(this).hasClass('invalid') ) {
    // Check if the card's function is not null
    if (card.function) {
      // Call the function with the arguments
      window[card.function].apply(this, card.functionArgs);
    }
      
    // Adjust scores and costs
    currentScore += card.points;
    currentEnergy = currentEnergy - card.cost;

    // Append photo
    if ( thisImg ){
      $('.id-photo').append(newImage);
    }

    refreshStats();
    // checkCardEnergy();
    // $(this).hide();
    fadeToHide($(this));
    
  } else {
    shakeElements($(this));
  }
  
});

$('.next-btn').on('click', function() {
  checkRep();
  resetWitness();

  // Move all cards from the board to the discard pile
  while (boardCards.length > 0) {
    let card = boardCards.pop();
    discardPile.push(card);
  }
  
  // Deal new cards
  dealCards();
  
  // Update the display
  displayCards();

  console.log('Draw Count:' + drawPile.length);
  console.log('Board Count:' + boardCards.length);
  console.log('Discard Count:' + discardPile.length);
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}


function runCardFunction(funcName, funcArgs) {
  if (funcName && typeof window[funcName] === "function") {
      window[funcName].apply(null, funcArgs);
  } else {
      console.log(`Function ${funcName} does not exist or not a function.`);
  }
}

function discardAndReplace() {

}

function refreshStats(){
  let offset = currentScore * 16.8;
  let $target = $('.caret');

  $('.caret').text(currentScore);
  $('.caret').data('score', currentScore);
  $target.css('margin-left', offset + 'px');

  $('.target').text(currentTarget);
  $('.target').data('target', currentTarget);

  $('.current-energy').text(currentEnergy);
  $('.current-energy').data('energy', currentEnergy);
}

function checkRep(){
  let difference = Math.abs(currentTarget - currentScore);
  let rep = $('.current-rep');
  let newRep = reputation - difference;
  let newWidth = 100 * newRep / 20;

  rep.css('width', newWidth + '%');

  reputation = newRep;
  
  $('.current-rep').data('rep', reputation);

  if ( reputation <= 0 ) {
    showOverlay();
  }

}

function resetWitness(){
  let randNum = Math.floor(Math.random() * 7) + 4
  let offset = randNum * 16.8;
  let $target = $('.target');
  let newName = generateRandomName();

  $('.id-name').text(newName);

  currentEnergy = 3; 
  currentScore = 0;
  currentTarget = randNum;

  $target.css('margin-left', offset + 'px');
  $('.id-photo').find('.id_disguise').remove();

  refreshStats();
}


function checkCardEnergy() {
  $('.card').each(function() {
    // Get the card's cost
    let cardCost = $(this).find('.cost').attr('data-cost');

    // If the card's cost is greater than the current energy
    if (currentEnergy - cardCost < 0) {
      // Add the "error" class to the cost div
      $(this).addClass('invalid');
    } else {
      // Otherwise, remove the "error" class from the cost div
      $(this).removeClass('invalid');
    }
  });
}

function switchImages() {
  let image1 = $('cd');
  let image2 = $('floppy');

  if(currentPref) {
      image1.hide()
      image2.show()
  } else {
    image1.show()
    image2.hide()
  }
}

function generateRandomName() {
  let firstNameList = ["Mister", "Milkshake", "Maria", "Leah", "Cake", "Garlic", "Rico",
      "Bouncy", "Captain", "Sparkle", "Banana", "Jerry", "King", "Princess", "Prince", 
      "Bubble", "Sassy", "Noodle", "Pickle", "Butter", "Fluffy", "Moon", "Rainbow", "Funky", 
      "Zippy", "Wacky", "Spud", "Hank", "Squiggly", "Sleepy", "Moose", "Senator", "Lumpy", "Big Boy", "Cha Cha", "Leonard", "Mac",
      "Jumbo", "Mark", "Timmy", "Sally", "Sadie", "Becky", "Nico", "Lil'", "Slippery", "Hungry", "Greg", "Rosie", "Popstar", "Hippie",
      "Jazzy", "Jenny", "Walrus", "Almighty", "Natalie", "Bart", "Moon", "Sonny", "Karen", "Buns", "Duck", "Ronny", "Ken", "Barbie"];

  let lastNameList = ["Muffin", "Jenkins", "Kaboom", "Smackdown", "Johnson", "Donna", "Brisket",
      "Pants", "Pancakes", "Cupcake", "Mango", "Star", "Moonbeam", "Waffles", "Giggles", 
      "Cheeks", "Nose", "Pockets", "Bubbles", "Whiskers", "Canoe", "Jenkins", "Gomez", "Sunshine", 
      "Twinkle", "Wiggle", "Jellybean", "Popsicle", "Snowflake", "Dumpling", "Tanktop", "McLucky", "Birdman", "Wombat", "Commando",
      "Walters", "Ostrich", "Canada", "San Diego", "Marcus", "Bread", "Garcia", "Lemons", "Jenkins", "Firework", "Hotdog", "Limbo", 
      "Toronto", "Cruise", "Miller", "Smith", "Cinnamon", "Nutmeg", "Dan", "Reggie", "Pockets", "Larry", "Ghost", "Sandwich", "Tickles",
      "McCracken", "McMaster", "McCrunchy", "McMuffin"];

  let randomFirstNameIndex = Math.floor(Math.random() * firstNameList.length);
  let randomLastNameIndex = Math.floor(Math.random() * lastNameList.length);

  let randomFirstName = firstNameList[randomFirstNameIndex];
  let randomLastName = lastNameList[randomLastNameIndex];

  return randomFirstName + " " + randomLastName;
}


//--- card modifiers ------------------------------------_______----------______-------__----__---_--_
function redrawCards(){
   // Deal new cards
   dealCards();
  
   // Update the display
   displayCards();
}

function doubleRedraw(){
  doubleScore();
  redrawCards();
}

// function swapPref(){
//   currentPref = !currentPref;
//   switchImages();
// }

function modifyTarget(direction, amount){
  if ( direction === "increase" ) {
    currentTarget = currentTarget + amount;
  }

  if ( direction === "decrease" ) {
    currentTarget = currentTarget - amount;
  }

  if (currentTarget > 10) {
    currentTarget = 10;
  }

  if (currentTarget < 0) {
    currentTarget = 0;
  }

  adjustTargetScore();
}

function adjustTargetScore(){
  let targetOffset = currentTarget * 16.8;
  let $target = $('.target');
  $target.css('margin-left', targetOffset + 'px');

  let caretOffset = currentScore * 16.8;
  let $caret = $('.caret');
  $caret.css('margin-left', caretOffset + 'px');
}

function doubleScore(){
  currentScore = currentScore * 2; 
  if (currentScore > 10) {
    currentScore = 10;
  }
}

function modifyCardCost(which, amount){}

function increaseCardPoints(which, amount) {
  let $cards = $(".card-row .card"); // Select all the card elements in .card-row

  if (which === "all") { // If 'which' argument is "all"
      $cards.each(function() { // Iterate over each card
          let $points = $(this).find('.card-points'); // Find the points span in this card
          let currentPoints = parseInt($points.text()); // Get the current points of the card
          $points.text(currentPoints + amount); // Update the points
          $points.attr('data-points', currentPoints + amount);
      });
  } else if (which === "random") { // If 'which' argument is "random"
      let randomIndex = Math.floor(Math.random() * $cards.length); // Generate a random index
      let $randomCard = $($cards[randomIndex]); // Select a random card
      let $points = $randomCard.find('.card-points'); // Find the points span in the random card
      let currentPoints = parseInt($points.text()); // Get the current points of the card
      $points.text(currentPoints + amount); // Update the points
      $points.attr('data-points', currentPoints + amount);
  }
}

function decreaseCardPoints(which, amount) {
  let $cards = $(".card-row .card"); // Select all the card elements in .card-row

  if (which === "all") { // If 'which' argument is "all"
      $cards.each(function() { // Iterate over each card
          let $points = $(this).find('.card-points'); // Find the points span in this card
          let currentPoints = parseInt($points.text()); // Get the current points of the card
          $points.text(currentPoints - amount); // Update the points
          $points.attr('data-points', currentPoints - amount);
      });
  } else if (which === "random") { // If 'which' argument is "random"
      let randomIndex = Math.floor(Math.random() * $cards.length); // Generate a random index
      let $randomCard = $($cards[randomIndex]); // Select a random card
      let $points = $randomCard.find('.card-points'); // Find the points span in the random card
      let currentPoints = parseInt($points.text()); // Get the current points of the card
      $points.text(currentPoints - amount); // Update the points
      $points.attr('data-points', currentPoints - amount);
  }
}


function decreaseCardCost(which, amount) {
  let $cards = $(".card-row .card"); // Select all the card elements in .card-row
  
  if (which === "all") { // If 'which' argument is "all"
      $cards.each(function() { // Iterate over each card
          let index = $(this).data('index');
          let $cost = $(this).find('.cost'); // Find the cost span in this card
          let currentCost = parseInt($cost.text()); // Get the current cost of the card
          if ( amount >= currentCost ) {
            $cost.text(0);
            $cost.attr('data-cost', 0);
            boardCards[index].cost = 0;
          } else {
            $cost.text(currentCost - amount); // Update the cost
            $cost.attr('data-cost', currentCost - amount);
          }
      });
  } else if (which === "random") { // If 'which' argument is "random"
      let randomIndex = Math.floor(Math.random() * $cards.length); // Generate a random index
      let $randomCard = $($cards[randomIndex]); // Select a random card
      let $cost = $randomCard.find('.cost'); // Find the cost span in the random card
      let currentCost = $cost.data('cost'); // Get the current cost of the card
      if ( amount >= currentCost ) {
        $cost.text(0);
        $cost.attr('data-cost', 0);
      } else {
        $cost.text(currentCost - amount); // Update the cost
        $cost.attr('data-cost', currentCost - amount);
      }
  }
}

