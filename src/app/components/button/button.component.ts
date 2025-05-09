import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [
    NgClass
  ],
  standalone: true,
})
export class ButtonComponent {
  @Input() text: string = 'Click Me';
  @Input() textSize: string = '1.2rem';
  @Input() buttonWidth: string = 'auto';
  @Input() buttonHeight: string = 'auto';
  @Input() customClass: string = '';
  @Input() disabled: boolean | null = false;

  @Output() buttonClick = new EventEmitter<void>();

  isHovering: boolean = false;

  onClick() {
    this.buttonClick.emit();
  }
}
