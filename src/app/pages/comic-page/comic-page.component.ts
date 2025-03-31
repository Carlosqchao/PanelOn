import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { HeaderComponent } from '../../components/header/header.component';
import { ComicCoverComponent } from '../../components/comic-cover/comic-cover.component';
import { ComicDescriptionComponent } from '../../components/comic-description/comic-description.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { ComicStatusComponent } from '../../components/comic-status/comic-status.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

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
    NgIf
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
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) {}

  ngOnInit(): void {
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
            this.releaseDate = comic.published || '';
            this.status = comic.state || '';
            this.rating = comic.rating || 0;
            this.cover = comic.cover || '';

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
    const comicId = this.route.snapshot.paramMap.get('id');
    if (comicId) {
      this.router.navigate(['comic-reader', comicId]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }

}
