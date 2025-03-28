import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CancelSubscriptionDialogComponent} from '../cancel-subscription-dialog/cancel-subscription-dialog.component';


@Component({
  selector: 'app-user-info',
    imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  @Input() userName: string = "";
  @Input() description: string = "";
  @Input() image: string = "";

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
