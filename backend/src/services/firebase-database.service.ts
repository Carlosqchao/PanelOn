import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, addDoc, deleteDoc, getDocs, CollectionReference } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreRepository {
  constructor(private firestore: Firestore) {}

  getAll<T>(collectionPath: string): Promise<T[]> {
    const ref = collection(this.firestore, collectionPath);
    return getDocs(ref).then(snapshot =>
      snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
    );
  }

  getById<T>(collectionPath: string, id: string): Promise<T | null> {
    const ref = doc(this.firestore, collectionPath, id);
    return getDoc(ref).then(snapshot =>
      snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null
    );
  }

  create<T extends Record<string, any>>(collectionPath: string, data: T): Promise<string> {
    const ref = collection(this.firestore, collectionPath);
    return addDoc(ref, data).then(docRef => docRef.id);
  }

  update<T>(collectionPath: string, id: string, data: Partial<T>): Promise<void> {
    const ref = doc(this.firestore, collectionPath, id);
    return setDoc(ref, data, { merge: true });
  }

  delete(collectionPath: string, id: string): Promise<void> {
    const ref = doc(this.firestore, collectionPath, id);
    return deleteDoc(ref);
  }
}

