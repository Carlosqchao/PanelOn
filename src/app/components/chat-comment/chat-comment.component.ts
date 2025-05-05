import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Comment} from '../../models/comic';
import {Subscription} from 'rxjs';
import {AppService} from '../../app.service';
import {AuthService} from '../../../../backend/src/services/user-auth';
import {UserStoreService} from '../../../../backend/src/services/user-store';
import {IUser} from '../../models/user';

@Component({
  selector: 'app-chat-comment',
  imports: [
    DatePipe,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './chat-comment.component.html',
  styleUrl: './chat-comment.component.scss'
})
export class ChatCommentComponent {
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

  private userSubscription: Subscription | undefined;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private userStoreService: UserStoreService
  ) {}

  get isCommentOwner(): boolean {
    return this.comment.author_id === this.currentUserId && this.currentUserId !== '';
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

  ngOnInit(): void {
    this.userSubscription = this.userStoreService.getUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id || '';
      } else {
        this.currentUserId = '';
      }
    });

    this.loadUserDetailsForComment();
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
