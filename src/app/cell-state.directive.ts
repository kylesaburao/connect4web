import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { GameContextService } from './game-context.service';

@Directive({
  selector: '[appCellState]',
})
export class CellStateDirective implements AfterViewInit, OnDestroy {
  private _subscriptions: Subscription[];
  @Input() coordinates!: [number, number];

  constructor(
    private _elemRef: ElementRef,
    private _context: GameContextService
  ) {
    this._subscriptions = [];
  }

  ngAfterViewInit(): void {
    let subscription = this._context.getChangeListener().subscribe(() => {
      let state = this._context.atPosition(
        this.coordinates[0],
        this.coordinates[1]
      );
      this._setText(`${state}`);
    });

    this._subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private _setText(text: string, defaultText?: string): void {
    if (!defaultText) {
      defaultText = '--';
    }

    this._elemRef.nativeElement.innerHTML = text != '' ? text : defaultText;
  }
}
