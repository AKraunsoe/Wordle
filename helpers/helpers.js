
const selectRandomWord = (words) => {
    const wordCount = words.length || -1;
    if(wordCount <= 0) {
        return null;
    }
    let randomNumber = Math.floor(Math.random() * wordCount);
    return words[randomNumber];
};

const matchGuess = (selectedWord, guess) => {
    let result = [];
    for(let i = 0; i < guess.length; i++){
        if(guess[i] === selectedWord[i]){
            result.push(2);
        }
        else if(selectedWord.indexOf(guess[i]) != -1){
            result.push(1);
        }else {
            result.push(0);
        }
    }

    return result;
}

module.exports = { selectRandomWord, 
                    matchGuess };