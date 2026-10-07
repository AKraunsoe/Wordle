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
        if(status != "error" && !loggedIn.success){
            //jQuery.ajaxSetup({async: true});
            $.get("pages/content/buttons/createAccount.html", "", (data) => { $("#contentContainer").append(data) })
            $.get("pages/content/loginForm.html",'', (data) => { $("#contentContainer").append(data) });
        }
    });
}

const loadDifficultyButtons = () => {
    clearContent();
    loadContent("pages/content/buttons/difficultyButtons.html");
}

const loadContent = (file, callback = ()=>{}) => {
    $("#contentContainer").load(file, callback);
}

module.exports = { loadStartScreen, loadDifficultyButtons, clearContent, loadContent }