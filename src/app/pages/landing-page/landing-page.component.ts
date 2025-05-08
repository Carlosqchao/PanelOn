import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../app.service';
import { LandingCarouselComponent } from '../../components/landing-carousel/landing-carousel.component';
import { ComicCardComponent } from '../../components/comic-card/comic-card.component';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { LandingCharacterCard1Component } from '../../components/landing-character-card-1/landing-character-card-1.component';
import { LandingCharacterCard2Component } from '../../components/landing-character-card-2/landing-character-card-2.component';
import { LandingCharacterCard3Component } from '../../components/landing-character-card-3/landing-character-card-3.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    LandingCarouselComponent,
    ComicCardComponent,
    SectionTitleComponent,
    NewsCardComponent,
    LandingCharacterCard1Component,
    LandingCharacterCard2Component,
    LandingCharacterCard3Component,
    FooterComponent,
    CommonModule,
    HeaderComponent,
    ButtonComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  carouselItems: any[] = [];
  comics: any[] = [];
  popularComics: any[] = [];
  news: any[] = [];
  characters: any[] = [];
  selectedCharacters: any[] = [];
  predefinedColors = ['#FFDD33', '#5CAAB4', '#A01F29'];

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit(): void {
    this.appService.getComics().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (comics) => {
        this.comics = comics;
      },
      error: (err) => {
        console.error('Error loading comics from Firestore:', err);
      }
    });

    this.appService.getComicsOrderedByRating(false).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (comics) => {
        this.popularComics = comics.slice(0, 4);
      },
      error: (err) => {
        console.error('Error loading popular comics from Firestore:', err);
        this.popularComics = [];
      }
    });

    this.appService.getNews().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (news) => {
        this.news = news.slice(0, 4);
        this.carouselItems = news.slice(0, 8).map((item, index) => {
          const carouselItem = {
            id: index + 1,
            title: item.title || 'No title',
            image: item.image || 'https://via.placeholder.com/800x400?text=Image+not+available',
            description: item.content ? item.content.substring(0, 100) + '...' : 'No description',
            newsId: item.id || `news_${index}`
          };
          return carouselItem;
        });
        const newsIds = this.carouselItems.map(item => item.newsId);
        if (new Set(newsIds).size !== newsIds.length) {
          console.warn('Warning: Duplicate newsIds detected!', newsIds);
        }
      },
      error: (err) => {
        console.error('Error loading news from Firestore:', err);
        this.carouselItems = [];
      }
    });

    this.appService.getCharacters().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (characters) => {
        this.characters = characters;
        this.selectRandomCharacters();
      },
      error: (err) => {
        console.error('Error loading characters from Firestore:', err);
      }
    });
  }

  selectRandomCharacters(): void {
    const shuffled = [...this.characters].sort(() => 0.5 - Math.random());
    this.selectedCharacters = shuffled.slice(0, 3).map((char, index) => ({
      ...char,
      backgroundColor: this.predefinedColors[index]
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  callToSearch(option: string): void {
    this.router.navigate(['search-page'], { queryParams: { option } }).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
