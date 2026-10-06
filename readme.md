# Wordle

A small browser-based Wordle game built with Node.js, Express, and Webpack.

## Project overview

This project lets you play a Wordle-style guessing game in the browser. The server serves the game page, selects a random word, and validates the player guesses.

## Requirements

Before running the project, make sure you have:

- Node.js installed
- npm installed
- A local browser (Chrome, Edge, Firefox, etc.)

## Install the project for now

From the project folder, run:

```bash
npm install
```

This installs the dependencies listed in the project, including Express and Webpack.

## Run it locally

Start the app with:

```bash
npm run start
```

This command runs the build step and then starts the server.

After the server starts, open this address in your browser:

```text
http://localhost:3000
```

If you want to stop the server, press:

```text
Ctrl + C
```

## How to play

1. Open the game in the browser at http://localhost:3000.
2. Click the start button to begin a new game.
3. Choose a difficulty level to set the word length.
4. Enter letters one by one into the Wordle grid.
5. Press Enter when the word is complete.
6. Use the color feedback to guess the hidden word:
   - Green: correct letter in the correct position
   - Yellow: correct letter in the wrong position
   - Red: the letter is not in the word
7. You have 6 attempts
8. Win by guessing the correct word before you run out of attempts.
9. If you run out of attempts you do have the option to get more attempts or just play again or change difficulty.

## Notes

- The game is meant for local use right now.
- The app uses a remote word list when creating random words.
- The default local server port is 3000.

## Useful project structure

- `index.js` — starts the Express server
- `public/` — client-side HTML, CSS, and JavaScript
- `helpers/helpers.js` — word selection and guess matching logic
- `endpoints/controller.js` — game API routes
- `package.json` — scripts and dependencies

## Troubleshooting

If the project does not start:

- make sure Node.js and npm are installed
- run `npm install` again
- make sure no other app is using port 3000
- check the terminal output for the exact error and fix it before restarting