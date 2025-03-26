import {Component, Input, OnInit} from '@angular/core';
import {PaymentFormComponent} from '../../components/payment-form/payment-form.component';
import {SummaryBuyComponent} from '../../components/summary-buy/summary-buy.component';
import {HeaderBacklinkComponent} from '../../components/header-backlink/header-backlink.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-payment-page',
  imports: [
    PaymentFormComponent,
    SummaryBuyComponent,
    HeaderBacklinkComponent
  ],
  templateUrl: './payment-page.component.html',
  standalone: true,
  styleUrl: './payment-page.component.scss'
})
export class PaymentPageComponent implements OnInit {
  @Input() imageSrc: string = '';
  @Input() figCaption: string = '';
  @Input() subscription: string = '';
  @Input() price: string = '';

  contents = [
    {subscription: 'monthly', imageSrc: 'assets/icon-spider-man.svg', figCaption: 'Monthly Subscription!', price: '9.99€'},
    {subscription: 'annual', imageSrc: 'assets/icon-venom.svg', figCaption: 'Annual Subscription!', price: '99.99€'},
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const plan = params.get('plan');
      const content = this.contents.find(c => c.subscription === plan);

      if (content) {
        this.subscription = content.subscription.charAt(0).toUpperCase() + content.subscription.slice(1).toLowerCase();
        this.imageSrc = content.imageSrc;
        this.figCaption = content.figCaption;
        this.price = content.price;
      }
    });
  }
}
