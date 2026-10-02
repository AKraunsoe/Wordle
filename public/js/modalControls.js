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
    clearModalContent(modal)
    return modal
}

const hideModal = () => {
    $(document).find('.modal').hide()
}

const showModal = () => {
    $(document).find('.modal').show()
}

module.exports = {getModalContent, 
    returnAndClearModalContent, 
    clearModalContent, 
    hideModal, 
    showModal,
    getModalButtons}