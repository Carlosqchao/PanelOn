import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.component.html',
  standalone: true,
  styleUrls: ['./section-title.component.scss'],
  imports: [CommonModule]
})
export class SectionTitleComponent {
  @Input() text: string = '';
  @Input() alignment: 'left' | 'center' | 'right' = 'center';


  get alignmentClass(): string {
    return `text-${this.alignment}`;
  }
}
