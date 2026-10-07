const { getModalButtons, showModal } = require('./modalControls');

const hideErrorMessage = () => {
    $("#errorMessage").text("");
    $("#errorMessage").hide();
}

const showErrorMessage = (message) => {
    $("#errorMessage").text(message);
    $("#errorMessage").show();
}

const showWinCondition = (modalContent, attempts) => {

    modalContent.load("pages/modal/content/successModal.html", (response, status, xhr) => {
        if(status != "error"){
            const modalButtons = getModalButtons();
            jQuery.ajaxSetup({async: true});
            $.get("pages/modal/buttons/playAgain.html",'', (data) => { modalButtons.append(data) });
            $.get("pages/modal/buttons/changeDifficulty.html",'', (data) => { modalButtons.append(data) });
            $.get("pages/content/buttons/backToStart.html",'', (data) => { modalButtons.append(data) });
            setAttempts(attempts);
            showModal();
        }
    })

}

const showLoseCondition = (modalContent, attempts) => {

    modalContent.load("pages/modal/content/failureModal.html", (response, status, xhr) => {
        if(status != "error"){
            const modalButtons = getModalButtons();
            jQuery.ajaxSetup({async: true});
            $.get("pages/modal/buttons/playAgain.html",'', (data) => { modalButtons.append(data) });
            $.get("pages/modal/buttons/changeDifficulty.html",'', (data) => { modalButtons.append(data) });
            $.get("pages/modal/buttons/moreAttempts.html",'', (data) => { modalButtons.append(data) });
            $.get("pages/modal/buttons/showWord.html",'', (data) => { modalButtons.append(data) });
            $.get("pages/content/buttons/backToStart.html",'', (data) => { modalButtons.append(data) });
            setAttempts(attempts);
            showModal();
        }
    })
}

const setAttempts = (attempts) => {
    $(document).find('#attempts').text(attempts);
}

module.exports = { hideErrorMessage, 
    showErrorMessage, 
    showWinCondition, 
    showLoseCondition};