import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comic } from '../../models/comic';
import { ComicSaveService } from '../../../../backend/src/services/saved-comics.service';

@Component({
  selector: 'app-action-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-icons.component.html',
  styleUrl: './action-icons.component.scss'
})
export class ActionIconsComponent implements OnInit {
  img_share: string = "/share.png";
  img_save: string = "/save.png";
  img_saved: string = "/saved.png";
  img_like: string = "/like.png";
  img_liked: string = "/liked.webp";
  @Input() comic!: Comic;
  isSaved = false;
  isLiked = false;

  constructor(private comicSaveService: ComicSaveService) {}

  ngOnInit() {
    this.comicSaveService.isComicSaved(this.comic.id).subscribe(isSaved => {
      this.isSaved = isSaved;
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
}
