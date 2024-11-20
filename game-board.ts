export enum Player {
  WHITE,
  BLACK
}

/**
 * Simple tuple for x-y or row-column style coordinates
 */
export type Position = readonly [number, number];

export abstract class GamePiece {

  constructor(row: number, column: number, player: Player) {
    this.row = row;
    this.column = column;
    this.player = player;
    this.id = crypto.randomUUID();
  }

  abstract readonly name: string;
  readonly id: string;
  row: number;
  column: number;
  readonly player: Player;

  /**
   * Given a position, determines whether moving to that position is valid
   * for this particular piece.
   * 
   * @param position 
   * @returns true if valid, otherwise false
   */
  abstract isValidMove(position: Position): boolean;

  toString() {
    return `${this.name}(${Player[this.player][0]})`;
  }
}

export class GameBoard {

  boardState: (GamePiece | null)[][];

  constructor(rowCount: number, columnCount: number, gamePieces: GamePiece[] = []) {
    this.boardState = [];

    for (let i = 0; i < rowCount; i++) {
      const row = Array<null | GamePiece>(columnCount).fill(null);
      this.boardState.push(row);
    }

    gamePieces.forEach(piece => {
      const { row, column } = piece;
      this.boardState[row][column] = piece;
    });
  }

  getPieceById(pieceId: string): GamePiece | undefined {
    const foundPiece = this.boardState.flat().find(pieceOrNull => {
      return pieceOrNull !== null && (pieceOrNull as GamePiece).id === pieceId;
    });

    return (foundPiece as GamePiece) || undefined;
  }

  getPieceByPosition(position: Position): GamePiece | undefined {
    const [row, column] = position;
    const piece = this.boardState[row][column];
    return piece || undefined;
  }

  addPiece(piece: GamePiece, position: Position): void {
    const [toRow, toColumn] = position;
    this.boardState[toRow][toColumn] = piece;
    piece.row = toRow;
    piece.column = toColumn;
  }

  movePiece(pieceId: string, position: Position) {
    const [toRow, toColumn] = position;
    const piece = this.getPieceById(pieceId);
    if (!piece) {
      throw new Error(`No piece found for id: ${pieceId}`);
    }

    const isValidMove = piece.isValidMove([toRow, toColumn]);

    if (isValidMove) {
      this.boardState[piece.row][piece.column] = null;
      this.boardState[toRow][toColumn] = piece;
      piece.row = toRow;
      piece.column = toColumn;
    } else {
      const errMsg = `Invalid move for ${piece} to row: ${toRow} col: ${toColumn}\nBoard state\n${this}`;
      throw new Error(errMsg);
    }
  }

  /**
   * toString override. Formats the board as a grid, where null values are represented 
   * as hyphens and pieces show the first character of their toString method
   * @returns string of the formatted grid
   */
  toString() {
    const columns = this.boardState.map(row => {
      return row.map(pieceOrNull => {
        return pieceOrNull === null ? '-' : pieceOrNull.toString()[0];
      });
    });

    return columns.join('\n').replace(/\,/g, ' ');
  }
}

