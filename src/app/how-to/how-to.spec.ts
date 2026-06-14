import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowTo } from './how-to';

describe('HowTo', () => {
  let component: HowTo;
  let fixture: ComponentFixture<HowTo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowTo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowTo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
