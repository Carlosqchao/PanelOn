import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingCharacterCard2Component } from './landing-character-card-2.component';

describe('LandingCharacterCard2Component', () => {
  let component: LandingCharacterCard2Component;
  let fixture: ComponentFixture<LandingCharacterCard2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingCharacterCard2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingCharacterCard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
