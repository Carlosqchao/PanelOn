import { Injectable } from '@angular/core';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';
import {Discussion} from '../../../models/discussion';

@Injectable({
  providedIn: 'root'
})
export class DiscussionsService extends FirestoreServiceInteractable<Discussion> {

  constructor() {
    super('discussions');
  }
}
