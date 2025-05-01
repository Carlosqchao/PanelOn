import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../app.service';
import { UserStoreService } from '../../../../backend/src/services/user-store';
import { AuthService } from '../../../../backend/src/services/user-auth';
import { Comment } from '../../models/comic';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IUser } from '../../models/user';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() comment!: Comment;
  @Input() comicId: string = '';
  @Input() parentCommentId: string = '';
  @Input() parentUsername: string = '';
  @Input() currentUserId: string = '';
  @Output() deleteEvent = new EventEmitter<{ commentId: string, isReply: boolean, parentCommentId?: string }>();
  @Output() updateEvent = new EventEmitter<{ commentId: string, content: string, isReply: boolean, parentCommentId?: string }>();

  userIcon: string = '../../assets/default-user-icon.png';
  username: string = 'Carlos Ruano Rachid';
  isEditing: boolean = false;
  editedContent: string = '';
  showReplyForm: boolean = false;
  newReplyContent: string = '';
  showAllReplies: boolean = false;
  maxVisibleReplies: number = 3;

  replyUsernames: Record<string, string> = {};
  replyUserIcons: Record<string, string> = {};

  private userSubscription: Subscription | undefined;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private userStoreService: UserStoreService
  ) {}

  get isCommentOwner(): boolean {
    return this.comment.author_id === this.currentUserId && this.currentUserId !== '';
  }

  get visibleReplies(): Comment[] {
    if (!this.comment.replies || this.comment.replies.length === 0) {
      console.log('No replies or replies array is empty');
      return [];
    }
    const visible = this.showAllReplies ? this.comment.replies : this.comment.replies.slice(0, this.maxVisibleReplies);
    return visible;
  }

  get hasMoreReplies(): boolean {
    const hasMore = !!this.comment.replies && this.comment.replies.length > this.maxVisibleReplies && !this.showAllReplies;
    return hasMore;
  }

  toggleEdit(): void {
    if (this.showReplyForm) return;

    if (this.isEditing) {
      this.appService.updateComment(
        this.comicId,
        this.comment.id!,
        this.editedContent,
        !!this.parentCommentId,
        this.parentCommentId
      ).then(() => {
        this.updateEvent.emit({
          commentId: this.comment.id!,
          content: this.editedContent,
          isReply: !!this.parentCommentId,
          parentCommentId: this.parentCommentId || undefined
        });
      }).catch(error => {
        console.error('Error updating comment:', error);
      });
    } else {
      this.editedContent = this.comment.content;
    }

    this.isEditing = !this.isEditing;
  }

  delete(): void {
    if (this.isEditing || this.showReplyForm) return;

    this.appService.deleteComment(
      this.comicId,
      this.comment.id!,
      !!this.parentCommentId,
      this.parentCommentId
    ).then(() => {
      this.deleteEvent.emit({
        commentId: this.comment.id!,
        isReply: !!this.parentCommentId,
        parentCommentId: this.parentCommentId || undefined
      });
    }).catch(error => {
      console.error('Error deleting comment:', error);
    });
  }

  toggleReplyForm(): void {
    if (this.isEditing) return;
    this.showReplyForm = !this.showReplyForm;

    if (!this.showReplyForm) {
      this.newReplyContent = '';
    }
  }

  toggleShowAllReplies(): void {
    this.showAllReplies = !this.showAllReplies;
  }

  addReply(): void {
    if (!this.newReplyContent.trim() || !this.currentUserId) return;

    const reply: Omit<Comment, 'id' | 'created_at'> = {
      author_id: this.currentUserId,
      content: this.newReplyContent,
    };

    this.appService.addReply(this.comicId, this.comment.id!, reply).then(() => {
      this.newReplyContent = '';
      this.showReplyForm = false;
      this.loadReplies();
    }).catch(error => {
      console.error('Error adding reply:', error);
    });
  }

  loadReplies(): void {
    if (this.comment.id) {
      console.log(`Fetching replies for comic ${this.comicId}, comment ${this.comment.id}`);
      this.appService.getRepliesByCommentId(this.comicId, this.comment.id).subscribe({
        next: (replies) => {
          this.comment.replies = replies || [];
          this.showAllReplies = false;
          if (replies && replies.length > 0) {
            replies.forEach(reply => {
              this.loadUserDetailsForReply(reply);
            });
          }
        },
        error: (error) => {
          console.error('Error loading replies:', error);
          this.comment.replies = [];
          this.showAllReplies = false;
        }
      });
    } else {
      console.warn('No comment ID provided for loading replies');
      this.comment.replies = [];
      this.showAllReplies = false;
    }
  }

  loadUserDetailsForReply(reply: Comment): void {
    if (!reply.author_id) {
      this.replyUsernames[reply.id!] = 'Carlos Ruano Rachid';
      this.replyUserIcons[reply.id!] = '../../assets/default-user-icon.png';
      return;
    }

    this.appService.getUserByUid(reply.author_id).subscribe({
      next: (userData: IUser) => {
        this.replyUsernames[reply.id!] = userData.username || 'User ' + reply.author_id;
        this.replyUserIcons[reply.id!] = userData.imageUrl || '../../assets/default-user-icon.png';
      },
      error: () => {
        this.replyUsernames[reply.id!] = 'User ' + reply.author_id;
        this.replyUserIcons[reply.id!] = '../../assets/default-user-icon.png';
      }
    });
  }

  onDeleteReply(event: { commentId: string, isReply: boolean, parentCommentId?: string }): void {
    this.deleteEvent.emit(event);
  }

  onUpdateReply(event: { commentId: string, content: string, isReply: boolean, parentCommentId?: string }): void {
    this.updateEvent.emit(event);
  }

  getRepliedToUsername(replyIndex: number): string {
    if (replyIndex === 0 && !this.parentCommentId) {
      return this.username;
    } else if (this.comment.replies && replyIndex > 0) {
      const previousReply = this.comment.replies[replyIndex - 1];
      return this.replyUsernames[previousReply.id!] || 'User ' + previousReply.author_id;
    } else if (this.parentCommentId) {
      return this.parentUsername || 'Unknown User';
    }
    return 'Unknown User';
  }

  ngOnInit(): void {
    this.userSubscription = this.userStoreService.getUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id || '';
      } else {
        this.currentUserId = '';
      }
    });

    this.loadUserDetailsForComment();
    this.loadReplies();
  }

  loadUserDetailsForComment(): void {
    if (!this.comment.author_id) {
      this.username = 'Carlos Ruano Rachid';
      this.userIcon = '../../assets/default-user-icon.png';
      return;
    }

    this.appService.getUserByUid(this.comment.author_id).subscribe({
      next: (userData: IUser) => {
        this.username = userData.username || 'User ' + this.comment.author_id;
        this.userIcon = userData.imageUrl || '../../assets/default-user-icon.png';
      },
      error: () => {
        this.username = 'User ' + this.comment.author_id;
        this.userIcon = '../../assets/default-user-icon.png';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
