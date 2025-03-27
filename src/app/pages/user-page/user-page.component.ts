import { Component } from '@angular/core';
import {ButtonComponent} from '../../components/button/button.component';
import {ProfileOptionComponent} from '../../components/profile-option/profile-option.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [ButtonComponent, ProfileOptionComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {

}
