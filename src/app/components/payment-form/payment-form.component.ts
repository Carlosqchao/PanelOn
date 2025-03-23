import {Component, Input} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {NgOptimizedImage} from '@angular/common';
import {PaymentCardComponent} from '../payment-card/payment-card.component';

@Component({
  selector: 'app-payment-form',
  imports: [
    ButtonComponent,
    PaymentCardComponent
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})
export class PaymentFormComponent {
  @Input() title: string = 'PAYMENT FORM';
}
