import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {ComicCardComponent} from "../../components/comic-card/comic-card.component";
import {NgForOf, SlicePipe} from "@angular/common";
import {CommonModule} from '@angular/common';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NewsCardComponent} from '../../components/news-card/news-card.component';
import {CharacterCardComponent} from '../../components/character-card/character-card.component';
import {map, take} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-search-page',
  imports: [
    CommonModule,
    HeaderComponent,
    SearchBarComponent,
    ComicCardComponent,
    NgForOf,
    NewsCardComponent,
    CharacterCardComponent,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements OnInit {
  handleComicSearch(query: string) {
    this.appService.getComics().pipe(
      map(comics => comics.filter(comic => comic.title.toLowerCase().includes(query.toLowerCase())))
    ).subscribe(result => {
      this.comics = result;
    });
  }


handleFilter() {
    console.log('Filter clicked');
  }

  comics: any[] = [];
  constructor(private appService: AppService, private router: Router,private activatedRoute: ActivatedRoute,) {}
  option: string = '';
  news: ({ title: string; imageUrl: string; author: string; })[] | undefined;
  selectedCharacters: any[] | undefined;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.option = params['option'];

      if (this.option === 'comic') {
        this.loadComics();
      } else if (this.option === 'news') {
        this.loadNews();
      } else{
        this.loadCharacters();
      }
    });

  }

  loadComics(): void {
    this.appService.getComics().subscribe({
      next: (comics: any[]) => {
        this.comics = comics;
        console.log('Cómics cargados desde Firestore:');
      },
      error: (err: any) => {
        console.error('Error al cargar los cómics:', err);
      }
    });
  }

  loadNews(): void {
    this.news = [
      {
        title: 'New Spider-Man Movie Announced',
        imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/3/30/6750d4c18340e/portrait_uncanny.jpg',
        author: 'Peter Parker'
      },
      {
        title: 'Star Wars Series Gets New Season',
        imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/6/70/6750d4ba4b982/portrait_uncanny.jpg',
        author: 'Luke Skywalker'
      },
      {
        title: 'Avengers Assemble for New Event',
        imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/d/00/6750d4ca9eff7/portrait_uncanny.jpg',
        author: 'Tony Stark'
      },
      {
        title: 'Avengers Face New Threat',
        imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/d/00/6750d4ca9eff7/portrait_uncanny.jpg',
        author: 'Steve Rogers'
      }
    ];
  }
  handleNewsSearch(query: string) {
    this.appService.getNews().pipe(
      map(news =>
        news.filter(report =>
          report.title?.toLowerCase().includes(query.toLowerCase())
        )
      )
    ).subscribe(result => {
      this.news = result; // ← esto debe incluir imageUrl si viene desde el servicio
    });
  }

  loadCharacters(): void {
    this.appService.getCharacters().subscribe({
      next: (selectedCharacters: any[]) => {
        this.selectedCharacters = selectedCharacters;
        console.log('Cómics cargados desde Firestore:');
      },
      error: (err: any) => {
        console.error('Error al cargar los cómics:', err);
      }
    });
  }

  handleCharacterSearch(query: string) {
    this.appService.getCharacters().pipe(
      map( selectedCharacters => selectedCharacters.filter(character => character.characterName.toLowerCase().includes(query.toLowerCase())))
    ).subscribe(result => {
      console.log(result);
      this.selectedCharacters = result;
    });
  }
}
