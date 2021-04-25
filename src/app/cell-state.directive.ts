import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ContextViewService } from './context-view.service';
import { GameContextService } from './game-context.service';

@Directive({
  selector: '[appCellState]',
})
export class CellStateDirective implements AfterViewInit, OnDestroy {
  private _subscriptions: Subscription[];

  @Input() coordinates!: [number, number];
  row: number;
  column: number;

  constructor(
    private _renderer: Renderer2,
    private _elemRef: ElementRef,
    private _contextService: GameContextService,
    private _columnViewService: ContextViewService
  ) {
    this._subscriptions = [];

    this.row = 0;
    this.column = 0;
  }

  ngAfterViewInit(): void {
    this.row = this.coordinates[0];
    this.column = this.coordinates[1];

    let subscription = this._contextService
      .getChangeListener()
      .subscribe(() => {
        let state = this._contextService.atPosition(this.row, this.column);
        this._setContent(state);
      });

    this._subscriptions.push(subscription);

    this._subscriptions.push(
      this._columnViewService
        .getColumnClassEmitter(this.column)
        .subscribe((classes) => {
          this._setParentClass('hovered', classes.includes('hovered'));
          this._setParentClass('clicked', classes.includes('clicked'));
        })
    );
  }

  private _setParentClass(cssClass: string, enable: boolean): void {
    if (this._elemRef) {
      if (enable) {
        this._renderer.addClass(
          this._elemRef.nativeElement.parentNode,
          cssClass
        );
      } else {
        this._renderer.removeClass(
          this._elemRef.nativeElement.parentNode,
          cssClass
        );
      }
    }
  }

  @HostListener('mouseenter') onColumnEntered() {
    this._columnViewService.addColumnClass(this.column, 'hovered');
  }

  @HostListener('mouseleave') onColumnLeft() {
    this._columnViewService.removeColumnClass(this.column, 'hovered');
    this._columnViewService.removeColumnClass(this.column, 'clicked');
  }

  @HostListener('click') onColumnClicked() {
    this._contextService.applyMove(this.column);
  }

  @HostListener('mousedown') onColumnMousedown() {
    this._columnViewService.addColumnClass(this.column, 'clicked');
  }

  @HostListener('mouseup') onColumnMouseup() {
    this._columnViewService.removeColumnClass(this.column, 'clicked');
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private _setContent(text: string): void {
    if (this._elemRef) {
      let color = text ? (text === 'B' ? 'black' : 'red') : 'initial';
      this._renderer.setStyle(
        this._elemRef.nativeElement,
        'background-color',
        color
      );
    }
  }
}
