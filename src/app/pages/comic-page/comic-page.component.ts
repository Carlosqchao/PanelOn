import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { HeaderComponent } from '../../components/header/header.component';
import { ComicCoverComponent } from '../../components/comic-cover/comic-cover.component';
import { ComicDescriptionComponent } from '../../components/comic-description/comic-description.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { ComicStatusComponent } from '../../components/comic-status/comic-status.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import {IUser} from '../../models/user';
import {UserStoreService} from '../../../../backend/src/services/user-store';

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
    NgClass
  ],
  templateUrl: './comic-page.component.html',
  styleUrls: ['./comic-page.component.scss']
})
export class ComicPageComponent implements OnInit, OnDestroy {
  title: string = '';
  synopsis: string = '';
  author: string = '';
  genre: string = '';
  releaseDate: string = '';
  status: string = '';
  rating: number = 0;
  characters: any[] = [];
  cover: string = '';
  pegi: number = 0;
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
            this.title = comic.title || '';
            this.synopsis = comic.synopsis || '';
            this.author = comic.author || '';
            this.genre = Array.isArray(comic.genre) ? comic.genre.join(', ') : comic.genre || '';
            const rawDate = comic.published;
            if (rawDate) {
              const date = new Date(rawDate);
              this.releaseDate = date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
            } else {
              this.releaseDate = '';
            }
            this.status = comic.state || '';
            this.rating = comic.rating || 0;
            this.cover = comic.cover || '';
            this.pegi = comic.pegi || 0;

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
      alert(`Sorry, you must be at least ${this.pegi} years old to read this comic.`);
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
    if (!this.user || !this.pegi) {
      this.canRead = true;
      return;
    }

    const userAge = this.userStore.getUserAge();
    this.canRead = userAge >= this.pegi;
  }
}
