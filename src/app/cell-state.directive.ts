import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ContextViewService } from './context-view.service';
import { GameContextService } from './game-context.service';

@Directive({
  selector: '[appCellState]',
})
export class CellStateDirective implements AfterViewInit, OnDestroy {
  private _subscriptions: Subscription[];
  @HostBinding('class.hovered') hover: boolean = false;
  @HostBinding('class.clicked') click: boolean = false;

  @Input() coordinates!: [number, number];
  row: number;
  column: number;

  constructor(
    private _elemRef: ElementRef,
    private _context: GameContextService,
    private _contextView: ContextViewService
  ) {
    this._subscriptions = [];

    this.row = 0;
    this.column = 0;
    this.hover = false;
    this.click = false;
  }

  ngAfterViewInit(): void {
    this.row = this.coordinates[0];
    this.column = this.coordinates[1];

    let subscription = this._context.getChangeListener().subscribe(() => {
      let state = this._context.atPosition(this.row, this.column);
      this._setText(`${state}`);
    });

    this._subscriptions.push(subscription);

    this._subscriptions.push(
      this._contextView
        .getColumnClassEmitter(this.column)
        .subscribe((classes) => {
          this.hover = classes.includes('hovered');
          this.click = classes.includes('clicked');
        })
    );
  }

  @HostListener('mouseenter') onColumnEntered() {
    this._contextView.addColumnClass(this.column, 'hovered');
  }

  @HostListener('mouseleave') onColumnLeft() {
    this._contextView.removeColumnClass(this.column, 'hovered');
    this._contextView.removeColumnClass(this.column, 'clicked');
  }

  @HostListener('click') onColumnClicked() {
    this._context.applyMove(this.column);
  }

  @HostListener('mousedown') onColumnMousedown() {
    this._contextView.addColumnClass(this.column, 'clicked');
  }

  @HostListener('mouseup') onColumnMouseup() {
    this._contextView.removeColumnClass(this.column, 'clicked');
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
