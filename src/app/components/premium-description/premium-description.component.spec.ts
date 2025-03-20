import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumDescriptionComponent } from './premium-description.component';

describe('PremiumDescriptionComponent', () => {
  let component: PremiumDescriptionComponent;
  let fixture: ComponentFixture<PremiumDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
