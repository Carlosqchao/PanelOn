import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComicPageComponent } from './edit-comic-page.component';

describe('EditComicPageComponent', () => {
  let component: EditComicPageComponent;
  let fixture: ComponentFixture<EditComicPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditComicPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditComicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
