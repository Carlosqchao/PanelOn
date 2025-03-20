import {Component} from '@angular/core';
import {PremiumPlanMonthlyComponent} from '../premium-plan-monthly/premium-plan-monthly.component';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {PremiumDescriptionComponent} from '../premium-description/premium-description.component';

@Component({
  selector: 'app-premium-plans-comparison',
  imports: [PremiumPlanMonthlyComponent, CommonModule, PremiumDescriptionComponent],
  templateUrl: './premium-plans-comparison.component.html',
  styleUrl: './premium-plans-comparison.component.scss'
})
export class PremiumPlansComparisonComponent {
  planMonthlyComponent = {
    title: 'Monthly Plan – Total Flexibility',
    description: 'Try the service with no commitments and pay month by month. Perfect if you want to explore everything we offer before making a long-term decision.',
    backgroundSection: '#EEEEEE',
    backgroundPrice: '#999',
    price: '9.99€'
  }

  planYearlyComponent = {
    title: 'Annual Plan – Biggest Savings',
    description: 'If you\'re a true comic fan, this is the best choice. Subscribe for a full year and get an exclusive discount, ensuring a year of unlimited adventures.',
    backgroundSection: '#FFB7A5',
    backgroundPrice: '#E76F51',
    price: '99.99€'
  }

  imagePath = "/PanelOn/src/assets/plan-versus.svg"
}
