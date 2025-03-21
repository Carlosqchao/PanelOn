import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-news-card',
  imports: [],
  standalone: true,
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss'
})
export class NewsCardComponent {
  @Input() imageUrl: string = '';
  @Input() author: string = '';
  @Input() title: string = '';
}

