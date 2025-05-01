import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { HeaderComponent } from '../../components/header/header.component';
import { ComicCoverComponent } from '../../components/comic-cover/comic-cover.component';
import { ComicDescriptionComponent } from '../../components/comic-description/comic-description.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ComicStatusComponent } from '../../components/comic-status/comic-status.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUser } from '../../models/user';
import { UserStoreService } from '../../../../backend/src/services/user-store';
import { ActionIconsComponent } from '../../components/action-icons/action-icons.component';
import { Comic } from '../../models/comic';

@Component({
  selector: 'app-comic-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ComicCoverComponent,
    ComicDescriptionComponent,
    CharacterCardComponent,
    NgForOf,
    ComicStatusComponent,
    FooterComponent,
    ButtonComponent,
    NgIf,
    NgClass,
    ActionIconsComponent
  ],
  templateUrl: './comic-page.component.html',
  styleUrls: ['./comic-page.component.scss']
})
export class ComicPageComponent implements OnInit, OnDestroy {
  comic: Comic | null = null;
  characters: any[] = [];
  user: IUser | null = null;
  canRead: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.userStore.user$.pipe(takeUntil(this.destroy$)).subscribe((userData) => {
      this.user = userData;
      this.checkAgeRestriction();
    });

    const comicId = this.route.snapshot.paramMap.get('id');
    if (comicId) {
      this.appService.getComicById(comicId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (comic) => {
          if (comic) {
            this.comic = {
              id: comicId,
              title: comic.title || '',
              synopsis: comic.synopsis || '',
              author: comic.author || '',
              genre: Array.isArray(comic.genre) ? comic.genre.join(', ') : comic.genre || '',
              published: comic.published || '',
              state: comic.state || '',
              rating: comic.rating || 0,
              cover: comic.cover || '',
              pegi: comic.pegi || 0,
              relatedCharacters: comic.relatedCharacters || [],
              author_id: comic.author_id || 0,
              comments: comic.comments || []
            };

            if (comic.relatedCharacters?.length) {
              this.appService.getRelatedCharacters(comic.relatedCharacters).pipe(
                takeUntil(this.destroy$)
              ).subscribe({
                next: (relatedCharacters) => {
                  this.characters = relatedCharacters;
                },
                error: (err) => {
                  console.error('Error al cargar personajes relacionados:', err);
                  this.characters = [];
                }
              });
            } else {
              this.characters = [];
            }

            this.checkAgeRestriction();
          }
        },
        error: (err) => {
          console.error('Error cargando el cómic:', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  callToRead() {
    if (!this.user) {
      this.router.navigate(['/login']).then(() => {
        window.scrollTo(0, 0);
      });
      return;
    }

    if (!this.canRead) {
      alert(`Sorry, you must be at least ${this.comic?.pegi} years old to read this comic.`);
      return;
    }

    const comicId = this.route.snapshot.paramMap.get('id');
    if (comicId) {
      this.router.navigate(['comic-reader', comicId]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  private checkAgeRestriction(): void {
    if (!this.user || !this.comic?.pegi) {
      this.canRead = true;
      return;
    }

    const userAge = this.userStore.getUserAge();
    this.canRead = userAge >= this.comic.pegi;
  }

  getPegiIconUrl(): string {
    if (!this.comic?.pegi) return '';
    return `/pegi-${this.comic.pegi}.png`;
  }

  protected readonly Array = Array;
}
