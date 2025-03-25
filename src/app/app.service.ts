import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, catchError, of } from 'rxjs';

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

  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, '/users');
    console.log('Consultando usuarios:', usersCollection);
    return collectionData(usersCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo usuarios:', error);
        return of([]);
      })
    );
  }

  getCharacters(): Observable<any[]> {
    const charactersCollection = collection(this.firestore, 'characters');
    console.log('Consultando personajes:', charactersCollection);
    return collectionData(charactersCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo personajes:', error);
        return of([]);
      })
    );
  }

  getNews(): Observable<any[]> {
    const newsCollection = collection(this.firestore, 'news');
    console.log('Consultando noticias:', newsCollection);
    return collectionData(newsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo noticias:', error);
        return of([]);
      })
    );
  }

  getDonations(): Observable<any[]> {
    const donationsCollection = collection(this.firestore, 'donations');
    console.log('Consultando donaciones:', donationsCollection);
    return collectionData(donationsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo donaciones:', error);
        return of([]);
      })
    );
  }

  getPayments(): Observable<any[]> {
    const paymentsCollection = collection(this.firestore, 'payments');
    console.log('Consultando pagos:', paymentsCollection);
    return collectionData(paymentsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo pagos:', error);
        return of([]);
      })
    );
  }

  getGenres(): Observable<any[]> {
    const genresCollection = collection(this.firestore, 'genres');
    console.log('Consultando géneros:', genresCollection);
    return collectionData(genresCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error obteniendo géneros:', error);
        return of([]);
      })
    );
  }
}
