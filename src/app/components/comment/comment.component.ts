import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../app.service';
import {UserStoreService} from '../../../../backend/src/services/user-store';
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
  @Input() parentUsername: string = ''; // Username of the parent comment's author
  @Input() currentUserId: string = '';
  @Output() deleteEvent = new EventEmitter<{ commentId: string, isReply: boolean, parentCommentId?: string }>();
  @Output() updateEvent = new EventEmitter<{ commentId: string, content: string, isReply: boolean, parentCommentId?: string }>();

  userIcon: string = '/assets/default-user-icon.png'; // Default user icon
  username: string = 'Anonymous'; // Default username
  isEditing: boolean = false;
  editedContent: string = '';
  showReplyForm: boolean = false;
  newReplyContent: string = '';
  showAllReplies: boolean = false;
  maxVisibleReplies: number = 3;

  // Track usernames for all replies
  replyUsernames: Record<string, string> = {};

  private userSubscription: Subscription | undefined;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private userStoreService: UserStoreService
  ) {}

  get isCommentOwner(): boolean {
    return this.comment.author_id === this.currentUserId;
  }

  get visibleReplies(): Comment[] {
    if (!this.comment.replies || this.comment.replies.length === 0) return [];
    return this.showAllReplies ? this.comment.replies : this.comment.replies.slice(0, this.maxVisibleReplies);
  }

  get hasMoreReplies(): boolean {
    return !!this.comment.replies && this.comment.replies.length > this.maxVisibleReplies && !this.showAllReplies;
  }

  toggleEdit(): void {
    if (this.showReplyForm) return;

    if (this.isEditing) {
      this.updateEvent.emit({
        commentId: this.comment.id!,
        content: this.editedContent,
        isReply: !!this.parentCommentId,
        parentCommentId: this.parentCommentId || undefined
      });
    } else {
      this.editedContent = this.comment.content;
    }

    this.isEditing = !this.isEditing;
  }

  delete(): void {
    if (this.isEditing || this.showReplyForm) return;

    this.deleteEvent.emit({
      commentId: this.comment.id!,
      isReply: !!this.parentCommentId,
      parentCommentId: this.parentCommentId || undefined
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
    if (!this.newReplyContent.trim()) return;

    const reply: Omit<Comment, 'id' | 'created_at'> = {
      author_id: this.currentUserId,
      content: this.newReplyContent,
    };

    this.appService.addReply(this.comicId, this.comment.id!, reply).then(() => {
      this.newReplyContent = '';
      this.showReplyForm = false;
      this.loadReplies();
    });
  }

  loadReplies(): void {
    if (this.comment.id) {
      this.appService.getRepliesByCommentId(this.comicId, this.comment.id).subscribe(replies => {
        this.comment.replies = replies;

        if (replies && replies.length > 0) {
          replies.forEach(reply => {
            this.loadUsernameForReply(reply);
          });
        }
      });
    }
  }

  loadUsernameForReply(reply: Comment): void {
    if (reply.author_id === this.currentUserId) {
      this.replyUsernames[reply.id!] = this.username;
    } else {
      // Fetch username from AppService or use a default
      this.appService.getUserByUid(reply.author_id).subscribe({
        next: (userData: IUser) => {
          this.replyUsernames[reply.id!] = userData.username || 'User ' + reply.author_id;
        },
        error: () => {
          this.replyUsernames[reply.id!] = 'User ' + reply.author_id;
        }
      });
    }
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
    // Subscribe to user data
    this.userSubscription = this.userStoreService.getUser().subscribe(user => {
      if (user) {
        this.username = user.username || 'Anonymous';
        this.userIcon = user.imageUrl || '/assets/default-user-icon.png';
        this.currentUserId = user.id || '';
      } else {
        this.username = 'Anonymous';
        this.userIcon = '/assets/default-user-icon.png';
        this.currentUserId = '';
      }
    });

    // Load replies
    this.loadReplies();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
