import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc, updateDoc, getDocs
} from '@angular/fire/firestore';
import {Observable, catchError, of, map, from, switchMap, combineLatest} from 'rxjs';
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

  getSavedComics(userId: string |undefined): Observable<any[]> {
    if (!userId) {
      console.error('User ID is required');
      return of([]);
    }

    const savedComicsCollection = collection(this.firestore, `/users/${userId}/savedComics`);

    return collectionData(savedComicsCollection, { idField: 'comicId' }).pipe(
      switchMap(savedComics => {
        if (savedComics.length === 0) {
          return of([]);
        }

        const comicIds = savedComics.map(item => item.comicId);

        const comicObservables = comicIds.map(comicId => this.getComicById(comicId));

        return combineLatest(comicObservables).pipe(
          map(comics => comics.filter(comic => comic !== null))
        );
      }),
      catchError(error => {
        console.error('Error fetching saved comics:', error);
        return of([]);
      })
    );
  }

  getLikedComics(userId: string |undefined): Observable<any[]> {
    if (!userId) {
      console.error('User ID is required');
      return of([]);
    }

    const savedComicsCollection = collection(this.firestore, `/users/${userId}/likedComics`);

    return collectionData(savedComicsCollection, { idField: 'comicId' }).pipe(
      switchMap(savedComics => {
        if (savedComics.length === 0) {
          return of([]);
        }

        const comicIds = savedComics.map(item => item.comicId);

        const comicObservables = comicIds.map(comicId => this.getComicById(comicId));

        return combineLatest(comicObservables).pipe(
          map(comics => comics.filter(comic => comic !== null))
        );
      }),
      catchError(error => {
        console.error('Error fetching saved comics:', error);
        return of([]);
      })
    );
  }

  getUploadedComics(userId: string |undefined): Observable<any[]> {
    if (!userId) {
      console.error('User ID is required');
      return of([]);
    }

    const savedComicsCollection = collection(this.firestore, `/users/${userId}/uploadedComics`);

    return collectionData(savedComicsCollection, { idField: 'comicId' }).pipe(
      switchMap(savedComics => {
        if (savedComics.length === 0) {
          return of([]);
        }

        const comicIds = savedComics.map(item => item.comicId);

        const comicObservables = comicIds.map(comicId => this.getComicById(comicId));

        return combineLatest(comicObservables).pipe(
          map(comics => comics.filter(comic => comic !== null))
        );
      }),
      catchError(error => {
        console.error('Error fetching saved comics:', error);
        return of([]);
      })
    );
  }

  getSavedComicsCount(userId: string | undefined): Observable<number> {
    if (!userId) {
      console.error('User ID is required');
      return of(0);
    }

    const savedComicsCollection = collection(this.firestore, `/users/${userId}/savedComics`);

    return collectionData(savedComicsCollection).pipe(
      map(comics => comics.length),
      catchError(error => {
        console.error('Error counting saved comics:', error);
        return of(0);
      })
    );
  }

  getLikedComicsCount(userId: string | undefined): Observable<number> {
    if (!userId) {
      console.error('User ID is required');
      return of(0);
    }

    const likedComicsCollection = collection(this.firestore, `/users/${userId}/likedComics`);

    return collectionData(likedComicsCollection).pipe(
      map(comics => comics.length),
      catchError(error => {
        console.error('Error counting liked comics:', error);
        return of(0);
      })
    );
  }

  getUploadedComicsCount(userId: string | undefined): Observable<number> {
    if (!userId) {
      console.error('User ID is required');
      return of(0);
    }

    const uploadedComicsCollection = collection(this.firestore, `/users/${userId}/uploadedComics`);

    return collectionData(uploadedComicsCollection).pipe(
      map(comics => comics.length),
      catchError(error => {
        console.error('Error counting uploaded comics:', error);
        return of(0);
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
      if (!isReply) {
        const repliesCollection = collection(this.firestore, `/comics/${comicId}/comments/${commentId}/replies`);
        const repliesSnapshot = await getDocs(repliesCollection);
        for (const replyDoc of repliesSnapshot.docs) {
          await deleteDoc(replyDoc.ref);
        }
      }
      await deleteDoc(commentDoc);
    } catch (error) {
      throw error;
    }
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

  getNewsById(newsId: string): Observable<any> {
    const newsDoc = doc(this.firestore, `/news/${newsId}`);
    return docData(newsDoc, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching news:', error);
        return of(null);
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
            return { ...userData, id: uid };
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
