import {Component, Input} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {loadStripe, Stripe, StripeElements, StripeCardElement} from '@stripe/stripe-js';
import {PaymentCardComponent} from '../payment-card/payment-card.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-payment-form',
  imports: [
    FormsModule,
    ButtonComponent,
    PaymentCardComponent
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})

export class PaymentFormComponent {
  @Input() title: string = 'PAYMENT FORM';

  stripe!: Stripe;
  elements!: StripeElements;
  card!: StripeCardElement;
  cardHolder: string = '';
  email: string = '';

  async ngOnInit() {
    const stripe = await loadStripe('pk_test_51R5clrEFPVbuZe1Ff35at5vjpOPZIKfBY1ImE1p8VGQD5ZQvhtCc01V3hja4dEJgxK67lDk3l3eoTl0I4Qjt4yDL00yp3kySoy');
    if (!stripe) {
      console.error('Stripe no pudo cargarse');
      return;
    }

    this.stripe = stripe;
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#card-element');
  }

  async handleSubmit() {
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: {
        name: this.cardHolder,
        email: this.email
      }
    });

    if (error) {
      console.error('Stripe error', error);
      return;
    }

    /*this.http.post('/api/subscriptions/pay', {
      userId: 'user_123',
      plan: 'monthly',
      paymentMethodId: paymentMethod.id,
      email: this.email
    }).subscribe(() => {
      alert('Pago procesado con éxito');
    });*/
  }
}
