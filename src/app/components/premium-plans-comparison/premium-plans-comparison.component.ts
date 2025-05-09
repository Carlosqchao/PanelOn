import { Component } from '@angular/core';
import { PremiumPlanMonthlyComponent } from '../premium-plan-monthly/premium-plan-monthly.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-premium-plans-comparison',
  standalone: true,
  imports: [PremiumPlanMonthlyComponent, CommonModule, TranslateModule],
  templateUrl: './premium-plans-comparison.component.html',
  styleUrl: './premium-plans-comparison.component.scss'
})
export class PremiumPlansComparisonComponent {
  planMonthlyComponent = {
    backgroundSection: '#D9D9D9',
    buttonTitle: '9.99€',
    buttonTextColor: 'black',
    buttonTextSize: '1.8rem',
    backgroundColorButton: '#EEEEEE',
    backgroundColorHoverButton: '#B8B8B8',
    buttonWidth: '10vw',
    buttonHeight: '7vh'
  };

  planYearlyComponent = {
    backgroundSection: '#FFB7A5',
    buttonTitle: '99.99€',
    buttonTextColor: 'black',
    buttonTextSize: '1.8rem',
    backgroundColorButton: '#E76F51',
    backgroundColorHoverButton: '#E66041',
    buttonWidth: '10vw',
    buttonHeight: '7vh'
  };

  constructor(private router: Router) {}

  handlePlanRedirect(planType: string) {
    this.router.navigate(['/payment'], { queryParams: { plan: planType } });
  }
}
