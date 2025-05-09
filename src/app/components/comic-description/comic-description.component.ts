import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthorSaveService } from '../../../../backend/src/services/author-save.service';

@Component({
  selector: 'app-comic-description',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './comic-description.component.html',
  styleUrls: ['./comic-description.component.scss']
})
export class ComicDescriptionComponent implements OnInit {
  @Input() title: string = '';
  @Input() synopsis: string = '';
  @Input() author: string = '';
  @Input() authorId: string = '';
  @Input() genre: string = '';
  @Input() releaseDate: string = '';
  isFollowing = false;

  constructor(private authorSaveService: AuthorSaveService) {}

  ngOnInit() {
    console.log('ComicDescriptionComponent initialized with authorId:', this.authorId);
    if (this.authorId) {
      console.log('Checking follow status for authorId:', this.authorId);
      this.authorSaveService.isAuthorSaved(this.authorId).subscribe({
        next: (isSaved) => {
          this.isFollowing = isSaved;
          console.log('Author follow status set to:', this.isFollowing);
        },
        error: (err) => {
          console.error('Error checking follow status:', err);
        }
      });
    } else {
      console.warn('No authorId provided, follow button will not function');
    }
  }

  toggleFollow() {
    console.log('Follow button clicked with authorId:', this.authorId);
    if (!this.authorId) {
      console.error('Cannot toggle follow: authorId is missing or invalid');
      return;
    }

    if (this.isFollowing) {
      console.log('Attempting to unfollow author:', this.authorId);
      this.authorSaveService.removeSavedAuthor(this.authorId).then(() => {
        this.isFollowing = false;
        console.log('Author unfollowed successfully, isFollowing set to:', this.isFollowing);
      }).catch(err => {
        console.error('Failed to unfollow author:', err);
      });
    } else {
      console.log('Attempting to follow author:', this.authorId);
      this.authorSaveService.saveAuthor(this.authorId).then(() => {
        this.isFollowing = true;
        console.log('Author followed successfully, isFollowing set to:', this.isFollowing);
      }).catch(err => {
        console.error('Failed to follow author:', err);
      });
    }
  }
}
