import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from '../../components/button/button.component';

@Component({
  selector: 'app-register-page',
  imports: [
    RouterLink,
    ButtonComponent
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  imageSource: string = 'https://1.bp.blogspot.com/-j7pelIBKTn0/XacCFsSjsII/AAAAAAAAf_Y/rvpqFruHKj8Hym6PS7n7P0V3J3nmHvs5wCLcBGAsYHQ/s1600/05.jpg';
  logoSource: string = '';
}
