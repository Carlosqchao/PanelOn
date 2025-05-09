import { Component } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [TranslateModule],
  standalone: true,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor() { }
}
