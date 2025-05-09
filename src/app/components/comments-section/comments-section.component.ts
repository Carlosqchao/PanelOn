import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { AppService } from '../../app.service';
import { Comment } from '../../models/comic';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { UserStoreService } from '../../../../backend/src/services/user-store';
import { Subscription } from 'rxjs';
import {ButtonComponent} from '../button/button.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, CommentComponent, ButtonComponent, TranslateModule]
})
export class CommentsSectionComponent implements OnInit, OnDestroy {
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
