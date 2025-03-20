import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumPlanMonthlyComponent } from './premium-plan-monthly.component';

describe('PremiumPlanMonthlyComponent', () => {
  let component: PremiumPlanMonthlyComponent;
  let fixture: ComponentFixture<PremiumPlanMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumPlanMonthlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumPlanMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
