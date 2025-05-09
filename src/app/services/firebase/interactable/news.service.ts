import { Injectable } from '@angular/core';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';
import {News} from '../../../models/new';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends FirestoreServiceInteractable<News> {

  constructor() {
    super('news');
  }
}
