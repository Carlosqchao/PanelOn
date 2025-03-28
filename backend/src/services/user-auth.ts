import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from '@angular/fire/auth';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { AppService } from '../../../src/app/app.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  appService = inject(AppService);

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.firebaseAuth.onAuthStateChanged(
      (user) => {
        this.userSubject.next(user);
      },
      (error) => {
        console.error('Authentication state error:', error);
        this.userSubject.next(null);
      }
    );
  }

  register(
    email: string,
    username: string,
    name: string,
    lastName: string,
    password: string
  ): Observable<void> {
    console.log('Starting registration with:', { email, username, name, lastName });
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        console.log('User created in Authentication:', response.user.uid);
        const updatePromise = updateProfile(response.user, { displayName: username })
          .then(() => console.log('displayName updated successfully'))
          .catch(err => {
            console.error('Error updating displayName:', err);
            throw err;
          });

        const userData = {
          uid: response.user.uid,
          email: email,
          username: username,
          name: name,
          lastName: lastName
        };

        console.log('Attempting to save to Firestore with addUser:', userData);
        const saveDataPromise = this.appService.addUser(userData)
          .then(docId => {
            console.log('User saved to Firestore with ID:', docId);
          })
          .catch(err => {
            console.error('Error saving to Firestore with addUser:', err);
            throw err;
          });

        return Promise.all([updatePromise, saveDataPromise]);
      })
      .then(() => undefined)
      .catch(err => {
        console.error('General registration error:', err);
        throw err;
      });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    console.log('Starting login with:', { email });
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        console.log('User authenticated successfully:', response.user.uid);
        return undefined;
      })
      .catch(err => {
        console.error('Login error:', err);
        throw err;
      });

    return from(promise);
  }

  logout(): void {
    signOut(this.firebaseAuth)
      .then(() => {
        console.log('User logged out');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}
