import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss']
})
export class NewsCardComponent {
  @Input() imageUrl: string = '';
  @Input() author: string = '';
  @Input() title: string = '';
  @Input() newsId: string = '';

  constructor(private router: Router) {}

  onCardClick(): void {
    if (this.newsId) {
      this.router.navigate(['news', this.newsId]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }
}
