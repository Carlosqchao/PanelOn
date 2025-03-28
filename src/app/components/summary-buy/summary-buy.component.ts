import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-summary-buy',
  imports: [
  ],
  templateUrl: './summary-buy.component.html',
  standalone: true,
  styleUrl: './summary-buy.component.scss'
})
export class SummaryBuyComponent {
  @Input() title: string = 'SUMMARY';
  @Input() imageSrc: string = 'assets/icon-spider-man.svg';
  @Input() figCaption: string = 'Monthly Subscription!';
  @Input() subscription: string = 'Monthly';
  @Input() price: string = '9.99€';
}
