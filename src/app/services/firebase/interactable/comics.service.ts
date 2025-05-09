import {Injectable} from '@angular/core';
import {Comic} from '../../../models/comic';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComicsService extends FirestoreServiceInteractable<Comic> {

  constructor() {
    super('comics');
  }

  getComicsOrderedByDate(ascending: boolean = false): Observable<Comic[]> {
    return this.getAll().pipe(
      map((comics: Comic[]) =>
        comics
          .filter(comic => comic.published != null)
          .sort((a, b) => {
            const dateA = new Date(a.published).getTime();
            const dateB = new Date(b.published).getTime();
            return ascending ? dateA - dateB : dateB - dateA;
          })
      )
    );
  }

  getComicsOrderedByRating(ascending: boolean = false): Observable<Comic[]> {
    return this.getAll().pipe(
      map((comics: Comic[]) =>
        comics
          .filter(comic => comic.rating != null)
          .sort((a, b) => ascending ? a.rating - b.rating : b.rating - a.rating)
      )
    );
  }
}
