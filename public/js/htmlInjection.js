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

const showFriends = (contentContainer, data) => {
    contentContainer.empty();

    if (data.friendCount === 0) {
        contentContainer.append($('<p>').text('looks like you have no friends. Battle mode only works with friends at the moment'));
        return;
    }

    for (const friend of data.friends) {
        const username = friend.username;
        const online = friend.online;
        const friendItem = $('<div>').addClass('friend-search-result');
        const statusIndicator = $('<span>')
            .addClass(`friend-status ${online ? 'text-success' : 'text-danger'}`)
            .attr('role', 'img')
            .attr('aria-label', online ? 'Online' : 'Offline')
            .text(online ? '●' : 'X');
        const friendName = $('<span>').addClass('friend-name').text(username);
        const battleButton = $('<button>')
            .attr('type', 'button')
            .attr('data-username', username)
            .attr('data-online', online)
            .attr('id', 'startBattle')
            .addClass('btn')
            .prop('disabled', !online)
            .text('Battle');

        friendItem.append(statusIndicator, friendName, battleButton);
        contentContainer.append(friendItem, $('<br>'));
    }
}

module.exports = { createInputs, createFriend, showFriends };