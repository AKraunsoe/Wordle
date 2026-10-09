const getModalContent = () => {
    const modalContent = $(document).find(".modal-content");
    return modalContent
}

const getModalButtons = () => {
    const modalButtons = $(document).find(".modal-button-block");
    return modalButtons
}

const clearModalContent = () => {
    const modal = getModalContent();
    modal.empty();
}

const returnAndClearModalContent = () => {
    const modal = getModalContent()
    clearModalContent()
    return modal
}

const hideModal = () => {
    const modal = $('.modal')
    if(modal.attr('data-invite')){
        $(document).find('#declineBattle').trigger('click');
    }
    modal.hide()
}

const showModal = () => {
    $(document).find('.modal').show()
}

const showBattleWaitingModal = (username, message) => {
    clearModalContent();

    const waitingMessage = $('<div>').addClass('d-flex align-items-center');
    const spinner = $('<span>')
        .addClass('spinner-border spinner-border-sm')
        .attr('role', 'status')
        .attr('aria-hidden', 'true');
    const localMessage = message || `Waiting for a response from ${username}...`
    const message = $('<span>').text(localMessage);

    waitingMessage.append(spinner, message);
    getModalContent().append(waitingMessage);
    showModal();
};

const showBattleRequestModal = (invitationId, username) => {
    clearModalContent();
    
    const modal = $('#myModal');
    modal.attr('data-invite', invitationId);
    const battleRequest = $('<div>').addClass('d-flex align-items-center').text(`You have been invited to battle ${username}`);
    const buttonBlock = $('<div>').addClass('modal-button-block');
    const accept = $('<button>')
            .attr('type', 'button')
            .attr('data-username', username)
            .attr('data-invite', invitationId)
            .attr('id', 'acceptBattle')
            .addClass('btn')
            .text('Accept');
    const decline = $('<button>')
            .attr('type', 'button')
            .attr('data-username', username)
            .attr('data-invite', invitationId)
            .attr('id', 'declineBattle')
            .addClass('btn')
            .text('Decline');

    buttonBlock.append(accept, decline);
    getModalContent().append(battleRequest, buttonBlock);

    showModal();
}

const showBattleFailureModal = (message) => {
    clearModalContent();

    const localMessage = $('<p>').text(message || 'cannot start battle at this time, please try again later');
    const buttonBlock = $('<div>').addClass('modal-button-block');
    const closeButton = $('<button>')
        .attr('type', 'button')
        .attr('id', 'closeBattleModal')
        .addClass('btn')
        .text('Close');

    buttonBlock.append(closeButton);
    getModalContent().append(localMessage, buttonBlock);
    showModal();
};

module.exports = {getModalContent, 
    returnAndClearModalContent, 
    clearModalContent, 
    hideModal, 
    showModal,
    getModalButtons,
    showBattleWaitingModal,
    showBattleFailureModal,
    showBattleRequestModal}