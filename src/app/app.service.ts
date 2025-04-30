import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc, updateDoc
} from '@angular/fire/firestore';
import {Observable, catchError, of, map, from} from 'rxjs';
import { where, query } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';
import {IUser} from './models/user';

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
        console.error('Error fetching comics:', error);
        return of([]);
      })
    );
  }

  getComicById(comicId: string): Observable<any> {
    const comicDoc = doc(this.firestore, `/comics/${comicId}`);
    return docData(comicDoc, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching comic:', error);
        return of(null);
      })
    );
  }


  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, '/users');
    return collectionData(usersCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }

  getCharacters(): Observable<any[]> {
    const charactersCollection = collection(this.firestore, 'characters');
    return collectionData(charactersCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching characters:', error);
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
        console.error('Error fetching related characters:', error);
        return of([]);
      })
    );
  }

  getRelatedComics(comicIds: string[]): Observable<any[]> {
    const comicsCollection = collection(this.firestore, 'comics');
    const q = query(comicsCollection, where('id', 'in', comicIds));
    return collectionData(q, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching related comics:', error);
        return of([]);
      })
    );
  }

  getNews(): Observable<any[]> {
    const newsCollection = collection(this.firestore, 'news');
    return collectionData(newsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching news:', error);
        return of([]);
      })
    );
  }

  getDonations(): Observable<any[]> {
    const donationsCollection = collection(this.firestore, 'donations');
    return collectionData(donationsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching donations:', error);
        return of([]);
      })
    );
  }

  getPayments(): Observable<any[]> {
    const paymentsCollection = collection(this.firestore, 'payments');
    return collectionData(paymentsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching payments:', error);
        return of([]);
      })
    );
  }

  getGenres(): Observable<any[]> {
    const genresCollection = collection(this.firestore, 'genres');
    return collectionData(genresCollection, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching genres:', error);
        return of([]);
      })
    );
  }

  getUserByUid(uid: string): Observable<IUser> {
    console.log('Buscando usuario en Firestore con UID:', uid);
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as IUser;
            console.log('Usuario encontrado en Firestore:', userData);
            return userData;
          } else {
            console.error('No se encontró usuario con UID:', uid);
            throw new Error('User not found');
          }
        })
        .catch((error) => {
          console.error('Error al buscar usuario en Firestore:', error);
          throw error;
        })
    );
  }

  async addComic(comic: any): Promise<string> {
    try {
      const comicsCollection = collection(this.firestore, '/comics');
      const docRef = await addDoc(comicsCollection, comic);
      return docRef.id;
    } catch (error) {
      console.error('Error adding comic:', error);
      throw error;
    }
  }

  async updateComic(comicId: string, comic: any): Promise<void> {
    try {
      const comicDoc = doc(this.firestore, `/comics/${comicId}`);
      await setDoc(comicDoc, comic, { merge: true });
    } catch (error) {
      console.error('Error updating comic:', error);
      throw error;
    }
  }

  async deleteComic(comicId: string): Promise<void> {
    try {
      const comicDoc = doc(this.firestore, `/comics/${comicId}`);
      await deleteDoc(comicDoc);
    } catch (error) {
      console.error('Error deleting comic:', error);
      throw error;
    }
  }

  async addUser(userData: IUser, uid: string): Promise<string> {
    try {
      const userDocRef = doc(this.firestore, `/users/${uid}`);
      await setDoc(userDocRef, userData);
      console.log('Usuario guardado en Firestore con UID:', uid);
      return uid;
    } catch (error) {
      console.error('Error al guardar usuario en Firestore:', error);
      throw error;
    }
  }

  updateUser(id: string | undefined, data: Partial<IUser>){
    const userDocRef = doc(this.firestore, `/users/${id}`);
    return updateDoc(userDocRef, data);
  }

  async addCharacter(character: any): Promise<string> {
    try {
      const charactersCollection = collection(this.firestore, 'characters');
      const docRef = await addDoc(charactersCollection, character);
      return docRef.id;
    } catch (error) {
      console.error('Error adding character:', error);
      throw error;
    }
  }

  async addNews(news: any): Promise<string> {
    try {
      const newsCollection = collection(this.firestore, 'news');
      const docRef = await addDoc(newsCollection, news);
      return docRef.id;
    } catch (error) {
      console.error('Error adding news:', error);
      throw error;
    }
  }

  async addDonation(donation: any): Promise<string> {
    try {
      const donationsCollection = collection(this.firestore, 'donations');
      const docRef = await addDoc(donationsCollection, donation);
      return docRef.id;
    } catch (error) {
      console.error('Error adding donation:', error);
      throw error;
    }
  }

  async addPayment(payment: any): Promise<string> {
    try {
      const paymentsCollection = collection(this.firestore, 'payments');
      const docRef = await addDoc(paymentsCollection, payment);
      return docRef.id;
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  }

  async addGenre(genre: any): Promise<string> {
    try {
      const genresCollection = collection(this.firestore, 'genres');
      const docRef = await addDoc(genresCollection, genre);
      return docRef.id;
    } catch (error) {
      console.error('Error adding genre:', error);
      throw error;
    }
  }

  getComicsOrderedByDate(ascending: boolean = false): Observable<any[]> {
    const comicsCollection = collection(this.firestore, 'comics');

    return collectionData(comicsCollection, { idField: 'id' }).pipe(
      map((comics: any[]) =>
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


  getComicsOrderedByRating(ascending: boolean = false): Observable<any[]> {
    const comicsCollection = collection(this.firestore, 'comics');

    return collectionData(comicsCollection, { idField: 'id' }).pipe(
      map((comics: any[]) =>
        comics
          .filter(comic => comic.rating != null)
          .sort((a, b) => ascending ? a.rating - b.rating : b.rating - a.rating)
      )
    );
  }

}
