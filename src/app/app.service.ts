import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc,
  CollectionReference,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable, catchError, of, map, from } from 'rxjs';
import { where, query, orderBy } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';
import { IUser } from './models/user';
import { Comment } from './models/comic';
import { Timestamp } from 'firebase/firestore';

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
        return of([]);
      })
    );
  }

  getComicById(comicId: string): Observable<any> {
    const comicDoc = doc(this.firestore, `/comics/${comicId}`);
    return docData(comicDoc, { idField: 'id' }).pipe(
      catchError(error => {
        return of(null);
      })
    );
  }

  getCommentsByComicId(comicId: string): Observable<Comment[]> {
    const commentsCollection = collection(this.firestore, `/comics/${comicId}/comments`);
    const q = query(commentsCollection, orderBy('created_at', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((comments: any[]) => comments.map(comment => ({
        ...comment,
        created_at: comment['created_at'] instanceof Timestamp ? comment['created_at'].toDate() : comment['created_at']
      } as Comment))),
      catchError(error => {
        return of([]);
      })
    );
  }

  getRepliesByCommentId(comicId: string, commentId: string): Observable<Comment[]> {
    const repliesCollection = collection(this.firestore, `/comics/${comicId}/comments/${commentId}/replies`);
    const q = query(repliesCollection, orderBy('created_at', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((replies: any[]) => replies.map(reply => ({
        ...reply,
        created_at: reply['created_at'] instanceof Timestamp ? reply['created_at'].toDate() : reply['created_at']
      } as Comment))),
      catchError(error => {
        return of([]);
      })
    );
  }

  async addComment(comicId: string, comment: Omit<Comment, 'id' | 'created_at'>): Promise<string> {
    try {
      const commentsCollection = collection(this.firestore, `/comics/${comicId}/comments`);
      const newComment = {
        ...comment,
        created_at: new Date()
      };
      const docRef = await addDoc(commentsCollection, newComment);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async addReply(comicId: string, commentId: string, reply: Omit<Comment, 'id' | 'created_at'>): Promise<string> {
    try {
      const repliesCollection = collection(this.firestore, `/comics/${comicId}/comments/${commentId}/replies`);
      const newReply = {
        ...reply,
        created_at: new Date()
      };
      const docRef = await addDoc(repliesCollection, newReply);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async updateComment(comicId: string, commentId: string, content: string, isReply: boolean = false, parentCommentId?: string): Promise<void> {
    try {
      const docPath = isReply
        ? `/comics/${comicId}/comments/${parentCommentId}/replies/${commentId}`
        : `/comics/${comicId}/comments/${commentId}`;
      const commentDoc = doc(this.firestore, docPath);
      await setDoc(commentDoc, { content }, { merge: true });
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(comicId: string, commentId: string, isReply: boolean = false, parentCommentId?: string): Promise<void> {
    try {
      const docPath = isReply
        ? `/comics/${comicId}/comments/${parentCommentId}/replies/${commentId}`
        : `/comics/${comicId}/comments/${commentId}`;
      const commentDoc = doc(this.firestore, docPath);
      await deleteDoc(commentDoc);
    } catch (error) {
      throw error;
    }
  }

  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, '/users');
    return collectionData(usersCollection, { idField: 'id' }).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  getCharacters(): Observable<any[]> {
    const charactersCollection = collection(this.firestore, 'characters');
    return collectionData(charactersCollection, { idField: 'id' }).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  getCharacterById(characterId: string): Observable<any> {
    const characterDoc = doc(this.firestore, `/characters/${characterId}`);
    return docData(characterDoc, { idField: 'id' }).pipe(
      catchError(error => {
        return of(null);
      })
    );
  }

  getRelatedCharacters(characterIds: string[]): Observable<any[]> {
    const charactersCollection = collection(this.firestore, 'characters');
    const q = query(charactersCollection, where('id', 'in', characterIds));
    return collectionData(q, { idField: 'id' }).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  getRelatedComics(comicIds: string[]): Observable<any[]> {
    const comicsCollection = collection(this.firestore, 'comics');
    const q = query(comicsCollection, where('id', 'in', comicIds));
    return collectionData(q, { idField: 'id' }).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  getNews(): Observable<any[]> {
    const newsCollection = collection(this.firestore, 'news');
    return collectionData(newsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  getNewsById(newsId: string): Observable<any> {
    const newsDoc = doc(this.firestore, `/news/${newsId}`);
    return docData(newsDoc, { idField: 'id' }).pipe(
      catchError(error => {
        return of(null);
      })
    );
  }

  getDonations(): Observable<any[]> {
    const donationsCollection = collection(this.firestore, 'donations');
    return collectionData(donationsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  getPayments(): Observable<any[]> {
    const paymentsCollection = collection(this.firestore, 'payments');
    return collectionData(paymentsCollection, { idField: 'id' }).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  getGenres(): Observable<any[]> {
    const genresCollection = collection(this.firestore, 'genres');
    return collectionData(genresCollection, { idField: 'id' }).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  getUserByUid(uid: string): Observable<IUser> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as IUser;
            return userData;
          } else {
            throw new Error('User not found');
          }
        })
        .catch((error) => {
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
      throw error;
    }
  }

  async updateComic(comicId: string, comic: any): Promise<void> {
    try {
      const comicDoc = doc(this.firestore, `/comics/${comicId}`);
      await setDoc(comicDoc, comic, { merge: true });
    } catch (error) {
      throw error;
    }
  }

  async deleteComic(comicId: string): Promise<void> {
    try {
      const comicDoc = doc(this.firestore, `/comics/${comicId}`);
      await deleteDoc(comicDoc);
    } catch (error) {
      throw error;
    }
  }

  async addUser(userData: IUser, uid: string): Promise<string> {
    try {
      const userDocRef = doc(this.firestore, `/users/${uid}`);
      await setDoc(userDocRef, userData);
      return uid;
    } catch (error) {
      throw error;
    }
  }

  async addCharacter(character: any): Promise<string> {
    try {
      const charactersCollection = collection(this.firestore, 'characters');
      const docRef = await addDoc(charactersCollection, character);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async addNews(news: any): Promise<string> {
    try {
      const newsCollection = collection(this.firestore, 'news');
      const docRef = await addDoc(newsCollection, news);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async addDonation(donation: any): Promise<string> {
    try {
      const donationsCollection = collection(this.firestore, 'donations');
      const docRef = await addDoc(donationsCollection, donation);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async addPayment(payment: any): Promise<string> {
    try {
      const paymentsCollection = collection(this.firestore, 'payments');
      const docRef = await addDoc(paymentsCollection, payment);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async addGenre(genre: any): Promise<string> {
    try {
      const genresCollection = collection(this.firestore, 'genres');
      const docRef = await addDoc(genresCollection, genre);
      return docRef.id;
    } catch (error) {
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
