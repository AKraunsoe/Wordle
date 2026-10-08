# Wordle

A small browser-based Wordle game built with Node.js, Express, and Webpack.

## Project overview

This project lets you play a Wordle-style guessing game in the browser. The server serves the game page, selects a random word, and validates the player guesses.

## Requirements

Before running the project, make sure you have:

- Node.js installed
- npm installed
- PostgreSQL installed and running
- A local browser (Chrome, Edge, Firefox, etc.)

Install PostgreSQL for your operating system from the [official PostgreSQL downloads page](https://www.postgresql.org/download/). The installer includes PostgreSQL Server and can include pgAdmin, a graphical database management tool.

## Set up the database

Create a database named `wordle` using pgAdmin or the PostgreSQL command line. For example, connect as the PostgreSQL administrator and run:

```sql
CREATE DATABASE wordle;
```

Connect to the new `wordle` database, then create the tables used by the application:

```sql
CREATE TABLE accounts (
   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   username TEXT NOT NULL UNIQUE,
   password TEXT NOT NULL
);

CREATE TABLE words (
   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   word TEXT NOT NULL,
   word_length INTEGER NOT NULL
);

CREATE TABLE friendships (
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    friend_id  BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (account_id, friend_id),
    CHECK (account_id < friend_id)
);
```

For `psql`, connect to the database with `psql -U postgres -d wordle`, then paste the `CREATE TABLE` statements. Replace `postgres` with your PostgreSQL role if you use a different one.

## Configure environment variables

Create a `.env` file in the project root (beside `package.json`) with the connection string for your local database and a private secret used to sign login tokens and Express sessions:

```dotenv
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/wordle
SECRET=YOUR_RANDOM_SECRET
```

Replace `YOUR_POSTGRES_PASSWORD` with the password for your PostgreSQL role. Generate a strong value for `SECRET` by running this from the project directory:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into `SECRET`. Keep `.env` private and do not commit real credentials or secrets to source control.

## Install the project

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