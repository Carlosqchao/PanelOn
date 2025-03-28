import { Component } from '@angular/core';
import {ButtonComponent} from '../../components/button/button.component';

@Component({
  selector: 'app-login-page',
  imports: [
    ButtonComponent
  ],
  templateUrl: './login-page.component.html',
  standalone: true,
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  imageSource: string = 'https://imgix.bustle.com/uploads/image/2022/7/23/f33a5352-e7ad-4d17-9b73-b364ba445391-clean2.jpeg';
  logoSource: string = '';
}
