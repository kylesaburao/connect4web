import { TestBed } from '@angular/core/testing';

import { ContextViewService } from './context-view.service';

describe('ContextViewService', () => {
  let service: ContextViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
