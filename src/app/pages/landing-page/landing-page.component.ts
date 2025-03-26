import { Component, OnInit } from '@angular/core';
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
export class LandingPageComponent implements OnInit {
  carouselItems = [
    {
      id: 1,
      title: 'Imagen 1',
      imageUrl: 'https://www.brooklyncomicshop.com/BCS/wp-content/uploads/2018/09/Batman-Article-Batman-Title-Brooklyn-Comic-Shop.jpg',
      description: 'Descripción de la imagen 1'
    },
    {
      id: 2,
      title: 'Imagen 2',
      imageUrl: 'https://www.eslahoradelastortas.com/blog/media/2021/07/stp00.jpg',
      description: 'Descripción de la imagen 2'
    },
    {
      id: 3,
      title: 'Imagen 3',
      imageUrl: 'https://www.telemadrid.es/2014/08/26/imagenes-de-archivo/actioncomic1214superman_1605149476_2010551_1300x731.jpg',
      description: 'Descripción de la imagen 3'
    }
  ];

  comics: any[] = [];
  news = [
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
  characters: any[] = [];
  selectedCharacters: any[] = [];
  predefinedColors = ['#FFDD33', '#5CAAB4', '#A01F29'];

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.appService.getComics().subscribe({
      next: (comics) => {
        this.comics = comics;
        console.log('Cómics cargados desde Firestore:');
      },
      error: (err) => {
        console.error('Error al cargar los cómics desde Firestore:', err);
      }
    });

    this.appService.getCharacters().subscribe({
      next: (characters) => {
        this.characters = characters;
        this.selectRandomCharacters();
      },
      error: (err) => {
        console.error('Error al cargar los personajes desde Firestore:', err);
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
}
