import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comic } from '../../models/comic';
import { ComicSaveService } from '../../../../backend/src/services/saved-comics.service';
import { LikedComicService } from '../../../../backend/src/services/liked-comic.service';
import { ClipboardService } from '../../../../backend/src/services/copy-link-service';
import { ComicDownloadService } from '../../../../backend/src/services/download-comic';
import Swal from 'sweetalert2';
import {ThemeService} from '../../../../backend/src/services/theme.service';

@Component({
  selector: 'app-action-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-icons.component.html',
  styleUrl: './action-icons.component.scss'
})
export class ActionIconsComponent implements OnInit {
  @Input() comic!: Comic;
  isSaved = false;
  isLiked = false;

  img_share_light = '/share.png';
  img_share_dark = '/share-dark.png';
  img_download_light = '/download.png';
  img_download_dark = '/download-dark.png';
  img_save_light = '/save.png';
  img_save_dark = '/save-dark.png';
  img_saved_light = '/saved.png';
  img_saved_dark = '/saved-dark.png';
  img_like_light = '/like.png';
  img_like_dark = '/like-dark.png';
  img_liked_light = '/liked.webp';
  img_liked_dark = '/liked-dark.png';

  img_share: string = this.img_share_light;
  img_download: string = this.img_download_light;
  img_save: string = this.img_save_light;
  img_saved: string = this.img_saved_light;
  img_like: string = this.img_like_light;
  img_liked: string = this.img_liked_light;

  constructor(
    private comicSaveService: ComicSaveService,
    private likedComicService: LikedComicService,
    private clipBoardService: ClipboardService,
    private comicDownloadService: ComicDownloadService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.updateIcons(this.themeService.isDark());

    this.comicSaveService.isComicSaved(this.comic.id).subscribe(isSaved => {
      this.isSaved = isSaved;
    });
    this.likedComicService.isComicLiked(this.comic.id).subscribe(isLiked => {
      this.isLiked = isLiked;
    });
  }


  private updateIcons(isDark: boolean) {
    this.img_share = isDark ? this.img_share_dark : this.img_share_light;
    this.img_download = isDark ? this.img_download_dark : this.img_download_light;
    this.img_save = isDark ? this.img_save_dark : this.img_save_light;
    this.img_saved = isDark ? this.img_saved_dark : this.img_saved_light;
    this.img_like = isDark ? this.img_like_dark : this.img_like_light;
    this.img_liked = isDark ? this.img_liked_dark : this.img_liked_light;
  }

  toggleSave() {
    if (this.isSaved) {
      this.comicSaveService.removeSavedComic(this.comic.id).then(() => {
        this.isSaved = false;
      });
    } else {
      this.comicSaveService.saveComic(this.comic.id).then(() => {
        this.isSaved = true;
      });
    }
  }

  toggleLike() {
    if (this.isLiked) {
      this.likedComicService.removeLikedComic(this.comic.id).then(() => {
        this.isLiked = false;
      });
    } else {
      this.likedComicService.likeComic(this.comic.id).then(() => {
        this.isLiked = true;
      });
    }
  }

  copyLink() {
    this.clipBoardService.copyPageUrl()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Link Copied!',
          text: 'The link has been copied to the clipboard.',
          timer: 2000,
          showConfirmButton: false
        });
      })
      .catch(err => {
        console.error('Error copying:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to copy the link.',
          timer: 2000,
          showConfirmButton: false
        });
      });
  }

  downloadComic() {
    const fileName = `${this.comic.title}.pdf`;
    this.comicDownloadService.downloadComic(fileName).subscribe({
      next: (downloadUrl) => {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName.replace(/ /g, '_'));
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
          icon: 'success',
          title: 'Download Started!',
          text: 'The comic is being downloaded to your Downloads folder.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Error getting download URL:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to initiate download. Please check the file name or server status.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}
