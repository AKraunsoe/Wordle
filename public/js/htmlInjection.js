const createInputs = (startIndex, endIndex, difficulty, incrementer = 0) => {
    for(let i = startIndex; i < endIndex; i++){
        let inputContainer = $("<div>").addClass('inputContainer')
        let valid = false;
        if(i == startIndex) {
            inputContainer.addClass("valid");
            valid = true;
        }else{
            inputContainer.addClass("invalid");
        }
        for(let j = 0; j < difficulty; j++){
            let input = $("<input>").attr("type", "text")
                .attr("maxlength", "1")
                .addClass("letterInput")
                .addClass('form-control');
            if(!valid){
                input.attr("disabled", "disabled");
            }
            input.attr("id",`letterInput_${i + incrementer}_${j}`);
            if(j == difficulty-1){
                input.addClass('lastLetter');
            }
                
            inputContainer.append(input);
        }
        inputContainer.append("<br>");
        $("#inputs").append(inputContainer);
    }

}

module.exports = { createInputs };