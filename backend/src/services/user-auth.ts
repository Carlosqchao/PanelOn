import { inject, Injectable } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import {AppService} from '../../../src/app/app.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  appService = inject(AppService);

  register(
    email: string,
    username: string,
    name: string,
    lastName: string,
    password: string
  ): Observable<void> {
    console.log('Iniciando registro con:', { email, username, name, lastName });
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        console.log('Usuario creado en Authentication:', response.user.uid);
        const updatePromise = updateProfile(response.user, { displayName: username })
          .then(() => console.log('displayName actualizado con éxito'))
          .catch(err => {
            console.error('Error al actualizar displayName:', err);
            throw err;
          });

        const userData = {
          uid: response.user.uid,
          email: email,
          username: username,
          name: name,
          lastName: lastName
        };

        console.log('Intentando guardar en Firestore con addUser:', userData);
        const saveDataPromise = this.appService.addUser(userData)
          .then(docId => {
            console.log('Usuario guardado en Firestore con ID:', docId);
          })
          .catch(err => {
            console.error('Error al guardar en Firestore con addUser:', err);
            throw err;
          });

        return Promise.all([updatePromise, saveDataPromise]);
      })
      .then(() => undefined)
      .catch(err => {
        console.error('Error general en el registro:', err);
        throw err;
      });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    console.log('Iniciando login con:', { email });
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        console.log('Usuario autenticado con éxito:', response.user.uid);
        return undefined;
      })
      .catch(err => {
        console.error('Login error:', err);
        throw err;
      });

    return from(promise);
  }
}
