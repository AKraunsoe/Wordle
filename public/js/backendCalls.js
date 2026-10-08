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
            messaging.showErrorMessage(error?.responseJSON?.message || "Error: Could not create word list");
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
            messaging.showErrorMessage(error?.responseJSON?.message || "Error: Could not start the game. Please try again.");
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
            messaging.showErrorMessage(error?.responseJSON?.message || "Error: Could not submit the guess. Please try again.");
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
            messaging.showErrorMessage(error?.responseJSON?.message || "Error: Could not retrieve the word");
            console.log("Start error: ", error);
        }
    })
}

const createAccount = (username, password) => {
  $.ajax({
    url: "/account/createAccount",
    method: "POST",
    data: JSON.stringify({"username": username, "password": password}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (data) => {
        if(data.success){
            window.location.reload();
        }else{
            messaging.showErrorMessage(data.message || "Error: Account could not be created");
        }
    },
    error: (error) => {
        messaging.showErrorMessage(error?.responseJSON?.message || "Error: Could not create account");
        console.log("Account error: ", error);
    }
  })
}

const login = (username, password) => {
  $.ajax({
    url: "/account/login",
    method: "POST",
    data: JSON.stringify({"username": username, "password": password}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (data) => {
        if(data.success) {
            window.location.reload();
        }else{
            messaging.showErrorMessage(data.message || "Error: Could not log in");
        }
    },
    error: (error) => {
        messaging.showErrorMessage(error?.responseJSON?.message || "Error: Could not login to account");
        console.log("Login error: ", error);
    }
  })
}

const logout = () => {
    $.ajax({
        url: "/account/logout",
        method: "GET",
        success: (data) => {
            if(data.success) {
                window.location.reload();
            }else{
                messaging.showErrorMessage(data.message || "Error: Could not log out");
            }
        },
        error: (error) => {
            messaging.showErrorMessage(error?.responseJSON?.message || "Error: Could not log out of account");
            console.log("Logout error: ", error);
        }
  })
}

const checkLoggedIn = () => {
    return new Promise ((resolve, reject) => {
        $.ajax({
                url: "/account/loggedIn",
                method: "GET",
                success: (data) => {
                    $("#userContainer").text(`Welcome ${data.user}`);
                    resolve(data)
                },
                error: (error) => {
                    $("#userContainer").empty();
                    if (error?.status !== 401) {
                        messaging.showErrorMessage(error?.responseJSON?.message || "Error: Could not check login status");
                    }
                    resolve({ success: false });
                }
        })
    })
}

const findUser = (username) => {
    $.ajax({
    url: "/users/search",
    method: "POST",
    data: JSON.stringify({"username": username}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (data) => {
        if(data.success) {
            htmlInjection.createFriend(username);
        }else{
            messaging.showErrorMessage(data.message || "Error: No user with that name found");
        }
    },
    error: (error) => {
        messaging.showErrorMessage(error?.responseJSON?.message || "Error: Search for friend failed");
        console.log("Find Friend error: ", error);
    }
  })
}

const addFriend = (username) => {
    $.ajax({
    url: "/users/addFriend",
    method: "POST",
    data: JSON.stringify({"username": username}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (data) => {
        if(data.success) {
            htmlInjection.createFriend(username);
        }else{
            messaging.showErrorMessage(data.message || "Error: No user with that name found");
        }
    },
    error: (error) => {
        messaging.showErrorMessage(error?.responseJSON?.message || "Error: Search for friend failed");
        console.log("Add Friend error: ", error);
    }
  })
}

const listFriends = () => {
    $.ajax({
    url: "/users/friends",
    success: (data) => {
        if(data.success) {
            $('#contentContainer').empty();
            htmlInjection.showFriends(data);
        }else{
            messaging.showErrorMessage(data.message || "Error: finding friends not possible");
        }
    },
    error: (error) => {
        messaging.showErrorMessage(error?.responseJSON?.message || "Error: it was not possible to find your friends");
        console.log("Add Friend error: ", error);
    }
  })
}

module.exports = { getWord,
    startGame,
    guess,
    createAccount,
    login,
    createWordList,
    checkLoggedIn,
    logout,
    findUser,
    addFriend,
    listFriends
}
