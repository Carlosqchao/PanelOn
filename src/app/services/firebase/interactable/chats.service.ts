import { Injectable } from '@angular/core';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';
import {Chat} from '../../../models/discussion';

@Injectable({
  providedIn: 'root'
})
export class ChatsService extends FirestoreServiceInteractable<Chat> {

  constructor() {
    super('chats');
  }

  getChatByDiscussionId(discussionId: string) {
    return this.getSubcollection(discussionId, 'comments');
  }
}
