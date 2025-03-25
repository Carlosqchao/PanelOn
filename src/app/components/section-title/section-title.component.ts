import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.component.html',
  standalone: true,
  styleUrls: ['./section-title.component.scss'],
  imports: [CommonModule]
})
export class SectionTitleComponent implements OnInit {
  @Input() position: 'left' | 'center' | 'right' = 'left';
  @Input() text: string = '';

  alignmentClass: string = 'text-left';

  ngOnInit(): void {
    this.alignmentClass = `text-${this.position}`;
  }
}
