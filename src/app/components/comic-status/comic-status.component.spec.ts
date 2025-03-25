import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicStatusComponent } from './comic-status.component';

describe('ComicStatusComponent', () => {
  let component: ComicStatusComponent;
  let fixture: ComponentFixture<ComicStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComicStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComicStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
