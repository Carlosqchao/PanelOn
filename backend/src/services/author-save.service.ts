import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './user-auth';
import { IUser } from '../../../src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthorSaveService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  isAuthorSaved(authorId: string): Observable<boolean> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      return from([false]);
    }
    if (!authorId) {
      return from([false]);
    }
    const authorDocRef = doc(this.firestore, `users/${userId}/savedAuthors/${authorId}`);
    return from(getDoc(authorDocRef)).pipe(
      map(snapshot => snapshot.exists())
    );
  }

  async saveAuthor(authorId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    if (!authorId) {
      throw new Error('Invalid author ID');
    }
    const authorDocRef = doc(this.firestore, `users/${userId}/savedAuthors/${authorId}`);
    try {
      await setDoc(authorDocRef, {
        savedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(`Failed to save author: ${error.message}`);
    }
  }

  async removeSavedAuthor(authorId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    if (!authorId) {
      throw new Error('Invalid author ID');
    }
    const authorDocRef = doc(this.firestore, `users/${userId}/savedAuthors/${authorId}`);
    try {
      await deleteDoc(authorDocRef);
    } catch (error: any) {
      throw new Error(`Failed to remove author: ${error.message}`);
    }
  }

  async getSavedAuthors(): Promise<IUser[]> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      return [];
    }
    const savedAuthorsRef = collection(this.firestore, `users/${userId}/savedAuthors`);
try {
  const savedSnapshot = await getDocs(savedAuthorsRef);
  const authorIds = savedSnapshot.docs.map(doc => doc.id);

  if (authorIds.length === 0) {
    return [];
  }

  const authors: IUser[] = [];
  const batchSize = 10;
  for (let i = 0; i < authorIds.length; i += batchSize) {
    const batchIds = authorIds.slice(i, i + batchSize);
    const authorsRef = collection(this.firestore, 'users');
    const q = query(authorsRef, where('id', 'in', batchIds));
    const authorsSnapshot = await getDocs(q);
    authors.push(...authorsSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as IUser)));
  }

  return authors;
} catch (error: any) {
  return [];
}
}
}
