import { Injectable } from '@angular/core';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';
import {Discussion} from '../../../models/discussion';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscussionsService extends FirestoreServiceInteractable<Discussion> {

  constructor() {
    super('discussions');
  }

  /*
  getDiscussionsOrderedByDate(ascending: boolean = false) {
    return this.getAll().pipe(
      map((discussions: Discussion[]) =>
        discussions
          .filter(discussion => discussions.published != null)
          .sort((a, b) => {
            const dateA = new Date(a.published).getTime();
            const dateB = new Date(b.published).getTime();
            return ascending ? dateA - dateB : dateB - dateA;
          })
      )
    );
  }*/
}
