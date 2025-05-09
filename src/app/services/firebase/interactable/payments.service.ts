import { Injectable } from '@angular/core';
import {FirestoreStaticService} from '../firestore-static.service';
import {Payment} from '../../../models/payment';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService extends FirestoreServiceInteractable<Payment>{

  constructor() {
    super('payments');
  }
}
