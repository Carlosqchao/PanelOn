import { Component, EventEmitter, Output } from '@angular/core';
import { PremiumDescriptionComponent } from '../../components/premium-description/premium-description.component';
import { PremiumPlansComparisonComponent } from '../../components/premium-plans-comparison/premium-plans-comparison.component';
import { HeaderBacklinkComponent } from '../../components/header-backlink/header-backlink.component';
import { FreePlanComponent } from '../../components/free-plan/free-plan.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-subscription-plans',
  imports: [
    PremiumDescriptionComponent,
    PremiumPlansComparisonComponent,
    HeaderBacklinkComponent,
    FreePlanComponent,
    ButtonComponent,
    TranslateModule
  ],
  templateUrl: './subscription-plans.component.html',
  standalone: true,
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent {
  @Output() buttonClick = new EventEmitter<void>();

  constructor(private router: Router, private translate: TranslateService) {}

  goHome() {
    this.router.navigate(['/']);
  }

  onClick() {
    this.buttonClick.emit();
  }

  changeLanguage(language: string) {
    this.translate.use(language);
  }
}
