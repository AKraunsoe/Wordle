const createInputs = (startIndex, endIndex, incrementer = 0) => {
    for(let i = startIndex; i < endIndex; i++){
        let inputContainer = $("<div>").addClass('inputContainer')
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
                .addClass("letterInput")
                .addClass('form-control');
            if(!valid){
                input.attr("disabled", "disabled");
            }
            switch(j) {
                case 0:
                    input.attr("id", `firstLetter_${incrementer+i}`).addClass("firstLetter");
                    break;
                case 1:
                    input.attr("id", `secondLetter_${incrementer+i}`).addClass("secondLetter");
                    break;
                case 2:
                    input.attr("id", `thirdLetter_${incrementer+i}`).addClass("thirdLetter");
                    break;
                case 3:
                    input.attr("id", `fourthLetter_${incrementer+i}`).addClass("fourthLetter");
                    break;
                case 4:
                    input.attr("id", `fifthLetter_${incrementer+i}`).addClass("fifthLetter");
                    break;
            }
                
            inputContainer.append(input);
        }
        inputContainer.append("<br>");
        $("#inputs").append(inputContainer);
    }

}

module.exports = { createInputs };