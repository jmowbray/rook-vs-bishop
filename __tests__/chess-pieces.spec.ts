import { Bishop, Rook } from "../chess-pieces";
import { Player } from "../game-board";

describe('Rook piece', () => {
  it('can move orthogonally', () => {
    const startingRow = 5;
    const startingCol = 5;
    const rook = new Rook(startingRow, startingCol, Player.BLACK);
    const isUpValid = rook.isValidMove([startingRow + 1, startingCol]);

    expect(isUpValid).toBeTruthy();
  });

  it('cannot move diagonally', () => {
    const startingRow = 5;
    const startingCol = 5;
    const rook = new Rook(startingRow, startingCol, Player.BLACK);
    const isDownLeftValid = rook.isValidMove([startingRow + 1, startingCol - 1]);

    expect(isDownLeftValid).toBeFalsy();
  });
});

describe('Bishop piece', () => {
  it('can move diagonally', () => {
    const startingRow = 5;
    const startingCol = 5;
    const bishop = new Bishop(startingRow, startingCol, Player.BLACK);
    const isDownLeftValid = bishop.isValidMove([startingRow + 1, startingCol - 1]);

    expect(isDownLeftValid).toBeTruthy();
  });

  it('cannot move orthogonally', () => {
    const startingRow = 5;
    const startingCol = 5;
    const bishop = new Bishop(startingRow, startingCol, Player.BLACK);
    const isDownValid = bishop.isValidMove([startingRow + 1, startingCol]);

    expect(isDownValid).toBeFalsy();
  });
});