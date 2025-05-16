import {Component, Input} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {loadStripe, Stripe, StripeElements, StripeCardElement} from '@stripe/stripe-js';
import {PaymentCardComponent} from '../payment-card/payment-card.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SubscriptionManagementService} from '../../services/stripe/subscription-management.service';

@Component({
  selector: 'app-payment-form',
  imports: [
    FormsModule,
    ButtonComponent,
    CommonModule,
    PaymentCardComponent,

  ],
  templateUrl: './payment-form.component.html',
  standalone: true,
  styleUrl: './payment-form.component.scss'
})

export class PaymentFormComponent {
  @Input() title: string = 'PAYMENT FORM';
  @Input() planType: string = '';

  stripe!: Stripe;
  elements!: StripeElements;
  card!: StripeCardElement;
  isLoading: boolean = false;
  errorMessage: string = '';
  cardHolder: string = '';
  email: string = '';

  constructor(private subscriptionService: SubscriptionManagementService) {
  }

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
    this.isLoading = true;
    this.errorMessage = '';

    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: {
        name: this.cardHolder,
        email: this.email
      }
    });

    if (error) {
      this.isLoading = false;
      this.errorMessage = error.message || 'Error al procesar el pago.';
      console.error('Stripe error', error);
      return;
    }

    if (paymentMethod) {
      this.subscriptionService.create('user_123', paymentMethod.id, this.planType, this.email)
        .subscribe({
          next: (subscription) => {
            this.isLoading = false;
            alert(`¡Suscripción creada exitosamente! ID: ${subscription.id}`);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = 'Error al crear la suscripción.';
            console.error('Error en el backend:', err);
          }
        });
    }
  }
}
