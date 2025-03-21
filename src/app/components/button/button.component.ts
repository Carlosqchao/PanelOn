import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true
})
export class ButtonComponent {
  @Input() text: string = 'Click Me';
  @Input() textColor: string = '#ffffff';
  @Input() backgroundColor: string = '#E76F51';
  @Input() backgroundHover: string = '#E66041';
  @Input() buttonWidth: string = '7vw';
  @Input() buttonHeight: string = '7vh';

  isHovering: boolean = false;
  border: boolean = false;
}
