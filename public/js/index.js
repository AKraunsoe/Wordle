
$(() => {
    console.log("test");
    loadStartButton()
});

const loadStartButton = () => {
    $("#contentContainer").empty()
    $("#contentContainer").load("pages/content/startButton.html");
}

module.exports = { loadStartButton }