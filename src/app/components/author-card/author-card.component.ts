import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-author-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.scss']
})
export class AuthorCardComponent {
  @Input() imageUrl: string = '';
  @Input() username: string = '';
  @Input() authorId: string = '';

  constructor(private router: Router) {}

  navigateToAuthor() {
    if (this.authorId) {
      this.router.navigate(['/author', this.authorId]);
    }
  }
}

