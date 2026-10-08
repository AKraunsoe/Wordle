const {createWordList, checkLoggedIn} = require('./backendCalls');

$(() => {
    const now = new Date().getMilliseconds()
    console.log("test ");
    loadStartScreen();
    console.log("test 2 " + now-new Date().getMilliseconds());
});

$(async () => {
    const now = new Date().getMilliseconds()
    console.log("test async");
    await createWordList();
    console.log("test async 2 " + now-new Date().getMilliseconds());
});

const clearContent = () => {
    $("#contentContainer").empty();
}

const loadStartScreen = () => {
    clearContent()
    loadContent("pages/content/startPage.html", async (response, status, xhr) => {
        const loggedIn = await checkLoggedIn()
        if(status != "error"){
            if(!loggedIn.success){
                $.get("pages/content/buttons/createAccount.html", "", (data) => { $("#contentContainer").append(data) });
                $.get("pages/content/loginForm.html",'', (data) => { $("#contentContainer").append(data) });
            }else{
                $.get("pages/content/buttons/addFriends.html", "", (data) => { $("#contentContainer").append(data) });
                $.get("pages/content/buttons/logoutButton.html", "", (data) => { $("#contentContainer").append(data) });
            }
        }
    });
}

const loadDifficultyButtons = () => {
    clearContent();
    loadContent("pages/content/buttons/difficultyButtons.html", (response, status, xhr) =>{
        if(status != "error"){
            $.get("pages/content/buttons/backToStart.html",'', (data) => { $("#contentContainer").append(data) });
        }
    });
}

const loadContent = (file, callback = ()=>{}) => {
    $("#contentContainer").load(file, callback);
}

module.exports = { loadStartScreen, loadDifficultyButtons, clearContent, loadContent }