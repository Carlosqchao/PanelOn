import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LandingCarouselComponent } from './landing-carousel/landing-carousel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LandingCarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PanelOn';

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
}
