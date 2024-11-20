# Rook VS Bishop

Prompt solution for the "Rook VS Bishop" programming prompt.

## Running locally
This project use NodeJS, Yarn and TypeScript. To install dependencies and run the program, execute the below command which will:

```
yarn && yarn sim
```

This command will:

* Install dependencies using Yarn
   * Yarn use `npm` under the hood, so you'll need NPM installed. See [npm installation instructions here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
   * After npm is installed, yarn can be installed with `npm install --global yarn`
* Compile the TypeScript files to JavaScript files, which will be outputted in the `dist` folder
* Execute the entrypoint of the program, which is the compiled `dist/index.js` file.

**NOTE** If you don't have certain dependencies installed, like `jest`, you may need to add them globally using `yarn global add jest`

## Expected output
The output of the program is written to stdout using `console.log`, so it will be in the terminal instance used to run it. It will print the board state and the rook's movement on each turn until a winner is determined, which will also be logged. In the formatted grid output the rook is represented with an `R`, the bishop with a `B` and unoccupied spaces with a `-`

<details>
<summary>Click to expand and see sample output</summary>

```
jim@jim-mbp18:rook-vs-bishop [main !] yarn sim
yarn run v1.22.4
$ yarn build && node dist/index.js
$ tsc
Board after 0 turns
- - - - - - - -
- - - - - - - -
- - - - - - - -
- - - - - - - -
- - - - - - - -
- - B - - - - -
- - - - - - - -
- - - - - - - R


Moving rook RIGHT 7 spaces from h1 to g1
Board after 1 turns
- - - - - - - -
- - - - - - - -
- - - - - - - -
- - - - - - - -
- - - - - - - -
- - B - - - - -
- - - - - - - -
- - - - - - R -


Moving rook RIGHT 6 spaces from g1 to e1
Board after 2 turns
- - - - - - - -
- - - - - - - -
- - - - - - - -
- - - - - - - -
- - - - - - - -
- - B - - - - -
- - - - - - - -
- - - - R - - -


Bishop(W) won after 2 turns
```
</details>

## Code Overview
There are 3 main files in the project

* `game-board.ts`, which has 2 main classes:
   * `GamePiece` - an abstract class meant to be extended by specific game piece types. This code has chess pieces, but there's no reason you couldn't implment a game of checkers for example, as well. The abstract class defines the common properties like id, row, column, name, player and `isValidMove` which each game piece needs to implement.
   * `GameBoard` - concrete class that assumes a grid-based board being used to run a game. This controls the live state of the running game and operations to do things like get a particular piece by it's ID, or move said piece to a new location.
* `simulator.ts` - An opinionated concrete class meant to encapsulate the non-generic "board game" functionality found in `game-board.ts`. This contains the specific business of the prompt. It's initialized with the initial postion of the rook, the bishop and how many turns to execute for the simulation (15, per the prompt). The only externally-necessary methods the class' constructor and the `simulate()` method. It also returns an opinionated `SimResult` which is used to print the results of the simulation;
* `chess-pieces.ts` - This contains the concrete chess-specific implementations of the abstract `GamePiece` class. You'll see these are light since most of the necessary properties are defined in `GamePiece`, but the important logic is in each piece's `isValidMove` implementation.

## Running Tests
The tests use Jest and can executed with the following command:

```
yarn test
```