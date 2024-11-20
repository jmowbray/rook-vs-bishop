import { Rook } from "../chess-pieces";
import { GameBoard, GamePiece, Player } from "../game-board";

describe('game-board', () => {
  describe('GameBoard class', () => {

    describe('initialization', () => {
      it('should populate create a board state grid based on row and col count', () => {
        const twoByTwoBoard = new GameBoard(2, 2);
        const boardState = twoByTwoBoard.boardState;
        const expectedEmptyBoard = [
          [null, null],
          [null, null]
        ];
  
        expect(boardState).toEqual(expectedEmptyBoard);
      });
  
      it('should add any pieces provided to the constructor', () => {
        const initialRow = 0;
        const initialCol = 0;
        const expectedInitialPiece = new Rook(initialRow, initialCol, Player.BLACK);
  
        const twoByTwoBoard = new GameBoard(2, 2, [expectedInitialPiece]);
        const actualPiece = twoByTwoBoard.boardState[initialRow][initialCol];
        
        expect(actualPiece).toEqual(expectedInitialPiece);
      });
    });

    describe('getPieceByid', () => {
      it('should return a piece by its id, if it exists', () => {
        const expectedInitialPiece = new Rook(0, 0, Player.BLACK);
  
        const twoByTwoBoard = new GameBoard(2, 2, [expectedInitialPiece]);
        const actualPiece = twoByTwoBoard.getPieceById(expectedInitialPiece.id);

        expect(actualPiece).toBeDefined();
        expect(actualPiece?.id).toEqual(expectedInitialPiece.id);
      });

      it('should return undefined if no such piece exists', () => {
        const expectedInitialPiece = new Rook(0, 0, Player.BLACK);
  
        const twoByTwoBoard = new GameBoard(2, 2, [expectedInitialPiece]);
        const actualPiece = twoByTwoBoard.getPieceById('not-a-valid-piece-id');

        expect(actualPiece).not.toBeDefined();
      });
    });

    describe('getPieceByPosition', () => {
      it('returns the piece at the position, if there is one', () => {
        const initialRow = 0;
        const initialCol = 0;
        const initialPiece = new Rook(initialRow, initialCol, Player.BLACK);
        const twoByTwoBoard = new GameBoard(2, 2, [initialPiece]);
  
        const actualPiece = twoByTwoBoard.getPieceByPosition([initialRow, initialCol]);
  
        expect(actualPiece).toBeDefined();
        expect(actualPiece?.id).toEqual(initialPiece.id);
      });

      it('returns undefined if there is not a piece at that position', () => {
        const twoByTwoBoard = new GameBoard(2, 2);

        const actualPiece = twoByTwoBoard.getPieceByPosition([0, 0]);

        expect(actualPiece).not.toBeDefined();
      });
    });

    describe('addPiece', () => {
      const twoByTwoBoard = new GameBoard(2, 2);
      const initialRow = 0;
      const initialCol = 0;
      const addedRow = 1;
      const addedCol = 1;

      const pieceToAdd = new Rook(initialRow, initialCol, Player.BLACK);
      twoByTwoBoard.addPiece(pieceToAdd, [addedRow, addedCol]);

      const actualPiece = twoByTwoBoard.getPieceById(pieceToAdd.id);

      expect(actualPiece).toBeDefined();
      expect(actualPiece?.row).toEqual(addedRow);
      expect(actualPiece?.column).toEqual(addedCol);
    });

    describe('movePiece', () => {
      it('should move a piece', () => {
        const initialRow = 0;
        const initialCol = 0;
        const newRow = 0;
        const newCol = 1;
        const expectedInitialPiece = new Rook(initialRow, initialCol, Player.BLACK);

        const twoByTwoBoard = new GameBoard(2, 2, [expectedInitialPiece]);
        const actualPiece = twoByTwoBoard.getPieceById(expectedInitialPiece.id);

        twoByTwoBoard.movePiece((actualPiece as GamePiece).id, [newRow, newCol]);

        expect(actualPiece?.row).toEqual(newRow);
        expect(actualPiece?.column).toEqual(newCol);
      });

      it('should throw an error if no such piece exists to move', () => {
        const twoByTwoBoard = new GameBoard(2, 2);

        expect(() => {
          twoByTwoBoard.movePiece('invalid-piece-id', [0, 0]);
        }).toThrow('No piece found')
      });

      it('should throw an error if it is an invalid move', () => {
        const initialRow = 0;
        const initialCol = 0;
        const initialPiece = new Rook(initialRow, initialCol, Player.BLACK);
        const twoByTwoBoard = new GameBoard(2, 2, [initialPiece]);
        const invalidRow = initialRow + 1;
        const invalidCol = initialCol + 1;

        expect(() => {
          twoByTwoBoard.movePiece(initialPiece.id, [invalidRow, invalidCol]);
        }).toThrow('Invalid move');
      });
    });
  });
});