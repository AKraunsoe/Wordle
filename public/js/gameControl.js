const { showErrorMessage } = require('./messaging');
const { startGame, guess, getWord } = require('./backendCalls');
const index = require('./index');
const htmlInjection = require('./htmlInjection');
const { clearModalContent, hideModal } = require('./modalControls');

$(document).on("click", "#startGame", (e) =>{
    index.loadDifficultyButtons();
});

$(document).on("click", ".startGame", function(e) {
    const $this = $(this);
    startGame(e, $this.attr('data-length'));
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

$(document).on("keyup", '.lastLetter', function(e) {
    e.preventDefault();
    if(e.key != "Enter" || e.which != 13){
        return;
    }
    const $this = $(this);
    const siblings = $this.closest('.inputContainer').find("input");
    for(let i = 0; i < siblings.length; i++){
        let sibling = $(siblings[i]);
        if(!sibling.val()){
            showErrorMessage("Please fill in all letters before submitting your guess.");
            return;
        }
    }
    $(document).find("#guess").trigger('click');
})

$(document).on('click', '#createAccount', async function(e) {
    e.preventDefault();
    index.clearContent();
    index.loadContent("pages/content/createAccountForm.html", (response, status, xhr) =>{
        if(status != "error"){
            $.get("pages/content/buttons/backToStart.html",'', (data) => { $("#contentContainer").append(data) });
        }
    });
})

$(document).on("submit", '#createAccountForm', function (e) {
    e.preventDefault();
    const form = $(this);
    

})

$(document).on('submit', "login", function (e) {
    e.preventDefault();
    const form = $(this);
})

$(document).on('click', '#back', function(e) {
    index.loadStartScreen();
    hideModal();
})

const getCurrentDifficulty = () => {
    return $(document).find(".inputContainer").first().find('input').length
}

$(document).on('click', '#playAgain', function(e) {
    clearModalContent();
    hideModal();
    startGame(e, getCurrentDifficulty())
})

$(document).on('click', "#changeDifficulty", function(e) {
    hideModal();
    index.loadDifficultyButtons();
})

$(document).on('click', '#moreAttempts', function(e) {
    clearModalContent();
    htmlInjection.createInputs(0, 3, getCurrentDifficulty(),$(document).find('.inputContainer').length);
    $(document).find('.valid').find('input').first().trigger('focus');
    hideModal();
})

$(document).on('click', '#showWord', function(e) {
    getWord(e);
})

$(document).on('click', '#modals .close', function(e){
    hideModal();
})
