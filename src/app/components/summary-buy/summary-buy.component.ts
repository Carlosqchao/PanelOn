import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-summary-buy',
  imports: [
    NgOptimizedImage
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
