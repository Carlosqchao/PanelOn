import { Injectable, inject } from '@angular/core';
import {Firestore, collection, collectionData, doc} from '@angular/fire/firestore';
import { Observable, catchError, of } from 'rxjs';
import { where, query } from '@angular/fire/firestore';
import {docData} from 'rxfire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  getComics(): Observable<any[]> {
    const comicsCollection = collection(this.firestore, '/comics');
    return collectionData(comicsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo cómics:', error);
        return of([]);
      })
    );
  }

  getComicById(comicId: string): Observable<any> {
    const comicDoc = doc(this.firestore, `/comics/${comicId}`);
    return docData(comicDoc, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo el cómic:', error);
        return of(null);
      })
    );
  }

  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, '/users');
    return collectionData(usersCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo usuarios:', error);
        return of([]);
      })
    );
  }

  getCharacters(): Observable<any[]> {
    const charactersCollection = collection(this.firestore, 'characters');
    return collectionData(charactersCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo personajes:', error);
        return of([]);
      })
    );
  }

  getCharacterById(characterId: string): Observable<any> {
    const characterDoc = doc(this.firestore, `/characters/${characterId}`);
    return docData(characterDoc, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching character:', error);
        return of(null);
      })
    );
  }


  getRelatedCharacters(characterIds: string[]): Observable<any[]> {
    const charactersCollection = collection(this.firestore, 'characters');
    const q = query(charactersCollection, where('id', 'in', characterIds));
    return collectionData(q, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo personajes relacionados:', error);
        return of([]);
      })
    );
  }

  getRelatedComics(comicIds: string[]): Observable<any[]> {
    const comicsCollection = collection(this.firestore, 'comics');
    const q = query(comicsCollection, where('id', 'in', comicIds));
    return collectionData(q, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo cómics relacionados:', error);
        return of([]);
      })
    );
  }

  getNews(): Observable<any[]> {
    const newsCollection = collection(this.firestore, 'news');
    return collectionData(newsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo noticias:', error);
        return of([]);
      })
    );
  }

  getDonations(): Observable<any[]> {
    const donationsCollection = collection(this.firestore, 'donations');
    return collectionData(donationsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo donaciones:', error);
        return of([]);
      })
    );
  }

  getPayments(): Observable<any[]> {
    const paymentsCollection = collection(this.firestore, 'payments');
    return collectionData(paymentsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo pagos:', error);
        return of([]);
      })
    );
  }

  getGenres(): Observable<any[]> {
    const genresCollection = collection(this.firestore, 'genres');
    return collectionData(genresCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo géneros:', error);
        return of([]);
      })
    );
  }
}
