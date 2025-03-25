import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingCharacterCard3Component } from './landing-character-card-3.component';

describe('LandingCharacterCard3Component', () => {
  let component: LandingCharacterCard3Component;
  let fixture: ComponentFixture<LandingCharacterCard3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingCharacterCard3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingCharacterCard3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
