import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User
} from '@angular/fire/auth';
import {Observable, from, BehaviorSubject, map} from 'rxjs';
import { AppService } from '../../../src/app/app.service';
import { UserStoreService } from './user-store';
import { IUser } from '../../../src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  appService = inject(AppService);
  userStore = inject(UserStoreService);

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.firebaseAuth.onAuthStateChanged(
      (user: User | null) => {
        console.log('Estado de autenticación cambió, usuario:', user);
        this.userSubject.next(user);
        if (user) {
          this.appService.getUserByUid(user.uid).subscribe({
            next: (userData: IUser) => {
              console.log('Datos de Firestore cargados exitosamente:', userData);
              this.userStore.setUser(userData);
            },
            error: (error) => {
              console.error('Error al cargar datos de Firestore para el usuario:', error);
              this.userStore.setUser(null);
            },
          });
        } else {
          console.log('No hay usuario autenticado');
          this.userStore.clearUser();
        }
      },
      (error) => {
        console.error('Error en el estado de autenticación:', error);
        this.userSubject.next(null);
        this.userStore.clearUser();
      }
    );
  }

  register(
    email: string,
    username: string,
    name: string,
    lastName: string,
    birthdate: string,
    password: string
  ): Observable<void> {
    console.log('Iniciando registro con email:', email);
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        const user: User = response.user;
        console.log('Usuario registrado con UID:', user.uid);
        const updatePromise = updateProfile(user, { displayName: username })
          .catch(err => {
            console.error('Error al actualizar el displayName:', err);
            throw err;
          });

        const userData: IUser = {
          id: user.uid,
          email: email,
          username: username,
          name: name,
          lastName: lastName,
          birthdate: birthdate
        };

        const saveDataPromise = this.appService.addUser(userData, user.uid)
          .then(docId => {
            console.log('Usuario guardado en Firestore, UID:', docId);
            this.userStore.setUser(userData);
          })
          .catch(err => {
            console.error('Error al guardar usuario en Firestore:', err);
            throw err;
          });

        return Promise.all([updatePromise, saveDataPromise]);
      })
      .then(() => {
        console.log('Registro completado exitosamente');
        return undefined;
      })
      .catch(err => {
        console.error('Error general en el registro:', err);
        throw err;
      });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    console.log('Iniciando login con email:', email);
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        const user: User = response.user;
        console.log('Usuario autenticado con UID:', user.uid);
        this.appService.getUserByUid(user.uid).subscribe({
          next: (userData: IUser) => {
            console.log('Datos de Firestore cargados después del login:', userData);
            this.userStore.setUser(userData);
          },
          error: (error) => {
            console.error('Error al cargar datos de Firestore después del login:', error);
            this.userStore.setUser(null);
          },
        });
        return undefined;
      })
      .catch(err => {
        console.error('Error en el login:', err);
        throw err;
      });

    return from(promise);
  }

  logout(): void {
    console.log('Iniciando logout');
    signOut(this.firebaseAuth)
      .then(() => {
        console.log('Usuario deslogueado exitosamente');
        this.userStore.clearUser();
      })
      .catch((error) => {
        console.error('Error al desloguear:', error);
      });
  }

  getCurrentUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getCurrentUserId(): Observable<string> {
    return this.getCurrentUser().pipe(
      map(user => {
        if (!user) throw new Error('No hay usuario autenticado');
        return user.uid;
      })
    );
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    console.log('Enviando email de recuperación a:', email);
    return from(sendPasswordResetEmail(this.firebaseAuth,email));
  }
}
