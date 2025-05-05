import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './user-auth';
import { Comic } from '../../../src/app/models/comic';

@Injectable({
  providedIn: 'root'
})
export class LikedComicService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  isComicLiked(comicId: string): Observable<boolean> {
    const userId = this.auth.getCurrentUserId();
    const comicDocRef = doc(this.firestore, `users/${userId}/likedComics/${comicId}`);
    return from(getDoc(comicDocRef)).pipe(map(snapshot => snapshot.exists()));
  }

  async likeComic(comicId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    const comicDocRef = doc(this.firestore, `users/${userId}/likedComics/${comicId}`);
    await setDoc(comicDocRef, {
      likedAt: new Date()
    });
  }

  async removeLikedComic(comicId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    const comicDocRef = doc(this.firestore, `users/${userId}/likedComics/${comicId}`);
    await deleteDoc(comicDocRef);
  }

  async getLikedComics(): Promise<Comic[]> {
    const userId = this.auth.getCurrentUserId();
    const likedComicsRef = collection(this.firestore, `users/${userId}/likedComics`);
    const likedSnapshot = await getDocs(likedComicsRef);
    const comicIds = likedSnapshot.docs.map(doc => doc.id);

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
