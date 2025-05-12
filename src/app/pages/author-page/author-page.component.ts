import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { HeaderBacklinkComponent } from '../../components/header-backlink/header-backlink.component';
import { NgIf, NgFor } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUser } from '../../models/user';
import { Comic } from '../../models/comic';
import { ComicCardComponent } from '../../components/comic-card/comic-card.component';
import {AuthorSaveService} from '../../../../backend/src/services/author-save.service';

@Component({
  selector: 'app-author-page',
  standalone: true,
  imports: [HeaderBacklinkComponent, NgIf, NgFor, ComicCardComponent],
  templateUrl: './author-page.component.html',
  styleUrls: ['./author-page.component.scss']
})
export class AuthorPageComponent implements OnInit, OnDestroy {
  author: IUser | null = null;
  comics: Comic[] = [];
  isFollowing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private authorSaveService: AuthorSaveService,
  ) {}

  ngOnInit(): void {
    const authorId = this.route.snapshot.paramMap.get('id');
    if (authorId) {
      this.appService.getUserByUid(authorId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (author) => {
          if (author) {
            this.author = author;
            this.loadAuthorComics(authorId);
            this.authorSaveService.isAuthorSaved(authorId).subscribe(isSaved => {
              this.isFollowing = isSaved;
            });
          }
        },
        error: (err) => {
          console.error('Error loading author:', err);
        }
      });
    }
  }

  loadAuthorComics(authorId: string) {
    this.appService.getComics().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (comics) => {
        this.comics = comics.filter(comic => comic.author_id === authorId);
      },
      error: (err) => {
        console.error('Error loading comics:', err);
        this.comics = [];
      }
    });
  }

  toggleFollow() {
    if (!this.author) return;
    if (this.isFollowing) {
      this.authorSaveService.removeSavedAuthor(this.author.id!).then(() => {
        this.isFollowing = false;
      });
    } else {
      this.authorSaveService.saveAuthor(this.author.id!).then(() => {
        this.isFollowing = true;
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
