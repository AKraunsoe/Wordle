const { clearModalContent, hideModal, showBattleWaitingModal, showBattleFailureModal, showBattleRequestModal } = require('./modalControls');
const htmlInjection = require('./htmlInjection');
const index = require('./index');

let interval;
const oneSecond = 1000;

const renderBattleState = async (state) => {
    if(interval){
        clearInterval(interval);
    }
    if(state.firstTurn){
        await startBattle();
        $(document).find('.opponent').text(state.opponent.username);
    }

    $(document).find('.my-counter').text(state.totalGuesses);
    $(document).find('.opponent-counter').text(state.opponent.totalGuesses);

    const guesses = Object.keys(state.opponent.guesses)
    if ($(document).find('.opponent-guess-container').length < guesses.length-1){
        for (let i = 0; i < guesses.length; i++) {
            const guessContainer = $('<div>').addClass('opponent-guess-container');
            const guess = guesses[i];
            const letters = guess.split('');
            fillOpponentGuess(guess, letters, guessContainer);
        }
    }else{
        const guessContainer = $('<div>').addClass('opponent-guess-container');
        const guess = Object.keys(state.lastGuess)[0];
        const letters = guess.split('');
        fillOpponentGuess(guess, letters, guessContainer);
    }

    $(document).find('#game-buttons').attr('data-state', state.yourState);

    switch (state.yourState) {
        case 'wait':
            showBattleWaitingModal(state.opponent.username, `${state.opponent.username} is taking their turn. If they run out of time it will automatically be your turn`);
            break;
        case 'take_turn':
            htmlInjection.createInputs(0, 1, 5, $(document).find('.used').length);
            $(document).find('.valid').find('input').first().trigger('focus');
            break;
        default:
            showBattleWaitingModal(state.opponent.username, `Congratulations, you won this round, now waiting for your opponent to finish`);
            break;
    }

    let timeLeft = state.timeLeft;
    $(document).find('.timer').text(Math.floor((timeLeft/oneSecond)/60)+":00")
    interval = setInterval(() => {
        timeLeft -= oneSecond;
        const minutes = Math.floor((timeLeft/oneSecond)/60);
        const seconds = Math.floor((timeLeft/oneSecond)%60);
        $(document).find('.timer').text(`${minutes}:${seconds}`);
        if(timeLeft <= 0){
            $(document).find('#guess').attr('data-force', true).trigger('click');

        }
    }, oneSecond);
    $(document).find('#guess').attr('data-battle', true);
}

const fillOpponentGuess = (guess, letters, guessContainer) => {
    for (let j = 0; j < letters.length; j++) {
        const letterContainer = $('<span>').addClass('opponent-letter-container').text(letters[j].toUpperCase());
        if(state.opponent.guesses[guess][j] === 2){
            letterContainer.css("background-color", "LightGreen");
        }else if(state.opponent.guesses[guess][j] === 1){
            letterContainer.css("background-color", "LemonChiffon");
        }else{
            letterContainer.css("background-color", "LightCoral");
        }
        guessContainer.append(letterContainer);
    }
    $(document).find('opponent-guesses').append(guessContainer);
}

const startBattle = () => {

    return new Promise ((resolve, reject) => {
        $("#contentContainer").empty();
        index.loadContent('pages/content/game.html', (response, status, xhr) => {
            if(status != "error"){
                const attackButton = $('<button>')
                    .attr('type', 'button')
                    .attr('id', 'attackModal')
                    .addClass('btn')
                    .text('Attack');

                $(document).find('#game-buttons').append(attackButton);
                resolve(true);
            }
        });
    });
    
}

module.exports = {
    renderBattleState
}