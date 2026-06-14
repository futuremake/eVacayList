import { TestBed } from '@angular/core/testing';

import { Vacation } from './vacation.model';

describe('Vacation', () => {
  let service: Vacation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vacation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
