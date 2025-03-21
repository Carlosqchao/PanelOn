import {Component, Input, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})

export class ButtonComponent implements OnInit {
  @Input() text: string = 'Click Me';
  @Input() textColor: string = 'white';
  @Input() backgroundColor: string = '#E76F51';
  @Input() backgroundHover: string = '#E66041';
  @Input() buttonWidth: string = '7vw';
  @Input() buttonHeight: string = '7vh';

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.setCSSVariable('--button-text-color', this.textColor);
    this.setCSSVariable('--button-background-color', this.backgroundColor);
    this.setCSSVariable('--button-background-hover', this.backgroundHover);
    this.setCSSVariable('--button-width', this.buttonWidth);
    this.setCSSVariable('--button-height', this.buttonHeight);
  }

  private setCSSVariable(variable: string, value: string) {
    this.renderer.setStyle(document.documentElement, variable, value);
  }
}
