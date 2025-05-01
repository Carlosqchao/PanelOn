import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './user-auth';
import { Comic } from '../../../src/app/models/comic';

@Injectable({
  providedIn: 'root'
})
export class uploadComicService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  isComicupload(comicId: string): Observable<boolean> {
    const userId = this.auth.getCurrentUserId();
    const comicDocRef = doc(this.firestore, `users/${userId}/uploadedComics/${comicId}`);
    return from(getDoc(comicDocRef)).pipe(map(snapshot => snapshot.exists()));
  }

  async uploadComic(comicId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    const comicDocRef = doc(this.firestore, `users/${userId}/uploadedComics/${comicId}`);
    await setDoc(comicDocRef, {
      uploadedAt: new Date()
    });
  }

  async removeuploaddComic(comicId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    const comicDocRef = doc(this.firestore, `users/${userId}/uploadedComics/${comicId}`);
    await deleteDoc(comicDocRef);
  }

  async getuploaddComics(): Promise<Comic[]> {
    const userId = this.auth.getCurrentUserId();
    const uploadedComicsRef = collection(this.firestore, `users/${userId}/uploadedComics`);
    const uploadedSnapshot = await getDocs(uploadedComicsRef);
    const comicIds = uploadedSnapshot.docs.map(doc => doc.id);

    if (comicIds.length === 0) {
      return [];
    }

    const comics: Comic[] = [];
    const batchSize = 10;
    for (let i = 0; i < comicIds.length; i += batchSize) {
      const batchIds = comicIds.slice(i, i + batchSize);
      const comicsRef = collection(this.firestore, 'comics');
      const q = query(comicsRef, where('id', 'in', batchIds));
      const comicsSnapshot = await getDocs(q);
      comics.push(...comicsSnapshot.docs.map(doc => doc.data() as Comic));
    }

    return comics;
  }
}
