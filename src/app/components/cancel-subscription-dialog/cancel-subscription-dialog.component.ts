import {Component, Inject} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {InputFieldComponent} from '../input-field/input-field.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-cancel-subscription-dialog',
  imports: [
    ButtonComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './cancel-subscription-dialog.component.html',
  styleUrl: './cancel-subscription-dialog.component.scss'
})
export class CancelSubscriptionDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CancelSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {
    this.form = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  confirmCancel(): void {
    const { password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.dialogRef.close({ confirmed: true, password });
  }
}
