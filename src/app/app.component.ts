import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  template: `
    <router-outlet></router-outlet>
    `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  comics: any[] = [];
  genres: any[] = [];

  newComic = {
    title: '',
    author: '',
    genre: ''
  };

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.loadComics();
    this.loadGenres();
  }

  loadComics() {
    this.appService.getComics().subscribe({
      next: (comics) => {
        this.comics = comics;
        console.log('Comics cargados:', comics);
      },
      error: (error) => {
        console.error('Error al cargar cómics:', error);
      }
    });
  }

  loadGenres() {
    this.appService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
        console.log('Géneros cargados:', genres);
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
      }
    });
  }

  addComic() {
    if (!this.newComic.title) {
      alert('Por favor, ingresa un título');
      return;
    }

    this.appService.addComic(this.newComic).then(() => {
      this.newComic = { title: '', author: '', genre: '' };
      this.loadComics();
    }).catch(error => {
      console.error('Error al añadir cómic:', error);
      alert('No se pudo añadir el cómic');
    });
  }

  deleteComic(comicId: string) {
    this.appService.deleteComic(comicId).then(() => {
      this.loadComics();
    }).catch(error => {
      console.error('Error al eliminar cómic:', error);
      alert('No se pudo eliminar el cómic');
    });
  }

  editComic(comic: any) {
    this.newComic = { ...comic };
  }
}
