import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContextViewService {
  private _columns: { [key: string]: BehaviorSubject<string> };

  constructor() {
    this._columns = {};
  }

  getColumnClassEmitter(column: number): Observable<string> {
    const key: string = this._getKey(column);
    this._initColumn(column);
    return this._columns[key].asObservable();
  }

  addColumnClass(column: number, value: string): void {
    let key = this._getKey(column);

    if (key in this._columns) {
      let classes: string[] = this._columns[key].value.split(' ');
      if (classes.filter((x) => x === value).length === 0) {
        classes.push(value);
        this._columns[key].next(classes.join(' '));
      }
    }
  }

  removeColumnClass(column: number, value: string): void {
    let key = this._getKey(column);

    if (key in this._columns) {
      let classes: string[] = this._columns[key].value.split(' ');
      const classIndex = classes.indexOf(value, 0);
      if (classIndex > -1) {
        classes.splice(classIndex, 1);
        this._columns[key].next(classes.join(' '));
      }
    }
  }

  private _initColumn(column: number): void {
    const key: string = this._getKey(column);

    if (!(key in this._columns)) {
      this._columns[key] = new BehaviorSubject<string>('');
    }
  }

  private _getKey(column: number): string {
    return `${column}`;
  }
}
