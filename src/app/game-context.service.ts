import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { evaluateNextMove } from 'src/game/ai/pmcs-agent';
import { ConnectContext } from 'src/game/game-context';

@Injectable({
  providedIn: 'root',
})
export class GameContextService {
  private _context: ConnectContext;
  private _contextUpdated: BehaviorSubject<boolean>;
  private _worker!: Worker;
  private _busy: boolean;

  private _agentBusy: BehaviorSubject<boolean>;

  constructor() {
    this._busy = false;
    this._context = new ConnectContext();
    this._contextUpdated = new BehaviorSubject<boolean>(false);
    this._agentBusy = new BehaviorSubject<boolean>(false);

    if (typeof Worker !== 'undefined') {
      this._worker = new Worker('./agent.worker', { type: 'module' });
      this._worker.onmessage = (result) => {
        if (result !== null) {
          this._context.applyMove(result.data);
          this._contextUpdated.next(true);
          this._busy = false;
          this._agentBusy.next(false);
        }
      };
    } else {
      alert('Web Worker API not supported');
    }
  }

  atPosition(row: number, column: number): string {
    return this._context.atPosition(row, column);
  }

  moves(): number[] {
    return this._context.moves();
  }

  applyMove(move: number): void {
    if (this._busy) {
      return;
    }

    let playerMoved: boolean = this._context.applyMove(move);
    this._contextUpdated.next(true);

    if (playerMoved && this._worker && !this._context.over()) {
      this._busy = true;
      this._agentBusy.next(true);
      this._worker.postMessage({
        context: this._context._context,
        rounds: 5000, // TODO: dynamic duration
      });
    }
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

  getBusyAgentListener(): Observable<boolean> {
    return this._agentBusy.asObservable();
  }
}
