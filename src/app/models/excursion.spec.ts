import { TestBed } from '@angular/core/testing';

import { Excursion } from './excursion.model';

describe('Excursion', () => {
  let service: Excursion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Excursion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
