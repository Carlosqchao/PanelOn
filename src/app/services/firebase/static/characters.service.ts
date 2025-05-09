import {Injectable} from '@angular/core';
import {Character} from '../../../models/character';
import {FirestoreStaticService} from '../firestore-static.service';

@Injectable({
  providedIn: 'root'
})
export class CharactersService extends FirestoreStaticService<Character> {

  constructor() {
    super('character');
  }
}
