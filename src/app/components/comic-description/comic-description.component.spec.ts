import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicDescriptionComponent } from './comic-description.component';

describe('ComicDescriptionComponent', () => {
  let component: ComicDescriptionComponent;
  let fixture: ComponentFixture<ComicDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComicDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComicDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
