import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationDetails } from './vacation-details';

describe('VacationDetails', () => {
  let component: VacationDetails;
  let fixture: ComponentFixture<VacationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
