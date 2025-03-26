import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ButtonComponent} from '../../components/button/button.component';
import {MatDialog} from '@angular/material/dialog';
import {
  CancelSubscriptionDialogComponent
} from '../../components/cancel-subscription-dialog/cancel-subscription-dialog.component';

@Component({
  selector: 'app-modal-testing',
  imports: [
    ButtonComponent
  ],
  templateUrl: './modal-testing.component.html',
  styleUrl: './modal-testing.component.scss'
})
export class ModalTestingComponent {
  constructor(public dialog: MatDialog) {}

  openModal() {
    this.dialog.open(CancelSubscriptionDialogComponent, {
      data: {
        title: 'YOU ARE GOING TO CANCEL YOUR SUBSCRIPTION',
        message: 'ARE YOU SURE OF WHAT ARE YOU DOING?',
      }
    })
  }
}
