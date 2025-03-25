import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreePlanComponent } from './free-plan.component';

describe('FreePlanComponent', () => {
  let component: FreePlanComponent;
  let fixture: ComponentFixture<FreePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreePlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
