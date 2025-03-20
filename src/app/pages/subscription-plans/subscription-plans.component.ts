import { Component } from '@angular/core';
import {PremiumPlanMonthlyComponent} from '../../components/premium-plan-monthly/premium-plan-monthly.component';

@Component({
  selector: 'app-subscription-plans',
  imports: [PremiumPlanMonthlyComponent],
  templateUrl: './subscription-plans.component.html',
  styleUrl: './subscription-plans.component.scss'
})
export class SubscriptionPlansComponent {

}
