import {Component} from '@angular/core';
import {PremiumPlanMonthlyComponent} from '../premium-plan-monthly/premium-plan-monthly.component';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {PremiumDescriptionComponent} from '../premium-description/premium-description.component';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-premium-plans-comparison',
  imports: [PremiumPlanMonthlyComponent, CommonModule, ButtonComponent],
  templateUrl: './premium-plans-comparison.component.html',
  styleUrl: './premium-plans-comparison.component.scss'
})
export class PremiumPlansComparisonComponent {
  planMonthlyComponent = {
    title: 'Monthly Plan – Total Flexibility',
    description: 'Try the service with no commitments and pay month by month. Perfect if you want to explore everything we offer before making a long-term decision.',
    backgroundSection: '#D9D9D9',
    buttonTitle: '9.99€',
    buttonTextColor: 'black',
    buttonTextSize: '1.8rem',
    backgroundColorButton: '#EEEEEE',
    backgroundColorHoverButton: '#B8B8B8',
    buttonWidth: '10vw',
    buttonHeight: '7vh',
  }

  planYearlyComponent = {
    title: 'Annual Plan – Biggest Savings',
    description: 'If you\'re a true comic fan, this is the best choice. Subscribe for a full year and get an exclusive discount, ensuring a year of unlimited adventures.',
    backgroundSection: '#FFB7A5',
    buttonTitle: '99.99€',
    buttonTextColor: 'black',
    buttonTextSize: '1.8rem',
    backgroundColorButton: '#E76F51',
    backgroundColorHoverButton: '#E66041',
    buttonWidth: '10vw',
    buttonHeight: '7vh',
  }

  imagePath = "/PanelOn/src/assets/plan-versus.svg"
}
