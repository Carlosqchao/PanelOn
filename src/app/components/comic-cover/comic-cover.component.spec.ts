import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicCoverComponent } from './comic-cover.component';

describe('ComicCoverComponent', () => {
  let component: ComicCoverComponent;
  let fixture: ComponentFixture<ComicCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComicCoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComicCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
