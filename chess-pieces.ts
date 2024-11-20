import { GamePiece, Player, Position } from "./game-board";

export class Bishop extends GamePiece {

  name = 'Bishop';

  constructor(row: number, column: number, player: Player) {
    super(row, column, player);
  }

  /**
   * A diagonal move in any direction, for any amount of spaces is valid for a bishop
   * @param position 
   * @returns 
   */
  isValidMove(position: Position): boolean {
    const [toRow, toColumn] = position;
    const diffX = Math.abs(toRow - this.row);
    const diffY = Math.abs(toColumn - this.column);

    return diffX === diffY;
  }
}

export class Rook extends GamePiece {
  name = 'Rook';

  constructor(row: number, column: number, player: Player) {
    super(row, column, player);
  }

  /**
   * An orthogonal move in any direction, for any amount of spaces is valid for a rook.
   * @param position 
   * @returns 
   */
  isValidMove(position: Position): boolean {
    const [toRow, toColumn] = position;
    const isSameRow = toRow === this.row;
    const isSameColumn = toColumn === this.column;

    return isSameRow || isSameColumn;
  }
}