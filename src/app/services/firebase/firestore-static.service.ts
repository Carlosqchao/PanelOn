import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore, getDocs, query,
  QueryConstraint,
  updateDoc
} from '@angular/fire/firestore';
import {docData} from 'rxfire/firestore';
import {from, map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreStaticService<T extends {id: number}> {
  private collectionName: string;
  firestore;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.firestore = inject(Firestore);
  }

  get(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(docRef, { idField: 'id' } ) as Observable<T>;
  }

  getAll() {
    const colRef = collection(this.firestore, this.collectionName);
    return collectionData(colRef, { idField: 'id' }) as Observable<T[]>;
  }

  add(data : T) {
    const colRef = collection(this.firestore, this.collectionName);
    return from(addDoc(colRef, data));
  }

  remove(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(deleteDoc(docRef));
  }

  update(data: T){
    const { id, ...rest } = data;
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(updateDoc(docRef, rest));
  }

  getWithQuery(queryFn: (ref: any) => QueryConstraint[]): Observable<any[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const q = query(collectionRef, ...queryFn(collectionRef));
    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) =>
          ({ id: doc.id, ...doc.data() })))
    );
  }

  getSubcollection(parentId: string, subcollectionName: string): Observable<T[]> {
    const colRef = collection(this.firestore, `${this.collectionName}/${parentId}/${subcollectionName}`);
    return collectionData(colRef, { idField: 'id' }) as Observable<T[]>;
  }

  getSubcollectionDoc(parentId: string, subcollectionName: string, subId: string): Observable<T> {
    const docRef = doc(this.firestore, `${this.collectionName}/${parentId}/${subcollectionName}/${subId}`);
    return docData(docRef, { idField: 'id' }) as Observable<T>;
  }

  addSubcollection(parentId: string, subcollectionName: string, data: T) {
    const colRef = collection(this.firestore, `${this.collectionName}/${parentId}/${subcollectionName}`);
    return from(addDoc(colRef, data));
  }

  removeSubcollectionDoc(parentId: string, subcollectionName: string, subId: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${parentId}/${subcollectionName}/${subId}`);
    return from(deleteDoc(docRef));
  }

  updateSubcollectionDoc(parentId: string, subcollectionName: string, data: T) {
    const { id, ...rest } = data;
    const docRef = doc(this.firestore, `${this.collectionName}/${parentId}/${subcollectionName}/${id}`);
    return from(updateDoc(docRef, rest));
  }
}
