import { Component, Input } from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-comic-status',
  standalone: true,
  templateUrl: './comic-status.component.html',
  imports: [
    NgForOf,
    NgClass
  ],
  styleUrls: ['./comic-status.component.scss']
})
export class ComicStatusComponent {
  @Input() status: string = 'Unknown';
  @Input() rating: number = 0;

  stars: number[] = [0, 1, 2, 3, 4];

  getStarClass(index: number): string {
    if (this.rating >= index + 1) {
      return 'filled';
    } else if (this.rating >= index + 0.5) {
      return 'half-filled';
    } else {
      return 'empty';
    }
  }
}
