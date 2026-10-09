const { showErrorMessage } = require('./messaging');
const backendCalls = require('./backendCalls');
const index = require('./index');
const htmlInjection = require('./htmlInjection');
const { clearModalContent, hideModal, showBattleWaitingModal, showBattleFailureModal, showBattleRequestModal } = require('./modalControls');
const socket = require('./socket');

$(document).on("click", "#playWordle", () =>{
    index.loadDifficultyButtons();
});

$(document).on("click", "#startGame", () =>{
    index.clearContent();
    index.loadContent("pages/content/buttons/gameButtons.html", (response, status, xhr) =>{
        if(status != "error"){
            $.get("pages/content/buttons/backToStart.html",'', (data) => { $("#contentContainer").append(data) });
        }
    });
});

$(document).on("click", ".startGame", function(e) {
    const $this = $(this);
    backendCalls.startGame(e, $this.attr('data-length'));
});

$(document).on("click", "#battle", function(e){
    e.preventDefault();
    backendCalls.listFriends();
})

$(document).on("click", "#guess", (e) => {
    if(!$(this).attr('data-battle')){
        backendCalls.guess(e);
    }else{
        if($(this).closest('#game-buttons').attr('data-state') == 'take_turn'){
            const force = $(this).attr('data-force');
            $(this).removeAttr('data-force');
            backendCalls.battleGuess(e, force);
        }
    }
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
    const username = form.find("#username").val();
    const password = form.find("#accountPassword").val();
    backendCalls.createAccount(username, password);
})

$(document).on('submit', '#loginForm', function (e) {
    e.preventDefault();
    const form = $(this);
    const username = form.find("#username").val();
    const password = form.find("#accountPassword").val();
    backendCalls.login(username, password);
})

$(document).on('click', '#logout', function (e) {
    e.preventDefault();
    backendCalls.logout();
})

$(document).on('click', '#back', function(e) {
    index.loadStartScreen();
    hideModal();
})

const getCurrentDifficulty = () => {
    return $(document).find(".inputContainer").first().find('input').length
}

$(document).on('click', '#playAgain', function(e) {
    e.preventDefault();
    hideModal();
    clearModalContent();
    backendCalls.startGame(e, getCurrentDifficulty())
})

$(document).on('click', "#changeDifficulty", function(e) {
    hideModal();
    index.loadDifficultyButtons();
})

$(document).on('click', '#moreAttempts', function(e) {
    e.preventDefault();
    htmlInjection.createInputs(0, 3, getCurrentDifficulty(),$(document).find('.inputContainer').length);
    $(document).find('.valid').find('input').first().trigger('focus');
    hideModal();
    clearModalContent();
})

$(document).on('click', '#showWord', function(e) {
    backendCalls.getWord(e);
})

$(document).on('click', '#modals .close', function(e){
    hideModal();
})

$(document).on('click', '#closeBattleModal', function(e) {
    e.preventDefault();
    hideModal();
    clearModalContent();
});

$(document).on('click', "#addFriends", function (e) {
    e.preventDefault();
    index.clearContent();
    index.loadContent("pages/content/friendsForm.html", (response, status, xhr)=>{
        if(status != "error"){
            $.get("pages/content/buttons/backToStart.html", "", (data) => { $("#contentContainer").append(data) });
        }
    });
})

$(document).on('submit', '#friendsSearchForm', function (e) {
    e.preventDefault();
    const form = $(this);
    const username = form.find("input").val();
    backendCalls.findUser(username);
})

$(document).on('click', "#addFriend", function(e){
    e.preventDefault();
    const username = $(this).attr('data-username');
    backendCalls.addFriend(username)
})

$(document).on('click', "#startBattle", async function (e) {
    e.preventDefault();
    const modalError = $('.modal-error');
    modalError.empty();
    const $this = $(this);
    if (!$this.attr('data-online') || $this.attr('data-online') == "false"){
        return;
    }
    const username = $this.attr('data-username');
    const requestSent = await backendCalls.requestBattleEvent(username);
    if(requestSent.success){
        showBattleWaitingModal(username);
    }else{
        modalError.append(requestSent.message || "Something went wrong requesting the battle");
    }
    
    //showBattleFailureModal(); 
})

$(document).on('click', "#acceptBattle", async function(e) {
    e.preventDefault();
    const invitationId = $('.modal').attr('data-invite');
    const modalError = $('.modal-error');
    modalError.empty();

    const requestSent = await backendCalls.battleRequestResponse(invitationId, true);
    if(requestSent.success){
        showBattleWaitingModal($(this).attr('data-username'));
    }else{
        modalError.append(requestSent.message || "Something went wrong sending battle response");
    }
})

$(document).on('click', "#declineBattle", async function(e) {
    e.preventDefault();
    const modal = $('.modal');
    const invitationId = $('.modal').attr('data-invite');
    const modalError = $('.modal-error');
    modalError.empty();

    const requestSent = await backendCalls.battleRequestResponse(invitationId, false);
    if(requestSent.success){
        modal.removeAttr('data-invite');
        hideModal();
        clearModalContent();
        //trigger battle
    }else{
        modalError.append(requestSent.message || "Something went wrong sending battle response");
    }
})

socket.on("battle:invite", ({ invitationId, from }) => {
  showBattleRequestModal(invitationId, from.username)
});

socket.on("battle:started", (state) => {
  renderBattleState(state)
})

socket.on("battle:turn", (state) => {
  renderBattleState(state)
})

socket.on("battle:invite:declined", ({invitationId, message}) => {
  //Trigger cancel Battle Event
  showBattleFailureModal(message);
});

socket.on("battle:invite:expired", ({ message }) => {
  showBattleFailureModal(message);
});

socket.on("battle:invite:cancelled", ({ invitationId }) => {
  const modal = $("#myModal");

  if (modal.attr("data-invite") === invitationId) {
    modal.removeAttr("data-invite");
    clearModalContent();
    hideModal();
  }
});
