import { Evaluable } from './ai/pmcs-interface';

export class GameContextData {
  readonly rows: number;
  readonly columns: number;

  grid: Uint8Array;
  currentState: number;
  winner: number;

  constructor(
    rows: number,
    columns: number,
    current: number,
    defaultState?: number
  ) {
    this.rows = rows;
    this.columns = columns;
    this.winner = 0;

    const size = rows * columns;
    this.currentState = current;
    this.grid = new Uint8Array(size);

    if (defaultState && defaultState != 0) {
      for (let i = 0; i < size; ++i) {
        this.grid[i] = defaultState;
      }
    }
  }

  copy(): GameContextData {
    let context: GameContextData = new GameContextData(
      this.rows,
      this.columns,
      this.currentState
    );
    context.grid = this.grid.slice(0);
    return context;
  }
}

export class GameContext implements Evaluable {
  static readonly COLUMNS: number = 7;
  static readonly ROWS: number = 6;
  static readonly STATE_DEFAULT: number = 0;
  static readonly STATE_X: number = 1;
  static readonly STATE_O: number = 2;
  static readonly STATE_UNKNOWN: number = 3;
  static readonly WIN_CONSECUTIVE: number = 4;

  private static readonly MAX_GRID_INDEX: number =
    GameContext.COLUMNS * GameContext.ROWS - 1;

  private _context: GameContextData;

  constructor() {
    this._context = new GameContextData(
      GameContext.ROWS,
      GameContext.COLUMNS,
      GameContext.STATE_X,
      GameContext.STATE_DEFAULT
    );
  }

  moves(): number[] {
    return this._getValidMoves();
  }

  applyMove(move: number): void {
    this._executeMove(move);
  }

  simulateMove(move: number): GameContext {
    let gameContext: GameContext = new GameContext();
    gameContext._context = this._context.copy();
    gameContext._executeMove(move);
    return gameContext;
  }

  over(): boolean {
    return (
      this._context.winner !== GameContext.STATE_DEFAULT ||
      this._getValidMoves().length === 0
    );
  }

  winner(): string {
    let winner = '';
    if (this._context.winner !== GameContext.STATE_DEFAULT) {
      winner = this._context.winner === GameContext.STATE_X ? 'X' : 'O';
    }
    return winner;
  }

  private _checkWin(row: number, column: number, state: number) {
    let checkHorizontal = (
      row: number,
      column: number,
      goRight: boolean
    ): boolean => {
      let counter = 0;
      let direction = goRight ? 1 : -1;

      for (
        let currentColumn = column;
        currentColumn >= 0 && currentColumn < GameContext.COLUMNS;
        currentColumn += direction
      ) {
        if (this._atGrid(row, currentColumn) === state) {
          ++counter;
        } else {
          break;
        }
      }

      return counter >= GameContext.WIN_CONSECUTIVE;
    };

    let checkVertical = (
      row: number,
      column: number,
      goUp: boolean
    ): boolean => {
      let counter = 0;
      let direction = goUp ? -1 : 1;

      for (
        let currentRow = row;
        currentRow >= 0 && currentRow < GameContext.ROWS;
        currentRow += direction
      ) {
        if (this._atGrid(currentRow, column) === state) {
          ++counter;
        } else {
          break;
        }
      }

      return counter >= GameContext.WIN_CONSECUTIVE;
    };

    let checkDiagonal = (
      row: number,
      column: number,
      direction: boolean
    ): boolean => {
      let currentRow = row;
      let currentColumn = column;
      let directionParity = direction ? -1 : 1;
      let counter = 0;

      const isValid = (row: number, column: number): boolean => {
        return (
          row >= 0 &&
          row < GameContext.ROWS &&
          column >= 0 &&
          column < GameContext.COLUMNS
        );
      };

      while (isValid(currentRow, currentColumn)) {
        if (this._atGrid(currentRow, currentColumn) === state) {
          ++counter;
        } else {
          break;
        }
        currentRow += directionParity;
        currentColumn += directionParity;
      }

      return counter >= GameContext.WIN_CONSECUTIVE;
    };

    let winnerExists: boolean = false;

    for (let checkFunc of [checkHorizontal, checkVertical, checkDiagonal]) {
      for (let directionParity of [true, false]) {
        if (checkFunc(row, column, directionParity)) {
          winnerExists = true;
          this._context.winner = state;
          break;
        }
      }
    }

    if (!winnerExists) {
      this._context.winner = GameContext.STATE_DEFAULT; // Safe reset
    }
  }

  private _setGrid(row: number, column: number, state: number): void {
    let index = this._getIndex(row, column);
    if (index != -1) {
      this._context.grid[index] = state;
    }
  }

  private _atGrid(row: number, column: number): number {
    let index = this._getIndex(row, column);
    return this._isValidIndex(index)
      ? this._context.grid[index]
      : GameContext.STATE_UNKNOWN;
  }

  private _isValidCoordinate(row: number, column: number): boolean {
    return this._getIndex(row, column) != -1;
  }

  private _isValidIndex(index: number): boolean {
    return index >= 0 && index <= GameContext.MAX_GRID_INDEX ? true : false;
  }

  private _getIndex(row: number, column: number): number {
    let index = row * GameContext.COLUMNS + column;
    return this._isValidIndex(index) ? index : -1;
  }

  private _getValidMoves(): number[] {
    let moves: number[] = [];
    for (let column = 0; column < GameContext.COLUMNS; ++column) {
      if (this._isValidMove(column)) {
        moves.push(column);
      }
    }
    return moves;
  }

  private _isValidMove(column: number): boolean {
    // Top row in the column should be empty
    return this._atGrid(0, column) === GameContext.STATE_DEFAULT;
  }

  private _executeMove(column: number): void {
    if (this._isValidMove(column)) {
      let moveRow = -1;

      // Locate row
      for (let row = GameContext.ROWS - 1; row >= 0; --row) {
        if (this._atGrid(row, column) === GameContext.STATE_DEFAULT) {
          this._setGrid(row, column, this._context.currentState);
          moveRow = row;
          break;
        }
      }

      this._checkWin(moveRow, column, this._context.currentState);

      this._context.currentState =
        this._context.currentState === GameContext.STATE_X
          ? GameContext.STATE_O
          : GameContext.STATE_X;
    }
  }
}