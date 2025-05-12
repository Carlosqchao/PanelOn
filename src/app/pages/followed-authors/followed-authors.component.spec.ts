import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedAuthorsComponent } from './followed-authors.component';

describe('FollowedAuthorsComponent', () => {
  let component: FollowedAuthorsComponent;
  let fixture: ComponentFixture<FollowedAuthorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowedAuthorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowedAuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
