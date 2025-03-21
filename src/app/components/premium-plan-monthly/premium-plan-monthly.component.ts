import { Component, Input } from '@angular/core';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-premium-plan-monthly',
  templateUrl: './premium-plan-monthly.component.html',
  imports: [
    ButtonComponent
  ],
  styleUrl: './premium-plan-monthly.component.scss'
})
export class PremiumPlanMonthlyComponent {
  @Input() title: string = 'Monthly Plan – Total Flexibility';
  @Input() description: string = 'Try the service with no commitments and pay month by month. Perfect if you want to explore everything we offer before making a long-term decision.';
  @Input() backgroundSection: string = '#D9D9D9';

  @Input() buttonTitle: string = '9.99€';
  @Input() buttonTextColor: string = 'black';
  @Input() buttonTextSize: string = '1.2rem';
  @Input() buttonWidth: string = '4vw';
  @Input() buttonHeight: string = '4vh';
  @Input() backgroundColorPrice: string = '#EEEEEE';
  @Input() backgroundColorHoverPrice: string = '#B8B8B8';
}
