import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-option',
  standalone: true,
  imports: [],
  templateUrl: './profile-option.component.html',
  styleUrl: './profile-option.component.scss'
})
export class ProfileOptionComponent {
  @Input() text: string = "option";
  @Input() textColor: string = "#D9D9D9";
  @Input() textSize: string = '1.2rem';
  @Input() imageURL: string = "";
  @Input() backgroundColor: string = "#D9D9D9";
  @Input() profileOptionId: string = '';
}
