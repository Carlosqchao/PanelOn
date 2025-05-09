import { Component, Input } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-comic-description',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './comic-description.component.html',
  styleUrls: ['./comic-description.component.scss']
})
export class ComicDescriptionComponent {
  @Input() title: string = '';
  @Input() synopsis: string = '';
  @Input() author: string = '';
  @Input() genre: string = '';
  @Input() releaseDate: string = '';
}
