import { Injectable } from '@angular/core';

// export class GameContextData {
//   private _grid: Uint8Array;
//   private _currentState: number;
// }

// export class GameContext {
//   static readonly COLUMNS: number = 7;
//   static readonly ROWS: number = 6;
//   static readonly STATE_DEFAULT: number = 0;
//   static readonly STATE_X: number = 1;
//   static readonly STATE_O: number = 2;
//   static readonly STATE_UNKNOWN: number = 3;
//   private static readonly MAX_GRID_INDEX: number =
//     GameContext.COLUMNS * GameContext.ROWS - 1;

//   private _data: GameContextData;

//   constructor() {
//     this._data = new
//     this._grid = new Uint8Array(GameContext.COLUMNS * GameContext.ROWS);
//   }

//   private _checkWin(row: number, column: number) {}

//   private _atGrid(row: number, column: number): number {
//     let index = this._getIndex(row, column);
//     return this._isValidIndex(index)
//       ? this._grid[index]
//       : GameContext.STATE_UNKNOWN;
//   }

//   private _isValidCoordinate(row: number, column: number): boolean {
//     return this._getIndex(row, column) != -1;
//   }

//   private _isValidIndex(index: number): boolean {
//     return index >= 0 && index <= GameContext.MAX_GRID_INDEX ? true : false;
//   }

//   private _getIndex(row: number, column: number): number {
//     let index = row * GameContext.COLUMNS + column;
//     return this._isValidIndex(index) ? index : -1;
//   }
// }

@Injectable({
  providedIn: 'root',
})
export class GameContextService {
  constructor() {}
}
