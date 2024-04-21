# Wordle Assistant

## Description
Wordle Assistant is an improved version of the game Wordle. It allows users to play 1v1 games of Wordle and it has a Wordle helper that returns the best possible word for the user to choose based on their previous inputs and results.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Development](#development)
4. [Testing](#testing)
5. [License](#license)
6. [Contact](#contact)
7. [Acknowledgements](#acknowledgements)

## Installation
To install Wordle Assistant, follow these steps:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the app with `ng serve`.
   # Additional Notes
  If you encounter any errors during installation or setup, please refer to the Angular documentation for troubleshooting tips.

## Usage
- Features:
  - Playing a 1v1 game of Wordle: Two players play in turns: first, player 1 chooses a word and player 2 has 6 chances to guess it. After that it's player 2's turn to pick a word and player 1 will have 6 chances to guess it. The only criteria for the points given at the end of each turn is the number of tries the player had before guessing the correct word. If a player fails to guess the word correctly in 6 tries, no points are given to them.
  - Wordle helper: gives the user the best possible words to use in their next try based on the user's previous inputs.
- User Guide:
  - Playing a 1v1 game of Wordle: Player 1 chooses "Player one" from the "CHOOSE PLAYER'S TURN" menu. Then they choose a word for player 2 to guess. Player 2 then types words into the rows of the wordle until they guess the word choosen by player 1 correctly or until they run out of tries. After that the scoreboard is updated and the game continues with player 1 and player 2 now changing roles.
  - Wordle helper: The player plays a game of Wordle. After they get the result of their first input, they type the word in the input field and press 'submit'. The word is placed in the first row of the Wordle helper grid. Then they choose the color of each letter (the same colors they get in their Wordle game) and they press 'Assist me'. They get as a result the first word from the list of words that our algorithm returned based on their input. The player can then use that word in their game or click 'Want another?', which will give them the next word from the list. The payer can add another row by clicking the '+' button and repeat the whole process again until the algorithm guesses the word correctly or until they run out of tries to guess.

## Development
To contribute to MyWebApp, follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## Testing
To run tests for Wordle Assistant, use the following command:
 (`ng serve`)

## License
Wordle Assistant is not released under any license.

## Contact
For questions or support, contact us at ii7102@student.uni-lj.si.

## Acknowledgements
- [Datamuse API] (https://www.datamuse.com/api/): Datamuse API is a word-finding query engine. It can find words that match a given set of constraints and that are likely in a given context.
