let blackjackGame = {

    'you': { 'scorespan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },

    'dealer': { 'scorespan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'],

    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand':false,
    'turnsOver':false,

};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];




document.querySelector("#blackjack-hit-button").addEventListener("click", blackJackHit);
document.querySelector("#blackjack-stand-button").addEventListener("click", dealerLogic);
document.querySelector("#blackjack-deal-button").addEventListener("click", blackJackDeal)

const hitSound = new Audio("static/Sounds Blackjack/swish.m4a");
const winSound = new Audio("static/Sounds Blackjack/cash.mp3");
const lossSound = new Audio("static/Sounds Blackjack/aww.mp3");

function blackJackHit() {
    if(blackjackGame['isStand']==false){
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
}

}


function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement("img");
        cardImage.src = `static/Images Blackjack/${card}.png`;


        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }


}


function blackJackDeal() {

if(blackjackGame['turnsOver']==true){
    blackjackGame['isStand'] = false;
    let yourImages = document.querySelector("#your-box").querySelectorAll("img");
    let dealerImages = document.querySelector("#dealer-box").querySelectorAll("img");

    for (let i = 0; i < yourImages.length; i++) {

        yourImages[i].remove();

        // computeWinner();

    }


    for (let i = 0; i < dealerImages.length; i++) {

        dealerImages[i].remove();

    }

    YOU['score'] = 0;
    DEALER['score'] = 0;
    document.querySelector("#your-blackjack-result").textContent = 0;
    document.querySelector("#your-blackjack-result").style.color = "white";
    document.querySelector("#dealer-blackjack-result").textContent = 0;
    document.querySelector("#dealer-blackjack-result").style.color = "white";
    document.querySelector("#blackjack-result").textContent ="Let's Play";
    document.querySelector("#blackjack-result").style.color = "black";

    blackjackGame['turnsOver']=true;
}

}
function randomCard() {

    let randomIndex = Math.floor(Math.random() * 13);

    return blackjackGame['cards'][randomIndex];

}


function updateScore(card, activePlayer) {


    if (card == 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {

            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {

            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }



    }
    else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }

}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scorespan']).textContent = "BUST!!";
        document.querySelector(activePlayer['scorespan']).style.color = "red";
    } else {
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
        document.querySelector(activePlayer['scorespan']).style.color = "white";
    }
}
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    
    blackjackGame['isStand'] = true;
    while(DEALER['score'] < 16 && blackjackGame['isStand'] == true){
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
    
    }
    
        blackjackGame['turnsOver'] = true;
        let winner = computeWinner()
        showResult(winner);

    

}


function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {

        if ((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
            //  console.log("You Win!!");
            blackjackGame['wins']++;
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {

            // console.log("You lost!!");
            blackjackGame['losses']++;
            winner = DEALER;

        } else if (YOU['score'] == DEALER['score']) {

            // console.log('You drew!!');
            blackjackGame['draws']++;

        }
        
        ///Condition when you bust but dealer doesn't 
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        // console.log("You lost!!");
        blackjackGame['losses']++;
        winner = DEALER;

    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {

        // console.log("You Drew!!");
        blackjackGame['draws']++;

    }
    // console.log("winner is", winner);
    console.log(blackjackGame);
    return winner;
}


function showResult(winner) {

    let message, messageColor;
    if(blackjackGame['turnsOver']==true){
    if (winner == YOU) {
        document.querySelector('#wins').textContent=blackjackGame['wins'];
        message = "You Won!!";
        messageColor = "green";
        winSound.play();
    } else if (winner == DEALER) {
        document.querySelector('#losses').textContent=blackjackGame['losses'];
        message = "You Lost!!";
        messageColor = "red";
        lossSound.play();
    } else {
        document.querySelector('#draws').textContent=blackjackGame['draws'];
        message = "You Drew!!";
        messageColor = "blue";
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
}
}