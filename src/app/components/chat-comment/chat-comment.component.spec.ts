import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCommentComponent } from './chat-comment.component';

describe('ChatCommentComponent', () => {
  let component: ChatCommentComponent;
  let fixture: ComponentFixture<ChatCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
