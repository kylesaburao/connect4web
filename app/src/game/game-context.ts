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
}

export class ConnectContext implements Evaluable {
  static readonly COLUMNS: number = 7;
  static readonly ROWS: number = 6;
  static readonly STATE_DEFAULT: number = 0;
  static readonly STATE_BLACK: number = 1;
  static readonly STATE_RED: number = 2;
  static readonly STATE_UNKNOWN: number = 3;
  static readonly WIN_CONSECUTIVE: number = 4;

  private static readonly MAX_GRID_INDEX: number =
    ConnectContext.COLUMNS * ConnectContext.ROWS - 1;

  _context: GameContextData;

  constructor() {
    this._context = new GameContextData(
      ConnectContext.ROWS,
      ConnectContext.COLUMNS,
      ConnectContext.STATE_BLACK,
      ConnectContext.STATE_DEFAULT
    );
  }

  moves(): number[] {
    return this._getValidMoves();
  }

  applyMove(move: number): boolean {
    return this._executeMove(move);
  }

  simulateMove(move: number): ConnectContext {
    let gameContext: ConnectContext = new ConnectContext();
    gameContext._context = new GameContextData(
      this._context.rows,
      this._context.columns,
      this._context.currentState
    );
    gameContext._context.grid = this._context.grid.slice(0);
    gameContext._executeMove(move);
    return gameContext;
  }

  over(): boolean {
    return (
      this._context.winner !== ConnectContext.STATE_DEFAULT ||
      this._getValidMoves().length === 0
    );
  }

  winner(): string {
    let winner = '';
    if (this._context.winner !== ConnectContext.STATE_DEFAULT) {
      winner = this._context.winner === ConnectContext.STATE_BLACK ? 'B' : 'R';
    }
    return winner;
  }

  currentPlayer(): number {
    return this._context.currentState;
  }

  winningPlayer(): number {
    return this._context.winner;
  }

  defaultState(): number {
    return ConnectContext.STATE_DEFAULT;
  }

  atPosition(row: number, column: number): string {
    let state = this._atGrid(row, column);
    return state === ConnectContext.STATE_DEFAULT
      ? ''
      : state === ConnectContext.STATE_BLACK
      ? 'B'
      : 'R';
  }

  private _checkWin(row: number, column: number, state: number): boolean {
    for (let deltas of [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ]) {
      let leftCounter = 0;
      let rightCounter = 0;

      for (let parity of [1, -1]) {
        const dRow = deltas[0] * parity;
        const dColumn = deltas[1] * parity;
        const isGoingLeft = parity === 1 ? true : false;

        let currentRow = row + dRow;
        let currentColumn = column + dColumn;

        while (this._isValidCoordinate(currentRow, currentColumn)) {
          if (this._atGrid(currentRow, currentColumn) === state) {
            if (isGoingLeft) {
              ++leftCounter;
            } else {
              ++rightCounter;
            }
            currentRow += dRow;
            currentColumn += dColumn;
          } else {
            break;
          }
        }
      }

      if (leftCounter + rightCounter + 1 >= ConnectContext.WIN_CONSECUTIVE) {
        return true;
      }
    }

    return false;
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
      : ConnectContext.STATE_UNKNOWN;
  }

  private _isValidCoordinate(row: number, column: number): boolean {
    return (
      row >= 0 &&
      row < ConnectContext.ROWS &&
      column >= 0 &&
      column < ConnectContext.COLUMNS
    );
  }

  private _isValidIndex(index: number): boolean {
    return index >= 0 && index <= ConnectContext.MAX_GRID_INDEX ? true : false;
  }

  private _getIndex(row: number, column: number): number {
    let index = row * ConnectContext.COLUMNS + column;
    return this._isValidIndex(index) ? index : -1;
  }

  private _getValidMoves(): number[] {
    let moves: number[] = [];
    for (let column = 0; column < ConnectContext.COLUMNS; ++column) {
      if (this._isValidMove(column)) {
        moves.push(column);
      }
    }
    return moves;
  }

  private _isValidMove(column: number): boolean {
    // Top row in the column should be empty
    return this._atGrid(0, column) === ConnectContext.STATE_DEFAULT;
  }

  private _executeMove(column: number): boolean {
    if (!this.over() && this._isValidMove(column)) {
      let moveRow = -1;

      // Locate row
      for (let row = ConnectContext.ROWS - 1; row >= 0; --row) {
        if (this._atGrid(row, column) === ConnectContext.STATE_DEFAULT) {
          this._setGrid(row, column, this._context.currentState);
          moveRow = row;
          break;
        }
      }

      if (this._checkWin(moveRow, column, this._context.currentState)) {
        this._context.winner = this._context.currentState;
      }

      this._context.currentState =
        this._context.currentState === ConnectContext.STATE_BLACK
          ? ConnectContext.STATE_RED
          : ConnectContext.STATE_BLACK;

      return true;
    }
    return false;
  }
}
