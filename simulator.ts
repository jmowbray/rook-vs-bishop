import { Bishop, Rook } from "./chess-pieces";
import { GameBoard, GamePiece, Player, Position } from "./game-board";
import { randBetweenInclusive } from "./utils";

export const CHESS_RANKS = [8, 7, 6, 5, 4, 3, 2, 1];
export const CHESS_FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

enum Direction {
  UP,
  RIGHT
};

export type SimResult = {
  winner: GamePiece;
  numberOfTurns: number;
}

export type RookMoveData = {
  direction: Direction;
  numberOfSpaces: number;
}

/**
 * Main business logic for the rook-vs-bishop specific busines logic.
 */
export class Simulator {

  rook: Rook;
  bishop: Bishop;
  maximumTurns: number;
  gameBoard: GameBoard;
  numberOfTurns: number;

  constructor(rookStart: Position, bishopStart: Position, maximumTurns: number) {
    this.rook = new Rook(rookStart[0], rookStart[1], Player.BLACK);
    this.bishop = new Bishop(bishopStart[0], bishopStart[1], Player.WHITE);
    this.gameBoard = new GameBoard(CHESS_RANKS.length, CHESS_FILES.length, [this.rook, this.bishop]);
    this.maximumTurns = maximumTurns;
    this.numberOfTurns = 0;
  }

  /**
   * Main method that runs the simulation, by randomly movinmg the rook and evaluating if there's a winner
   * based on the arguments provided to the constructor for instantiation up to the maximumTurns amount of iterations
   * 
   * @returns results of the simulation, including who won and how many turns it took
   */
  simulate(): SimResult {
    this.logBoardState();

    let winner: GamePiece | undefined;
    
    for (let i = 0; i < this.maximumTurns; i++) {      
      winner = this.determineWinner();
      if (!!winner) {
        break;
      }

      this.numberOfTurns++;
      this.moveRook();
      this.logBoardState();
    }

    if (!winner) {
      winner = this.rook;
    }

    return { winner, numberOfTurns: this.numberOfTurns };
  }

  /**
   * Moves the rook randomly and logs the result
   */
  moveRook(): void {
    const moveData = this.calculateMoveData();
    const { direction: moveDirection, numberOfSpaces: spacesToMove } = moveData;
    const currentColumn = this.rook.column;
    const currentRow = this.rook.row;
    let newRow = currentRow;
    let newColumn = currentColumn;

    if (moveDirection === Direction.RIGHT) {
      // Move right, wrapping back to the left if end of board is reached
      newColumn = Math.abs((currentColumn + spacesToMove) % CHESS_FILES.length);
    } else if (moveDirection === Direction.UP) {
      // Move up, wrapping back to the bottom if end of board is reached
      let moveToRow = currentRow - spacesToMove;
      newRow = moveToRow;
      if (moveToRow < 0) {
        const wrappedRemainder = Math.abs(moveToRow) % CHESS_RANKS.length;
        newRow = wrappedRemainder === 0 ? 0 : (CHESS_RANKS.length - wrappedRemainder);
      }
    } else {
      throw new Error('No direction to move the rook!')
    }

    this.gameBoard.movePiece(this.rook.id, [newRow, newColumn]);
    this.logRookMovement([currentRow, currentColumn], [newRow, newColumn], moveData);
  }

  /**
   * Determines how the rook should randomly move. Currently based on a coin flip and rolling dice.
   * 
   * @returns which direction and how many spaces
   */
  calculateMoveData(): RookMoveData {
    const direction = this.flipCoin() === 0 ? Direction.RIGHT : Direction.UP;
    const numberOfSpaces = this.rollDie() + this.rollDie();
    return { direction, numberOfSpaces };
  }

  /**
   * Evaluates both the rook and bishop to see if either piece can capture the other.
   *  
   * @returns the winner if there is one, or undefined if there isn't.
   */
  determineWinner(): GamePiece | undefined {
    let winner: GamePiece | undefined = undefined;
    const rookCanCaptureBishop = this.rook.isValidMove([this.bishop.row, this.bishop.column]);
    const bishopCanCaptureRook = this.bishop.isValidMove([this.rook.row, this.rook.column]);

    if (rookCanCaptureBishop) {
      winner = this.rook;
    }
    if (bishopCanCaptureRook) {
      winner = this.bishop
    }
    
    return winner;
  }

  /**
   * Writes movemet of the rook to stdout, including where it came from and where it's going.
   * @param oldPosition 
   * @param newPosition 
   * @param moveData 
   */
  logRookMovement(oldPosition: Position, newPosition: Position, moveData: RookMoveData): void {
    const oldPositionStr = this.positionAsRankAndFile(oldPosition);
    const newPositionStr = this.positionAsRankAndFile(newPosition);
    const msg = `Moving rook ${Direction[moveData.direction]} ${moveData.numberOfSpaces} spaces from ${oldPositionStr} to ${newPositionStr}`;
    console.log(msg);
  }

  /**
   * Prints the entire formated board state to stdout
   */
  logBoardState(): void {
    console.log(`Board after ${this.numberOfTurns} turns\n${this.gameBoard}\n\n`);
  }

  /**
   * Returns a string representing the chess-specific rank-and-file notation
   * for a piece given its position by row-and-column
   * @param position 
   * @returns the chess-specific rank-and-file notation
   */
  positionAsRankAndFile(position: Position): string {
    const [row, column] = position;
    return `${CHESS_FILES[column]}${CHESS_RANKS[row]}`;
  }

  /**
   * Returns random result between 0 and 1
   * @returns 
   */
  flipCoin(): number {
    return randBetweenInclusive(0, 1);
  }

  /**
   * Returns random result between 1 and 6, for standard 6-sided die.
   * @returns 
   */
  rollDie(): number {
    return randBetweenInclusive(1, 6);
  }
}

