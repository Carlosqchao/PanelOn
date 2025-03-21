import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingCharacterCard1Component } from './landing-character-card-1.component';

describe('LandingCharacterCard1Component', () => {
  let component: LandingCharacterCard1Component;
  let fixture: ComponentFixture<LandingCharacterCard1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingCharacterCard1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingCharacterCard1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
