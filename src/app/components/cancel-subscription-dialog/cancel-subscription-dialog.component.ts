import {Component, Inject} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {InputFieldComponent} from '../input-field/input-field.component';

@Component({
  selector: 'app-cancel-subscription-dialog',
  imports: [
    ButtonComponent,
    InputFieldComponent
  ],
  templateUrl: './cancel-subscription-dialog.component.html',
  styleUrl: './cancel-subscription-dialog.component.scss'
})
export class CancelSubscriptionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
