import { Injectable, inject } from '@angular/core';
import {Firestore, collection, collectionData, doc} from '@angular/fire/firestore';
import { Observable, catchError, of } from 'rxjs';
import { where, query } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';

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

  async addComic(comic: any): Promise<string> {
    try {
      const comicsCollection = collection(this.firestore, '/comics');
      const docRef = await addDoc(comicsCollection, comic);
      console.log('Cómic añadido con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error añadiendo cómic:', error);
      throw error;
    }
  }

  async updateComic(comicId: string, comic: any): Promise<void> {
    try {
      const comicDoc = doc(this.firestore, `/comics/${comicId}`);
      await setDoc(comicDoc, comic, { merge: true });
      console.log('Cómic actualizado:', comicId);
    } catch (error) {
      console.error('Error actualizando cómic:', error);
      throw error;
    }
  }

  async deleteComic(comicId: string): Promise<void> {
    try {
      const comicDoc = doc(this.firestore, `/comics/${comicId}`);
      await deleteDoc(comicDoc);
      console.log('Cómic eliminado:', comicId);
    } catch (error) {
      console.error('Error eliminando cómic:', error);
      throw error;
    }
  }

  async addUser(user: any): Promise<string> {
    try {
      const usersCollection = collection(this.firestore, '/users');
      const docRef = await addDoc(usersCollection, user);
      console.log('Usuario añadido con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error añadiendo usuario:', error);
      throw error;
    }
  }

  async addCharacter(character: any): Promise<string> {
    try {
      const charactersCollection = collection(this.firestore, 'characters');
      const docRef = await addDoc(charactersCollection, character);
      console.log('Personaje añadido con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error añadiendo personaje:', error);
      throw error;
    }
  }

  async addNews(news: any): Promise<string> {
    try {
      const newsCollection = collection(this.firestore, 'news');
      const docRef = await addDoc(newsCollection, news);
      console.log('Noticia añadida con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error añadiendo noticia:', error);
      throw error;
    }
  }

  async addDonation(donation: any): Promise<string> {
    try {
      const donationsCollection = collection(this.firestore, 'donations');
      const docRef = await addDoc(donationsCollection, donation);
      console.log('Donación añadida con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error añadiendo donación:', error);
      throw error;
    }
  }

  async addPayment(payment: any): Promise<string> {
    try {
      const paymentsCollection = collection(this.firestore, 'payments');
      const docRef = await addDoc(paymentsCollection, payment);
      console.log('Pago añadido con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error añadiendo pago:', error);
      throw error;
    }
  }

  async addGenre(genre: any): Promise<string> {
    try {
      const genresCollection = collection(this.firestore, 'genres');
      const docRef = await addDoc(genresCollection, genre);
      console.log('Género añadido con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error añadiendo género:', error);
      throw error;
    }
  }
}
