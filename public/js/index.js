
$(() => {
    console.log("test");
    loadStartButton()
});

const loadStartButton = () => {
    $("#contentContainer").empty();
    $("#contentContainer").load("pages/content/startButton.html");
}

const loadDifficultyButtons = () => {
    $("#contentContainer").empty();
    $("#contentContainer").load("pages/content/difficultyButtons.html");
}

module.exports = { loadStartButton, loadDifficultyButtons }