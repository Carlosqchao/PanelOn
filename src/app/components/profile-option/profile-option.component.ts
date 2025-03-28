import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-option',
  standalone: true,
  imports: [],
  templateUrl: './profile-option.component.html',
  styleUrl: './profile-option.component.scss'
})
export class ProfileOptionComponent {
  @Input() optionName: string = "";
  @Input() imageURL: string = "";
}
