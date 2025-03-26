import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumPlansComparisonComponent } from './premium-plans-comparison.component';

describe('PremiumPlansComparisonComponent', () => {
  let component: PremiumPlansComparisonComponent;
  let fixture: ComponentFixture<PremiumPlansComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumPlansComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumPlansComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
