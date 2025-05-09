import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comic } from '../../models/comic';
import { ComicSaveService } from '../../../../backend/src/services/saved-comics.service';
import { LikedComicService } from '../../../../backend/src/services/liked-comic.service';
import { ClipboardService } from '../../../../backend/src/services/copy-link-service';
import Swal from 'sweetalert2';
import {ComicDownloadService} from '../../../../backend/src/services/download-comic';

@Component({
  selector: 'app-action-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-icons.component.html',
  styleUrl: './action-icons.component.scss'
})
export class ActionIconsComponent implements OnInit {
  img_share: string = "/share.png";
  img_download: string = "/download.png";
  img_save: string = "/save.png";
  img_saved: string = "/saved.png";
  img_like: string = "/like.png";
  img_liked: string = "/liked.webp";
  @Input() comic!: Comic;
  isSaved = false;
  isLiked = false;

  constructor(
    private comicSaveService: ComicSaveService,
    private likedComicService: LikedComicService,
    private clipBoardService: ClipboardService,
    private comicDownloadService: ComicDownloadService
  ) {}

  ngOnInit() {
    this.comicSaveService.isComicSaved(this.comic.id).subscribe(isSaved => {
      this.isSaved = isSaved;
    });
    this.likedComicService.isComicLiked(this.comic.id).subscribe(isLiked => {
      this.isLiked = isLiked;
    });
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
