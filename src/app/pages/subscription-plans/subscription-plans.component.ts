import {Component, EventEmitter, Output} from '@angular/core';
import {PremiumDescriptionComponent} from '../../components/premium-description/premium-description.component';
import {
  PremiumPlansComparisonComponent
} from '../../components/premium-plans-comparison/premium-plans-comparison.component';
import {HeaderBacklinkComponent} from '../../components/header-backlink/header-backlink.component';
import {FreePlanComponent} from '../../components/free-plan/free-plan.component';
import {ButtonComponent} from '../../components/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-subscription-plans',
  imports: [PremiumDescriptionComponent, PremiumPlansComparisonComponent, HeaderBacklinkComponent, FreePlanComponent, ButtonComponent],
  templateUrl: './subscription-plans.component.html',
  styleUrl: './subscription-plans.component.scss'
})
export class SubscriptionPlansComponent {
  freePlan = {
    title: 'Prefer to stick with the free version?',
    description: 'No problem! Keep enjoying community comics. When you\'re ready to upgrade, we\'ll be here.',
    textButton: 'FREE'
  }

  constructor(private router: Router) {}

  @Output() buttonClick = new EventEmitter<void>()

  onClick() {
    this.buttonClick.emit();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
