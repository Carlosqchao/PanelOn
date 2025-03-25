import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from './app.service';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
    template: `
    <router-outlet></router-outlet>
    `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  comics$;
  users$;
  characters$;
  news$;
  donations$;
  payments$;
  genres$;

  constructor(private appService: AppService) {
    this.comics$ = this.appService.getComics();
    this.users$ = this.appService.getUsers();
    this.characters$ = this.appService.getCharacters();
    this.news$ = this.appService.getNews();
    this.donations$ = this.appService.getDonations();
    this.payments$ = this.appService.getPayments();
    this.genres$ = this.appService.getGenres();

    this.comics$.subscribe(comics => {
      console.log('Lista de cómics:', comics);
    });
    this.users$.subscribe(users => {
      console.log('Lista de usuarios:', users);
    });
    this.characters$.subscribe(characters => {
      console.log('Lista de personajes:', characters);
    });
    this.news$.subscribe(news => {
      console.log('Lista de noticias:', news);
    });
    this.donations$.subscribe(donations => {
      console.log('Lista de donaciones:', donations);
    });
    this.payments$.subscribe(payments => {
      console.log('Lista de pagos:', payments);
    });
    this.genres$.subscribe(genres => {
      console.log('Lista de géneros:', genres);
    });
  }
}
