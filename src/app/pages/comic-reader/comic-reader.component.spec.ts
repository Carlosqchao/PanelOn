import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicReaderComponent } from './comic-reader.component';

describe('ComicReaderComponent', () => {
  let component: ComicReaderComponent;
  let fixture: ComponentFixture<ComicReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComicReaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComicReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
