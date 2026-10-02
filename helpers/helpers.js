
const selectRandomWord = (words, req) => {
    const wordCount = words.length || -1;
    if(wordCount <= 0) {
        return null;
    }
    let randomNumber = Math.floor(Math.random() * wordCount);
    const word = words[randomNumber].toUpperCase();
    if(!word){
        return false;
    }
    req.session.selectedWord = word;
    createWordObject(word, req);
    return true;
};

const createWordObject = (word, req) => {

    const letters = word.split('');
    let wordObject = {};
    for(let i = 0; i < letters.length; i++){
        let letter = letters[i];
        if(wordObject[letter]){
            wordObject[letter].position.push(i);
            wordObject[letter].count++;
            continue;
        }
        wordObject[letter] = {
            position: [i],
            count: 1
        }
    }

    req.session.wordObject = wordObject;

}

const matchGuess = (wordObject, guess) => {
    let result = [];
    const foundLetterObject = {}
    for(let i = 0; i < guess.length; i++){
        let letter = guess[i];
        if(!wordObject[letter]){
            result.push(0);
            continue;
        }

        if(!foundLetterObject[letter]){
            foundLetterObject[letter] = 1
        }else{
            foundLetterObject[letter]++;
        }

        if(foundLetterObject[letter] > wordObject[letter].count){
            result.push(0);
            continue;
        }

        if(wordObject[letter].position.indexOf(i) != -1){
            result.push(2);
        }else{
            result.push(1);
        }

    }

    return result;
}

module.exports = { selectRandomWord, 
                    matchGuess };