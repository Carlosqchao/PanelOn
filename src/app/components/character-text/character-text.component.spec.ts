import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterTextComponent } from './character-text.component';

describe('CharacterTextComponent', () => {
  let component: CharacterTextComponent;
  let fixture: ComponentFixture<CharacterTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
