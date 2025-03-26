import {Component, inject} from '@angular/core';
import {ButtonComponent} from '../../components/button/button.component';
import {
  CancelSubscriptionDialogComponent
} from '../../components/cancel-subscription-dialog/cancel-subscription-dialog.component';

@Component({
  selector: 'app-cancel-subscription-dialog-test',
  imports: [
    ButtonComponent
  ],
  templateUrl: './cancel-subscription-dialog-test.component.html',
  styleUrl: './cancel-subscription-dialog-test.component.scss'
})
export class CancelSubscriptionDialogTestComponent {
  readonly dialog = inject(MatDialog);

  openDialog (){
    this.dialog.open(CancelSubscriptionDialogComponent, {})
  }
}
