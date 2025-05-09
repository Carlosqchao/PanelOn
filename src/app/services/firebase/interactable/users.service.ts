import { Injectable } from '@angular/core';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';
import {IUser} from '../../../models/user';
import {catchError, map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends FirestoreServiceInteractable<IUser> {

  constructor() {
    super('users');
  }

  getSavedComicsCount(userId: string): Observable<number> {
    if (!userId) return of(0);

    return this.getSubcollection(userId, 'savedComics').pipe(
      map((comics) => comics.length),
      catchError((error) => {
        console.error('Error counting saved comics:', error);
        return of(0);
      })
    );
  }

  getLikedComicsCount(userId: string): Observable<number> {
    if (!userId) return of(0);

    return this.getSubcollection(userId, 'likedComics').pipe(
      map((comics) => comics.length),
      catchError((error) => {
        console.error('Error counting liked comics:', error);
        return of(0);
      })
    );
  }

  getUploadedComicsCount(userId: string): Observable<number> {
    if (!userId) return of(0);

    return this.getSubcollection(userId, 'uploadedComics').pipe(
      map((comics) => comics.length),
      catchError((error) => {
        console.error('Error counting uploaded comics:', error);
        return of(0);
      })
    );
  }
}
