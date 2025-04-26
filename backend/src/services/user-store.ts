import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {IUser} from '../../../src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private userSubject = new BehaviorSubject<IUser | null>(null);
  public user$ = this.userSubject.asObservable();

  setUser(user: IUser | null) {
    console.log('Guardando datos del usuario en el store:', user);
    this.userSubject.next(user);
  }

  getUser(): IUser | null {
    return this.userSubject.value;
  }

  clearUser() {
    console.log('Limpiando datos del usuario en el store');
    this.userSubject.next(null);
  }

  calculateAge(birthdate: string): number {
    if (!birthdate) {
      return 0;
    }

    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getUserAge(): number {
    const user = this.getUser();
    if (!user || !user.birthdate) {
      return 0;
    }
    return this.calculateAge(user.birthdate);
  }
}
