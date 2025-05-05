import {Component, Input} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import {CommentComponent} from "../comment/comment.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Comment} from '../../models/comic';
import {Subscription} from 'rxjs';
import {AppService} from '../../app.service';
import {UserStoreService} from '../../../../backend/src/services/user-store';

@Component({
  selector: 'app-chat',
  imports: [
    ButtonComponent,
    CommentComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @Input() comicId: string = '';
  @Input() currentUserId: string = '';

  comments: Comment[] = [];
  showCommentForm: boolean = false;
  newCommentContent: string = '';
  isLoading: boolean = true;


  private userSubscription: Subscription | undefined;

  constructor(
    private appService: AppService,
    private userStoreService: UserStoreService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userStoreService.getUser().subscribe(user => {
      this.currentUserId = user?.id || '';
    });
    this.loadComments();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadComments(): void {
    this.isLoading = true;
    this.appService.getCommentsByComicId(this.comicId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.comments = [];
        this.isLoading = false;
      }
    });
  }

  toggleCommentForm(): void {
    this.showCommentForm = !this.showCommentForm;
    if (!this.showCommentForm) {
      this.newCommentContent = '';
    }
  }

  addComment(): void {
    if (!this.newCommentContent.trim() || !this.currentUserId) {
      return;
    }

    const newComment: Omit<Comment, 'id' | 'created_at'> = {
      author_id: this.currentUserId,
      content: this.newCommentContent
    };

    this.appService.addComment(this.comicId, newComment).then(() => {
      this.newCommentContent = '';
      this.showCommentForm = false;
      this.loadComments();
    }).catch(err => {
      console.error('Error adding comment:', err);
    });
  }

  onDeleteComment(event: { commentId: string, isReply: boolean, parentCommentId?: string }): void {
    this.appService.deleteComment(this.comicId, event.commentId, event.isReply, event.parentCommentId).then(() => {
      this.loadComments();
    }).catch(err => {
      console.error('Error deleting comment:', err);
    });
  }

  onUpdateComment(event: { commentId: string, content: string, isReply: boolean, parentCommentId?: string }): void {
    this.appService.updateComment(this.comicId, event.commentId, event.content, event.isReply, event.parentCommentId).then(() => {
      this.loadComments();
    }).catch(err => {
      console.error('Error updating comment:', err);
    });
  }
}
