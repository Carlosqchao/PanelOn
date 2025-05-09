import { Injectable } from '@angular/core';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';
import {IUser} from '../../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends FirestoreServiceInteractable<IUser> {

  constructor() {
    super('users');
  }
}
