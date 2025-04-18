import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './user-auth';
import { Comic } from '../../../src/app/models/comic';

@Injectable({
  providedIn: 'root'
})
export class ComicSaveService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  isComicSaved(comicId: string): Observable<boolean> {
    const userId = this.auth.getCurrentUserId();
    const comicDocRef = doc(this.firestore, `users/${userId}/savedComics/${comicId}`);
    return from(getDoc(comicDocRef)).pipe(map(snapshot => snapshot.exists()));
  }

  async saveComic(comicId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    const comicDocRef = doc(this.firestore, `users/${userId}/savedComics/${comicId}`);
    await setDoc(comicDocRef, {
      savedAt: new Date()
    });
  }

  async removeSavedComic(comicId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    const comicDocRef = doc(this.firestore, `users/${userId}/savedComics/${comicId}`);
    await deleteDoc(comicDocRef);
  }

  async getSavedComics(): Promise<Comic[]> {
    const userId = this.auth.getCurrentUserId();
    const savedComicsRef = collection(this.firestore, `users/${userId}/savedComics`);
    const savedSnapshot = await getDocs(savedComicsRef);
    const comicIds = savedSnapshot.docs.map(doc => doc.id);

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
