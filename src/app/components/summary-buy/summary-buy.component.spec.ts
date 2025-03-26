import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryBuyComponent } from './summary-buy.component';

describe('SummaryBuyComponent', () => {
  let component: SummaryBuyComponent;
  let fixture: ComponentFixture<SummaryBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryBuyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
