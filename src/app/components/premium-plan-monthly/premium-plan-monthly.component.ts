import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-premium-plan-monthly',
  templateUrl: './premium-plan-monthly.component.html',
  styleUrl: './premium-plan-monthly.component.scss'
})
export class PremiumPlanMonthlyComponent {
  @Input() title: string = 'Monthly Plan – Total Flexibility';
  @Input() description: string = 'Try the service with no commitments and pay month by month. Perfect if you want to explore everything we offer before making a long-term decision.';
  @Input() backgroundSection: string = '#D9D9D9';
  @Input() backgroundPrice: string  = '#EEEEEE';
  @Input() price: string = '9.99€';
}
