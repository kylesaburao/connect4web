import { templateJitUrl } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
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

  busySpinnerMode: ProgressSpinnerMode;
  busySpinnerValue: number;
  opponentBusy: boolean;
  winText: string;

  constructor(private _context: GameContextService) {
    this._subscriptions = [];
    this.rows = Array(ConnectContext.ROWS)
      .fill(0)
      .map((_, i) => i);
    this.columns = Array(ConnectContext.COLUMNS)
      .fill(0)
      .map((_, i) => i);

    this.busySpinnerMode = 'determinate';
    this.winText = '';
    this.opponentBusy = false;
    this.busySpinnerValue = 0;

    let contextChanged = this._context.getChangeListener().subscribe(() => {
      const gameOver = this._context.over();
      let winner = this._context.winner();
      winner = winner === '' ? '' : winner === 'R' ? 'Red' : 'Black';
      let text = winner ? `Winner: ${winner}` : '';

      if (gameOver && !winner) {
        text = 'Draw';
      }

      this.winText = text;
    });
    this._subscriptions.push(contextChanged);

    let agentState = this._context.getBusyAgentListener().subscribe((busy) => {
      this.busySpinnerMode = busy ? 'indeterminate' : 'determinate';
      this.busySpinnerValue = busy ? 0 : 100;
      this.opponentBusy = busy;
    });
    this._subscriptions.push(agentState);
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
