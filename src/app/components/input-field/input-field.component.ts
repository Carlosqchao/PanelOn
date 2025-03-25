import { Component, Input } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  imports: [
    NgClass
  ],
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent {
  @Input() nameInput: string = '';
  @Input() typeInput: string = '';
  @Input() textColor: string = 'black';
  @Input() inputWidth: string = '30vw';
  @Input() inputHeight: string = '6.7vh';
  @Input() textSize: string = '1rem';
  @Input() customClass: string = '';
  @Input() placeHolder: string = 'Enter text here.';
}
