import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comic-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comic-card.component.html',
  styleUrls: ['./comic-card.component.scss']
})
export class ComicCardComponent {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
}
