import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comic-description',
  standalone: true,
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
