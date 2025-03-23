import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-payment-card',
  imports: [],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.scss'
})
export class PaymentCardComponent {
  @Input() cardNumber: string = '################';
  @Input() cardHolder: string = 'FULL NAME';
  @Input() expMonth: string = 'MM';
  @Input() expYear: string = 'YY';
  @Input() cvv: string = '';
}
