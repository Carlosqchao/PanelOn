import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-user-metrics',
  imports: [],
  templateUrl: './user-metrics.component.html',
  styleUrl: './user-metrics.component.scss'
})
export class UserMetricsComponent {
  @Input() value: string = "0";
  @Input() title: string = "User Metrics";
}
