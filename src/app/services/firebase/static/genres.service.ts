import { Injectable } from '@angular/core';
import {FirestoreStaticService} from '../firestore-static.service';
import {Genre} from '../../../models/genre';

@Injectable({
  providedIn: 'root'
})
export class GenresService extends FirestoreStaticService<Genre> {

  constructor() {
    super('genres');
  }
}
