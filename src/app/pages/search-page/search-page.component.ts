import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {ComicCardComponent} from "../../components/comic-card/comic-card.component";
import {NgForOf} from "@angular/common";
import {CommonModule} from '@angular/common';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NewsCardComponent} from '../../components/news-card/news-card.component';
import {CharacterCardComponent} from '../../components/character-card/character-card.component';
import {map} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';


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
    TranslateModule
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements OnInit {


  handleComicSearch(query: string) {
    this.appService.getComics().pipe(
      map(comics => comics.filter(comic => {
        const lowerQuery = query.toLowerCase();
        return comic.title.toLowerCase().includes(lowerQuery) ||
          comic.author.toLowerCase().includes(lowerQuery);
      }))
    ).subscribe(result => {
      this.comics = result;
    });
  }



  filterVisible = false;
  availableGenres: string[] = [];
  selectedGenres: string[] = [];

  handleFilter() {
    this.filterVisible = !this.filterVisible;
    if (this.availableGenres.length === 0) {
      this.appService.getGenres().subscribe(result => {
        this.availableGenres = result.map(genre => genre.name);
      });
    }
  }

  toggleGenre(genre: string) {
    const index = this.selectedGenres.indexOf(genre);
    if (index === -1) {
      this.selectedGenres.push(genre);
    } else {
      this.selectedGenres.splice(index, 1);
    }

    this.appService.getComics().pipe(
      map(comics => comics.filter(comic =>
          this.selectedGenres.length === 0 || this.selectedGenres.every(selectedGenre =>
            comic.genre.includes(selectedGenre)
          )
      ))
    ).subscribe(result => {
      this.comics = result;
    });
  }


  comics: any[] = [];
  constructor(private appService: AppService, private router: Router,private activatedRoute: ActivatedRoute,) {}
  option: string = '';
  news: ({
    id: string;
    title: string; image: string; author: string; })[] | undefined;
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


  dropdownVisible = false;
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  sortByRatingAscending = false;
  loadComicsOrderedByRating() {
    this.appService.getComicsOrderedByRating(this.sortByRatingAscending).subscribe((orderedComics) => {
      this.comics = orderedComics;
    });


    this.sortByRatingAscending = !this.sortByRatingAscending;
  }


  sortByDateAscending: boolean = false;

  loadComicsOrderedByDate() {
    this.appService.getComicsOrderedByDate(this.sortByDateAscending).subscribe((orderedComics) => {
      this.comics = orderedComics;
    });

    this.sortByDateAscending = !this.sortByDateAscending;
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
    this.appService.getNews().pipe(
    ).subscribe(result => {
      this.news = result;
    });
  }

  handleNewsSearch(query: string) {
    this.appService.getNews().pipe(
      map(news =>
        news.filter(report =>
          report.title?.toLowerCase().includes(query.toLowerCase()) ||
          report.author?.toLowerCase().includes(query.toLowerCase())
        )
      )
    ).subscribe(result => {
      this.news = result;
    });
  }

  loadCharacters(): void {
    this.appService.getCharacters().subscribe({
      next: (selectedCharacters: any[]) => {
        this.selectedCharacters = selectedCharacters;
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

  maxComicsPerPage = 15;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.comics.length / this.maxComicsPerPage);
  }

  get paginatedComics() {
    const start = (this.currentPage - 1) * this.maxComicsPerPage;
    const end = start + this.maxComicsPerPage;
    return this.comics.slice(start, end);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
