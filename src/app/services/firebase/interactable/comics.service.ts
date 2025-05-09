import {Injectable} from '@angular/core';
import {Comic} from '../../../models/comic';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';

@Injectable({
  providedIn: 'root'
})
export class ComicsService extends FirestoreServiceInteractable<Comic> {

  constructor() {
    super('comics');
  }
}
