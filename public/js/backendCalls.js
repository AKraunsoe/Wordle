const messaging = require('./messaging');
const htmlInjection = require('./htmlInjection');
const { returnAndClearModalContent } = require('./modalControls');

const createWordList = async () => {
    $.ajax({
        url: "/game/words",
        method: "GET",
        success: async (data) => {
            if(data.success) {
                console.log("words created succesfully");
            }else{
                console.log(data.message || "Error could not create words");
            }
        },
        error: async (error) => {
            console.log("Create Words Error: ", error);
        }
    })
}

const startGame = (e, difficulty) => {
    e.preventDefault();
    messaging.hideErrorMessage();
    $.ajax({
        url: `/game/start?difficulty=${difficulty}`,
        method: "GET",
        success: (data) => {
            if(data.success) {
                $("#contentContainer").empty();
                $("#contentContainer").load(data.file, (response, status, xhr) => {
                    if(status != "error"){
                        htmlInjection.createInputs(0, 6, difficulty);
                        $(document).find('.valid').find('input').first().trigger('focus');
                        $.get("pages/content/buttons/backToStart.html",'', (data) => { $("#contentContainer").find('#game-buttons').append(data) });
                    }
                });

            }else{
                messaging.showErrorMessage("Error: Could not start the game. Please try again.");
            }
        },
        error: (error) => {
            messaging.showErrorMessage("Error: Could not start the game. Please try again.");
            console.log("Start error: ", error);
        }
    })
}

const guess = (e) => {
    e.preventDefault();
    messaging.hideErrorMessage();
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
                messaging.showErrorMessage(response.message);
                return;
            }
            let result = response.result;
            const inputs = $(".valid").find("input");
            for(let i = 0; i < result.length; i++){
                let keyboardKey = $(document).find(`.keyboard-key[data-letter=${$(inputs[i]).val()}]`)
                let keyboardValue = keyboardKey.attr('data-value')
                if(result[i] === 2){
                    if(!keyboardValue || keyboardValue != 2){
                        keyboardKey.attr('data-value', 2);
                    }
                    $(inputs[i]).css("background-color", "LightGreen");
                }else if(result[i] === 1){
                    if(!keyboardValue || keyboardValue < 1){
                        keyboardKey.attr('data-value', 1);
                    }
                    $(inputs[i]).css("background-color", "LemonChiffon");
                }else{
                    if(keyboardValue == ""){
                        keyboardKey.attr('data-value', 0);
                    }
                    $(inputs[i]).css("background-color", "LightCoral");
                }

            }
            inputContainer.removeClass("valid").addClass("used");
            inputContainer.find("input").attr("disabled", "disabled");
            const attempts = $(document).find(".used").length

            if(result.indexOf(1) == -1 && result.indexOf(0) == -1){
                const modalContent = returnAndClearModalContent();
                messaging.showWinCondition(modalContent, attempts);
                return
            }

            let nextContainers = $(".inputContainer.invalid");

            if(!nextContainers || !nextContainers.length){
                const modalContent = returnAndClearModalContent();
                messaging.showLoseCondition(modalContent, attempts);
                return;
            }

            nextContainers.first().removeClass("invalid").addClass("valid");
            nextContainers.first().find("input").removeAttr("disabled");
            nextContainers.first().find("input").first().trigger("focus");

        },
        error: (error) => {
            messaging.showErrorMessage("Error: Could not submit the guess. Please try again.");
            console.log("Guess error: ", error);
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
                $(document).find("#correctWord").empty().append(data.word);
            }else{
                messaging.showErrorMessage("Error: Could not get the word");
            }
        },
        error: (error) => {
            messaging.showErrorMessage("Error: Could not retrieve the word");
            console.log("Start error: ", error);
        }
    })
}

const createAccount = (username, password) => {
  e.preventDefault();
  $.ajax({
    url: "/account/createAccount",
    method: "POST",
    data: JSON.stringify({"username": username, "password": password}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (data) => {
        if(data.success){

        }else{
            messaging.showErrorMessage(data.message || "Error: Account could not be created");
        }
    },
    error: (error) => {
        messaging.showErrorMessage("Error: Could not create account");
        console.log("Start error: ", error);
    }
  })
}

const login = (username, password) => {
  e.preventDefault();
  $.ajax({
    url: "/game/login",
    method: "POST",
    data: JSON.stringify({"username": username, "password": password}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (data) => {
        if(data.word) {
            $(document).find("#correctWord").empty().append(data.word);
        }else{
            showErrorMessage("Error: Could not get the word");
        }
    },
    error: (error) => {
        messaging.showErrorMessage("Error: Could not login to account");
        console.log("Start error: ", error);
    }
  })
}

const checkLoggedIn = () => {
    return new Promise ((resolve, reject) => {
        $.ajax({
                url: "/account/loggedIn",
                method: "GET",
                success: (data) => {
                    resolve(data)
                },
                error: (error) => {
                    reject(error)
                }
        })
    })
}

module.exports = { getWord,
    startGame,
    guess,
    createAccount,
    login,
    createWordList,
    checkLoggedIn
}
