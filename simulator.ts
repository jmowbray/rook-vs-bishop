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

  calculateMoveData(): RookMoveData {
    const direction = this.flipCoin() === 0 ? Direction.RIGHT : Direction.UP;
    const numberOfSpaces = this.rollDie() + this.rollDie();
    return { direction, numberOfSpaces };
  }

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

  logRookMovement(oldPosition: Position, newPosition: Position, moveData: RookMoveData): void {
    const oldPositionStr = this.positionAsRankAndFile(oldPosition);
    const newPositionStr = this.positionAsRankAndFile(newPosition);
    const msg = `Moving rook ${Direction[moveData.direction]} ${moveData.numberOfSpaces} spaces from ${oldPositionStr} to ${newPositionStr}`;
    console.log(msg);
  }

  logBoardState(): void {
    console.log(`Board after ${this.numberOfTurns} turns\n${this.gameBoard}\n\n`);
  }

  positionAsRankAndFile(position: Position): string {
    const [row, column] = position;
    return `${CHESS_FILES[column]}${CHESS_RANKS[row]}`;
  }

  flipCoin(): number {
    return randBetweenInclusive(0, 1);
  }

  rollDie(): number {
    return randBetweenInclusive(1, 6);
  }
}

