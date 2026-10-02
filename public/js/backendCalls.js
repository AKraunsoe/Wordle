let { hideErrorMessage, showErrorMessage, showWinCondition, showLoseCondition } = require('./messaging');
let { createInputs } = require('./htmlInjection');
const { returnAndClearModalContent } = require('./modalControls')

const guess = (e) => {
    e.preventDefault();
    hideErrorMessage();
    let guess = "";
    let inputContainer = $(".inputContainer.valid");
    $(inputContainer).find("input").each((index, input) => {
        guess += $(input).val();
    });

    $.ajax({
        url: "/game/guess",
        method: "POST",
        data: JSON.stringify({"guess": guess}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (response) => {
            if(!response.success){
                showErrorMessage(response.message);
                return;
            }
            let result = response.result;
            const inputs = $(".valid").find("input");
            for(let i = 0; i < result.length; i++){

                if(result[i] === 2){
                    $(inputs[i]).css("background-color", "LightGreen");
                }else if(result[i] === 1){
                    $(inputs[i]).css("background-color", "LemonChiffon");
                }else{
                    $(inputs[i]).css("background-color", "LightCoral");
                }

            }
            inputContainer.removeClass("valid").addClass("used");
            inputContainer.find("input").attr("disabled", "disabled");

            if(result.indexOf(1) == -1 && result.indexOf(0) == -1){
                const modalContent = returnAndClearModalContent();
                showWinCondition(modalContent);
                return
            }

            let nextContainers = $(".inputContainer.invalid");
            
            if(!nextContainers || !nextContainers.length){
                const modalContent = returnAndClearModalContent();
                showLoseCondition(modalContent);
                return;
            }
            
            nextContainers.first().removeClass("invalid").addClass("valid");
            nextContainers.first().find("input").removeAttr("disabled");
            nextContainers.first().find("input").first().trigger("focus");



        },
        error: (error) => {
            showErrorMessage("Error: Could not submit the guess. Please try again.");
            console.log("Guess error: ", error);
        }
    })
}

const startGame = (e) => {
    e.preventDefault();
    hideErrorMessage();
    $.ajax({
        url: "/game/start",
        method: "GET",
        success: (data) => {
            if(data.success) {
                $("#contentContainer").empty();
                $("#contentContainer").load(data.file, (response, status, xhr) => {
                    if(status != "error"){
                        createInputs(0, 6)
                    }
                });
                             
            }else{
                showErrorMessage("Error: Could not start the game. Please try again.");
            }
        },
        error: (error) => {
            showErrorMessage("Error: Could not start the game. Please try again.");
            console.log("Start error: ", error);
        }
    })
}

const getWord = (e) => {
    e.preventDefault();
    $.ajax({
        url: "/game/word",
        method: "GET",
        success: (data) => {
            if(data.word) {
                $(document).find("#correctWord").append(data.word)                
            }else{
                showErrorMessage("Error: Could not get the word");
            }
        },
        error: (error) => {
            showErrorMessage("Error: Could not retrieve the word");
            console.log("Start error: ", error);
        }
    })
}

module.exports = { getWord,
    startGame,
    guess
}