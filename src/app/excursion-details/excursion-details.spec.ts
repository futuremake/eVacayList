import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcursionDetails } from './excursion-details';

describe('ExcursionDetails', () => {
  let component: ExcursionDetails;
  let fixture: ComponentFixture<ExcursionDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcursionDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcursionDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
