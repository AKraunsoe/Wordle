//const $ = require('jquery');

$(() => {
    console.log("test");
    $("#contentContainer").load("pages/content/startButton.html");
});

$(document).on("click", "#startGame", (e) =>{
    e.preventDefault();
    hideErrorMessage();
    $.ajax({
        url: "/game/play",
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
});

$(document).on("click", "#guess", (e) => {
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
            for(let i = 0; i < result.length; i++){
                let inputClass = "";
                switch(i) {
                    case 0:
                        inputClass = "firstLetter";
                        break;
                    case 1:
                        inputClass = "secondLetter";
                        break;
                    case 2:
                        inputClass = "thirdLetter"; 
                        break;
                    case 3:
                        inputClass = "fourthLetter";
                        break;
                    case 4:
                        inputClass = "fifthLetter";
                        break;
                }
                let input = inputContainer.find(`.${inputClass}`);
                if(result[i] === 2){
                    $(input).css("background-color", "green");
                }else if(result[i] === 1){
                    $(input).css("background-color", "yellow");
                }else{
                    $(input).css("background-color", "red");
                }

            }
            inputContainer.removeClass("valid").addClass("used");
            inputContainer.find("input").attr("disabled", "disabled");
            let nextContainers =$(".inputContainer.invalid");
            
            if(!nextContainers || !nextContainers.length){
                showLoseCondition();
                return;
            }
            
            nextContainers.first().removeClass("invalid").addClass("valid");
            nextContainers.first().find("input").removeAttr("disabled");

            if(result.indexOf(1) == -1 && result.indexOf(0) == -1){
                showWinCondition();
            }

        },
        error: (error) => {
            showErrorMessage("Error: Could not submit the guess. Please try again.");
            console.log("Guess error: ", error);
        }
    })

})

$(document).on("keydown", ".letterInput", function(e) {
    e.preventDefault();
    let $this = $(this);
    let keystroke = e.key;
    if(/^[a-zA-Z]$/.test(keystroke)) {
        $this.val(keystroke.toUpperCase());
        $this.next("input").trigger("focus");
    }else if(keystroke === "Backspace" || keystroke === "Delete"){
        $this.val("");
    }
})

function hideErrorMessage() {
    $("#errorMessage").text("");
    $("#errorMessage").hide();
}

function showErrorMessage(message) {
    $("#errorMessage").text(message);
    $("#errorMessage").show();
}

function createInputs(startIndex, endIndex) {
    for(let i = startIndex; i < endIndex; i++){
        let inputContainer = $("<div>").attr("class", `inputContainer`)
        let valid = false;
        if(i == startIndex) {
            inputContainer.addClass("valid");
            valid = true;
        }else{
            inputContainer.addClass("invalid");
        }
        for(let j = 0; j < 5; j++){
            let input = $("<input>").attr("type", "text")
                .attr("maxlength", "1")
                .addClass("letterInput");
            if(!valid){
                input.attr("disabled", "disabled");
            }
            switch(j) {
                case 0:
                    input.attr("id", `firstLetter_${i}`).addClass("firstLetter");
                    break;
                case 1:
                    input.attr("id", `secondLetter_${i}`).addClass("secondLetter");
                    break;
                case 2:
                    input.attr("id", `thirdLetter_${i}`).addClass("thirdLetter");
                    break;
                case 3:
                    input.attr("id", `fourthLetter_${i}`).addClass("fourthLetter");
                    break;
                case 4:
                    input.attr("id", `fifthLetter_${i}`).addClass("fifthLetter");
                    break;
            }
                
            inputContainer.append(input);
        }
        inputContainer.append("<br>");
        $("#inputs").append(inputContainer);
    }

}

function showWinCondition() {}

function showLoseCondition() {}