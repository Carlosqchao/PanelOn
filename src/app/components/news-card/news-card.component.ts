import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

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

  constructor(private router: Router) {}

  onCardClick(): void {
      this.router.navigate(['news']).then(() => {
        window.scrollTo(0, 0);
      });
  }
}

