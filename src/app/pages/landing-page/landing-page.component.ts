import { Component } from '@angular/core';
import { LandingCarouselComponent } from '../../landing-carousel/landing-carousel.component';
import { ComicCardComponent } from '../../comic-card/comic-card.component';
import { CommonModule } from '@angular/common';
import { SectionTitleComponent } from '../../section-title/section-title.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LandingCarouselComponent, ComicCardComponent, SectionTitleComponent, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
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

  comics = [
    { title: 'Spider-Man', imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/3/30/6750d4c18340e/portrait_uncanny.jpg' },
    { title: 'Star Wars', imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/6/70/6750d4ba4b982/portrait_uncanny.jpg' },
    { title: 'Avengers', imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/d/00/6750d4ca9eff7/portrait_uncanny.jpg' },
    { title: 'X-Men', imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/5/d0/6750d4a2405bd/portrait_uncanny.jpg' },
    { title: 'Avengers', imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/d/00/6750d4ca9eff7/portrait_uncanny.jpg' },
  ];
}
