import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [
    NgClass
  ],
  standalone: true
})
export class ButtonComponent {
  @Input() text: string = 'Click Me';
  @Input() textColor: string = '#ffffff';
  @Input() textSize: string = '1.2rem';
  @Input() backgroundColor: string = '#E76F51';
  @Input() backgroundHover: string = '#E66041';
  @Input() buttonWidth: string = 'auto';
  @Input() buttonHeight: string = 'auto';
  @Input() customClass: string = '';

  // @ts-ignore
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }

  isHovering: boolean = false;
}
