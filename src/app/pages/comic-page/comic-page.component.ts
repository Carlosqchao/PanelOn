import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { HeaderComponent } from '../../components/header/header.component';
import { ComicCoverComponent } from '../../components/comic-cover/comic-cover.component';
import { ComicDescriptionComponent } from '../../components/comic-description/comic-description.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import {NgForOf, NgIf} from '@angular/common';
import { ComicStatusComponent } from '../../components/comic-status/comic-status.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-comic-page',
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
  standalone: true,
  styleUrls: ['./comic-page.component.scss']
})
export class ComicPageComponent implements OnInit {
  title: string = '';
  synopsis: string = '';
  author: string = '';
  genre: string = '';
  releaseDate: string = '';
  status: string = '';
  rating: number = 0;
  characters: any[] = [];
  cover: string = '';

  constructor(private route: ActivatedRoute, private appService: AppService) {}

  ngOnInit(): void {
    const comicId = this.route.snapshot.paramMap.get('id');
    if (comicId) {
      this.appService.getComicById(comicId).subscribe({
        next: (comic) => {
          if (comic) {
            this.title = comic.title || '';
            this.synopsis = comic.synopsis || '';
            this.author = comic.author || '';
            this.genre = Array.isArray(comic.genre) ? comic.genre.join(', ') : '';
            this.releaseDate = comic.published || '';
            this.status = comic.state || '';
            this.rating = comic.rating || 0;
            this.characters = comic.characters || [];
            this.cover = comic.cover || '';
          }
        },
        error: (err) => {
          console.error('Error cargando el cómic:', err);
        }
      });
    }
  }
}
