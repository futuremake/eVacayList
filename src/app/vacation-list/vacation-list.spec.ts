import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationList } from './vacation-list';

describe('VacationList', () => {
  let component: VacationList;
  let fixture: ComponentFixture<VacationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
