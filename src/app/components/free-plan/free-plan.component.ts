import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-free-plan',
  imports: [],
  templateUrl: './free-plan.component.html',
  styleUrl: './free-plan.component.scss'
})
export class FreePlanComponent {
  @Input() title: string = 'Prefer to stick with the free version?';
  @Input() description: string = 'No problem! Keep enjoying community comics. When you\'re ready to upgrade, we\'ll be here.';
}
