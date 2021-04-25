import { templateJitUrl } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConnectContext } from 'src/game/game-context';
import { GameContextService } from '../game-context.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[];

  rows: number[];
  columns: number[];

  debugText: string;

  constructor(private _context: GameContextService) {
    this._subscriptions = [];
    this.rows = Array(ConnectContext.ROWS)
      .fill(0)
      .map((_, i) => i);
    this.columns = Array(ConnectContext.COLUMNS)
      .fill(0)
      .map((_, i) => i);

    this.debugText = '';

    let contextChanged = this._context.getChangeListener().subscribe(() => {
      this.debugText = `${this._context.winner()}`;
    });
    this._subscriptions.push(contextChanged);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onCellClicked(row: number, column: number) {
    // this.activateColumn(column);
  }

  onCellHover(row: number, column: number) {}

  activateColumn(column: number): void {
    this._context.applyMove(column);
  }

  resetGame(): void {
    this._context.reset();
  }
}
