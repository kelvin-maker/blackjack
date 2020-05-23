//challenge 5: javascript
// once the id 'blackjack-hit' button is hit, an event listener should be added upon clicking and the blackjackhit function will run

let blackjackgame = {
    'you': {'scoreSpan': '#your-blackjack-results', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-results', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': {'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'J':10, 'Q':10, 'K':10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws':0,
    'isStand': false,
    'turnsOver':false,

};

const YOU = blackjackgame['you']
const DEALER = blackjackgame['dealer']

const hitSound = new Audio('sounds/swish.m4a');

const winSound = new Audio('sounds/cash.mp3');

const lossSound = new Audio('sounds/aww.mp3');


document.getElementById('blackjack-hit').addEventListener('click', blackjackHit);
document.getElementById('blackjack-stand').addEventListener('click', dealerLogic);
document.getElementById('blackjack-deal').addEventListener('click', blackjackDeal);


function blackjackHit() {
    if (blackjackgame['isStand'] === false) {
        let card = randomCard();
        showCard(card,YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
    
    
}
    

function showCard(card, ActivePlayer) {
    if (ActivePlayer['score'] <= 21) {
        let cardimage = document.createElement('img');
        cardimage.src = `images/${card}.png`;
        document.querySelector(ActivePlayer['div']).appendChild(cardimage);
        hitSound.play();
    }
    
}

function blackjackDeal() {
    if (blackjackgame['turnsOver'] === true) {
        blackjackgame['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for (let i=0; i<yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (let i=0; i<dealerImages.length; i++) {
            dealerImages[i].remove();
        }
    
        YOU['score'] = 0;
        DEALER['score'] = 0;
    
        document.querySelector('#your-blackjack-results').textContent =0;
        document.querySelector('#your-blackjack-results').style.color = 'white';
    
        document.querySelector('#dealer-blackjack-results').textContent =0;
        document.querySelector('#dealer-blackjack-results').style.color = 'white';
    
        document.querySelector('#black-jack-result').textContent = 'Lets play';
        document.querySelector('#black-jack-result').style.color = 'black';

        blackjackgame['turnsOver'] = false;
    }
    

}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackgame['cards'][randomIndex];
}

function updateScore(card, ActivePlayer) {
    // if adding 11 keeps me below 21, add 11. Otherwise add 1. when ace is picked
    if (card === 'A'){
        if (ActivePlayer['score'] + blackjackgame['cardsMap'][card][1] <= 21){
            ActivePlayer['score'] += blackjackgame['cardsMap'][card][1];
        }else{
            ActivePlayer['score'] += blackjackgame['cardsMap'][card][0];
        }    
    }else{
        ActivePlayer['score'] += blackjackgame['cardsMap'][card];
    }
   
}

function showScore(ActivePlayer) {
    if (ActivePlayer['score'] > 21) {
        document.querySelector(ActivePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(ActivePlayer['scoreSpan']).style.color = 'red';
    }else{
        document.querySelector(ActivePlayer['scoreSpan']).textContent = ActivePlayer['score'];
    }
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic() {
    blackjackgame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackgame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

blackjackgame['turnsOver'] = true;
let winner = computeWinner();
ShowResult(winner);

   
    
}



//compute winner and return who just won
//updates the wins loss draws
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21){
        //condition: higher score than dealer or when dealer busts but you're 21 or under

        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)){
            blackjackgame['wins']++;
            winner = YOU;
        }else if(YOU['score'] < DEALER['score']){
            blackjackgame['losses']++;
            winner = DEALER;

        }else if (YOU['score'] === DEALER['score']) {
            blackjackgame['draws']++;
        }
    //condition: When user bursrs but dealer doesen't
    }else if (YOU['score'] > 21 && DEALER['score'] <= 21){
        blackjackgame['losses']++;
        winner = DEALER;

    //condition: When yoou and the dealer busts
    }else if(YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackgame['draws']++;
    }

    console.log(blackjackgame)
    return winner;

}

function ShowResult(winner) {
    let message, messageColor;

    if (blackjackgame['turnsOver'] === true) {
        if (winner === YOU){
            document.querySelector('#wins').textContent = blackjackgame['wins'];
            message = 'you won!';
            messageColor =  'green';
            winSound.play();
    
        }else if (winner === DEALER){
            document.querySelector('#losses').textContent = blackjackgame['losses'];
            message = 'you lost!';
            messageColor = 'red';
            lossSound.play();
        }else {
            document.querySelector('#draws').textContent = blackjackgame['draws'];
            message = 'you drew!';
            messageColor = 'black';
        }
        
        document.querySelector('#black-jack-result').textContent = message;
        document.querySelector('#black-jack-result').style.color = messageColor;
    }
}

