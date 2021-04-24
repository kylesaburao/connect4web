import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { evaluateNextMove } from 'src/game/ai/pmcs-agent';
import { ConnectContext } from 'src/game/game-context';

@Injectable({
  providedIn: 'root',
})
export class GameContextService {
  private _context: ConnectContext;
  private _contextUpdated: BehaviorSubject<boolean>;

  constructor() {
    this._context = new ConnectContext();
    this._contextUpdated = new BehaviorSubject<boolean>(false);
  }

  atPosition(row: number, column: number): string {
    return this._context.atPosition(row, column);
  }

  moves(): number[] {
    return this._context.moves();
  }

  applyMove(move: number): void {
    let playerMoved: boolean = this._context.applyMove(move);

    new Promise(() => {
      // temp ai
      if (playerMoved) {
        let aiColumn = evaluateNextMove(this._context);
        if (aiColumn !== null) {
          this._context.applyMove(aiColumn);
        }
      }

      this._contextUpdated.next(true);
    });
  }

  winner(): string {
    return this._context.winner();
  }

  over(): boolean {
    return this._context.over();
  }

  reset(): void {
    this._context = new ConnectContext();
    this._contextUpdated.next(true);
  }

  getChangeListener(): Observable<boolean> {
    return this._contextUpdated.asObservable();
  }
}
