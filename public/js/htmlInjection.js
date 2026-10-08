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

const createFriend = (username) => {
    const friendsList = $(document).find('#friendSearchResults');
    friendsList.empty();

    const friendItem = $('<div>').addClass('friend-search-result d-flex align-items-stretch gap-2');
    const friendName = $('<span>').addClass('d-flex align-items-center flex-grow-1').text(username);
    const addFriendButton = $('<button>')
        .attr('type', 'button')
        .attr('id', 'addFriend')
        .attr('data-username', username)
        .addClass('btn')
        .text('+');

    friendItem.append(friendName, addFriendButton);
    friendsList.append(friendItem);
}

const showFriends = (data) => {
    const contentContainer = $(document).find('#contentContainer').empty();

    if (data.friendCount === 0) {
        contentContainer.append($('<p>').text('looks like you have no friends'));
        return;
    }

    for (const friend of data.friends) {
        const username = friend.username;
        const friendItem = $('<div>').addClass('friend-search-result d-flex align-items-stretch gap-2');
        const friendName = $('<span>').addClass('d-flex align-items-center flex-grow-1').text(username);
        const battleButton = $('<button>')
            .attr('type', 'button')
            .attr('data-username', username)
            .attr('startBattle')
            .addClass('btn')
            .text('Battle');

        friendItem.append(friendName, battleButton);
        contentContainer.append(friendItem, $('<br>'));
    }
}

module.exports = { createInputs, createFriend, showFriends };