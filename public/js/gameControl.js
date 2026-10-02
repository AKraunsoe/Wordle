const { showErrorMessage } = require('./messaging');
const { startGame, guess, getWord } = require('./backendCalls');
const { loadStartButton } = require('./index');
const { createInputs } = require('./htmlInjection')
const { clearModalContent, hideModal } = require('./modalControls')

$(document).on("click", "#startGame", (e) =>{
    startGame(e);
});

$(document).on("click", "#guess", (e) => {
    guess(e);
})

$(document).on("keydown", ".letterInput", function(e) {
    e.preventDefault();
    let $this = $(this);
    let keystroke = e.key;
    if(e.which == 37){
       const previous = $this.prev("input")
       if(previous){
        previous.trigger("focus")
       }
    } else if(e.which == 39){
        const next = $this.next("input")
        if(next){
            next.trigger("focus")
        }
    }else{
        if(/^[a-zA-Z]$/.test(keystroke)) {
            $this.val(keystroke.toUpperCase());
            $this.next("input").trigger("focus");
        }else if(keystroke === "Backspace" || keystroke === "Delete"){
            if(!$this.val()){
                const previous = $this.prev("input")
                if(previous){
                    previous.val("")
                    previous.trigger("focus")
                }
            }else{
                $this.val("");
            }
        }
    }


})

$(document).on("keyup", '.fifthLetter', function(e) {
    e.preventDefault();
    if(e.key != "Enter" || e.which != 13){
        return;
    }
    const $this = $(this);
    const siblings = $this.siblings("input");
    for(let i = 0; i < siblings.length; i++){
        let sibling = $(siblings[i]);
        if(!sibling.val()){
            showErrorMessage("Please fill in all letters before submitting your guess.");
            return;
        }
    }
    $(document).find("#guess").trigger('click');
})

$(document).on('click', '#back', function(e) {
    loadStartButton();
    hideModal();
})

$(document).on('click', '#playAgain', function(e) {
    clearModalContent();
    hideModal();
    startGame(e);
})

$(document).on('click', '#moreAttempts', function(e) {
    clearModalContent();
    createInputs(0, 3, $(document).find('.inputContainer').length);
    $(document).find('.valid').find('input').first().trigger('focus');
    hideModal();
})

$(document).on('click', '#showWord', function(e) {
    getWord(e);
})